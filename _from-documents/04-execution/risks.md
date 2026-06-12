# Risks — AWSPrepAI
**Date:** 2026-03-31

---

## Active Risks

| Risk | Severity | Likelihood | Status |
|---|---|---|---|
| Lambda concurrency = 10 → site dies with 10 simultaneous users | HIGH | HIGH | ❌ Not fixed |
| No DDoS / rate limiting → AWS bill explosion under attack | HIGH | MEDIUM | ❌ Not fixed |
| Users must re-register (Cognito fresh start) → churn | MEDIUM | HIGH | ⚠️ Unavoidable |
| stripe-webhook crash = lost payment event, user not upgraded | MEDIUM | LOW | ❌ No DLQ yet |
| Leaked Stripe key in git history | HIGH | LOW | ✅ Fixed (filter-branch) |
| Two Mac repos causing confusion on git push | MEDIUM | MEDIUM | ✅ Fixed (use Desktop/Projects/) |

## Mitigations

**Lambda concurrency:**
Go to AWS Service Quotas → Lambda → Concurrent executions → Request 1000. Auto-approved in minutes. Free.

**DDoS / rate limiting:**
Add CloudFront + WAF (~$6/month). Until then, billing alert at $40/month acts as early warning.

**Re-registration:**
Post a clear message on the site: "We've upgraded our infrastructure. Please create a new account." Consider offering a discount code to previous paid users.

**stripe-webhook crash:**
Add SQS Dead Letter Queue to the Lambda. If it crashes, the event is saved and replayable. Free at this scale.

## Past Risks (Resolved)

| Risk | Resolution |
|---|---|
| Git index.lock blocking commits | Deleted lock files from Mac Terminal |
| Two repos (master vs main) | Standardized on Desktop/Projects/AWSPrepAI main branch |
| Netlify hardcoded in React app | Updated all URLs to Lambda Function URLs |
| Stripe sk_live_ key leaked in deploy.sh | git filter-branch removed it from history |
| Lambda 403 Forbidden | Re-added AllowPublicAccess permission to all 3 Lambdas |
| awsprepai-db missing permission | Added AllowPublicAccess policy |
| Stripe webhook had placeholder whsec_ | Updated with real secret from Stripe Dashboard |
