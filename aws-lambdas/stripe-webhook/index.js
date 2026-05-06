/**
 * awsprepai-stripe-webhook
 * Handles Stripe webhook events and manages Cognito user tiers.
 */
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { CognitoIdentityProviderClient, ListUsersCommand, AdminUpdateUserAttributesCommand } = require('@aws-sdk/client-cognito-identity-provider');

const cognito = new CognitoIdentityProviderClient({ region: 'us-east-1' });
const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;

async function setCognitoUserTier(email, tier) {
  const listRes = await cognito.send(new ListUsersCommand({
    UserPoolId: USER_POOL_ID,
    Filter: `email = "${email}"`,
    Limit: 1,
  }));
  const user = listRes.Users?.[0];
  if (!user) throw new Error(`No Cognito user found for: ${email}`);

  await cognito.send(new AdminUpdateUserAttributesCommand({
    UserPoolId: USER_POOL_ID,
    Username: user.Username,
    UserAttributes: [{ Name: 'custom:plan', Value: tier }],
  }));
  console.log(`[webhook] Set ${email} -> ${tier}`);
}

exports.handler = async (event) => {
  const sig = event.headers?.['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return { statusCode: 400, body: 'Missing webhook configuration' };
  }

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, webhookSecret);
  } catch (err) {
    console.error('[webhook] Signature failed:', err.message);
    return { statusCode: 400, body: `Verification failed: ${err.message}` };
  }

  // Chargeback
  if (stripeEvent.type === 'charge.dispute.created') {
    console.warn(`[webhook] CHARGEBACK: ${stripeEvent.data.object.payment_intent}`);
    return { statusCode: 200, body: JSON.stringify({ received: true }) };
  }

  // Subscription cancelled
  if (stripeEvent.type === 'customer.subscription.deleted') {
    const sub = stripeEvent.data.object;
    try {
      const customer = await stripe.customers.retrieve(sub.customer);
      if (customer.email) await setCognitoUserTier(customer.email, 'free');
    } catch (err) {
      console.error('[webhook] Downgrade failed:', err.message);
    }
    return { statusCode: 200, body: JSON.stringify({ received: true }) };
  }

  // Payment succeeded (subscription or one-time)
  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object;
    if (session.metadata?.product !== 'awsprepai_premium') {
      return { statusCode: 200, body: JSON.stringify({ received: true, skipped: true }) };
    }
    const tier = session.metadata?.tier || 'lifetime';
    const email = session.customer_details?.email;
    if (email) {
      try { await setCognitoUserTier(email, tier); }
      catch (err) { console.error('[webhook] Upgrade failed:', err.message); }

      // When upgrading to lifetime, cancel any active subscriptions so the user
      // isn't double-billed for both their old plan and the lifetime purchase.
      if (tier === 'lifetime') {
        try {
          const customers = await stripe.customers.list({ email: email.toLowerCase().trim(), limit: 5 });
          for (const customer of customers.data) {
            const activeSubs = await stripe.subscriptions.list({ customer: customer.id, status: 'active', limit: 10 });
            for (const sub of activeSubs.data) {
              await stripe.subscriptions.cancel(sub.id);
              console.log(`[webhook] Cancelled subscription ${sub.id} for ${email} after lifetime purchase`);
            }
          }
        } catch (err) {
          console.error('[webhook] Failed to cancel old subscription after lifetime purchase:', err.message);
        }
      }
    }
    return { statusCode: 200, body: JSON.stringify({ received: true, tier }) };
  }

  return { statusCode: 200, body: JSON.stringify({ received: true, ignored: stripeEvent.type }) };
};
