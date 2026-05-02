import https from 'https'
import {
  CognitoIdentityProviderClient,
  GetUserCommand,
} from '@aws-sdk/client-cognito-identity-provider'

const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY
const cognito = new CognitoIdentityProviderClient({ region: 'us-east-1' })

function stripeGet(path) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.stripe.com', path, method: 'GET',
      headers: { Authorization: `Bearer ${STRIPE_SECRET}` },
    }, res => { let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(JSON.parse(d))) })
    req.on('error', reject); req.end()
  })
}

// POST to Stripe (for cancel_at_period_end=true)
function stripePost(path, body) {
  const payload = new URLSearchParams(body).toString()
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.stripe.com', path, method: 'POST',
      headers: {
        Authorization: `Bearer ${STRIPE_SECRET}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(payload),
      },
    }, res => { let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(JSON.parse(d))) })
    req.on('error', reject)
    req.write(payload)
    req.end()
  })
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
  'Content-Type': 'application/json',
}

export const handler = async (event) => {
  if (event.requestContext?.http?.method === 'OPTIONS')
    return { statusCode: 200, headers: CORS, body: '' }

  try {
    const token = (event.headers?.authorization || event.headers?.Authorization || '').replace('Bearer ', '')
    if (!token) return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'Missing token' }) }

    // Validate access token + get user attributes from Cognito
    const userInfo = await cognito.send(new GetUserCommand({ AccessToken: token }))
    const attrs = Object.fromEntries(userInfo.UserAttributes.map(a => [a.Name, a.Value]))
    const email = attrs.email
    const stripeCustomerId = attrs['custom:stripe_customer_id']

    if (!stripeCustomerId) {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'No Stripe customer found.' }) }
    }

    // Find active subscriptions
    const subs = await stripeGet(`/v1/subscriptions?customer=${stripeCustomerId}&status=active&limit=10`)
    if (!subs.data || subs.data.length === 0) {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'No active subscription found.' }) }
    }

    // Set cancel_at_period_end=true on each active subscription
    // DO NOT set Cognito to free — the Stripe webhook handles that at period end
    let periodEnd = null
    for (const sub of subs.data) {
      const updated = await stripePost(`/v1/subscriptions/${sub.id}`, { cancel_at_period_end: 'true' })
      periodEnd = updated.current_period_end // Unix timestamp
      console.log(`Scheduled cancellation for Stripe subscription ${sub.id} for ${email}, period ends: ${new Date(periodEnd * 1000).toISOString()}`)
    }

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({
        message: 'Subscription will cancel at end of billing period.',
        periodEnd, // Unix timestamp — frontend converts to human date
      }),
    }
  } catch (err) {
    console.error('Cancel error:', err)
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: err.message }) }
  }
}
