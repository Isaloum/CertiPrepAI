# MVP Definition — AWSPrepAI
**Date:** 2026-03-31

---

## Must-Have (live in production)
- ✅ User auth (signup, login, logout, password reset) — Cognito
- ✅ Free tier: SAA-C03, 5 questions, upgrade wall after limit
- ✅ Paid tier: full access to selected cert
- ✅ Stripe checkout (monthly plan)
- ✅ Stripe webhook (plan upgrade/downgrade)
- ✅ 12 cert pages with practice + mock exam modes
- ✅ AI Coach (chat.html)
- ✅ Dashboard showing active cert + progress
- ✅ DynamoDB: monthly_cert_selection, free_usage tables

## Should-Have (not yet done)
- ❌ Exam history — write results to DB on mock complete
- ❌ Progress sync across sessions
- ❌ Monthly tier cert selection UX (which cert does $7/mo unlock?)
- ❌ Newsletter capture
- ❌ Yearly + Lifetime pricing tiers live in Stripe
- ❌ Fix success.html share links (still hardcoded SAA-C03)

## Non-Goals (explicit)
- Mobile app (future phase)
- Video content
- Study groups / social features
- Flashcards
- Anki integration

## Definition of Done (MVP)
A user can sign up, pick a cert, pay $7, practice full question sets, and track their mock exam scores — end to end, no bugs, on mobile and desktop.
