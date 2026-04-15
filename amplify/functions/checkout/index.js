/**
 * checkout/index.js
 * AWS Lambda — creates a Stripe Checkout session and returns the redirect URL.
 * Ported from the original Netlify function.
 */
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const PRICE_IDS = {
  monthly:  process.env.STRIPE_PRICE_MONTHLY  || 'price_1TB1YCE9neqrFM5LDbyzVSnv',
  yearly:   process.env.STRIPE_PRICE_YEARLY   || 'price_1TED8EE9neqrFM5LCIL9P0Yp',
  lifetime: process.env.STRIPE_PRICE_LIFETIME || 'price_1TED9ME9neqrFM5LeKAAEWTO',
};

const PLAN_MODES = {
  monthly:  'subscription',
  yearly:   'subscription',
  lifetime: 'payment',
};

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
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };
}

// Security: basic email format validation
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.handler = async (event) => {
  const origin = event.headers?.origin || event.headers?.Origin || '';
  const CORS   = corsHeaders(origin);

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { plan, email } = JSON.parse(event.body || '{}');

    if (!plan || !PRICE_IDS[plan]) {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Invalid plan' }) };
    }

    // Security: validate email format if provided
    if (email && !EMAIL_RE.test(email)) {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Invalid email format' }) };
    }

    const mode = PLAN_MODES[plan];
    const appUrl = process.env.APP_URL || 'https://main.d2pm3jfcsesli7.amplifyapp.com';

    const sessionParams = {
      payment_method_types: ['card'],
      line_items: [{ price: PRICE_IDS[plan], quantity: 1 }],
      mode,
      metadata: { product: 'awsprepai_premium', tier: plan },
      success_url: `${appUrl}/certifications?upgrade=success`,
      cancel_url: `${appUrl}/pricing?cancelled=1`,
    };

    if (email) sessionParams.customer_email = email;

    if (mode === 'subscription') {
      sessionParams.subscription_data = { trial_period_days: 3 };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    // Security: never expose internal error details to client
    console.error('[checkout]', err);
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};
