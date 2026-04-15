# Cost Audit — AWSPrepAI
**Last Updated:** 2026-03-31

---

## Main Account (441393059130)

### Monthly Cost Estimate
| Service | Est. Cost | Notes |
|---------|-----------|-------|
| Amplify | ~$0 | Free tier covers low traffic |
| Cognito | ~$0 | Free up to 50k MAU |
| Lambda | ~$0 | Free tier 1M req/month |
| DynamoDB | ~$0 | Free tier 25GB + 25 WCU/RCU |
| Stripe fees | 2.9% + $0.30/txn | Not an AWS cost |
| **Budget cap** | **$50/month** | Alert fires at $40 |

### Budget Alert
- Threshold: **$40/month** (80% of $50 cap)
- Email: ihabsaloum85@gmail.com
- Status: ✅ Set on 2026-03-31

---

## Fridayaiapp Account (4413-9305-9130)

### Waste Found — 2026-03-31

| Resource | Monthly Cost | Status | Action |
|----------|-------------|--------|--------|
| bumpie-staging NAT Gateway | $15.90 | ✅ DELETED 2026-03-31 | Done |
| WorkMail organization | $3.89 | 🔲 Pending | Delete in AWS console |
| Idle IPv4 (us-east-1) | $3.60 | 🔲 Pending | EC2 → Elastic IPs → Release |
| Secrets Manager | $0.95 | 🔲 Pending | Delete secrets in both regions |
| Route 53 hosted zone | $0.51 | 🔲 Pending | Verify then delete |

### Savings Summary
| | Monthly |
|-|---------|
| Already saved | $15.90 |
| Still to save | $8.95 |
| **Total potential savings** | **$24.85/month** |

### Important Notes
- **bumpie-staging VPC: KEEP** — NAT Gateway will be re-created in ~2 weeks
- MCP is connected to main account only — Fridayaiapp changes are manual
- Verify Route 53 zone has no active DNS records before deleting
