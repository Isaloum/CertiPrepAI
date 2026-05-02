/**
 * useCertAccess.ts
 * Returns whether the current user has access to a specific cert.
 *
 * Access rules:
 *  - free / logged out   → false
 *  - monthly             → true only if their selected cert matches
 *  - bundle              → true only if certId is in their bundle
 *  - yearly / lifetime   → always true (all certs)
 */
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getMonthlyCert, getBundleCerts } from '../lib/db'

export function useCertAccess(certId: string): { hasAccess: boolean; loading: boolean } {
  const { user, tier, loading: authLoading } = useAuth()
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)

  useEffect(() => {
    // Wait for Cognito auth to finish resolving
    if (authLoading) return

    // Yearly / Lifetime → unrestricted
    if (tier === 'yearly' || tier === 'lifetime') {
      setHasAccess(true)
      return
    }

    // Free user or no token → no access
    if (tier === 'free' || !user?.accessToken) {
      setHasAccess(false)
      return
    }

    // Monthly → check which single cert they selected
    if (tier === 'monthly') {
      getMonthlyCert(user.accessToken)
        .then(data => setHasAccess(data?.cert_id === certId))
        .catch(() => setHasAccess(false))
      return
    }

    // Bundle → check if certId is in their 3-cert selection
    if (tier === 'bundle') {
      getBundleCerts(user.accessToken)
        .then(data => setHasAccess(data?.cert_ids?.includes(certId) ?? false))
        .catch(() => setHasAccess(false))
      return
    }

    setHasAccess(false)
  }, [authLoading, user?.accessToken, tier, certId])

  return {
    hasAccess: hasAccess ?? false,
    loading: authLoading || hasAccess === null,
  }
}
