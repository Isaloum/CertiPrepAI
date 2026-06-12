# Risks — AWSPrepAI
**Date:** 2026-03-31

---

## 🔴 High Risk

### R1 — Lambda Concurrency = 10
- **Risk:** Any real traffic spike throttles all Lambda functions instantly. Users get 429 errors. Stripe webhooks fail.
- **Likelihood:** High (any Reddit post or ProductHunt launch will cause this)
- **Impact:** Critical — app goes down, payments fail
- **Mitigation:** Request quota increase to 1000 via Service Quotas. Do this TODAY.

### R2 — No DDoS / Rate Limiting
- **Risk:** Lambda URLs are publicly accessible with no protection. A simple bot can exhaust concurrency or run up AWS costs.
- **Likelihood:** Medium (bots scan for open Lambda URLs)
- **Impact:** High — unexpected AWS bill, service degradation
- **Mitigation:** Add CloudFront + WAF before any public launch or marketing

---

## 🟡 Medium Risk

### R3 — Stripe Webhook Failure = Silent Data Loss
- **Risk:** If the stripe-webhook Lambda fails mid-execution, the event is lost. User pays but plan doesn't upgrade.
- **Likelihood:** Low-medium (Lambda cold starts, transient errors)
- **Impact:** High — user pays, doesn't get access, files chargeback
- **Mitigation:** Add DLQ. Stripe also retries webhooks — verify retry config in Stripe Dashboard.

### R4 — Cognito JWT Not Validated Consistently
- **Risk:** If any Lambda skips JWT validation, unauthorized users access paid content
- **Likelihood:** Low (was intentional for checkout/verify-session)
- **Impact:** High — free users bypass paywall
- **Mitigation:** Audit all Lambdas — confirm only `awsprepai-checkout` and `awsprepai-verify-session` are public. `awsprepai-db` must always validate JWT.

### R5 — Users Must Re-Register
- **Risk:** Old Supabase users don't know they need new accounts. They try to login, fail, churn.
- **Likelihood:** High (if any users existed pre-migration)
- **Impact:** Medium — user frustration, churn
- **Mitigation:** Add clear messaging on login page: "New platform — please create a new account." Consider email outreach if user list exists.

---

## 🟢 Low Risk

### R6 — AWS Costs Spike Unexpectedly
- **Risk:** DynamoDB reads or Lambda invocations exceed free tier
- **Likelihood:** Low at current scale
- **Impact:** Medium — unexpected bill
- **Mitigation:** Budget alert already set at $40/month. Review Cost Explorer monthly.

### R7 — Fridayaiapp Idle Resources Still Running
- **Risk:** WorkMail ($3.89), idle IPv4 ($3.60), Secrets Manager ($0.95) continue to burn money
- **Likelihood:** Certain (they're already running)
- **Impact:** Low (~$9/month)
- **Mitigation:** Clean up manually in Fridayaiapp AWS console (see cost-audit.md)
