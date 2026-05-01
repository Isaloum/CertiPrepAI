# AWSPrepAI
**Date:** 2026-03-31
**Status:** 🟡 In Progress — Migration Complete, Security Hardening Pending
**Repo:** github.com/Isaloum/AWSPrepAI (branch: `main`)
**Live URL:** https://awsprepai.isaloumapps.com

---

## What This Is
An AWS certification prep web app. Users sign up, get a free tier, upgrade via Stripe, and practice AWS exam questions. Built on React + AWS (Amplify, Cognito, Lambda, DynamoDB).

---

## ✅ What's Been Built

### Session 1 — Supabase → AWS Migration (2026-03-31)
- Amplify build deployed and LIVE
- Cognito auth fully wired (`us-east-1_bqEVRsi2b`)
- 3 Lambda Function URLs live and working
- DynamoDB tables: `monthly_cert_selection`, `free_usage`
- Stripe webhook configured with live secret
- AWS Budgets alert set at $40/month
- NAT Gateway on `bumpie-staging` DELETED (saved $15.90/month)

---

## 🔲 What Remains

### 🔴 Critical
- [ ] Lambda concurrency limit = 10 → Request 1000 via Service Quotas
- [ ] No DDoS / rate limiting → Add WAF + CloudFront (~$6/month)

### 🟡 Medium
- [ ] Codebase cleanup (delete Netlify/Supabase/old files — see `04-execution/pending-tasks.md`)
- [ ] Fridayaiapp WorkMail → Delete ($3.89/month)
- [ ] Fridayaiapp idle IPv4 → Release Elastic IP ($3.60/month)
- [ ] Fridayaiapp Secrets Manager → Delete secrets ($0.95/month)

### 🟢 Low
- [ ] DLQ on stripe-webhook Lambda (retry safety, free)
- [ ] Cognito Advanced Security (brute force protection, ~$0.05/MAU)

---

## Current Architecture
```
User → Amplify (awsprepai.isaloumapps.com)
     → React App (Cognito auth via amazon-cognito-identity-js)
     → Lambda URLs:
         awsprepai-checkout       → Stripe checkout session
         awsprepai-verify-session → upgrades Cognito user plan after payment
         awsprepai-db             → DynamoDB CRUD (JWT protected)
         awsprepai-stripe-webhook → handles Stripe events
     → DynamoDB (monthly_cert_selection, free_usage)
     → Cognito User Pool (us-east-1_bqEVRsi2b)
```

---

## Amplify Environment Variables
| Key | Value |
|-----|-------|
| `VITE_COGNITO_USER_POOL_ID` | `us-east-1_bqEVRsi2b` |
| `VITE_COGNITO_CLIENT_ID` | `4j9mnlkhtu023takbj0qb1g10h` |
| `VITE_DB_API_URL` | `https://f2i2exyezxhojuk7znx6rl5snm0tndur.lambda-url.us-east-1.on.aws/` |
| `VITE_VERIFY_SESSION_URL` | `https://6ryf7eipwnxeus2xbekgvwykme0otufd.lambda-url.us-east-1.on.aws/` |

---

## ⚠️ Critical Notes for Next Agent
1. **Work in `/Users/ihabsaloum/Desktop/Projects/AWSPrepAI`** — NOT the `/Users/ihabsaloum/AWSPrepAI` mount
2. **Users must re-register** — Cognito starts fresh, no Supabase accounts migrated
3. **Stripe webhook secret is live** — stored in Lambda env var `STRIPE_WEBHOOK_SECRET` — DO NOT commit secrets to files
4. **Fridayaiapp is a separate AWS account** — MCP is connected to `441393059130` (main), not Fridayaiapp
5. **bumpie-staging VPC is kept intentionally** — NAT Gateway will be re-created in 2 weeks
6. **Lambda URLs are hardcoded** in Amplify env vars — if Lambdas are recreated, update Amplify too

---

## ➡️ Next Step
**Priority 1:** Request Lambda concurrency quota increase (Service Quotas → Lambda → Concurrent executions → Request 1000)
**Priority 2:** Add WAF + CloudFront for DDoS protection
**Priority 3:** Codebase cleanup (see `04-execution/pending-tasks.md`)
