# CertiPrepAI — Claude Context
_Last updated: 2026-05-18_

## What this project is
AWS certification prep SaaS. React frontend on AWS Amplify, serverless backend on Lambda + DynamoDB + Cognito.
- **Live app:** https://certiprepai.com
- **Amplify URL:** https://main.d2pm3jfcsesli7.amplifyapp.com
- **GitHub:** https://github.com/Isaloum/CertiPrepAI (branch: `main`)
- **Local repo:** `~/Desktop/Projects/CertiPrepAI`
- **Amplify App ID:** d2pm3jfcsesli7
- **AWS Account:** 441393059130 (Fridayaiapp)
- **AWS Region:** us-east-1

---

## ⚠️ CRITICAL — READ BEFORE TOUCHING ANYTHING

### 1. Email normalization is MANDATORY
macOS autocorrects the first letter to uppercase. Cognito is case-sensitive. Every auth function MUST do:
```typescript
const normalizedEmail = email.trim().toLowerCase()
```
Every email input MUST have:
```tsx
onChange={e => setEmail(e.target.value.trim().toLowerCase())}
```
**NEVER remove this normalization from cognito.ts.**

### 2. Token type matters
- `awsprepai-db` Lambda uses `GetUserCommand({ AccessToken: token })` — requires **Cognito ACCESS token**
- Dashboard.tsx MUST pass `user.accessToken` (NOT `user.idToken`) to all DB functions
- Cancel Lambda also uses access token — always `user.accessToken`

### 3. API URLs are hardcoded in source (NOT env vars)
Amplify was NOT injecting VITE_* env vars into the Vite build. All API URLs are hardcoded:
- `react-app/src/lib/db.ts` → `const DB_API = "https://dzhvi7oz29.execute-api.us-east-1.amazonaws.com"`
- `react-app/src/pages/Dashboard.tsx` → `const CANCEL_API = "https://hpcdl0ft8a.execute-api.us-east-1.amazonaws.com"`
- `react-app/src/pages/AiCoach.tsx` → `const AI_COACH_API = "https://hyb325gocg.execute-api.us-east-1.amazonaws.com"`
- `react-app/src/pages/Pricing.tsx` + `Billing.tsx` + `Signup.tsx` → `CHECKOUT_API = "https://34zglioc5a.execute-api.us-east-1.amazonaws.com/checkout"`
- `react-app/src/pages/Pricing.tsx` + `Billing.tsx` → `UPGRADE_API = "https://d8bmltyjpe.execute-api.us-east-1.amazonaws.com"`
- Do NOT revert to env vars unless you fix Amplify build injection first.

### 4. Lambda zips must include node_modules
Always: `npm install` then zip before deploying. Use `coach.zip` or any name — NOT `lambda.zip` (turns into hyperlink in Claude chat).
```bash
cd aws-lambdas/FUNCTION-NAME && npm install
zip -r coach.zip index.js node_modules/
aws lambda update-function-code --function-name FUNCTION_NAME --zip-file fileb://coach.zip
```

### 5. Vite config
Must have `base: '/'` and `define: { global: 'globalThis' }` in `vite.config.ts`.
- `base: '/'` — Amplify deployment breaks without it
- `define: { global: 'globalThis' }` — AWS/Cognito SDK needs `global`; this replaces it at build time so NO inline script is needed in index.html. Never add `<script>window.global=...</script>` to index.html — it violates CSP.

### 6. Stripe cancellation = cancel_at_period_end: true
Cancel Lambda sets `cancel_at_period_end: true` on Stripe — user keeps access until billing period ends.
The Lambda does NOT downgrade Cognito plan — that is handled by the Stripe webhook at period end.

### 7. Browser caching
After deploys, always test in a **fresh incognito window**. Old bundles are aggressively cached.

### 8. ⚠️ CDN routing for certiprepai.com
`certiprepai.com` → Route 53 → **CloudFront `E149XOHRPMJ4D1`** (`d10nn383a5lev5.cloudfront.net`) → Amplify origin.
- Amplify RELEASE deployments do NOT clear this CloudFront cache.
- After any routing or caching fix, ALWAYS run: `aws cloudfront create-invalidation --distribution-id E149XOHRPMJ4D1 --paths "/*"`
- Amplify's own CDN only serves `main.d2pm3jfcsesli7.amplifyapp.com` (not the custom domain).

