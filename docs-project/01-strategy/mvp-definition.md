# MVP Definition — AWSPrepAI
**Date:** 2026-03-31

---

## Must-Have (MVP — in production now)
- [x] User registration + login (Cognito)
- [x] Free tier with usage limits (DynamoDB free_usage table)
- [x] Stripe checkout + plan upgrade
- [x] Pro plan unlock after payment (Cognito custom:plan attribute)
- [x] Monthly cert selection (monthly_cert_selection table)
- [x] Hosted on Amplify with custom domain

## Should-Have (Next sprint)
- [ ] WAF + CloudFront (security hardening)
- [ ] Lambda concurrency quota raised to 1000
- [ ] Progress tracking per user (domains, % correct)
- [ ] Question explanations (why answer is right/wrong)
- [ ] Mobile-responsive UI improvements

## Later (Post-MVP)
- [ ] Admin dashboard (manage questions, see users)
- [ ] Multiple certification tracks (not just one per month)
- [ ] AI-generated question explanations
- [ ] Leaderboard / gamification
- [ ] Email drip (remind users to study)
- [ ] Annual pricing option

## Explicit Non-Goals (MVP)
- ❌ Video content — not a course platform
- ❌ Mobile app — web only for now
- ❌ Social features — no forums, no comments
- ❌ Enterprise / team plans — solo learners only
- ❌ Custom question uploads — curated content only

## User Outcome Mapping
| Feature | User Outcome |
|---------|-------------|
| Free tier limits | User experiences value before paying |
| Stripe upgrade | Frictionless path to paid |
| Monthly cert selection | Focused study, not overwhelmed |
| Progress tracking (soon) | User sees improvement, stays engaged |
