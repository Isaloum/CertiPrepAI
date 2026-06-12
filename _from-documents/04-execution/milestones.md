# Milestones — AWSPrepAI
**Date:** 2026-03-31

---

## ✅ Completed

### Week 1–2 (March 24)
- Fixed access control on all 12 cert pages
- SAA-C03 free tier: 5-question limit + upgrade wall
- All paid certs: premium overlay gate

### Week 3–4 (March 28–31)
- Full migration: Supabase + Netlify → AWS (Cognito + DynamoDB + Lambda + Amplify)
- 4 Lambda functions deployed and live
- Stripe webhook configured with real secret
- Amplify build succeeding on main branch
- Billing alert set at $40/month

---

## ❌ Next Up

### Week 5 — Security & Cleanup
- [ ] Request Lambda concurrency increase (10 → 1000) via Service Quotas
- [ ] Delete dead files: docs/, netlify/, worker/, supabase.ts, zip artifacts
- [ ] Delete aws-prep-ai/ folder (old Next.js version)
- [ ] Kill Fridayaiapp account waste: WorkMail ($3.89) + Elastic IP ($3.60) + Secrets Manager ($0.95) + Route 53 ($0.51)
- [ ] Add DLQ to stripe-webhook Lambda

### Week 6 — Complete the MVP
- [ ] Exam history: write mock results to DynamoDB on completion
- [ ] Monthly tier cert selection UX (let user pick which cert $7/mo unlocks)
- [ ] Fix success.html share links (hardcoded SAA-C03)
- [ ] Progress sync: wire syncProgressDebounced in all cert pages
- [ ] Newsletter capture function

### Week 7 — Hardening
- [ ] CloudFront in front of Lambda URLs
- [ ] WAF with rate limiting ($6/month)
- [ ] Cognito Advanced Security (brute force protection)
- [ ] Yearly + Lifetime pricing tiers in Stripe

### Week 8 — GTM
- [ ] Launch on Reddit (r/AWSCertifications, r/aws)
- [ ] SEO: landing page meta tags, cert-specific pages
- [ ] Referral / share mechanic on success.html
- [ ] Email onboarding sequence (3 emails)
