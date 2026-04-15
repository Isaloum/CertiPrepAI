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

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
  'Content-Type': 'application/json',
};

exports.handler = async (event) => {
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
      await dynamo.send(new PutCommand({
        TableName: 'awsprepai-monthly-cert',
        Item: { user_id: userId, cert_id: data.cert_id, selected_at: new Date().toISOString() },
      }));
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ success: true }) };
    }

    if (action === 'get_free_usage') {
      const res = await dynamo.send(new GetCommand({ TableName: 'awsprepai-free-usage', Key: { user_id: userId } }));
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ data: res.Item || null }) };
    }

    if (action === 'update_free_usage') {
      await dynamo.send(new PutCommand({
        TableName: 'awsprepai-free-usage',
        Item: { user_id: userId, cert_id: data.cert_id, count: data.count, updated_at: new Date().toISOString() },
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
      await dynamo.send(new PutCommand({
        TableName: 'awsprepai-progress',
        Item: {
          user_id: userId,
          cert_id: data.cert_id,
          correct: data.correct,
          updated_at: new Date().toISOString(),
        },
      }));
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ success: true }) };
    }

    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Unknown action' }) };
  } catch (err) {
    console.error('[awsprepai-db] Error:', err.message);
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: err.message }) };
  }
};
