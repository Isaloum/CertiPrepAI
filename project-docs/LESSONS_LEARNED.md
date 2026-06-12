# LESSONS_LEARNED.md — CertiPrepAI

## 2026-06-11 — Auth redirect destroyed SEO on money pages

**Incident**
The 12 /cert/* pages (highest-value keywords) were invisible on Google.
GSC: 17 pages "Discovered – currently not indexed"; one indexed as
"Sign Up Free | CertiPrepAI". 642 impressions / 4 clicks / avg position 69.

**Root cause**
`CertDetail.tsx` redirected anonymous visitors (including Googlebot) to
/signup via `useEffect(() => { if (!loading && !user) navigate('/signup') })`.
Google rendered the page, got bounced to the signup wall, indexed that or
skipped the URL entirely.

**Fix applied**
Logged-out visitors now get a public, crawlable `CertLanding` view on the
same URL (overview, exam facts, domains, sample questions, FAQ, CTA).
Sitemap updated to include all 12 cert pages + public study content pages.

**Prevention rule (guardrail)**
Never `navigate()` away from a URL that is in the sitemap, has SEOMeta
entries, or targets search keywords. Gate *features* on a page, never the
*page itself*. Before adding any auth redirect, ask: "should Google be able
to read this URL?" If yes → render public content instead.
