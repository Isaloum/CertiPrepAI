# CertiPrepAI — Roadmap
_Last updated: 2026-04-09_

---

## 🗺️ FEATURE ROADMAP (From User Feedback)

> Feedback source: Rola Dali — experienced AWS professional, April 9 2026

---

### Phase 1 — Content Foundation (Do this first, no code needed)
**Goal:** Answer "where do questions come from?" before anyone else asks.

- [ ] Document question sources — are they AI-generated, scraped, manually written?
- [ ] Add accuracy disclaimer on each question (e.g. "Based on AWS official docs, last verified April 2026")
- [ ] Build a **Study Section** — one page per AWS service group:
  - Compute: EC2 vs ECS vs EKS vs Lambda vs Fargate
  - Storage: S3 vs EFS vs EBS vs FSx
  - Database: RDS vs Aurora vs DynamoDB vs ElastiCache
  - Networking: VPC, ALB, NLB, CloudFront, Route 53
  - Security: IAM, KMS, Secrets Manager, WAF, Shield
- [ ] Add "When to use X vs Y" comparison tables per service group

**Effort:** Medium (content-heavy, minimal code)
**Impact:** High — answers the #1 question every serious user will ask

---

### Phase 2 — Visual Exam (Migrate from old platform)
**Goal:** Questions with AWS architecture diagrams — already built in old version, needs migration.

> ⚠️ Already exists in `docs/` (old GitHub Pages platform). Needs porting to React app.

- [ ] Find visual/diagram questions in old `docs/` question banks
- [ ] Build image question renderer in React (show diagram above answers)
- [ ] Store diagram questions in DynamoDB with `question_type: visual`
- [ ] Add "Visual Questions" filter on practice page

**Effort:** Medium (already designed, just needs React migration)
**Impact:** Very High — strong differentiator vs Tutorials Dojo, Udemy, etc.

---

### Phase 3 — Architecture Builder (Migrate from old platform)
**Goal:** Interactive AWS architecture diagram tool — already built in old version.

> ⚠️ Already exists as `docs/diagrams.html` in old platform. Needs porting to React app.

- [ ] Port `diagrams.html` to a React component
- [ ] Add "Quiz this architecture" — generate questions based on what user built
- [ ] Gate behind paid plan (monthly/yearly only)

**Effort:** Medium (already exists, needs React migration + enhancement)
**Impact:** Very High — unique feature, justifies premium pricing

---

### Competitor Gap Analysis
| Feature | CertiPrepAI | Tutorials Dojo | Udemy |
|---------|-------------|----------------|-------|
| Practice questions | ✅ 3,120 | ✅ ~1,000/cert | ✅ varies |
| Explanations | ✅ | ✅ | ✅ |
| Study guides | ❌ | ✅ | ✅ |
| Visual/diagram questions | ❌ | ✅ some | ❌ |
| Architecture builder | ❌ | ❌ | ❌ |
| Progress tracking | ⚠️ partial | ✅ | ❌ |
| Mobile app | ❌ | ❌ | ✅ |
| Price | $7/mo | $19.99 one-time | $15 one-time |

---

## ✅ DONE (April 5–9, 2026)

### Infrastructure
- [x] Cancel-subscription Lambda deployed with all npm packages bundled
- [x] API Gateway in front of cancel Lambda (CORS fixed)
- [x] API Gateway in front of awsprepai-db Lambda (CORS fixed)
- [x] DynamoDB `awsprepai-progress` table confirmed exists
- [x] `awsprepai-db` Lambda updated to handle `get_progress` + `update_progress` actions

### Frontend
- [x] `db.ts` — DB_API URL hardcoded (Amplify env var injection was broken)
- [x] `Dashboard.tsx` — CANCEL_API URL hardcoded
- [x] `Dashboard.tsx` — Fixed token: `user.idToken` → `user.accessToken` for DB calls (lines 68, 73)
- [x] `Dashboard.tsx` — Cancel button added, visible for monthly/yearly plans
- [x] `Dashboard.tsx` — Cancel no longer logs user out after success
- [x] `Dashboard.tsx` — `cancelScheduled` state added, `setCancelScheduled(true)` called on success
- [x] `Dashboard.tsx` — Skeleton loader added for cert box (no more pop-in delay)
- [x] Amplify stale cache cleared via RELEASE job

