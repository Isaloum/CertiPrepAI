# PROJECT_LOG.md — CertiPrepAI

## 2026-06-11 22:10 — SEO fix: public landing pages for /cert/*

**Objective**: Fix zero organic visibility — Google skipping the 12 cert pages.

**Diagnosis performed**
- robots.txt ✓, sitemap ✓, 12 pages indexed, ranks #1 for brand name
- GSC: avg position 69.1, 642 impressions/3mo, 4 clicks
- GSC: 17 pages "Discovered – currently not indexed"
- Root cause found in code: auth redirect on /cert/* (see LESSONS_LEARNED)

**Action taken**
1. Created `react-app/src/components/CertLanding.tsx` — public SEO landing:
   hero (H1 with cert code + name), exam facts grid, overview, domain chips,
   5 free sample questions (crawlable, <details> reveal), CTA, per-cert FAQ.
   Unique content written for all 12 certs.
2. Edited `react-app/src/pages/CertDetail.tsx`:
   - removed `navigate('/signup')` redirect for anonymous users
   - fixed `isLoading` (anonymous no longer = infinite loading)
   - added `if (!user) return <CertLanding .../>` branch
   - logged-in practice flow untouched
3. Rewrote `react-app/public/sitemap.xml`: +12 cert pages, +11 public
   content pages (glossary, keywords, study-guide, cheat-sheets, guides...).

**Commands run**
- `npm install && npx tsc --noEmit` → clean
- `npm run build` → ✓ built in 1.71s

**Files changed**
- NEW  react-app/src/components/CertLanding.tsx
- EDIT react-app/src/pages/CertDetail.tsx (3 small changes)
- EDIT react-app/public/sitemap.xml
- NEW  project-docs/{PROJECT_LOG,DECISIONS,LESSONS_LEARNED}.md

**Result**: Build green. Awaiting owner review + deploy.

**Next step**
1. Owner verifies GAI-C01 / SCS-C03 exam facts (intentionally omitted)
2. Merge + Amplify deploy
3. GSC: resubmit sitemap.xml; URL-inspect + "Request indexing" for
   /cert/saa-c03, /cert/clf-c02, /cert/aif-c01 (top 3 first — quota limits)
4. Re-check GSC indexing report in 7–14 days
