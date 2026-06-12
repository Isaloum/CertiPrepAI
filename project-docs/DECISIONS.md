# DECISIONS.md — CertiPrepAI

## 2026-06-11 — Public landing view on /cert/* instead of auth redirect

**Context**
GSC showed 17 pages "Discovered – currently not indexed" and the only indexed
cert page titled "Sign Up Free". Root cause: `CertDetail.tsx` ran
`navigate('/signup')` for anonymous visitors, so Googlebot never saw content
on the 12 highest-value keyword URLs (/cert/saa-c03 etc.).

**Options considered**
1. Public landing view on the same URL for logged-out users (chosen)
2. Separate public routes (/exam/saa-c03) + keep /cert/* gated — splits link
   equity, duplicates meta config, adds redirects
3. Migrate to SSR (Next.js) — correct long-term but weeks of work, high risk
4. Prerendering service (prerender.io) — monthly cost, fragile, masks the
   real problem (no public content)

**Chosen option**: #1 — render `CertLanding` (overview, exam facts, domains,
5 free sample questions, FAQ, CTA) when `!user`; logged-in flow unchanged.

**Why**: zero new routes, zero infra, reuses existing SEOMeta titles/JSON-LD,
ships in one PR, and free visible content likely converts better than an
instant signup wall.

**Consequences / tradeoffs**
- 5 sample questions per cert are now publicly visible (they already were, in
  /public/data/*.json).
- Still client-side rendered; Google must execute JS. Acceptable: Google
  already indexed 12 CSR pages correctly. SSR/prerender can be revisited if
  indexing stalls.
- GAI-C01 and SCS-C03 exam facts (cost/duration/passing score) intentionally
  omitted pending owner verification against the official AWS exam guides.
