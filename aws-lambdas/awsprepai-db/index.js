/**
 * awsprepai-db Lambda
 * Auth via Cognito GetUser (no external packages).
 * DynamoDB CRUD for monthly_cert and free_usage.
 */
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const { CognitoIdentityProviderClient, GetUserCommand } = require('@aws-sdk/client-cognito-identity-provider');

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({ region: 'us-east-1' }));
const cognito = new CognitoIdentityProviderClient({ region: 'us-east-1' });

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
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Content-Type': 'application/json',
  };
}

// ── Security: whitelist of valid cert IDs — prevents injection ────────────
const VALID_CERTS = new Set([
  'aws-clf-c02', 'aws-saa-c03', 'aws-dva-c02', 'aws-soa-c02',
  'aws-sap-c02', 'aws-dop-c02', 'aws-ans-c01', 'aws-das-c01',
  'aws-mls-c01', 'aws-pas-c01', 'aws-sec-c02', 'aws-iot-c01',
]);

exports.handler = async (event) => {
  const origin = event.headers?.origin || event.headers?.Origin || '';
  const CORS   = corsHeaders(origin);

  const method = event.requestContext?.http?.method || 'UNKNOWN';
  const authHeader = event.headers?.authorization || event.headers?.Authorization || '';
  const token = authHeader.replace('Bearer ', '').trim();
  console.log(`[db] method=${method} hasToken=${!!token} authHeader="${authHeader.substring(0, 20)}..."`);

  if (method === 'OPTIONS') {
    return { statusCode: 200, headers: CORS, body: '' };
  }

  if (!token) {
    console.log('[db] 401 Missing token');
    return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'Missing token' }) };
  }

  let userId;
  try {
    const userInfo = await cognito.send(new GetUserCommand({ AccessToken: token }));
    userId = userInfo.Username;
  } catch (err) {
    // Security: never expose auth error details
    console.error('Auth error:', err.message);
    return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  try {
    const { action, data } = JSON.parse(event.body || '{}');

    if (action === 'get_monthly_cert') {
      const res = await dynamo.send(new GetCommand({ TableName: 'awsprepai-monthly-cert', Key: { user_id: userId } }));
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ data: res.Item || null }) };
    }

    if (action === 'set_monthly_cert') {
      // Security: validate cert_id against whitelist
      const certId = data?.cert_id;
      if (!certId || !VALID_CERTS.has(certId)) {
        return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Invalid cert_id' }) };
      }
      await dynamo.send(new PutCommand({
        TableName: 'awsprepai-monthly-cert',
        Item: { user_id: userId, cert_id: certId, selected_at: new Date().toISOString() },
      }));
      console.log('[AUDIT] ' + JSON.stringify({ event: 'cert_selected', userId, cert: certId, ts: new Date().toISOString() }));
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ success: true }) };
    }

    if (action === 'get_free_usage') {
      const res = await dynamo.send(new GetCommand({ TableName: 'awsprepai-free-usage', Key: { user_id: userId } }));
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ data: res.Item || null }) };
    }

    if (action === 'update_free_usage') {
      // Security: validate cert_id + count
      const certId = data?.cert_id;
      const count  = data?.count;
      if (!certId || !VALID_CERTS.has(certId)) {
        return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Invalid cert_id' }) };
      }
      if (typeof count !== 'number' || !Number.isInteger(count) || count < 0) {
        return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Invalid count' }) };
      }
      await dynamo.send(new PutCommand({
        TableName: 'awsprepai-free-usage',
        Item: { user_id: userId, cert_id: certId, count, updated_at: new Date().toISOString() },
      }));
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ success: true }) };
    }

    if (action === 'get_progress') {
      const res = await dynamo.send(new QueryCommand({
        TableName: 'awsprepai-progress',
        KeyConditionExpression: 'user_id = :uid',
        ExpressionAttributeValues: { ':uid': userId },
      }));
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ data: res.Items || [] }) };
    }

    if (action === 'update_progress') {
      // Security: validate cert_id + correct
      const certId  = data?.cert_id;
      const correct = data?.correct;
      if (!certId || !VALID_CERTS.has(certId)) {
        return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Invalid cert_id' }) };
      }
      if (typeof correct !== 'boolean') {
        return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Invalid correct value' }) };
      }
      await dynamo.send(new PutCommand({
        TableName: 'awsprepai-progress',
        Item: {
          user_id:    userId,
          cert_id:    certId,
          correct,
          updated_at: new Date().toISOString(),
        },
      }));
      console.log('[AUDIT] ' + JSON.stringify({ event: 'question_answered', userId, cert: certId, correct, ts: new Date().toISOString() }));
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ success: true }) };
    }

    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Unknown action' }) };
  } catch (err) {
    // Security: never expose internal error details to client
    console.error('[awsprepai-db] Error:', err);
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};
