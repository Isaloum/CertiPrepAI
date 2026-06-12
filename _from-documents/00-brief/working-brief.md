# Working Brief — AWSPrepAI
**Date:** 2026-03-31
**Status:** Live in production

---

## Problem
AWS certification candidates have no single platform that combines practice questions, AI coaching, and an affordable pricing model. Existing tools (Tutorials Dojo, Whizlabs) are expensive and outdated.

## User (ICP)
- Developers and cloud engineers preparing for AWS certifications
- Age 25–40, self-taught or bootcamp background
- Budget-conscious, prefers monthly/one-time payment over $30+/month competitors
- Studies on their own time, needs flexible access

## Platform
- Web app (React, mobile-responsive)
- Hosted on AWS Amplify at `awsprepai.isaloumapps.com`

## Founder
- Solo founder (Ihab Saloum)
- Bias toward fastest learning, lowest ops complexity, cheapest architecture

## Pricing Tiers
| Tier | Price | Access |
|---|---|---|
| Free | $0 | SAA-C03 only, 5 questions |
| Monthly | $7/month | 1 cert of choice, full access |
| Yearly | $X/year | All certs |
| Lifetime | $X one-time | All certs forever |

## Compliance
- No HIPAA, no PII beyond email + payment
- GDPR applies (Canadian users, international traffic)

## Success in 90 Days
- 500 registered users
- 50 paying subscribers
- Zero downtime incidents
- Full cert library live (12 certs)

## Stack Decision
Migrated from Supabase + Netlify → full AWS stack for learning and cost control.

## Assumptions
- Users will re-register (Cognito starts fresh, no Supabase migration)
- Mobile app is future phase (not MVP)
- AI Coach (chat.html) exists but is not the core feature
