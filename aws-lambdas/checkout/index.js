/**
 * checkout/index.js
 * AWS Lambda — creates a Stripe Checkout session and returns the redirect URL.
 *
 * Duplicate-payment protections:
 *  1. Idempotency key → same request within 24h returns the same Stripe session
 *  2. Existing subscription check → blocks paid users from buying again via checkout
 */
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const PRICE_IDS = {
  monthly:  process.env.STRIPE_PRICE_MONTHLY  || 'price_1TB1YCE9neqrFM5LDbyzVSnv',
  bundle:   process.env.STRIPE_PRICE_BUNDLE   || 'price_BUNDLE_REPLACE_ME',
  yearly:   process.env.STRIPE_PRICE_YEARLY   || 'price_1TED8EE9neqrFM5LCIL9P0Yp',
  lifetime: process.env.STRIPE_PRICE_LIFETIME || 'price_1TED9ME9neqrFM5LeKAAEWTO',
};

const PLAN_MODES = {
  monthly:  'subscription',
  bundle:   'subscription',
  yearly:   'subscription',
  lifetime: 'payment',
};

const ALLOWED_ORIGINS = [
  'https://certiprepai.com',
  'https://www.certiprepai.com',
  'https://main.d2pm3jfcsesli7.amplifyapp.com',
];

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin':  allowed,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.handler = async (event) => {
  const origin = event.headers?.origin || event.headers?.Origin || '';
  const CORS   = corsHeaders(origin);

  const method = event.httpMethod || event.requestContext?.http?.method || '';

  if (method === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  if (method !== 'POST') {
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { plan, email } = JSON.parse(event.body || '{}');

    if (!plan || !PRICE_IDS[plan]) {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Invalid plan' }) };
    }

    if (email && !EMAIL_RE.test(email)) {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Invalid email format' }) };
    }

    // ── Duplicate protection: check for existing active Stripe subscription ──────
    // Only applies when email is known (logged-in users). Skip for anonymous.
    if (email) {
      const customers = await stripe.customers.list({ email: email.toLowerCase().trim(), limit: 5 });
      for (const customer of customers.data) {
        const activeSubs = await stripe.subscriptions.list({
          customer: customer.id,
          status: 'active',
          limit: 5,
        });
        if (activeSubs.data.length > 0) {
          console.warn(`[checkout] Blocked duplicate checkout for ${email} — already has active subscription`);
          return {
            statusCode: 409,
            headers: CORS,
            body: JSON.stringify({ error: 'You already have an active subscription. Go to Billing to manage your plan.' }),
          };
        }
      }
    }

    const mode = PLAN_MODES[plan];
    const appUrl = process.env.APP_URL || 'https://certiprepai.com';

    const sessionParams = {
      payment_method_types: ['card'],
      line_items: [{ price: PRICE_IDS[plan], quantity: 1 }],
      mode,
      metadata: { product: 'awsprepai_premium', tier: plan },
      success_url: plan === 'bundle'
        ? `${appUrl}/dashboard?upgrade=bundle`
        : `${appUrl}/certifications?upgrade=success`,
      cancel_url: `${appUrl}/pricing?cancelled=1`,
    };

    if (mode === 'subscription') {
      sessionParams.subscription_data = { trial_period_days: 3 };
    }

    // ── Idempotency key: email + plan + current UTC day ──────────────────────────
    // Same user buying the same plan on the same day → Stripe returns the same session
    const dayStamp = new Date().toISOString().slice(0, 10) // e.g. '2026-05-02'
    const idempotencyKey = `checkout-${(email || 'anon').toLowerCase().replace(/[^a-z0-9]/g, '')}-${plan}-${dayStamp}`

    const session = await stripe.checkout.sessions.create(sessionParams, {
      idempotencyKey,
    });

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    console.error('[checkout]', err);
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};
