# CertiPrepAI

**Date:** 2026-04-07
**Status:** In Progress — Cognito Auth Live, Static Site Migrated, Study Guide Added

---

## Current Architecture

```
User → Amplify (certiprepai.com)
     → React App (Vite + TypeScript)
          → Cognito auth (amazon-cognito-identity-js)
          → Lambda Function URLs (no API Gateway)
               - awsprepai-checkout       → creates Stripe checkout session
               - awsprepai-verify-session → upgrades Cognito user plan post-payment
               - awsprepai-db             → DynamoDB CRUD (JWT protected)
               - awsprepai-stripe-webhook → handles Stripe events
     → DynamoDB (monthly_cert_selection, free_usage tables)
     → Cognito User Pool: us-east-1_bqEVRsi2b

docs/ → GitHub Pages (static HTML site — parallel frontend, same content)
```

---

## Amplify Environment Variables
| Key | Value |
|---|---|
| VITE_COGNITO_USER_POOL_ID | us-east-1_bqEVRsi2b |
| VITE_COGNITO_CLIENT_ID | 4j9mnlkhtu023takbj0qb1g10h |
| VITE_DB_API_URL | https://f2i2exyezxhojuk7znx6rl5snm0tndur.lambda-url.us-east-1.on.aws/ |
| VITE_VERIFY_SESSION_URL | https://6ryf7eipwnxeus2xbekgvwykme0otufd.lambda-url.us-east-1.on.aws/ |
| NODE_VERSION | 20 |

## Lambda Function URLs
| Function | URL |
|---|---|
| awsprepai-checkout | https://alwdh4nsomuznniu6yhjgf5i6y0xbzve.lambda-url.us-east-1.on.aws/ |
| awsprepai-verify-session | https://6ryf7eipwnxeus2xbekgvwykme0otufd.lambda-url.us-east-1.on.aws/ |
| awsprepai-db | https://f2i2exyezxhojuk7znx6rl5snm0tndur.lambda-url.us-east-1.on.aws/ |
| awsprepai-stripe-webhook | https://kapdmn3zvt4o2cslfxjgwlbmhi0svefw.lambda-url.us-east-1.on.aws/ |

## Cognito User Pool
- Pool ID: `us-east-1_bqEVRsi2b`
- Client ID: `4j9mnlkhtu023takbj0qb1g10h`
- Custom attribute: `custom:plan` → values: `free`, `monthly`, `yearly`, `lifetime`
- 2-step email verification enabled by default
- Forgot password: code-based (not link-based)

## Stripe Webhook
- Endpoint: `https://kapdmn3zvt4o2cslfxjgwlbmhi0svefw.lambda-url.us-east-1.on.aws/`
- Events: `checkout.session.completed`, `customer.subscription.deleted`, `charge.dispute.created`
- Secret: set in Lambda env var `STRIPE_WEBHOOK_SECRET`
- Status: ✅ Active

---

## localStorage Session Keys (React app + static docs/)
| Key | Value |
|---|---|
| `_apa_session` | Cognito idToken |
| `_apa_session_exp` | Expiry timestamp (24hr from login) |
| `_apa_email` | User email |
| `_apa_name` | User given_name from Cognito payload |
| `_apa_tier` | Plan: free / monthly / yearly / lifetime |

---

## Question Banks
| Cert | File | Questions | Notes |
|---|---|---|---|
| SAA-C03 | `docs/saa_questions_260.js` | **288** | +28 added 2026-04-07 (10 missing topics) |
| All others | `react-app/src/pages/*.tsx` | ~260 each | Inline in component files |

### SAA-C03 Question Fields
Each question has: `cat`, `q`, `options`, `answer` (0-indexed), `explain`, `hint`, `terms`
- `hint`: key scenario pattern (e.g. "BYOL / per-socket licensing → Dedicated Hosts")
- `terms`: array of key terms shown after answering
- Both render in practice mode AND mock exam review

### Topics Added 2026-04-07
| Topic | Questions |
|---|---|
| EC2 Dedicated Hosts (BYOL) | 2 |
| VPN CloudHub (hub-and-spoke) | 2 |
| RDS SSL / in-transit encryption | 2 |
| Gateway VPC Endpoints (S3+DynamoDB only) | 2 |
| S3 Batch Replication | 1 |
| AWS Resource Access Manager (subnet sharing) | 2 |
| IAM Permissions Boundary | 2 |
| AWS SCT (Schema Conversion Tool) | 2 |
| RDS Custom for Oracle | 2 |
| CloudWatch alarm → EC2 Reboot/Recover | 2 |
| Low-coverage boosts (Neptune, Golden AMI, Compute Optimizer, One Zone-IA, Cluster PG, Launch Template, Global Accelerator, Shield Advanced) | 1 each |

---

