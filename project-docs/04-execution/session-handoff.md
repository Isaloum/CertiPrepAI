# Session Handoff Log — AWSPrepAI

---

## Session 1 — 2026-03-31

### What Was Done
1. **Supabase → AWS Migration — COMPLETE**
   - Amplify build succeeded and deployed at 9:39 AM
   - All 3 Lambda Function URLs confirmed working with `AuthType: NONE`
   - Fixed missing `AllowPublicAccess` permission on `awsprepai-db` Lambda
   - Stripe webhook configured in Stripe Dashboard
   - Live webhook secret `whsec_REDACTED_SEE_LAMBDA_ENV` set in Lambda env vars

2. **Security Audit**
   - Added AWS Budgets alert at $40/month (80% of $50 cap) → email: ihabsaloum85@gmail.com
   - Identified gaps: no DDoS protection, no rate limiting, no DB-level security
   - Lambda concurrency = 10 → critically low, quota increase needed

3. **Fridayaiapp Cost Audit (account 4413-9305-9130)**
   - `bumpie-staging` NAT Gateway → **DELETED** (saved $15.90/month)
   - WorkMail → still running ($3.89/month) — **pending deletion**
   - Idle IPv4 in us-east-1 → **pending release** ($3.60/month)
   - Secrets Manager → **pending deletion** ($0.95/month)
   - Route 53 hosted zone → **pending deletion** ($0.51/month)

4. **Codebase Cleanup — Identified (not executed yet)**
   - See `04-execution/pending-tasks.md` for full file-by-file list

### What Was NOT Done
- Lambda concurrency quota increase (needs AWS console action)
- WAF + CloudFront setup
- Codebase cleanup
- Fridayaiapp cost cleanup (except NAT Gateway)

### Handoff Notes
- Users must re-register — Cognito starts fresh, no Supabase data migrated
- Stripe webhook secret is live — do not regenerate
- Fridayaiapp MCP is NOT connected — main account (`441393059130`) is
- bumpie-staging VPC is kept intentionally — NAT Gateway re-created in 2 weeks
- Always work in `/Users/ihabsaloum/Desktop/Projects/AWSPrepAI`

---

## Session 2 — 2026-04-28

### What Was Done
1. **Billing page** (`/billing`) — current plan card + upgrade options with prorated modal
2. **AI Coach page** (`/ai-coach`) — full-page chat, lifetime-only gate, redirects others to /dashboard
3. **Navbar tier logic** — Pricing tab hidden for paid users. Billing shown for paid. Sample Questions hidden for paid
4. **Dashboard AI Coach** — Cancel button removed. Lifetime: AI Coach widget shown
5. **AI Coach Lambda** — `awsprepai-ai-coach` with `custom:plan === 'lifetime'` gating
6. **MarkdownRenderer.tsx** — lightweight markdown for AI Coach responses
7. **CloudFront 404 fix** — custom error responses: 404+403 → /index.html (200). Fixes SPA hard refresh
8. **Pricing fixes** — Yearly: $67/yr. Lifetime: $147. AI Coach removed from yearly
9. **Auth-aware UI** — Home, About, Footer, SampleQuestions, ServiceGroups show different CTAs for paid vs free
10. **EmailCapture redesign** — sticky bottom banner → centered modal popup at 60% scroll
11. **No Refund Policy** — added as section 5 in Terms.tsx
12. **Upgrade flow** — `awsprepai-upgrade-subscription` Lambda + API Gateway with prorated Stripe preview modal
13. **WorkMail** — certiprepai.com org. support@, noreply@, hello@ mailboxes. DNS in Route 53
14. **Paid-user UI cleanup** — Home pricing teaser hidden, Pricing bottom CTA → "Go to Certifications", SampleQuestions redirects paid to /certifications

---

## Session 3 — 2026-05-18

### What Was Done
1. **CLF-C02 Deep Study Guide** — `ClfGuide.tsx`, 6 tabs (Decision Matrix, Exam Traps, Deep Dives, 14-day Study Plan, Quick Reference, Exam Strategy). `useCertAccess('clf-c02')` gate
2. **CLF Keywords tab** — Added 3rd cert switcher (SAA · CLF · AIF). 65 CLF keywords across 9 categories
3. **SAA Numbers & Facts tab** — 47 critical numbers, 4 service distinction tables, DynamoDB RCU/WCU math
4. **SAA Architect's Codex tab** — 6 parts: Mindset, Decision Trees, Security (IAM Conditions, Cross-Account, Directory Services), HA/DR, Cost, Exam Strategy, Ports/CIDR appendix
5. **CLF Codex tab** — 6 advantages, deployment/service models, global infra, core services, shared responsibility, billing, support plans
6. **AIF Codex tab** — 4 ML types, AI terminology, Bedrock/SageMaker, Responsible AI, Guardrails 5 types, use case decision tree
7. **SAA gap coverage** — +26 Decision Matrix rows including Lambda@Edge, QLDB, Timestream, Managed Blockchain, DMS+SCT, Health Dashboard, Migration Hub, Application Discovery

---

## Session 4 — 2026-05-25

### What Was Done
1. **robots.txt fix** — Removed all explicit Allow rules that were blocking new pages from Google indexing. Now only has Disallow for private pages
2. **sitemap.xml expansion** — Added /saa-guide, /clf-guide, /aif-guide (priority 0.95), /quick-fire (0.85), /prompt-patterns, /sample-questions, /architecture-builder, /terms. Removed /login and /signup
3. **QuickFire expansion** — 115 → 277 questions. 4 → 6 drill modes (added Scenarios + Compare). Same-mode distractor logic
4. **QuickFire wired** — Lazy import + route in App.tsx. Navbar Practice dropdown with NEW badge
5. **QuickFire UX** — Symmetrical 3×2 grid. Exit button during drill session
6. **SEO meta updates** — Per-route FAQ JSON-LD schema for SAA/CLF/AIF guides (Google rich snippets)
7. **Homepage stats** — Updated to: 12 certs, 3,910 questions, 277 Quick Fire Drills
8. **Social proof honesty** — Removed fake "2,400+ learners" and "4.9/5" rating. Replaced with honest language
9. **Urgency callout** — Green box in hero: "scenario drilling = 20–30pt score improvement"
10. **Free tier clarity** — Homepage + SampleQuestions page now clearly distinguish: 20q no-signup vs 50q free account + Skill Radar + bookmarks + retry wrong answers
11. **CLAUDE.md corrected** — Free tier was documented as "20 questions" but actual `FREE_LIMIT = 50` in CertDetail.tsx

### Key Lessons
- robots.txt explicit Allow = blocks everything not listed. Only use Disallow
- Code is always source of truth over CLAUDE.md
- Two free tiers without clear messaging = user confusion
- Fake social proof numbers are obvious on a new site — honest vague language is more credible

### Google Search Console Status (as of May 25, 2026)
- Indexed: 12 pages
- Not indexed: 21 pages (17 = "Discovered, not indexed" — normal queue)
- robots.txt fix validated — /login de-indexing in progress
- Sitemap needs resubmission to pick up new pages
- Average position: 62.9 | Impressions: 178 (3 months) | Clicks: 2
- Top queries: "aws certifications list" (28 impressions), "aws certification exam" (26 impressions)
