# System Diagram — AWSPrepAI
**Date:** 2026-03-31

---

## Request Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        USER (Browser)                       │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              AWS Amplify (awsprepai.isaloumapps.com)        │
│              React App — Vite + TypeScript                  │
│                                                             │
│  Pages: Login, Signup, Dashboard, CertDetail,              │
│         Pricing, PaymentSuccess                             │
│                                                             │
│  Libs:  cognito.ts (auth)   db.ts (data)                   │
└────┬────────────────┬────────────────┬───────────────────── ┘
     │                │                │
     │ Auth calls     │ DB calls       │ Payment calls
     ▼                ▼                ▼
┌──────────┐  ┌──────────────────┐  ┌─────────────────────┐
│ Cognito  │  │  awsprepai-db    │  │ awsprepai-checkout  │
│ User Pool│  │  Lambda          │  │ Lambda              │
│          │  │  (JWT verified)  │  │                     │
│ custom:  │  │  DynamoDB CRUD   │  │ Creates Stripe      │
│  plan    │  │                  │  │ checkout session    │
│  tier    │  └────────┬─────────┘  └──────────┬──────────┘
│  expiry  │           │                        │
└──────────┘           ▼                        ▼
                ┌─────────────┐         ┌──────────────┐
                │  DynamoDB   │         │    Stripe    │
                │             │         │              │
                │ monthly_    │         │  Checkout    │
                │ cert_       │         │  Session     │
                │ selection   │         └──────┬───────┘
                │             │                │ redirect
                │ free_usage  │                ▼
                └─────────────┘    ┌───────────────────────┐
                                   │  PaymentSuccess page  │
                                   │  calls verify-session │
                                   └──────────┬────────────┘
                                              │
                                              ▼
                                   ┌─────────────────────────┐
                                   │ awsprepai-verify-session│
                                   │ Lambda                  │
                                   │                         │
                                   │ Looks up Stripe session │
                                   │ Updates Cognito         │
                                   │ custom:plan attribute   │
                                   └─────────────────────────┘

── Stripe Events ──────────────────────────────────────────────

Stripe Dashboard
     │ checkout.session.completed
     │ customer.subscription.deleted
     │ charge.dispute.created
     ▼
┌─────────────────────────────┐
│ awsprepai-stripe-webhook    │
│ Lambda                      │
│ (verifies whsec_ signature) │
│                             │
│ → upgrades / downgrades     │
│   Cognito custom:plan       │
└─────────────────────────────┘
```

## DynamoDB Tables

```
monthly_cert_selection
  PK: user_id (string)
  Attributes: cert_id, selected_at

free_usage
  PK: user_id (string)
  Attributes: cert_id, question_count, last_updated
```

## Cognito User Attributes
```
standard:  email, email_verified, sub
custom:    custom:plan         → free | monthly | yearly | lifetime
           custom:plan_expiry  → ISO date string
           custom:stripe_customer_id → cus_xxx
```