### Cancel Flow (end-to-end working)
- [x] Click "Cancel Plan" → modal appears with billing period message
- [x] Click "Yes, Cancel" → shows "Cancelling..." spinner
- [x] Lambda cancels Stripe with `cancel_at_period_end: true`
- [x] User stays on dashboard (no logout)
- [x] Alert confirms cancellation
- [x] Monthly Plan stays active until billing period ends

---

## 🔴 NEXT — CRITICAL (do these first)

### 1. Hide Cancel button after cancellation (30 min)
**File:** `react-app/src/pages/Dashboard.tsx`
**What:** `cancelScheduled` state exists and is set to `true` on success, but the Cancel button doesn't check it yet.
**Fix:** Around line 185-194, wrap the cancel button:
```tsx
{cancelScheduled ? (
  <div style={{ padding: '0.6rem 1.25rem', background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', borderRadius: '0.75rem', fontWeight: 600, fontSize: '0.875rem' }}>
    ✓ Cancellation Scheduled
  </div>
) : (
  <button onClick={() => { setCancelError(''); setShowCancelModal(true) }} ...>
    Cancel Plan
  </button>
)}
```

### 2. Fix Checkout Lambda syntax error (1-2 hours)
**What:** `awsprepai-checkout` has `Runtime.UserCodeSyntaxError` since April 2. New paid signups broken.
**How:**
```bash
aws logs tail /aws/lambda/awsprepai-checkout --since 7d | head -50
```
Read the error, fix the syntax, redeploy.

### 3. Rotate leaked credentials (15 min — SECURITY)
- AWS key `AKIAWNRITSU5DRQBL74S` was exposed in terminal screenshot → go to IAM console → deactivate + create new key
- Stripe secret key was also visible → go to Stripe dashboard → roll the key → update Lambda env var

---

## 🟡 IMPORTANT (this week)

### 4. Password strength indicator on Signup.tsx
Cognito enforces: min 8 chars, uppercase, lowercase, numbers, symbols.
Currently shows cryptic Cognito error. Add a real-time strength meter below the password field.

### 5. Delete old CloudFront distribution
Distribution `E3885PO59ILHI0` ("CertiPrepAI — API Lambda URLs") is obsolete.
API Gateway replaced the old Lambda Function URLs. Delete to save cost + reduce confusion.

### 6. Verify ihabsaloum@hotmail.com Stripe charge
Confirm the April charge went through in Stripe dashboard. Plan was manually fixed via CLI multiple times during debugging.

---

## 🟢 NICE TO HAVE (backlog)

### 7. Fix Amplify env var injection
Root cause: Amplify branch-level env vars weren't being passed to Vite at build time.
Fix properly so API URLs can be managed via Amplify console, not hardcoded in source.

### 8. Progress tracking on Dashboard
Show score per cert, questions answered, correct %. Infra is ready (`awsprepai-progress` table + Lambda handlers).

### 9. CloudFront + WAF in front of API Gateway
Protect Lambda endpoints from abuse. Currently open to the internet.

### 10. MFA (TOTP)
Google Authenticator support. Cognito infra ready. UI scaffolded but not fully wired.

### 11. Lambda concurrency
Increase to 1000 via AWS Service Quotas for production scale.

---

## Architecture Overview

```
certiprepai.com (Route 53 + CloudFront + WAF)
    │
    ├── /  → AWS Amplify (React app, auto-deploys from GitHub main)
    │         └── Vite 8 + React + TypeScript
    │
    └── /saa-c03.html etc → GitHub Pages (static HTML, docs/)

React App calls:
    ├── Cognito (auth) — direct SDK calls
    ├── API Gateway → awsprepai-db Lambda → DynamoDB (progress, cert selection)
    ├── API Gateway → cancel-subscription Lambda → Stripe API
    └── Checkout Lambda → Stripe (create payment session)

Stripe webhooks → stripe-webhook Lambda → Cognito + DynamoDB (plan updates)
```

---

## Current State (as of 2026-04-09 17:30)

| Feature | Status |
|---------|--------|
| Login / Signup | ✅ Working |
| Dashboard loads | ✅ Working — no errors |
| Plan display (free/monthly/yearly) | ✅ Working |
| Cancel Plan button | ✅ Working — stays on page, plan active until period end |
| Cancel UI feedback | ⚠️ Alert works but button doesn't hide after cancel |
| DB progress tracking | ✅ Lambda fixed, DynamoDB table exists |
| New paid signups | ❌ Checkout Lambda has syntax error |
| Password strength UI | ❌ Missing — cryptic error shown |
| MFA | ⚠️ Partially wired |
