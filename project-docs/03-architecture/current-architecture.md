# Current Architecture — AWSPrepAI
**Date:** 2026-03-31
**Status:** Live in Production

---

## System Diagram

```
┌─────────────────────────────────────────────────────────┐
│                        USER                             │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTPS
                        ▼
┌─────────────────────────────────────────────────────────┐
│           AWS Amplify                                   │
│   awsprepai.isaloumapps.com                             │
│   React SPA (Vite) — auto-deploy from GitHub main       │
└───────────────────────┬─────────────────────────────────┘
                        │
          ┌─────────────┼──────────────┐
          ▼             ▼              ▼
   ┌──────────┐  ┌──────────┐  ┌───────────────┐
   │ Cognito  │  │ Lambda   │  │    Stripe      │
   │ User Pool│  │ URLs (3) │  │  (Checkout)    │
   └──────────┘  └────┬─────┘  └───────┬────────┘
                      │                │
                      ▼                ▼
               ┌──────────┐   ┌────────────────┐
               │ DynamoDB │   │ stripe-webhook  │
               │  Tables  │   │    Lambda       │
               └──────────┘   └────────────────┘
```

---

## AWS Resources

### Cognito
- **User Pool ID:** `us-east-1_bqEVRsi2b`
- **Client ID:** `4j9mnlkhtu023takbj0qb1g10h`
- **Region:** us-east-1
- **Auth library:** `amazon-cognito-identity-js`
- **Custom attribute:** `custom:plan` (values: `free` / `pro`)

### Lambda Functions (all in us-east-1)

| Function | URL | Purpose |
|----------|-----|---------|
| `awsprepai-checkout` | (Stripe checkout) | Creates Stripe checkout session |
| `awsprepai-verify-session` | `https://6ryf7eipwnxeus2xbekgvwykme0otufd.lambda-url.us-east-1.on.aws/` | Upgrades Cognito user plan after payment |
| `awsprepai-db` | `https://f2i2exyezxhojuk7znx6rl5snm0tndur.lambda-url.us-east-1.on.aws/` | DynamoDB CRUD — JWT protected |
| `awsprepai-stripe-webhook` | (internal) | Handles Stripe events — plan upgrades/downgrades |

- **AuthType:** NONE on all (public URLs)
- **Concurrency limit:** 10 — ⚠️ CRITICAL, needs quota increase to 1000

### DynamoDB Tables

| Table | Purpose |
|-------|---------|
| `monthly_cert_selection` | Tracks which cert a user selected this month |
| `free_usage` | Tracks question usage for free tier users |

### Amplify Environment Variables

| Key | Value |
|-----|-------|
| `VITE_COGNITO_USER_POOL_ID` | `us-east-1_bqEVRsi2b` |
| `VITE_COGNITO_CLIENT_ID` | `4j9mnlkhtu023takbj0qb1g10h` |
| `VITE_DB_API_URL` | `https://f2i2exyezxhojuk7znx6rl5snm0tndur.lambda-url.us-east-1.on.aws/` |
| `VITE_VERIFY_SESSION_URL` | `https://6ryf7eipwnxeus2xbekgvwykme0otufd.lambda-url.us-east-1.on.aws/` |

### Stripe
- **Webhook secret:** `whsec_REDACTED_SEE_LAMBDA_ENV` — set in Lambda env vars
- **Webhook endpoint:** points to `awsprepai-stripe-webhook` Lambda URL
- **Mode:** Live (production)

---

## Security Status

| Layer | Status | Notes |
|-------|--------|-------|
| Auth | ✅ Cognito JWT | Protected on awsprepai-db Lambda |
| DDoS | ❌ Missing | No WAF, no CloudFront |
| Rate Limiting | ❌ Missing | Lambdas are wide open |
| DB Security | ⚠️ Partial | IAM roles only, no row-level security |
| Secrets | ✅ Lambda env vars | Not hardcoded in code |
| Budget Alert | ✅ Set | $40/month alert to ihabsaloum85@gmail.com |

---

## GitHub
- **Repo:** `Isaloum/AWSPrepAI`
- **Branch:** `main`
- **Working copy on Mac:** `/Users/ihabsaloum/Desktop/Projects/AWSPrepAI` ← USE THIS ONE
- **Do NOT use:** `/Users/ihabsaloum/AWSPrepAI` (VM mount)