## React App Routes
| Path | Component | Notes |
|---|---|---|
| `/` | Home | Landing |
| `/certifications` | Certifications | All 12 certs |
| `/cert/:certId` | CertDetail | Practice per cert |
| `/mock-exam/:certId` | MockExam | 65-question timed exam |
| `/study-guide` | StudyGuide | **NEW** Domain strategy + traps |
| `/resources` | Resources | Curated external links |
| `/keywords` | Keywords | Scenario identifiers |
| `/glossary` | Glossary | 50+ AWS terms |
| `/diagrams` | Diagrams | Architecture diagrams |
| `/visual-exam` | VisualExam | Visual questions |
| `/pricing` | Pricing | Plans + Stripe |
| `/login` | Login | Cognito auth |
| `/signup` | Signup | Cognito + 2-step email verify |
| `/dashboard` | Dashboard | User plan + cert grid |
| `/about` | About | About page |
| `/payment-success` | PaymentSuccess | Post-Stripe redirect |
| `/sample-questions` | SampleQuestions | Free preview |
| `/architecture-builder` | ArchitectureBuilder | Builder tool |
| `/terms` | Terms | Terms of service |

---

## Bug Fixed: Study Guide = Resources (2026-04-07)
**Problem:** In Navbar.tsx, Study Guide AND AWS Services both pointed to `/resources`

**Fix:**
- Study Guide → `/study-guide` (new dedicated page: domain strategy + traps per domain)
- AWS Services → `/keywords`
- Descriptions updated in all 21 static HTML files in docs/

---

## Static Site (docs/) Auth Migration (2026-04-07)
All 5 auth files migrated from Supabase to Cognito:
| File | Change |
|---|---|
| `login.html` | Cognito authenticateUser() |
| `signup.html` | Cognito signUp() + 2-step confirmation |
| `forgot-password.html` | Cognito forgotPassword() + code-based reset |
| `success.html` | localStorage tier write (no more Supabase) |
| `user-dashboard.html` | Cognito getSession() refresh |

Branding: all 31 files renamed AWSPrepAI → CertiPrepAI via bulk sed.

---

## Known Issues / Tech Debt
| Issue | Severity | Notes |
|---|---|---|
| Two parallel frontends | 🔴 High | docs/ + react-app/ = double surface area for bugs |
| No progress tracking in dashboard | 🟡 Med | Score/questions-per-cert never migrated from Supabase |
| No .env file in react-app | 🔴 High | Cognito falls back to 'placeholder' if Amplify vars missing |
| Vite 8 + Rolldown | 🟡 Med | Multiple build-fix commits — watch for regressions |
| dist/ exists in repo | 🟡 Med | .gitignore excludes it but folder exists — EPERM on local builds |
| No WAF / rate limiting | 🔴 High | Lambda URLs exposed, no DDoS protection |
| Lambda concurrency = 10 | 🔴 High | Site dies at 10 simultaneous users |
| Checkout URL hardcoded | 🟡 Med | In Pricing.tsx, not in Amplify env vars |

---

## Security Status
| Layer | Status | Notes |
|---|---|---|
| Auth (Cognito JWT) | ✅ | All DB calls require valid token |
| Email verification | ✅ | 2-step on signup |
| Stripe webhook | ✅ | Verifies whsec_ on every call |
| DDoS protection | ❌ | No WAF, no CloudFront |
| Rate limiting | ❌ | None |
| Lambda concurrency | ❌ | Limit 10 — request increase via Service Quotas |
| Billing alert | ✅ | Fires at $40/month |

---

## Next Session Priorities
| Priority | Task | Effort |
|---|---|---|
| 🔴 1 | Lambda concurrency increase to 1000 | 2 min — Service Quotas |
| 🔴 2 | Add progress tracking to Dashboard (score + questions per cert) | 2hr |
| 🔴 3 | Consolidate: kill docs/ → run everything from React app only | 4hr |
| 🟡 4 | CloudFront + WAF in front of Lambda URLs | 30 min (~$6/mo) |
| 🟡 5 | Move Checkout Lambda URL to Amplify env var | 5 min |
| 🟢 6 | Clean dead files (zips, old scripts, TaxFlowAI files) | 5 min |

---

## Fridayaiapp Account Cleanup (~$9/month still burning)
| Service | Cost | Action |
|---|---|---|
| WorkMail organization (us-east-1) | $3.89 | Delete manually |
| Idle IPv4 (us-east-1) | $3.60 | Release manually |
| Secrets Manager | $0.95 | Delete all |
| Route 53 hosted zone | $0.51 | Delete if unused |
| S3 bucket | $0.07 | Empty + delete |

---

## Build Notes
- **Amplify**: works fine — fresh build from scratch, no dist/ issue
- **Local**: `npm run build` fails EPERM on dist/ (macOS mount). Use `tsc --noEmit` for type checks.
- **TypeScript**: 0 errors as of 2026-04-07

---

## Git Setup
- Repo: `Isaloum/AWSPrepAI`
- Branch: `main`
- **Always use**: `/Users/ihabsaloum/Desktop/Projects/AWSPrepAI`
- Never use: `/Users/ihabsaloum/AWSPrepAI` (stale Linux VM mount)
