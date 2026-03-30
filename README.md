# AWSPrepAI

**Last Updated:** 2026-03-30
**Status:** Live — Production
**URL:** https://awsprepai.isaloumapps.com

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + TypeScript (AWS Amplify) |
| Auth | Supabase (email/password + magic link) |
| Payments | Stripe Checkout (Netlify serverless function) |
| Database | Supabase (PostgreSQL + RLS) |
| Domain | awsprepai.isaloumapps.com (Route 53 + Amplify) |

---

## Folder Structure

```
AWSPrepAI/
├── react-app/          → Frontend React app (deployed to Amplify)
├── netlify/functions/  → Stripe checkout serverless function
├── docs/               → Legacy (GitHub Pages disabled)
└── README.md           → This file
```

---

## Security Assessment (2026-03-30)

### ✅ What's Safe

**Credit Card Data — NOT stored anywhere in this app.**
Stripe handles 100% of payment processing. The app only creates a Stripe Checkout session (a URL) and redirects the user to Stripe's hosted page. No card numbers, CVVs, or billing info ever touch our server or database. Stripe is PCI DSS Level 1 compliant.

**HTTPS — Enforced everywhere.**
Amplify managed SSL certificate on `awsprepai.isaloumapps.com`. All traffic is encrypted in transit.

**CORS — Locked down.**
The Netlify checkout function only accepts requests from whitelisted origins (`awsprepai.isaloumapps.com`). All other origins are rejected.

**Stripe priceId Validation — Hardcoded whitelist.**
The checkout function only accepts known, valid Stripe price IDs. Any attempt to pass an arbitrary price ID returns a 400 error. Prevents price manipulation attacks.

**XSS — React auto-escapes all rendered values.**
React's JSX template engine escapes all dynamic values by default, preventing cross-site scripting.

**Supabase Anon Key — Public by design, safe by RLS.**
The `VITE_SUPABASE_ANON_KEY` is intentionally public (embedded in the client bundle). Supabase's Row Level Security (RLS) policies enforce what data each user can access — the anon key alone gives no special access.

---

### ⚠️ Known Risks & Mitigations

**Tier stored in user_metadata (client-readable)**
The user's plan tier (`free/monthly/yearly/lifetime`) is stored in Supabase `user_metadata`. A savvy attacker could not change this without a valid JWT signed by Supabase's private key. However, all sensitive data access should be double-checked server-side via RLS policies.
→ **Action:** Verify RLS policies on `free_usage`, `monthly_cert_selection` tables enforce user_id = auth.uid().

**No rate limiting on checkout endpoint**
The Netlify function has no rate limiting. A bot could spam it to generate Stripe session objects.
→ **Action (future):** Add Netlify rate limiting or a simple IP-based counter.

**Subscription cancellation not wired**
If a user cancels their Stripe subscription, their tier in Supabase is NOT automatically revoked. They keep access until manually removed.
→ **Action (future):** Wire Stripe webhook `customer.subscription.deleted` → set tier back to `free` in Supabase.

---

### ✅ Session Security (Fixed 2026-03-30)

| Setting | Value |
|---------|-------|
| JWT expiry | **1 hour** (3600 seconds) |
| Refresh token rotation | **Enabled** |
| Refresh token reuse interval | 10 seconds |

Users are automatically signed out after 1 hour of inactivity. The refresh token rotates on each use, preventing token theft attacks.

---

## Current Pricing

| Plan | Price | Details |
|------|-------|---------|
| Free | $0 | 20 questions per cert, no signup needed |
| Monthly | $7/mo | 1 cert at a time, switch every 30 days |
| Yearly | $67/yr | All 12 certs, saves $17/yr vs monthly |
| Lifetime | $147 once | All 12 certs forever + AI Coach |

---

## What's Live ✅

- 12 AWS certifications, 260 questions each (3,120 total)
- Timed mock exam: 65 questions, 130-minute timer
- Domain filtering (focus on weak areas)
- Supabase auth (signup, login, email confirmation)
- Stripe checkout (Monthly, Yearly, Lifetime)
- Payment success → tier activation
- Dashboard with Monthly cert selection widget
- Custom domain: awsprepai.isaloumapps.com

---

## Still Needed ⚠️

- [ ] Stripe webhook: `customer.subscription.deleted` → revoke tier
- [ ] Email onboarding sequence for new signups
- [ ] Progress tracking per domain (score history)
- [ ] AI Coach — verify it's live for Lifetime users
- [ ] Rate limiting on Netlify checkout function
- [ ] Password reset → verify redirect points to new domain
- [ ] Stripe dashboard: archive $57 Yearly price, fix descriptions

---

## Promotion Schedule

| Task | When |
|------|------|
| YouTube comments (SAA-C03 videos) | Every day 10am |
| Reddit post (r/AWSCertifications etc.) | Every Monday 9am |
| Multi-platform promotion | Every Wednesday 9am |
