import { describe, it, expect } from 'vitest'
import { TIER_RANK, isPremium, isFullAccess, hasCertAccess, type Tier } from './tiers'

const ALL_TIERS: Tier[] = ['free', 'monthly', 'bundle', 'yearly', 'lifetime']

describe('TIER_RANK', () => {
  it('orders plans free < monthly < bundle < yearly < lifetime', () => {
    expect(TIER_RANK.free).toBeLessThan(TIER_RANK.monthly)
    expect(TIER_RANK.monthly).toBeLessThan(TIER_RANK.bundle)
    expect(TIER_RANK.bundle).toBeLessThan(TIER_RANK.yearly)
    expect(TIER_RANK.yearly).toBeLessThan(TIER_RANK.lifetime)
  })

  it('has a rank for every tier', () => {
    for (const t of ALL_TIERS) expect(typeof TIER_RANK[t]).toBe('number')
  })
})

describe('isPremium', () => {
  it('is false only for free', () => {
    expect(isPremium('free')).toBe(false)
  })
  it('is true for every paid plan', () => {
    for (const t of ['monthly', 'bundle', 'yearly', 'lifetime'] as Tier[]) {
      expect(isPremium(t)).toBe(true)
    }
  })
})

describe('isFullAccess', () => {
  it('is true only for yearly and lifetime', () => {
    expect(isFullAccess('yearly')).toBe(true)
    expect(isFullAccess('lifetime')).toBe(true)
  })
  it('is false for free, monthly, bundle', () => {
    for (const t of ['free', 'monthly', 'bundle'] as Tier[]) {
      expect(isFullAccess(t)).toBe(false)
    }
  })
})

describe('hasCertAccess', () => {
  it('blocks free users from every cert', () => {
    expect(hasCertAccess({ tier: 'free', certId: 'saa-c03' })).toBe(false)
  })

  it('grants yearly and lifetime access to any cert', () => {
    expect(hasCertAccess({ tier: 'yearly', certId: 'saa-c03' })).toBe(true)
    expect(hasCertAccess({ tier: 'lifetime', certId: 'ans-c01' })).toBe(true)
  })

  describe('monthly', () => {
    it('grants access only to the one selected cert', () => {
      expect(hasCertAccess({ tier: 'monthly', certId: 'saa-c03', monthlyCertId: 'saa-c03' })).toBe(true)
    })
    it('denies a different cert', () => {
      expect(hasCertAccess({ tier: 'monthly', certId: 'clf-c02', monthlyCertId: 'saa-c03' })).toBe(false)
    })
    it('denies when no selection is known', () => {
      expect(hasCertAccess({ tier: 'monthly', certId: 'saa-c03', monthlyCertId: null })).toBe(false)
      expect(hasCertAccess({ tier: 'monthly', certId: 'saa-c03' })).toBe(false)
    })
  })

  describe('bundle', () => {
    const bundle = ['saa-c03', 'clf-c02', 'aif-c01']
    it('grants access to a cert inside the bundle', () => {
      expect(hasCertAccess({ tier: 'bundle', certId: 'clf-c02', bundleCertIds: bundle })).toBe(true)
    })
    it('denies a cert outside the bundle', () => {
      expect(hasCertAccess({ tier: 'bundle', certId: 'dva-c02', bundleCertIds: bundle })).toBe(false)
    })
    it('denies when the selection is missing or empty', () => {
      expect(hasCertAccess({ tier: 'bundle', certId: 'saa-c03', bundleCertIds: null })).toBe(false)
      expect(hasCertAccess({ tier: 'bundle', certId: 'saa-c03', bundleCertIds: [] })).toBe(false)
      expect(hasCertAccess({ tier: 'bundle', certId: 'saa-c03' })).toBe(false)
    })
  })
})
