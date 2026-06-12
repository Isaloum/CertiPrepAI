# System Diagram — AWSPrepAI
**Date:** 2026-03-31

---

## Current Architecture (Live)

```
                          ┌──────────────────────────────────┐
                          │             USER                  │
                          └──────────────┬───────────────────┘
                                         │ HTTPS
                                         ▼
                          ┌──────────────────────────────────┐
                          │         AWS Amplify               │
                          │   awsprepai.isaloumapps.com       │
                          │   React SPA + Vite build          │
                          │   Auto-deploy: GitHub/main        │
                          └──────┬───────────────────────────┘
                                 │
           ┌─────────────────────┼──────────────────────┐
           │                     │                      │
           ▼                     ▼                      ▼
  ┌─────────────────┐   ┌──────────────────┐   ┌──────────────┐
  │  AWS Cognito    │   │  Lambda: checkout │   │    Stripe    │
  │  User Pool      │   │  (Stripe session) │──▶│  (Payments)  │
  │  us-east-1_     │   └──────────────────┘   └──────┬───────┘
  │  bqEVRsi2b      │                                  │
  │                 │   ┌──────────────────┐           │ webhook
  │  custom:plan    │   │  Lambda: db       │   ┌──────▼───────────────┐
  │  free / pro     │   │  (DynamoDB CRUD)  │   │  Lambda:             │
  └────────┬────────┘   │  JWT protected    │   │  stripe-webhook      │
           │            └────────┬──────────┘   │  (upgrade/downgrade) │
           │                     │              └──────────────────────┘
           ▼                     ▼
  ┌─────────────────────────────────────────┐
  │               AWS DynamoDB              │
  │   monthly_cert_selection                │
  │   free_usage                            │
  └─────────────────────────────────────────┘

  ┌──────────────────────────────────────────┐
  │  Lambda: verify-session                  │
  │  (upgrades Cognito custom:plan → pro     │
  │   after successful Stripe payment)       │
  └──────────────────────────────────────────┘
```

---

## Target Architecture (After Security Hardening)

```
                          ┌──────────────────────────────────┐
                          │             USER                  │
                          └──────────────┬───────────────────┘
                                         │ HTTPS
                                         ▼
                          ┌──────────────────────────────────┐
                          │    CloudFront + WAF               │  ← ADD THIS
                          │    Rate limiting, DDoS protection │
                          └──────────────┬───────────────────┘
                                         │
                          ┌──────────────▼───────────────────┐
                          │         AWS Amplify               │
                          │   (same as current)               │
                          └──────────────────────────────────┘
                                    (rest same)
```

---

## Auth Flow

```
1. User signs up → Cognito creates account (custom:plan = "free")
2. User logs in → Cognito returns JWT tokens
3. React stores tokens in memory
4. API calls → JWT sent in Authorization header
5. Lambda validates JWT → allows/denies request

Upgrade flow:
1. User clicks Upgrade → awsprepai-checkout Lambda → Stripe checkout URL
2. User pays → Stripe fires webhook → awsprepai-stripe-webhook Lambda
3. Webhook Lambda → updates Cognito custom:plan = "pro"
4. OR: User lands on success page → awsprepai-verify-session Lambda → updates Cognito
```
