# CertiPrepAI

**Last updated:** 2026-06-09
**Status:** Live in production — https://certiprepai.com

AWS certification prep SaaS: 3,910 practice questions across 12 certifications, mock exams, study guides, AI coach.

> 📘 **Full operational documentation lives in [CLAUDE.md](CLAUDE.md)** — deployment checklist, AWS resource IDs, critical gotchas, session history. This README is the high-level overview only.

---

## Architecture

```
User → Route 53 → CloudFront (E149XOHRPMJ4D1) + WAF → Amplify (React SPA)
          → Cognito (us-east-1_bqEVRsi2b) — auth + plan tiers in custom attributes
          → API Gateway → Lambda
               - awsprepai-db                   → DynamoDB CRUD
               - awsprepai-checkout             → Stripe checkout session
               - awsprepai-stripe-webhook       → Stripe events → Cognito/DynamoDB
               - awsprepai-cancel-subscription  → cancel at period end
               - awsprepai-upgrade-subscription → prorated upgrades
               - awsprepai-verify-session       → post-checkout fallback
               - awsprepai-ai-coach             → Claude Haiku (lifetime only)
               - awsprepai-email-drip           → 3-email onboarding sequence
          → DynamoDB (progress, monthly-cert, free-usage, leads, bundle-certs)
```

- **Frontend:** `react-app/` — Vite + React + TypeScript, deployed via AWS Amplify (the ONLY frontend)
- **Static files** (robots.txt, sitemap.xml, og-image): `react-app/public/` — ⚠️ `docs/` is NOT deployed
- **AWS Account:** 441393059130 · us-east-1

## Plans

| Plan | Price | Access |
|------|-------|--------|
| free | $0 | 50 questions per cert |
| monthly | $7/mo | 1 cert |
| bundle | $17/mo | 3 certs |
| yearly | $67/yr | all 12 certs |
| lifetime | $147 once | all 12 certs + AI Coach |

## Key Routes

| Path | Purpose |
|------|---------|
| `/` `/pricing` `/about` `/certifications` `/sample-questions` `/terms` | Public (in sitemap) |
| `/cert/:certId` | Practice per cert (free tier gated at 50q) |
| `/mock-exam/:certId` | Timed 65q mock exam |
| `/saa-guide` `/clf-guide` `/aif-guide` | Deep study guides (7–8 tabs each) |
| `/quick-fire` | 277 rapid-drill questions, 6 modes |
| `/dashboard` `/billing` `/ai-coach` | Authenticated |

## Deploy

```bash
cd react-app && npm run build          # ALWAYS test locally first (tsc -b runs too)
git push origin main                   # Amplify auto-builds (~90s)
aws cloudfront create-invalidation --distribution-id E149XOHRPMJ4D1 --paths "/*"
# verify in fresh incognito window
```

## Monitoring

- **Sentry** (production errors) · **PostHog** (analytics) · **UptimeRobot** (5-min checks)
- **CloudWatch alarm** on awsprepai-db errors · **GitHub Actions CI** on every push

## Top Backlog

1. 🔴 Pre-render public routes — SPA empty body is invisible to crawlers/link previews (blocks SEO + lead-magnet funnel)
2. 🟡 Real downgrade flow (yearly → monthly)
3. 🟡 CAN-SPAM: real unsubscribe mechanism in email drip
4. 🟢 Zoho Mail migration before WorkMail deprecation (March 2027)

## Git

- Repo: `Isaloum/CertiPrepAI` · branch `main` · remote via HTTPS (`gh auth setup-git`)
- Local path: `~/Desktop/Projects/CertiPrepAI`
