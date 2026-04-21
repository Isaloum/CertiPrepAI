/**
 * ai-coach/index.js
 * AWS Lambda — AI Coach powered by Claude Haiku.
 * Lifetime users only. Verifies Cognito access token.
 */
const Anthropic = require('@anthropic-ai/sdk');
const { CognitoIdentityProviderClient, GetUserCommand } = require('@aws-sdk/client-cognito-identity-provider');

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const cognito = new CognitoIdentityProviderClient({ region: 'us-east-1' });

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
  'Content-Type': 'application/json',
};

const SYSTEM_PROMPT = `You are an AWS certification exam coach built into CertiPrepAI.
Your job: help users pass their AWS certification exams.

Guidelines:
- Answer AWS concept questions clearly and concisely
- Explain why answers are correct or incorrect
- Give memory tricks and mnemonics for tricky topics
- Keep responses under 250 words unless deep explanation is needed
- Use bullet points for clarity
- Stay focused on AWS exam-relevant content
- Be encouraging but honest about difficulty
- Never make up AWS services or features — if unsure, say so`;

exports.handler = async (event) => {
  const method = event.httpMethod || event.requestContext?.http?.method || '';

  if (method === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  if (method !== 'POST') return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };

  try {
    const token = (event.headers?.authorization || event.headers?.Authorization || '').replace('Bearer ', '');
    if (!token) return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'Unauthorized' }) };

    // Verify token + check plan
    const userInfo = await cognito.send(new GetUserCommand({ AccessToken: token }));
    const attrs = Object.fromEntries(userInfo.UserAttributes.map(a => [a.Name, a.Value]));

    if (attrs['custom:plan'] !== 'lifetime') {
      return { statusCode: 403, headers: CORS, body: JSON.stringify({ error: 'AI Coach is exclusive to Lifetime plan users.' }) };
    }

    const { message, history = [] } = JSON.parse(event.body || '{}');
    if (!message?.trim()) return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Message required' }) };

    // Keep last 10 turns for context
    const messages = [
      ...history.slice(-10),
      { role: 'user', content: message.trim() },
    ];

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    });

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({ reply: response.content[0].text }),
    };
  } catch (err) {
    console.error('[ai-coach]', err);
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};
