/**
 * awsprepai-cancel-subscription
 * Cancels a user's Stripe subscription at period end and downgrades
 * their Cognito custom:plan to 'free'.
 *
 * Protected by Cognito JWT (Authorization: Bearer <accessToken>).
 * Deploy as: awsprepai-cancel-subscription  runtime: nodejs20.x
 * Env vars: STRIPE_SECRET_KEY, COGNITO_USER_POOL_ID, COGNITO_CLIENT_ID
 */
import Stripe from 'stripe';
import {
  CognitoIdentityProviderClient,
  AdminGetUserCommand,
  AdminUpdateUserAttributesCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { CognitoJwtVerifier } from 'aws-jwt-verify';

// ── Security: fail hard if env vars are missing — no hardcoded fallbacks ──
const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
const CLIENT_ID    = process.env.COGNITO_CLIENT_ID;
if (!USER_POOL_ID || !CLIENT_ID) throw new Error('Missing required Cognito env vars');

const stripe  = new Stripe(process.env.STRIPE_SECRET_KEY);
const cognito = new CognitoIdentityProviderClient({ region: 'us-east-1' });

const verifier = CognitoJwtVerifier.create({
  userPoolId: USER_POOL_ID,
  tokenUse:   'access',
  clientId:   CLIENT_ID,
});

// ── Security: CORS restricted to known origins only — no wildcard ─────────
const ALLOWED_ORIGINS = [
  'https://certiprepai.com',
  'https://www.certiprepai.com',
  'https://main.d2pm3jfcsesli7.amplifyapp.com',
];

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin':  allowed,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };
}

export const handler = async (event) => {
  const origin = event.headers?.origin || event.headers?.Origin || '';
  const CORS   = corsHeaders(origin);

  if (event.requestContext?.http?.method === 'OPTIONS') {
    return { statusCode: 200, headers: CORS, body: '' };
  }

  // ── Verify JWT ───────────────────────────────────────────────────
  const authHeader = event.headers?.authorization || event.headers?.Authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');

  let claims;
  try {
    claims = await verifier.verify(token);
  } catch {
    return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  const username = claims.username || claims.sub;

  try {
    // ── Look up Stripe customer ID from Cognito ───────────────────
    const userRes = await cognito.send(new AdminGetUserCommand({
      UserPoolId: USER_POOL_ID,
      Username:   username,
    }));

    const attrs = Object.fromEntries(
      (userRes.UserAttributes || []).map(a => [a.Name, a.Value])
    );

    const stripeCustomerId = attrs['custom:stripe_customer_id'];
    const currentPlan      = attrs['custom:plan'] || 'free';

    if (currentPlan === 'free') {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'No active subscription to cancel.' }) };
    }

    if (currentPlan === 'lifetime') {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Lifetime plans cannot be cancelled.' }) };
    }

    // ── Cancel active Stripe subscriptions at period end ─────────
    // Security fix: cancel each sub individually, only downgrade Cognito
    // AFTER all Stripe updates succeed to prevent state inconsistency.
    if (stripeCustomerId) {
      const subscriptions = await stripe.subscriptions.list({
        customer: stripeCustomerId,
        status:   'active',
        limit:    10,
      });

      const results = await Promise.allSettled(
        subscriptions.data.map(sub =>
          stripe.subscriptions.update(sub.id, { cancel_at_period_end: true })
        )
      );

      const failed = results.filter(r => r.status === 'rejected');
      if (failed.length > 0) {
        console.error('[cancel-subscription] Stripe update failed for some subscriptions:', failed);
        return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'Failed to cancel subscription with Stripe. Please try again.' }) };
      }

      console.log(`[cancel-subscription] Scheduled cancellation for ${username} (${stripeCustomerId})`);
    }

    // ── Only downgrade Cognito after Stripe succeeded ────────────
    await cognito.send(new AdminUpdateUserAttributesCommand({
      UserPoolId:     USER_POOL_ID,
      Username:       username,
      UserAttributes: [{ Name: 'custom:plan', Value: 'free' }],
    }));

    console.log(`[cancel-subscription] Downgraded ${username} -> free`);

    return {
      statusCode: 200,
      headers:    CORS,
      body:       JSON.stringify({ success: true, message: 'Subscription cancelled. Access continues until end of billing period.' }),
    };
  } catch (err) {
    // Security fix: never expose internal error details to the client
    console.error('[cancel-subscription] Error:', err);
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};
