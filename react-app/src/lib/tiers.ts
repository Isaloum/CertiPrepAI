/**
 * tiers.ts — single source of truth for plan-tier + per-cert access logic.
 *
 * These are pure functions (no React, no network) so they can be unit-tested
 * and reused. AuthContext uses isPremium/isFullAccess; useCertAccess uses
 * hasCertAccess. Keep the plan rules here — do not re-derive them inline.
 *
 * See CLAUDE.md "Plan Tier System".
 */

export type Tier = 'free' | 'monthly' | 'bundle' | 'yearly' | 'lifetime'

/** Ordering used to compare plans (e.g. for upgrade eligibility). */
export const TIER_RANK: Record<Tier, number> = {
  free: 0,
  monthly: 1,
  bundle: 1.5,
  yearly: 2,
  lifetime: 3,
}

/** Any paid plan (everything except free). */
export function isPremium(tier: Tier): boolean {
  return tier !== 'free'
}

/** Plans that unlock all 12 certs. */
export function isFullAccess(tier: Tier): boolean {
  return tier === 'yearly' || tier === 'lifetime'
}

/**
 * Whether a user may access a specific cert. Pure mirror of the useCertAccess rules:
 *  - free / logged out → false
 *  - monthly           → only their one selected cert
 *  - bundle            → only certs in their 3-cert selection
 *  - yearly / lifetime → always (all certs)
 *
 * monthlyCertId / bundleCertIds are the user's saved selections; pass null/undefined
 * when unknown (treated as no access for that tier).
 */
export function hasCertAccess(params: {
  tier: Tier
  certId: string
  monthlyCertId?: string | null
  bundleCertIds?: string[] | null
}): boolean {
  const { tier, certId, monthlyCertId, bundleCertIds } = params
  if (tier === 'yearly' || tier === 'lifetime') return true
  if (tier === 'monthly') return monthlyCertId === certId
  if (tier === 'bundle') return Array.isArray(bundleCertIds) && bundleCertIds.includes(certId)
  return false // free or anything unexpected
}
