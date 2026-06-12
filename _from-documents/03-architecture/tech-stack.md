# Tech Stack — AWSPrepAI
**Date:** 2026-03-31

---

## Frontend
| Layer | Choice | Rationale |
|---|---|---|
| Framework | React + Vite + TypeScript | Fast builds, type safety |
| Styling | Tailwind CSS | Utility-first, no CSS files |
| Auth SDK | amazon-cognito-identity-js | Browser-side Cognito auth |
| Hosting | AWS Amplify | Git-push deploy, free SSL, custom domain |
| Domain | awsprepai.isaloumapps.com | Amplify custom domain |

## Backend
| Layer | Choice | Rationale |
|---|---|---|
| Functions | AWS Lambda (Node 20) | Serverless, pay per call |
| Exposure | Lambda Function URLs | No API Gateway needed at this scale |
| Auth | AWS Cognito User Pool | Managed auth, JWT tokens |
| Database | DynamoDB PAY_PER_REQUEST | No joins needed, scales to zero |
| Payments | Stripe | Industry standard |

## Lambda Functions
| Name | Purpose |
|---|---|
| awsprepai-checkout | Creates Stripe checkout session |
| awsprepai-verify-session | Upgrades Cognito custom:plan after payment |
| awsprepai-db | DynamoDB CRUD, JWT-protected |
| awsprepai-stripe-webhook | Handles Stripe events (upgrade/downgrade/dispute) |

## AWS Account
- Account ID: 441393059130
- Region: us-east-1
- Cognito User Pool ID: us-east-1_bqEVRsi2b
- Cognito Client ID: 4j9mnlkhtu023takbj0qb1g10h

## Environment Variables (Amplify)
| Key | Value |
|---|---|
| VITE_COGNITO_USER_POOL_ID | us-east-1_bqEVRsi2b |
| VITE_COGNITO_CLIENT_ID | 4j9mnlkhtu023takbj0qb1g10h |
| VITE_DB_API_URL | https://f2i2exyezxhojuk7znx6rl5snm0tndur.lambda-url.us-east-1.on.aws/ |
| VITE_VERIFY_SESSION_URL | https://6ryf7eipwnxeus2xbekgvwykme0otufd.lambda-url.us-east-1.on.aws/ |
| NODE_VERSION | 20 |

## Trade-offs
| Decision | Why | Risk |
|---|---|---|
| Lambda URLs over API Gateway | Simpler, cheaper | No built-in rate limiting |
| DynamoDB over RDS | No joins, free tier forever | Can't do complex queries |
| Cognito over Supabase Auth | AWS native, learning value | More manual setup |
| No WAF yet | Cost savings at MVP stage | No DDoS protection |

## What's Missing (security gaps — fix next)
- Lambda concurrency limit = 10 (needs Service Quotas increase to 1000)
- No WAF / rate limiting on Lambda URLs
- No CloudFront in front of Lambda URLs
- No DLQ on stripe-webhook (no retry on crash)
