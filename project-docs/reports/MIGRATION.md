# CertiPrepAI — Migration Roadmap
_Static HTML (docs/ → GitHub Pages) → React App (Amplify)_
_Created: 2026-04-17_

---

## Why We're Migrating

Right now CertiPrepAI has two separate frontends:

| Frontend | Tech | Hosted on | URL |
|---|---|---|---|
| `docs/` | Static HTML + vanilla JS | GitHub Pages | certiprepai.com/* (old pages) |
| `react-app/` | React + Vite | AWS Amplify | certiprepai.com (new app) |

Problems this causes:
- Two codebases to maintain — any fix must be done twice
- Static pages have no auth awareness (can't check user plan)
- Static pages can't track progress (no DynamoDB integration)
- SEO confusion — same domain, two different rendering engines
- Free users can bypass paywall via direct GitHub Pages URL

**Goal: retire `docs/` entirely. React app becomes the only frontend.**

---

## Current State

### React App — Routes Already Exist ✅
All these routes are live in `react-app/src/App.tsx`:

| Route | Component | Status |
|---|---|---|
| `/` | Home.tsx | ✅ Live |
| `/certifications` | Certifications.tsx | ✅ Live |
| `/cert/:certId` | CertDetail.tsx | ✅ Live (serves 3,221 questions from `/public/data/*.json`) |
| `/mock-exam/:certId` | MockExam.tsx | ✅ Live |
| `/dashboard` | Dashboard.tsx | ✅ Live |
| `/pricing` | Pricing.tsx | ✅ Live |
| `/login` | Login.tsx | ✅ Live |
| `/signup` | Signup.tsx | ✅ Live |
| `/resources` | Resources.tsx | ✅ Live |
| `/glossary` | Glossary.tsx | ✅ Live |
| `/comparisons` | Comparisons.tsx | ✅ Live |
| `/keywords` | Keywords.tsx | ✅ Live |
| `/study-guide` | StudyGuide.tsx | ✅ Live |
| `/service-groups` | ServiceGroups.tsx | ✅ Live |
| `/diagrams` | Diagrams.tsx | ✅ Live |
| `/visual-exam` | VisualExam.tsx | ✅ Live |
| `/architecture-builder` | ArchitectureBuilder.tsx | ✅ Live |
| `/about` | About.tsx | ✅ Live |
| `/terms` | Terms.tsx | ✅ Live |
| `/sample-questions` | SampleQuestions.tsx | ✅ Live |

### Static HTML — Pages Still in docs/ ⚠️
30 HTML files currently served via GitHub Pages.
Question data lives in `docs/*.js` (vanilla JS arrays) AND `react-app/public/data/*.json` (React format).

---

## Migration Steps

### ✅ Phase 0 — Already Done
- [x] React app has all routes
- [x] Question JSON files in `react-app/public/data/` (12 certs, 3,221 questions)
- [x] Auth wired (Cognito, access control, free user redirect)
- [x] Progress tracking wired (DynamoDB)
- [x] Legal source language cleaned across all React pages
- [x] Tutorials Dojo/Udemy references removed

---

### 🔲 Phase 1 — Content Audit & Sync (1-2 days)
_Make sure React pages have everything the static HTML pages have._

**Step 1.1 — Audit each React page vs its HTML counterpart**

| React Page | HTML Counterpart | Gap? |
|---|---|---|
| Resources.tsx | docs/resources.html | Has Service Comparison section in HTML but not in React |
| Glossary.tsx | docs/glossary.html | React has 70+ terms, HTML may have more |
| Comparisons.tsx | (no HTML equivalent) | React-only, already updated |
| Keywords.tsx | (data from docs/keywords_data.json) | Verify data is in sync |
| StudyGuide.tsx | docs/exam-strategy.html | Check content parity |
| Diagrams.tsx | docs/diagrams.html | Check parity |
| SampleQuestions.tsx | (check docs/) | Verify |
| About.tsx | docs/about.html | Check parity |
| ServiceGroups.tsx | (no HTML equivalent) | React-only |

**Step 1.2 — Port Service Comparison into Resources.tsx**
- `docs/resources.html` has a Service Comparison section (injected April 16)
- `docs/service-comparison-data.js` has 20 comparison pairs, 7 groups
- This data needs to be added to `Resources.tsx` or a dedicated `ServiceComparison.tsx`

**Step 1.3 — Verify question JSON parity**
- `docs/*.js` = old format (vanilla JS arrays, `window.SAA_QUESTIONS = [...]`)
- `react-app/public/data/*.json` = new format (pure JSON)
- Run a count check: each JSON file should have the right question count
  - `saa-c03.json` → 361 questions
  - All others → 260 questions each
  - Total → 3,221

---

### 🔲 Phase 2 — Redirect Old URLs to React (1 day)
_When users hit old GitHub Pages URLs, redirect them to the React app._

**Step 2.1 — Add redirects to static HTML pages**
Each `docs/*.html` file gets a meta redirect to the equivalent React route:
```html
<!-- docs/saa-c03.html -->
<meta http-equiv="refresh" content="0;url=https://certiprepai.com/cert/saa-c03">
```

Full redirect map:
| Old URL (GitHub Pages) | New URL (React) |
|---|---|
| `/saa-c03.html` | `/cert/saa-c03` |
| `/clf-c02.html` | `/cert/clf-c02` |
| `/dva-c02.html` | `/cert/dva-c02` |
| `/soa-c02.html` | `/cert/soa-c02` |
| `/dea-c01.html` | `/cert/dea-c01` |
| `/mla-c01.html` | `/cert/mla-c01` |
| `/gai-c01.html` | `/cert/gai-c01` |
| `/sap-c02.html` | `/cert/sap-c02` |
| `/dop-c02.html` | `/cert/dop-c02` |
| `/scs-c03.html` | `/cert/scs-c03` |
| `/ans-c01.html` | `/cert/ans-c01` |
| `/aif-c01.html` | `/cert/aif-c01` |
| `/glossary.html` | `/glossary` |
| `/resources.html` | `/resources` |
| `/certifications.html` | `/certifications` |
| `/about.html` | `/about` |
| `/pricing.html` | `/pricing` |
| `/login.html` | `/login` |
| `/signup.html` | `/signup` |
| `/diagrams.html` | `/diagrams` |
| `/exam-strategy.html` | `/study-guide` |
| `/user-dashboard.html` | `/dashboard` |

**Step 2.2 — Update all internal links in docs/ pages**
Any nav links in remaining HTML pages that point to other HTML pages should also redirect.

---

### 🔲 Phase 3 — SEO Handoff (1 day)
_Make sure Google transfers ranking from old URLs to new ones._

**Step 3.1 — Submit updated sitemap**
- Update `docs/sitemap.xml` to point to React URLs only
- Submit to Google Search Console

**Step 3.2 — Add canonical tags to React pages**
Already partially done (`CanonicalUpdater` in App.tsx).
Verify each page has correct `<link rel="canonical">`.

**Step 3.3 — Monitor Google Search Console**
- Watch for crawl errors on old HTML URLs
- 301 redirects via meta refresh are soft signals — Google will eventually follow

---

### 🔲 Phase 4 — Remove Static Pages from docs/ (after 30 days)
_Only after confirming Google has re-indexed all pages to React URLs._

**Step 4.1 — Verify zero traffic to docs/ HTML files**
Check GitHub Pages analytics or CloudFront logs.

**Step 4.2 — Delete HTML question pages from docs/**
Keep:
- `docs/sitemap.xml` (still needed, just updated)
- `docs/CNAME` (GitHub Pages custom domain config)
- `docs/robots.txt`
- `docs/public/data/*.json` — keep question data as backup

Delete:
- All `docs/*.html` files
- All `docs/*.js` files (question banks now in react-app/public/data/)
- `docs/service-comparison-data.js` (data moved to React)

**Step 4.3 — Point certiprepai.com DNS to Amplify only**
Currently: certiprepai.com → Route 53 → CloudFront → Amplify
GitHub Pages: served from a separate origin for docs/
After migration: GitHub Pages origin can be disabled.

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Google drops rankings during URL change | Medium | High | Add redirects BEFORE removing old pages. Wait 30+ days. |
| React page missing content vs HTML page | Medium | Medium | Full audit in Phase 1 before touching HTML files |
| Old bookmarks break | Low | Medium | Meta redirects in Phase 2 handle this |
| Question count mismatch between JS and JSON | Low | High | Verify counts in Phase 1.3 before proceeding |
| Users lose progress (DynamoDB) | None | — | Progress is in DynamoDB, not in the HTML pages |

---

## Definition of Done

Migration is complete when:
- [ ] All React pages have content parity with static HTML counterparts
- [ ] All old HTML URLs redirect to React equivalents
- [ ] Google Search Console shows 0 crawl errors on old URLs
- [ ] `docs/` folder contains only: `CNAME`, `sitemap.xml`, `robots.txt`
- [ ] No traffic to GitHub Pages HTML files for 7+ consecutive days
- [ ] React app is the single source of truth for all CertiPrepAI content

---

## Start Point for Next Session

**Pick up at Phase 1, Step 1.2:**
Port Service Comparison section from `docs/resources.html` into `Resources.tsx`.
Data is already extracted in `docs/service-comparison-data.js` — 7 groups, 20 pairs.
