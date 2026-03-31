/**
 * lib/db.ts
 * DynamoDB API wrapper — replaces Supabase table calls.
 * Calls awsprepai-db Lambda with Cognito access token.
 */

const DB_API = import.meta.env.VITE_DB_API_URL as string

async function call(action: string, data: object | null, accessToken: string) {
  const res = await fetch(DB_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ action, data }),
  })
  if (!res.ok) throw new Error(`DB error: ${res.status}`)
  return res.json()
}

export async function getMonthlyCert(accessToken: string) {
  const { data } = await call('get_monthly_cert', null, accessToken)
  return data as { cert_id: string; selected_at: string } | null
}

export async function setMonthlyCert(certId: string, accessToken: string) {
  await call('set_monthly_cert', { cert_id: certId }, accessToken)
}

export async function getFreeUsage(accessToken: string) {
  const { data } = await call('get_free_usage', null, accessToken)
  return data as { cert_id: string; count: number } | null
}

export async function updateFreeUsage(certId: string, count: number, accessToken: string) {
  await call('update_free_usage', { cert_id: certId, count }, accessToken)
}
