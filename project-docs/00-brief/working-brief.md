# Working Brief — AWSPrepAI
**Date:** 2026-03-31
**Status:** Active Development

---

## Problem
People preparing for AWS certifications need practice questions and structured study material. Existing tools are expensive or poorly designed.

## User (ICP)
- Developers and IT professionals studying for AWS certs (Solutions Architect, Developer, SysOps, etc.)
- Age 25–45, technical background, self-motivated learners
- Willing to pay for quality content after validating free tier

## Platform
- Web (React SPA) — mobile-responsive

## Team
- Solo founder: Ihab Saloum

## Stack Decision
| Layer | Choice | Why |
|-------|--------|-----|
| Frontend | React + Vite | Fast dev, familiar |
| Auth | AWS Cognito | Native AWS, free tier generous |
| Backend | AWS Lambda (Function URLs) | Serverless, no server management |
| Database | DynamoDB | Scalable, pay-per-use |
| Payments | Stripe | Industry standard |
| Hosting | AWS Amplify | Auto-deploy from GitHub |

## Compliance
- None currently required
- GDPR consideration: users are global, emails stored in Cognito

## Success in 90 Days
- [ ] 100 paying users
- [ ] < $50/month AWS costs
- [ ] < 2s page load
- [ ] Zero data incidents

## Assumptions (labeled)
- [ASSUMPTION] Free tier = limited questions per month, paid = unlimited
- [ASSUMPTION] No mobile app needed in MVP
- [ASSUMPTION] Questions are stored in DynamoDB, not a separate CMS
- [ASSUMPTION] No admin dashboard needed yet
