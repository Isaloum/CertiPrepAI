# Milestones — AWSPrepAI
**Date:** 2026-03-31

---

## ✅ Milestone 1 — Foundation (COMPLETE)
**Goal:** Get the app live on AWS
- [x] React app deployed on Amplify
- [x] Cognito auth working
- [x] Lambda functions deployed with Function URLs
- [x] DynamoDB tables created
- [x] Stripe payments integrated
- [x] Custom domain live (awsprepai.isaloumapps.com)
- [x] Budget alert set

---

## 🔲 Milestone 2 — Security Hardening (NEXT)
**Goal:** Make the app production-safe
**ETA:** 1–2 sessions

- [ ] Lambda concurrency quota → 1000 (Service Quotas request)
- [ ] CloudFront distribution in front of Amplify
- [ ] WAF with rate limiting rules attached
- [ ] DLQ on stripe-webhook Lambda
- [ ] Cognito Advanced Security enabled

**Definition of Done:** No public Lambda URLs exposed without rate limiting. Concurrency ≥ 1000.

---

## 🔲 Milestone 3 — Codebase Cleanup
**Goal:** Remove dead code, reduce confusion for future work
**ETA:** 1 session

- [ ] Delete `docs/`, `netlify/`, `netlify.toml`, `worker/`
- [ ] Delete `supabase.ts`, `supabase_migration.sql`
- [ ] Delete old zip artifacts
- [ ] Delete `aws-prep-ai/` (old Next.js version)
- [ ] Move `TaxFlowAI_*.docx` to correct repo

**Definition of Done:** Repo contains only active, needed files.

---

## 🔲 Milestone 4 — User Experience (Growth)
**Goal:** Users can study effectively and track progress
**ETA:** 2–3 sessions

- [ ] Progress tracking (domains, % correct per user)
- [ ] Question explanations (why answer is right/wrong)
- [ ] Mobile-responsive UI audit + fixes
- [ ] Email notification on plan upgrade/downgrade

**Definition of Done:** A new user can sign up, practice, see progress, and upgrade — all without friction.

---

## 🔲 Milestone 5 — First 100 Paying Users
**Goal:** Validate product-market fit
**ETA:** 60–90 days post-launch

- [ ] Launch on Reddit (r/AWSCertifications, r/aws)
- [ ] Product Hunt launch
- [ ] Analytics instrumentation (track funnel)
- [ ] 100 paying users

---

## Critical Path
```
Milestone 2 (Security) → Milestone 3 (Cleanup) → Milestone 4 (UX) → Milestone 5 (Growth)
```
Security must come before growth. Do not drive traffic to an unprotected app.
