# Pending Tasks — AWSPrepAI
**Last Updated:** 2026-03-31

---

## 🔴 Critical (Do First)

### 1. Lambda Concurrency Quota Increase
- **Why:** Current limit is 10 — any real traffic will throttle immediately
- **Steps:**
  1. AWS Console → Service Quotas → Lambda
  2. Find "Concurrent executions"
  3. Request increase to 1000
  4. Takes ~24h to approve

### 2. WAF + CloudFront
- **Why:** Lambda URLs are fully public — no DDoS protection, no rate limiting
- **Cost:** ~$6/month
- **Steps:**
  1. Create CloudFront distribution in front of Amplify
  2. Attach WAF with rate limiting rule (e.g., 100 req/5min per IP)
  3. Update Amplify custom domain to route through CloudFront

---

## 🟡 Medium

### 3. Codebase Cleanup
**Files to DELETE** from `/Users/ihabsaloum/Desktop/Projects/AWSPrepAI`:

| File/Folder | Reason |
|------------|--------|
| `docs/` | Old static HTML site — replaced by Amplify |
| `netlify/` folder | Replaced by Lambda |
| `netlify.toml` | Replaced by Lambda |
| `worker/` | Cloudflare Worker — not in use |
| `react-app/src/lib/supabase.ts` | Replaced by `cognito.ts` |
| `supabase_migration.sql` | Supabase is gone |
| `awsprepai-react-dist.zip` | Old build artifact |
| `deploy-*.zip` (2 files) | Old deploy artifacts |
| `fix-users-lambda.sh` | One-time script, done |
| `aws-prep-ai/` folder | Old Next.js version — entire folder |

**Files to MOVE:**

| File | Move To |
|------|---------|
| `TaxFlowAI_*.docx` files | Correct repo for TaxFlowAI project |

**Files to KEEP:**

| File | Reason |
|------|--------|
| `react-app/` | Active frontend |
| `lambdas/` | Active backend |
| `cognito.ts` | Active auth |

---

## 🟢 Low (Nice to Have)

### 4. DLQ on stripe-webhook Lambda
- **Why:** If webhook fails, it's silently lost — DLQ lets you retry
- **Cost:** Free (SQS free tier)
- **Steps:** Lambda → Async invocation config → Add Dead Letter Queue

### 5. Cognito Advanced Security
- **Why:** Brute force protection, compromised credential detection
- **Cost:** ~$0.05/MAU
- **Steps:** Cognito → User Pool → Advanced security → Enable

---

## Fridayaiapp Cleanup (Separate AWS Account — do manually in console)

| Item | Monthly Cost | Action |
|------|-------------|--------|
| WorkMail | $3.89 | Delete WorkMail organization |
| Idle IPv4 | $3.60 | EC2 → Elastic IPs → Release |
| Secrets Manager | $0.95 | Delete secrets in us-east-1 AND us-west-2 |
| Route 53 hosted zone | $0.51 | Verify not in use, then delete |
| **Total savings** | **$8.95/month** | |
