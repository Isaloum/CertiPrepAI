# Tech Stack — AWSPrepAI
**Date:** 2026-03-31

---

## Current Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Frontend | React + Vite | Fast build, familiar, SPA |
| Auth | AWS Cognito | Native AWS, generous free tier, JWT |
| Backend | AWS Lambda (Function URLs) | Serverless, no infra management, pay-per-use |
| Database | AWS DynamoDB | Scalable, free tier covers early traffic |
| Payments | Stripe | Industry standard, webhooks reliable |
| Hosting | AWS Amplify | Auto-deploy from GitHub, CDN included |
| Domain | isaloumapps.com | Custom domain on Amplify |

## Trade-offs

### Lambda Function URLs vs. API Gateway
- **Chose:** Function URLs (simpler, free, no extra config)
- **Trade-off:** No built-in throttling, usage plans, or request validation
- **Risk:** Must add WAF manually for rate limiting

### DynamoDB vs. RDS
- **Chose:** DynamoDB (schemaless, free tier, serverless-native)
- **Trade-off:** No complex queries, no joins
- **Risk:** If data model grows complex, migration to RDS is painful

### Cognito vs. Auth0 / Clerk
- **Chose:** Cognito (native AWS, free up to 50k MAU)
- **Trade-off:** More complex to configure, less developer-friendly
- **Risk:** Cognito UI customization is limited

## Missing (Needs to be added)
| Component | Why Needed | Cost |
|-----------|-----------|------|
| CloudFront | CDN + DDoS protection | ~$1-3/month |
| WAF | Rate limiting, bot protection | ~$5/month |
| DLQ (SQS) | Stripe webhook retry safety | Free tier |

## Recommended Next Stack Addition
**CloudFront + WAF** — puts a shield in front of both Amplify and Lambda URLs. Single change, maximum security coverage.