### 9. TypeScript strict mode
Amplify runs `tsc -b` before Vite build. Any unused variable (`TS6133`) or type error fails the build.
Always test locally first: `cd react-app && npm run build`

### 10. git HEAD.lock
If git says HEAD.lock exists: `rm -f ~/Desktop/Projects/CertiPrepAI/.git/HEAD.lock`

### 11. sed on macOS
macOS `sed -i ''` does NOT interpret `\n` as newline in replacement strings. Use Python instead:
```bash
python3 -c "f=open('file.tsx').read(); f=f.replace('old','new'); open('file.tsx','w').write(f)"
```

### 12. bundle tier MUST be in cognito.ts
The `AuthUser` type and `sessionToUser()` in `cognito.ts` MUST include `'bundle'` in the tier union type and the conditional check. If missing, bundle users are treated as free. Fixed May 2026 — never remove it.

### 13. Stripe webhook Lambda env vars (ALL THREE required)
`awsprepai-stripe-webhook` needs ALL THREE env vars or it crashes:
- `STRIPE_SECRET_KEY` — the restricted API key
- `STRIPE_WEBHOOK_SECRET` — `whsec_A1seLNW08cP1cUDmRGp82PNvPNcUOQ1W`
- `COGNITO_USER_POOL_ID` — `us-east-1_bqEVRsi2b`
Missing `COGNITO_USER_POOL_ID` = downgrades silently fail (users keep paid plan after canceling forever).

---

## Frontend Structure
- `docs/` — Only CNAME, favicon, robots.txt, sitemap.xml remain (static HTML deleted April 2026)
- `react-app/` — Vite + React + TypeScript → deployed via AWS Amplify. This is the ONLY frontend.

---

## Key Files

