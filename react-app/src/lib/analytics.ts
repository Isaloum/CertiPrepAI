/**
 * CertiPrepAI Analytics — powered by PostHog
 * Drop-in replacement for the deprecated Amazon Pinpoint integration.
 * All existing call sites are unchanged — only this file changed.
 */
import posthog from 'posthog-js'

// ── Init ─────────────────────────────────────────────────────────────────────
if (typeof window !== 'undefined') {
  posthog.init('phc_vQkqAhkS2zJBrqL5roLz8iquSgXWuucyBodeyNH99dsS', {
    api_host: 'https://us.i.posthog.com',
    capture_pageview: true,           // auto page views on every route change
    capture_pageleave: true,          // time-on-page metrics
    person_profiles: 'identified_only', // don't create anonymous profiles for crawlers
    autocapture: false,               // we fire events manually for precision
  })
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function track(name: string, props: Record<string, string | number | boolean> = {}) {
  try { posthog.capture(name, props) } catch (_) { /* never crash the app */ }
}

// ── Identity — call after login or signup ─────────────────────────────────────
/** Links all subsequent events to a known user. Call on login + signup. */
export function identifyUser(userId: string, email: string, plan: string) {
  try {
    posthog.identify(userId, { email, plan })
  } catch (_) {}
}

/** Call on logout to disassociate the device from the user. */
export function resetUser() {
  try { posthog.reset() } catch (_) {}
}

// ── Events ────────────────────────────────────────────────────────────────────

/** Called when a user views a certification detail page */
export function trackCertStarted(certId: string, plan: string) {
  track('cert_started', { cert_id: certId, plan })
}

/** Called when a user answers a practice question */
export function trackQuestionAnswered(certId: string, domain: string, correct: boolean, plan: string) {
  track('question_answered', { cert_id: certId, domain, correct, plan })
}

/** Called when a free user hits the 20-question limit */
export function trackFreeLimitHit(certId: string) {
  track('free_limit_hit', { cert_id: certId })
}

/** Called when a mock exam is completed */
export function trackMockExamCompleted(certId: string, score: number, total: number, plan: string) {
  const pct = Math.round((score / total) * 100)
  track('mock_exam_completed', { cert_id: certId, plan, passed: pct >= 72, score_pct: pct, correct: score, total })
}

/** Called when a user clicks an upgrade button */
export function trackUpgradeClicked(fromPlan: string, toPlan: string, location: string) {
  track('upgrade_clicked', { from_plan: fromPlan, to_plan: toPlan, location })
}

/** Called when a checkout session is initiated */
export function trackCheckoutStarted(plan: string) {
  track('checkout_started', { plan })
}

/** Called when payment succeeds (landing on /payment-success) */
export function trackPaymentSuccess(plan: string) {
  track('payment_success', { plan })
}

/** Called when AI Coach is opened */
export function trackAiCoachOpened() {
  track('ai_coach_opened', { plan: 'lifetime' })
}

/** Called when AI Coach sends a message */
export function trackAiCoachMessage(messageIndex: number) {
  track('ai_coach_message_sent', { message_index: messageIndex })
}

/** Called when a user signs up */
export function trackSignup() {
  track('signup')
}

/** Called when a user logs in */
export function trackLogin(plan: string) {
  track('login', { plan })
}

/** Called when a user bookmarks a question */
export function trackBookmark(certId: string) {
  track('question_bookmarked', { cert_id: certId })
}

/** Called when email capture popup is submitted */
export function trackLeadCaptured() {
  track('lead_captured')
}