| File | Purpose |
|------|---------|
| `react-app/src/lib/cognito.ts` | All auth functions. Email normalization MANDATORY. `bundle` MUST be in AuthUser type + sessionToUser. |
| `react-app/src/lib/db.ts` | DynamoDB API wrapper. Uses ACCESS token. DB_API hardcoded. |
| `react-app/src/lib/analytics.ts` | PostHog wrapper. Key: `phc_vQkqAhkS2zJBrqL5roLz8iquSgXWuucyBodeyNH99dsS`. Public key — safe in bundle. |
| `react-app/src/contexts/AuthContext.tsx` | Auth state. Exposes: user, tier, isPremium, isFullAccess, loading. |
| `react-app/src/components/Navbar.tsx` | Nav. Pricing hidden for paid. Billing shown for paid. AI Coach tab hidden (accessible only via /ai-coach). |
| `react-app/src/pages/Login.tsx` | Email normalized on input onChange. |
| `react-app/src/pages/Signup.tsx` | Email normalized. Password strength indicator. PAID_PLANS includes bundle. |
| `react-app/src/pages/Dashboard.tsx` | Plan display, cert selection, Skill Radar Chart. AI Coach widget for lifetime only. Cancel button REMOVED (dead modal state remains — harmless). |
| `react-app/src/pages/Pricing.tsx` | Checkout + upgrade flows. Upgrade buttons with prorated preview modal. |
| `react-app/src/pages/Billing.tsx` | /billing page. Current plan + upgrade options for paying users. |
| `react-app/src/pages/AiCoach.tsx` | /ai-coach full page. Lifetime only (redirects others to /dashboard). Error message: "Lifetime plan members" only. |
| `react-app/src/pages/CertDetail.tsx` | Practice mode. Bookmark questions. Retry wrong answers. Free tier 20q gating. |
| `react-app/src/pages/MockExam.tsx` | Timed mock exam. Saves per-domain scores. Monthly/bundle gating. |
| `react-app/src/pages/CheatSheets.tsx` | All 12 cert cheat sheets. 5 tabs per cert. |
| `react-app/src/pages/ForgotPassword.tsx` | 3-step forgot password flow. |
| `react-app/src/components/SEOMeta.tsx` | Per-route meta tags + JSON-LD schemas. |
| `react-app/src/components/SkillRadarChart.tsx` | Radar chart using real per-domain DynamoDB scores. |
| `react-app/src/components/EmailCapture.tsx` | Centered modal popup at 60% scroll. Saves to awsprepai-leads. No auth required. Hidden for logged-in users. |
| `react-app/src/components/MarkdownRenderer.tsx` | Lightweight markdown renderer for AI Coach. No deps. |
| `react-app/src/components/Footer.tsx` | Auth-aware footer. Hides Sample Questions + shows Manage Subscription for paid users. |
| `aws-lambdas/ai-coach/index.js` | AI Coach Lambda. **Lifetime-only** (`custom:plan === 'lifetime'`). Fixed May 2026. |
| `aws-lambdas/cancel-subscription/index.mjs` | Cancels Stripe sub (period end). Does NOT touch Cognito plan. Uses raw https (no SDK). |
| `aws-lambdas/upgrade-subscription/index.mjs` | Handles preview + execute for plan upgrades with Stripe proration. USER_POOL_ID hardcoded inside. |
| `aws-lambdas/awsprepai-db/index.js` | DynamoDB CRUD. `capture_lead` requires NO auth. All others require ACCESS token. |
| `aws-lambdas/stripe-webhook/index.js` | Stripe events → Cognito + DynamoDB. Needs all 3 env vars (see critical note #13). |
| `aws-lambdas/checkout/index.js` | Creates Stripe checkout session. Reuses existing Stripe customer by email (no duplicates). |
| `aws-lambdas/email-drip/index.mjs` | 3-email drip (welcome, day3, day7). Prices: $7/$67/$147. FROM: hello@certiprepai.com. Unsubscribe link = homepage (CAN-SPAM risk — known). |
| `aws-lambdas/verify-session/index.js` | Called after checkout redirect. Upgrades Cognito tier. Redundant with webhook but kept as fallback while webhook is unstable. |

---

## AWS Resources

| Resource | ID/Value |
|----------|--------|
| Cognito User Pool | `us-east-1_bqEVRsi2b` |
| Lambda: awsprepai-checkout | Creates Stripe checkout session. Reuses existing customer by email. |
| Lambda: awsprepai-cancel-subscription | Cancels sub at period end (API Gateway behind it) |
| Lambda: awsprepai-verify-session | Session verification after checkout redirect |
| Lambda: awsprepai-stripe-webhook | Stripe events → Cognito + DynamoDB. Needs STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET + COGNITO_USER_POOL_ID |
| Lambda: awsprepai-db | DynamoDB CRUD (API Gateway behind it) |
| Lambda: awsprepai-ai-coach | AI Coach via Claude Haiku. **Lifetime-only.** |
| Lambda: awsprepai-upgrade-subscription | Upgrade with Stripe proration |
| Lambda: awsprepai-email-drip | 3-email drip sequence |
| IAM Role for Lambdas | `arn:aws:iam::441393059130:role/awsprepai-checkout-role` |
| DynamoDB: awsprepai-users | ⚠️ Does NOT exist — user data stored in Cognito attributes only |
| DynamoDB: awsprepai-progress | (user_id PK, cert_id SK) — stores domain_scores map |
| DynamoDB: awsprepai-monthly-cert | Monthly cert selection per user |
| DynamoDB: awsprepai-free-usage | Free tier question count |
| DynamoDB: awsprepai-leads | Email capture (no auth) |
| DynamoDB: awsprepai-bundle-certs | Bundle cert selection (user_id PK) |
| API Gateway: DB | `https://dzhvi7oz29.execute-api.us-east-1.amazonaws.com` |
| API Gateway: Cancel | `https://hpcdl0ft8a.execute-api.us-east-1.amazonaws.com` |
| API Gateway: AI Coach | `https://hyb325gocg.execute-api.us-east-1.amazonaws.com` |
| API Gateway: Upgrade | `https://d8bmltyjpe.execute-api.us-east-1.amazonaws.com` |
| API Gateway: Checkout | `https://34zglioc5a.execute-api.us-east-1.amazonaws.com/checkout` |
| API Gateway: Stripe Webhook | `https://515bmmrebh.execute-api.us-east-1.amazonaws.com` |
| CloudFront | `E149XOHRPMJ4D1` → `d10nn383a5lev5.cloudfront.net` |
| WAF | `awsprepai-waf` — attached to CloudFront. Rules: RateLimitRule + AWSManagedRulesCommonRuleSet |
| CloudWatch Alarm | `certiprepai-db-errors` — alerts on awsprepai-db Lambda errors ≥3 in 5min |
| Sentry | DSN: `https://ff11893839d989559b8b45663789b544@o4511333066145792.ingest.us.sentry.io/4511333070667776`. Production-only. |
| UptimeRobot | Monitors https://certiprepai.com every 5min |
| GitHub Actions CI | `.github/workflows/ci.yml` — runs `npm install` + `npm run build` on every push to main |

---

## Cognito Custom Attributes
- `custom:plan` — values: `free`, `monthly`, `bundle`, `yearly`, `lifetime`
- `custom:plan_expiry` — ISO date string
- `custom:stripe_customer_id` — Stripe cus_xxx ID

---

## Plan Tier System

```typescript
const TIER_RANK = { free: 0, monthly: 1, bundle: 1.5, yearly: 2, lifetime: 3 }
const isPremium = tier !== 'free'
const isFullAccess = tier === 'yearly' || tier === 'lifetime'
```

| Plan | Price | Access | AI Coach |
|------|-------|--------|----------|
| free | $0 | 20 sample questions | ❌ |
| monthly | $7/mo | 1 cert (pick from 12) | ❌ |
| bundle | $17/mo | 3 certs (pick from 12) | ❌ |
| yearly | $67/yr | All 12 certs | ❌ |
| lifetime | $147 once | All 12 certs | ✅ Widget on Dashboard + /ai-coach page |

---

## Stripe Price IDs (live)
| Plan | Price ID |
|------|----------|
| monthly | `price_1TB1YCE9neqrFM5LDbyzVSnv` |
| bundle | `price_1TEh73E9neqrFM5L2Q38zGJF` |
| yearly | `price_1TED8EE9neqrFM5LCIL9P0Yp` |
| lifetime | `price_1TED9ME9neqrFM5LeKAAEWTO` |

---

## Navbar Logic (Tier-based)

| User State | Pricing Tab | Billing in Dropdown |
|------------|-------------|---------------------|
| Logged out | ✅ Visible | ❌ |
| Free | ✅ Visible | ❌ |
| Monthly / Bundle / Yearly / Lifetime | ❌ Hidden | ✅ |

---

## Stripe Keys

### Restricted key (checkout + upgrade Lambdas)
- Stored in Lambda env vars — do NOT put in source files
- Permissions: Checkout Sessions Write, Customers Write, Subscriptions Write

### Full secret key (cancel + verify-session Lambdas)
- ⚠️ These use full `sk_live` key — should eventually be replaced with restricted key

### Webhook
- Endpoint: `https://515bmmrebh.execute-api.us-east-1.amazonaws.com`
- Secret: `STRIPE_WEBHOOK_SECRET` env var in `awsprepai-stripe-webhook` Lambda

---

## Email Infrastructure (WorkMail)
- Domain: certiprepai.com
- Mailboxes: support@, noreply@, hello@
- DNS: MX, SPF, DKIM, DMARC, autodiscover records set in Route 53
- Statement descriptor on Stripe: CertiPrepAI
- ⚠️ WorkMail deprecated March 31, 2027 — migrate to Zoho Mail (free) before Jan 2027
- SES MAIL FROM: mail.certiprepai.com (MX + SPF records in Route 53)

---

## Test Accounts
| Email | Plan | Notes |
|-------|------|-------|
| ihabsaloum85@gmail.com | Free (all Stripe subs canceled) | Primary test account |
| ihabsaloum@hotmail.com | Free | Was monthly, now free |

To restore plan manually:
```bash
aws cognito-idp admin-update-user-attributes \
  --user-pool-id us-east-1_bqEVRsi2b \
  --username user@example.com \
  --user-attributes Name=custom:plan,Value=monthly
```

---

## Deployment
- **Auto-deploy:** push to `main` → Amplify builds in ~90 seconds
- **Check build:** `aws amplify list-jobs --app-id d2pm3jfcsesli7 --branch-name main --max-results 3`
- **Local build test:** `cd react-app && npm run build` (ALWAYS do this before pushing)
- **CloudFront invalidation:** `aws cloudfront create-invalidation --distribution-id E149XOHRPMJ4D1 --paths "/*"`

---

## ✅ Launch Readiness (May 13, 2026) — All Systems Go

| System | Status |
|--------|--------|
| Site uptime (7 days) | ✅ 100% |
| SSL certificate | ✅ A+ |
| Page speed (LCP) | ✅ 1.1s (Google wants <2.5s) |
| Total Blocking Time | ✅ 0ms |
| Stripe checkout | ✅ Working, no duplicate customers |
| Stripe webhook | ✅ Fixed (was missing COGNITO_USER_POOL_ID) |
| Cancel subscription | ✅ Working |
| Upgrade subscription | ✅ Working |
| AI Coach (lifetime) | ✅ Lifetime-only gate confirmed |
| Email drip prices | ✅ Fixed ($7/$67/$147) |
| bundle tier auth | ✅ Fixed (was treating bundle as free) |
| CI/CD | ✅ GitHub Actions on every push |
| PostHog analytics | ✅ Active |
| Sentry error tracking | ✅ Active |
| UptimeRobot monitoring | ✅ Active |

---

## ✅ Built This Session (May 18, 2026) — Study Guide Expansion

| # | Item | Details |
|---|------|---------|
| 17 | SAA-C03 Architect's Codex (8th tab) | Added to `SaaGuide.tsx`. 6-part codex: Architect's Mindset, Service Selection Decision Trees (Storage/Database/Compute/Network/Integration), Security (IAM Evaluation Logic, Condition Operators, Cross-Account Role, Directory Services), HA/DR (4 tiers: Backup→Pilot Light→Warm Standby→Active-Active), Cost Optimisation, Exam Strategy. Plus Appendix: Ports/CIDR/Acronyms. |
| 18 | SAA-C03 Gap Coverage | Added 26 new rows to Decision Matrix (exam-critical + medium priority). Added DynamoDB RCU/WCU math section to Numbers & Facts tab (formulas + worked examples). Expanded Codex Part 1 Security with IAM Condition Operators panel, Cross-Account Role Delegation panel, Directory Services comparison. Expanded Codex Part 2 with specialty DBs (QLDB, Neptune, Timestream, Managed Blockchain) and Lambda@Edge 4-stage decision tree. |
| 19 | CLF-C02 Codex (7th tab) | Added to `ClfGuide.tsx`. Green scheme (#059669). Covers: 6 Cloud Advantages, Deployment Models (Public/Private/Hybrid), Service Models (IaaS/PaaS/SaaS — Lambda = FaaS fixed), Global Infrastructure (AZ min-2 note), Core Services (5 panels), Shared Responsibility + IAM + Security Services, Billing (RI=72% fixed, Free Tier, Support Plans table, Cost Tools), Exam Strategy (question patterns, elimination tricks), CLF Mantra. |
| 20 | AIF-C01 Codex (7th tab) | Added to `AifGuide.tsx`. Purple scheme (#7c3aed). Covers: 4 ML types, 10-term AI glossary, Bedrock deep card (models/KB/Agents/Guardrails), Pre-built AI services by category, SageMaker components, AI chips (Trainium/Inferentia), 4 Responsible AI pillars, Bedrock Guardrails 5 types, HITL/A2I, use-case decision tree, 14 keyword→service mappings, Bedrock vs SageMaker table, AIF Mantra. |
| 21 | CLF gap coverage (exhaustive drill-down) | `ClfGuide.tsx` Decision Matrix +6 rows: AWS Artifact, CloudFormation, DMS, Site-to-Site VPN, Aurora, CUR. Codex new section: Securing a New Account (4 steps), Direct Connect vs VPN comparison table, Data Transfer Pricing (IN free / OUT billed / cross-region billed), AWS Artifact callout panel. |
| 22 | AIF gap coverage (exhaustive drill-down) | `AifGuide.tsx` Decision Matrix +7 rows: SageMaker Canvas, Data Wrangler, Batch Transform, Transcribe Call Analytics, Connect+Lex, Panorama, MTurk. Codex new section: MDLC 7 phases table, Precision/Recall/F1 formulas with when-to-use, Data Drift vs Concept Drift side-by-side, SageMaker inference types (Real-Time/Serverless/Batch/Async), Amazon Q Business vs Q Developer full comparison table. |
| 23 | SAA layout fixes | Security section: removed 2-col grid that left tall white gap (switched to flex column). HA checklist: fixed to `repeat(3, 1fr)` for uniform box sizes. Lambda@Edge cards: fixed to `repeat(2, 1fr)` 2×2 grid (was 4-col in narrow container = unreadable). Codex tab badge: set to `'6'` (6 parts). |
| 24 | CLF second-pass gap coverage | `ClfGuide.tsx` Decision Matrix +3 rows: S3 Intelligent-Tiering, Amazon SQS (decoupling), AWS Compute Optimizer. Codex new panel: 4 Cloud Architecture Design Principles (Design for Failure, Decouple Components, Implement Elasticity, Think Parallel). Codex Databases table: DAX (DynamoDB Accelerator, microsecond latency, drop-in compatible). |
| 25 | AIF second-pass gap coverage | `AifGuide.tsx` Decision Matrix +2 rows: SageMaker Studio (unified ML IDE), SageMaker Model Cards (governance/responsible AI). Codex RL card: added AWS DeepRacer as the specific AWS service for learning Reinforcement Learning. |
| 26 | Audit fixes (full pass) | Home.tsx H1 typo fixed (`for<br/>` → `for <br/>`). index.html: 3,958→3,910 (all 5 occurrences). SEOMeta.tsx: og:image + twitter:image added to all routes. `/sample-questions` + `/clf-guide` added to ROUTE_META. sitemap.xml: 12→27 URLs (all 12 cert pages + study guide pages). og-image.svg created (1200×630 branded). Converted to og-image.png via sips. |
| 27 | SkillRadarChart improvements | Empty state: ghost chart replaced with motivating message + "Start Practicing →" CTA button. Domain cards: now show attempted count + correct% underneath gap score (e.g. "12 questions · 75% correct"). Domain table hidden entirely until user has practiced. |

### Study Guide Tab Structure (as of May 18, 2026)

**SaaGuide.tsx** — 8 tabs
| Tab ID | Label | Content |
|--------|-------|---------|
| `matrix` | 🎯 Decision Matrix | ~90+ requirement→solution rows |
| `traps` | ⚠️ Exam Traps | Wrong-answer patterns with explanations |
| `deepdives` | 🔬 Deep Dives | Domain-specific technical breakdowns |
| `studyplan` | 📅 Study Plan | 4-week structured study schedule |
| `reference` | 📋 Quick Reference | Service limits, CIDR blocks, port numbers |
| `strategy` | 🧠 Exam Strategy | Test-taking tactics and time management |
| `numbers` | 🔢 Numbers & Facts | Critical numbers, RCU/WCU math, service distinctions |
| `codex` | 🧭 Architect's Codex | 6-part decision framework + Appendix |

**ClfGuide.tsx** — 7 tabs
| Tab ID | Label | Content |
|--------|-------|---------|
| `matrix` | 🎯 Decision Matrix | CLF scenario→service mappings |
| `traps` | ⚠️ Exam Traps | CLF common wrong-answer patterns |
| `deepdives` | 🔬 Deep Dives | Cloud concepts, billing, security deep dives |
| `studyplan` | 📅 Study Plan | CLF study schedule |
| `reference` | 📋 Quick Reference | CLF quick reference tables |
| `strategy` | 🧠 Exam Strategy | CLF test-taking tactics |
| `codex` | 🧭 CLF Codex | Cloud fundamentals, global infra, billing, exam mantra |

**AifGuide.tsx** — 7 tabs
| Tab ID | Label | Content |
|--------|-------|---------|
| `matrix` | 🎯 Decision Matrix | AIF scenario→service mappings |
| `traps` | ⚠️ Exam Traps | AIF common wrong-answer patterns |
| `deepdives` | 🔬 Deep Dives | ML/AI domain deep dives |
| `studyplan` | 📅 Study Plan | AIF study schedule |
| `reference` | 📋 Quick Reference | AIF quick reference tables |
| `strategy` | 🧠 Exam Strategy | AIF test-taking tactics |
| `codex` | 🧭 AIF Codex | ML types, Bedrock, SageMaker, Responsible AI, exam mantra |

### Content Placement Rules (established this session)
| Content Type | → Tab |
|--------------|-------|
| Scenario → service mappings | Decision Matrix |
| Numeric limits and thresholds | Numbers & Facts |
| Formulas with worked examples | Numbers & Facts |
| Conceptual frameworks / decision trees | Codex |
| Wrong-answer patterns | Exam Traps |

### Content Accuracy Fixes Applied
| File | Fix |
|------|-----|
| SaaGuide Codex | Pilot Light ≠ Warm Standby (separate DR tiers). Active/Active RTO = "Seconds / Near-zero". Port 3389 (RDP) added to Appendix. |
| ClfGuide Codex | Lambda = FaaS (not PaaS). AZ minimum = 2 (some regions only have 2). RI discount = 72% (not 75%). |

---

## 🔲 Known Issues & Backlog

| Priority | Item |
|----------|------|
| 🟡 Medium | Downgrade flow (yearly → monthly) not built — buttons are disabled with "Contact support to downgrade" message. Build real flow when needed. |
| 🟡 Medium | Billing.tsx: `navigate('/login')` called during render (not in useEffect) — React anti-pattern, causes warning |
| 🟡 Medium | upgrade-subscription Lambda: Cognito updated before Stripe confirms payment — user could get free upgrade if card fails |
| 🟡 Medium | CAN-SPAM: email drip "unsubscribe" link goes to homepage, not real unsubscribe mechanism |
| 🟡 Medium | CLF-C02 study tools — Keywords + Service Groups for highest-volume entry cert |
| 🟡 Medium | PostHog: Signup.tsx passes email as userId instead of Cognito sub — creates duplicate profiles |
| 🟡 Medium | SkillRadarChart domain catKeys may not match CertDetail domain keys for gai-c01 |
| 🟢 Low | SEOMeta: /visual-exam, /architecture-builder still missing dedicated meta tags |
| 🟢 Low | Move hardcoded API URLs to env vars (fix Amplify build injection first) |
| 🟢 Low | Zoho Mail migration — WorkMail deprecated March 2027 |
| 🟢 Low | Replace full sk_live keys in cancel + verify-session with restricted keys |

---

## ⚠️ Deploy Checklist (run after every push)
```bash
git push origin main
# wait ~90s for Amplify build
aws cloudfront create-invalidation --distribution-id E149XOHRPMJ4D1 --paths "/*"
# test in fresh incognito window
```

---

## Monthly AWS Cost (~$17-18/mo)
- WorkMail: ~$8 (shared with TaxFlowAI)
- Route 53: ~$5
- Amplify: ~$2
- Lambda/Cognito/DynamoDB: ~$1-2
- **CertiPrepAI itself: ~$0**

---

## Common Commands
```bash
# Check Cognito user
aws cognito-idp admin-get-user --user-pool-id us-east-1_bqEVRsi2b --username user@example.com

# Fix user plan manually
aws cognito-idp admin-update-user-attributes \
  --user-pool-id us-east-1_bqEVRsi2b \
  --username user@example.com \
  --user-attributes Name=custom:plan,Value=monthly

# Lambda logs
aws logs tail /aws/lambda/FUNCTION_NAME --since 10m

# Check Amplify builds
aws amplify list-jobs --app-id d2pm3jfcsesli7 --branch-name main --max-results 5

# Deploy Lambda
cd aws-lambdas/FUNCTION-NAME && npm install
zip -r deploy.zip index.js node_modules/
aws lambda update-function-code --function-name FUNCTION_NAME --zip-file fileb://deploy.zip

# CloudFront cache clear
aws cloudfront create-invalidation --distribution-id E149XOHRPMJ4D1 --paths "/*"

# Remove git lock
rm -f ~/Desktop/Projects/CertiPrepAI/.git/HEAD.lock

# Fix webhook Lambda env vars (all 3 required)
aws lambda update-function-configuration \
  --function-name awsprepai-stripe-webhook \
  --environment "Variables={STRIPE_SECRET_KEY=YOUR_KEY,STRIPE_WEBHOOK_SECRET=whsec_A1seLNW08cP1cUDmRGp82PNvPNcUOQ1W,COGNITO_USER_POOL_ID=us-east-1_bqEVRsi2b}"
```

---

## 🧠 How to Prompt Claude for This Project

### 🟦 Template 1 — New Page
```
Create a new page at `react-app/src/pages/[PageName].tsx`.
- Route: /[route-name] (add to react-app/src/App.tsx)
- Pattern: same structure as [ClosestExistingPage].tsx
- Access: [free | isPremium | isFullAccess | tier === 'lifetime']
  → if blocked: redirect to [/pricing | /dashboard]
- Data: [fetches from DB_API using user.accessToken | no data needed | static content]
- SEO: add entry to react-app/src/components/SEOMeta.tsx ROUTE_META
- Nav: [add to Navbar under section X | no nav change needed]
- Do NOT: [add anything to Dashboard | change auth logic | touch cognito.ts]
```

### 🟩 Template 2 — New Lambda
```
Create a new Lambda at `aws-lambdas/[function-name]/index.js`.
- Function name: awsprepai-[function-name]
- Trigger: API Gateway HTTP (method: POST | GET)
- Auth: [Cognito ACCESS token in Authorization header | no auth required]
- Input: { field1, field2 } in request body
- Output: { result } JSON
- AWS services used: [DynamoDB table X | SES | Stripe | Cognito]
- Error handling: return 400 for missing fields, 401 for bad token, 500 for AWS errors
- Do NOT: use idToken — always ACCESS token for Cognito GetUserCommand
```

### 🟨 Template 3 — UI Change
```
In `react-app/src/pages/[File].tsx`:
- Find: [describe the section or paste the exact text]
- Change: [what to change and why]
- Access rule: [keep existing | change to isPremium | lifetime only]
- Style: match existing inline style pattern (no CSS modules, no Tailwind)
- Do NOT: change any other file unless I list it here
```

### 🟥 Template 4 — Gating
```
Gate [feature/page/component] behind [isPremium | isFullAccess | tier === 'lifetime'].
- File: react-app/src/pages/[File].tsx
- Import: { isPremium } from useAuth() — already in AuthContext
- If blocked: show paywall card with lock emoji + message + "See Plans →" button → /pricing
- Do NOT change the underlying data fetching — only wrap in the gate
```

### 🟪 Template 5 — Deploy & Ship
```
1. cd react-app && npm run build
2. Fix any TypeScript errors (no unused vars — TS6133 fails Amplify)
3. git add [specific files]
4. git commit -m "[description]"
5. git push origin main
6. Wait ~90s for Amplify build
7. aws cloudfront create-invalidation --distribution-id E149XOHRPMJ4D1 --paths "/*"
8. Test in fresh incognito window at https://certiprepai.com
```

### ✅ Golden Rules
| Rule | Why |
|------|-----|
| Always name the exact file path | No guessing where it goes |
| Say "same pattern as X.tsx" | Claude mirrors structure, imports, style |
| Specify the access tier explicitly | isPremium ≠ isFullAccess ≠ lifetime |
| List every file that needs updating | Routes, Nav, SEO — Claude won't assume |
| End with "Do NOT touch X" | Prevents unintended side effects |
| One feature per prompt | Easier to review, easier to roll back |
