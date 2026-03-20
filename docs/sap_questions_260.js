const SAP_QUESTIONS = [
  {
    cat: "complex-org-design",
    q: "S3 versioning enforcement across accounts?",
    options: [
      "A. IAM policies",
      "B. SCPs deny",
      "C. Config rules",
      "D. Bucket policies",
    ],
    answer: 0,
    explain: "SCPs at org level enforce across accounts"
  },
  {
    cat: "complex-org-design",
    q: "Control Tower automates?",
    options: [
      "A. Landing zones",
      "B. VPCs",
      "C. IAM",
      "D. CloudFormation",
    ],
    answer: 0,
    explain: "Control Tower governance"
  },
  {
    cat: "complex-org-design",
    q: "Cross-account backup?",
    options: [
      "A. Separate",
      "B. Central vault",
      "C. S3 copy",
      "D. Single",
    ],
    answer: 0,
    explain: "Central vault enables"
  },
  {
    cat: "complex-org-design",
    q: "Data residency enforcement?",
    options: [
      "A. SCP",
      "B. Manual",
      "C. Config",
      "D. VPC",
    ],
    answer: 0,
    explain: "SCPs enforce regions"
  },
  {
    cat: "complex-org-design",
    q: "Consistent VPC 20 accounts?",
    options: [
      "A. Manual",
      "B. StackSets",
      "C. Copy",
      "D. Templates",
    ],
    answer: 0,
    explain: "StackSets deploy"
  },
  {
    cat: "complex-org-design",
    q: "SCP exceptions handling?",
    options: [
      "A. Remove",
      "B. Document",
      "C. Exception",
      "D. None",
    ],
    answer: 0,
    explain: "Formally document"
  },
  {
    cat: "complex-org-design",
    q: "RBAC implementation?",
    options: [
      "A. Users",
      "B. Federation",
      "C. Shared",
      "D. Root",
    ],
    answer: 0,
    explain: "Team federation"
  },
  {
    cat: "complex-org-design",
    q: "Multi-region policies?",
    options: [
      "A. Per",
      "B. Region-agnostic",
      "C. Manual",
      "D. None",
    ],
    answer: 0,
    explain: "Org policies apply"
  },
  {
    cat: "complex-org-design",
    q: "Enforce RDS encryption?",
    options: [
      "A. Manual",
      "B. IAM deny",
      "C. SCP",
      "D. Config",
    ],
    answer: 0,
    explain: "IAM prevents"
  },
  {
    cat: "complex-org-design",
    q: "Shared services account?",
    options: [
      "A. All",
      "B. Core services",
      "C. Dev",
      "D. None",
    ],
    answer: 0,
    explain: "Core infrastructure"
  },
  {
    cat: "complex-org-design",
    q: "Multi-account network?",
    options: [
      "A. Independent",
      "B. Transit",
      "C. Peering",
      "D. None",
    ],
    answer: 0,
    explain: "Transit Gateway hub"
  },
  {
    cat: "complex-org-design",
    q: "Resource naming?",
    options: [
      "A. None",
      "B. Org-wide",
      "C. Per",
      "D. Random",
    ],
    answer: 0,
    explain: "Standardized names"
  },
  {
    cat: "new-solutions",
    q: "Highly available web app with spikes?",
    options: [
      "A. Single EC2",
      "B. ASG ALB",
      "C. RDS",
      "D. On-prem",
    ],
    answer: 0,
    explain: "ASG provides elasticity"
  },
  {
    cat: "new-solutions",
    q: "Microservices communication?",
    options: [
      "A. EC2 IPs",
      "B. Service discovery",
      "C. DNS",
      "D. Hard-coded",
    ],
    answer: 0,
    explain: "Service discovery enables"
  },
  {
    cat: "new-solutions",
    q: "Global low-latency content?",
    options: [
      "A. ALB",
      "B. CloudFront",
      "C. RDS",
      "D. EC2",
    ],
    answer: 0,
    explain: "CloudFront edges"
  },
  {
    cat: "new-solutions",
    q: "Event-driven architecture?",
    options: [
      "A. Polling",
      "B. SNS SQS",
      "C. Manual",
      "D. Email",
    ],
    answer: 0,
    explain: "SNS-SQS decouples"
  },
  {
    cat: "new-solutions",
    q: "Sub-millisecond latency?",
    options: [
      "A. RDS",
      "B. ElastiCache",
      "C. S3",
      "D. EBS",
    ],
    answer: 0,
    explain: "ElastiCache microseconds"
  },
  {
    cat: "new-solutions",
    q: "Long-running serverless?",
    options: [
      "A. Lambda",
      "B. Step Functions",
      "C. EC2",
      "D. Sync",
    ],
    answer: 0,
    explain: "Step Functions orchestrate"
  },
  {
    cat: "new-solutions",
    q: "DynamoDB throttling?",
    options: [
      "A. Larger",
      "B. Autoscaling",
      "C. RDS",
      "D. Rows",
    ],
    answer: 0,
    explain: "Autoscaling adjusts"
  },
  {
    cat: "new-solutions",
    q: "Real-time analytics?",
    options: [
      "A. Batch",
      "B. Kinesis",
      "C. Polling",
      "D. Manual",
    ],
    answer: 0,
    explain: "Kinesis streams"
  },
  {
    cat: "new-solutions",
    q: "Message ordering?",
    options: [
      "A. SNS",
      "B. SQS FIFO",
      "C. EventBridge",
      "D. API",
    ],
    answer: 0,
    explain: "FIFO ordered"
  },
  {
    cat: "new-solutions",
    q: "REST API millions requests?",
    options: [
      "A. EC2",
      "B. API Gateway",
      "C. ASG",
      "D. On-prem",
    ],
    answer: 0,
    explain: "API Gateway scales"
  },
  {
    cat: "new-solutions",
    q: "Dual consistency?",
    options: [
      "A. RDS",
      "B. DynamoDB",
      "C. S3",
      "D. Cache",
    ],
    answer: 0,
    explain: "DynamoDB configurable"
  },
  {
    cat: "new-solutions",
    q: "Auto failover?",
    options: [
      "A. Multi-AZ",
      "B. Backup",
      "C. Replica",
      "D. None",
    ],
    answer: 0,
    explain: "Multi-AZ auto"
  },
  {
    cat: "new-solutions",
    q: "High-volume notifications?",
    options: [
      "A. Lambda",
      "B. SNS SQS",
      "C. Email",
      "D. SMS",
    ],
    answer: 0,
    explain: "SQS buffers"
  },
  {
    cat: "new-solutions",
    q: "API rate limiting?",
    options: [
      "A. Code",
      "B. API Gateway",
      "C. Pooling",
      "D. None",
    ],
    answer: 0,
    explain: "Gateway throttles"
  },
  {
    cat: "new-solutions",
    q: "Cross-AZ replication?",
    options: [
      "A. S3",
      "B. Aurora",
      "C. DynamoDB",
      "D. Script",
    ],
    answer: 0,
    explain: "Aurora replicates"
  },
  {
    cat: "new-solutions",
    q: "ML pipeline terabytes?",
    options: [
      "A. EC2",
      "B. SageMaker",
      "C. RDS",
      "D. Lambda",
    ],
    answer: 0,
    explain: "SageMaker scales"
  },
  {
    cat: "new-solutions",
    q: "Personalized content?",
    options: [
      "A. None",
      "B. CloudFront",
      "C. DB",
      "D. Client",
    ],
    answer: 0,
    explain: "CloudFront behaviors"
  },
  {
    cat: "new-solutions",
    q: "Process uploaded files?",
    options: [
      "A. Sync",
      "B. S3 Lambda",
      "C. Polling",
      "D. Manual",
    ],
    answer: 0,
    explain: "S3 triggers Lambda"
  },
  {
    cat: "new-solutions",
    q: "Strong consistency?",
    options: [
      "A. DynamoDB",
      "B. RDS",
      "C. S3",
      "D. Cache",
    ],
    answer: 0,
    explain: "RDS ACID"
  },
  {
    cat: "new-solutions",
    q: "Distributed tracing?",
    options: [
      "A. Logs",
      "B. X-Ray",
      "C. Custom",
      "D. None",
    ],
    answer: 0,
    explain: "X-Ray traces"
  },
  {
    cat: "migration-modernization",
    q: "Large DB continuous replication?",
    options: [
      "A. S3",
      "B. DMS",
      "C. Exports",
      "D. Snowball",
    ],
    answer: 0,
    explain: "DMS replicates"
  },
  {
    cat: "migration-modernization",
    q: "50TB quick migration?",
    options: [
      "A. Upload",
      "B. Snowball",
      "C. EC2",
      "D. SFTP",
    ],
    answer: 0,
    explain: "Snowball fastest"
  },
  {
    cat: "migration-modernization",
    q: "Monolithic modernization?",
    options: [
      "A. EC2",
      "B. Microservices",
      "C. Lambda",
      "D. None",
    ],
    answer: 0,
    explain: "Microservices modular"
  },
  {
    cat: "migration-modernization",
    q: "Windows share migration?",
    options: [
      "A. EC2",
      "B. DataSync FSx",
      "C. S3",
      "D. Manual",
    ],
    answer: 0,
    explain: "FSx replaces"
  },
  {
    cat: "migration-modernization",
    q: "100GB regular sync?",
    options: [
      "A. DMS",
      "B. DataSync",
      "C. Manual",
      "D. Snowball",
    ],
    answer: 0,
    explain: "DataSync incremental"
  },
  {
    cat: "migration-modernization",
    q: "Lift-and-shift strategy?",
    options: [
      "A. EC2 minimal",
      "B. Containerize",
      "C. Lambda",
      "D. On-prem",
    ],
    answer: 0,
    explain: "Rehost to EC2"
  },
  {
    cat: "migration-modernization",
    q: "Legacy OS requirements?",
    options: [
      "A. Rehost",
      "B. Refactor",
      "C. Replatform",
      "D. None",
    ],
    answer: 0,
    explain: "Rehost preserves"
  },
  {
    cat: "migration-modernization",
    q: "Oracle to AWS?",
    options: [
      "A. Rehost",
      "B. Replatform",
      "C. Refactor",
      "D. Repurchase",
    ],
    answer: 0,
    explain: "Replatform Aurora"
  },
  {
    cat: "migration-modernization",
    q: "Batch modernization?",
    options: [
      "A. Keep",
      "B. Step Functions",
      "C. Real-time",
      "D. None",
    ],
    answer: 0,
    explain: "Step Functions"
  },
  {
    cat: "migration-modernization",
    q: "Complex planning?",
    options: [
      "A. CloudForm",
      "B. Evaluator",
      "C. Sheets",
      "D. Glue",
    ],
    answer: 0,
    explain: "Evaluator assesses"
  },
  {
    cat: "migration-modernization",
    q: "Monolithic extraction?",
    options: [
      "A. All",
      "B. Loose first",
      "C. Rewrite",
      "D. None",
    ],
    answer: 0,
    explain: "Strangler pattern"
  },
  {
    cat: "migration-modernization",
    q: "Containerize storage?",
    options: [
      "A. Local",
      "B. EBS RDS",
      "C. S3",
      "D. None",
    ],
    answer: 0,
    explain: "EBS and RDS"
  },
  {
    cat: "migration-modernization",
    q: "Custom hardware migration?",
    options: [
      "A. Match",
      "B. Test",
      "C. Assume",
      "D. None",
    ],
    answer: 0,
    explain: "Benchmark"
  },
  {
    cat: "migration-modernization",
    q: "Multiple DB consolidation?",
    options: [
      "A. Separate",
      "B. Aurora",
      "C. Keep",
      "D. None",
    ],
    answer: 0,
    explain: "Aurora consolidates"
  },
  {
    cat: "migration-modernization",
    q: "Compliance during migration?",
    options: [
      "A. After",
      "B. Throughout",
      "C. On-prem",
      "D. Accept",
    ],
    answer: 0,
    explain: "Maintain throughout"
  },
  {
    cat: "cost-optimization",
    q: "Increasing spend analysis?",
    options: [
      "A. Ignore",
      "B. Cost Explorer",
      "C. Budget++",
      "D. Delete",
    ],
    answer: 0,
    explain: "Explorer identifies"
  },
  {
    cat: "cost-optimization",
    q: "Predictable workload?",
    options: [
      "A. On-Demand",
      "B. Reserved",
      "C. Spot",
      "D. None",
    ],
    answer: 0,
    explain: "RI 40-70%"
  },
  {
    cat: "cost-optimization",
    q: "Variable workloads?",
    options: [
      "A. On-Demand",
      "B. Savings Plans",
      "C. Spot",
      "D. Fixed",
    ],
    answer: 0,
    explain: "Plans flexible"
  },
  {
    cat: "cost-optimization",
    q: "Fault-tolerant batch?",
    options: [
      "A. On-Demand",
      "B. Spot",
      "C. Reserved",
      "D. None",
    ],
    answer: 0,
    explain: "Spot 70-90%"
  },
  {
    cat: "cost-optimization",
    q: "Over-provisioned RDS?",
    options: [
      "A. Keep",
      "B. Optimizer",
      "C. Increase",
      "D. None",
    ],
    answer: 0,
    explain: "Optimizer recommends"
  },
  {
    cat: "cost-optimization",
    q: "Infrequent storage?",
    options: [
      "A. Standard",
      "B. Intelligent",
      "C. Delete",
      "D. None",
    ],
    answer: 0,
    explain: "Auto-transition"
  },
  {
    cat: "accelerate-workload",
    q: "Multi-region latency?",
    options: [
      "A. Single",
      "B. CloudFront",
      "C. Accept",
      "D. None",
    ],
    answer: 0,
    explain: "CloudFront CDN"
  },
  {
    cat: "accelerate-workload",
    q: "High-volume reads?",
    options: [
      "A. Larger",
      "B. Replicas",
      "C. Cache",
      "D. Horizontal",
    ],
    answer: 0,
    explain: "Replicas offload"
  },
  {
    cat: "accelerate-workload",
    q: "Global low-latency?",
    options: [
      "A. Single",
      "B. Global",
      "C. Per region",
      "D. None",
    ],
    answer: 0,
    explain: "Global tables"
  },
  {
    cat: "accelerate-workload",
    q: "API throttling?",
    options: [
      "A. Reject",
      "B. SQS",
      "C. Capacity",
      "D. None",
    ],
    answer: 0,
    explain: "SQS queues"
  },
  {
    cat: "accelerate-workload",
    q: "Lambda cold starts?",
    options: [
      "A. Accept",
      "B. Provisioned",
      "C. EC2",
      "D. Ignore",
    ],
    answer: 0,
    explain: "Provisioned concurrency"
  },
  {
    cat: "accelerate-workload",
    q: "Microsecond latency?",
    options: [
      "A. DB",
      "B. ElastiCache",
      "C. App",
      "D. None",
    ],
    answer: 0,
    explain: "Cache microseconds"
  },
  {
    cat: "accelerate-workload",
    q: "Global static?",
    options: [
      "A. S3",
      "B. CloudFront",
      "C. EC2",
      "D. None",
    ],
    answer: 0,
    explain: "CloudFront edges"
  },
  {
    cat: "complex-org-design",
    q: "Which service allows you to apply consistent tag standards across all AWS accounts?",
    options: [
      "A. Organizations tag policies",
      "B. Config rules",
      "C. Resource Groups",
      "D. CloudFormation",
    ],
    answer: 0,
    explain: "Tag policies in Organizations enforce naming and values across accounts"
  },
  {
    cat: "complex-org-design",
    q: "How do you prevent accidental deletion of critical resources across an organization?",
    options: [
      "A. SCPs that deny Delete* actions for specified services",
      "B. CloudTrail logging and alerts",
      "C. IAM permission boundaries",
      "D. AWS Config remediation rules",
    ],
    answer: 0,
    explain: "SCPs can deny Delete actions at the organization level"
  },
  {
    cat: "new-solutions",
    q: "Which Step Functions execution type is best for short-running workflows under 5 minutes?",
    options: [
      "A. Express workflows with synchronous execution",
      "B. Standard workflows with asynchronous execution",
      "C. Activity-based workflows",
      "D. Map state workflows",
    ],
    answer: 0,
    explain: "Express workflows are optimized for short, high-volume synchronous tasks"
  },
  {
    cat: "new-solutions",
    q: "What Lambda destination should you use to send successful invocations to SQS?",
    options: [
      "A. Lambda destinations configured with resource-based policy",
      "B. SNS topics",
      "C. CloudWatch Events",
      "D. S3 notifications",
    ],
    answer: 0,
    explain: "Lambda destinations provide reliable asynchronous invocation routing"
  },
  {
    cat: "migration-modernization",
    q: "Which approach is best for refactoring a monolithic application to microservices?",
    options: [
      "A. Strangler fig pattern with incremental service extraction",
      "B. Complete rewrite at once",
      "C. Lift-and-shift to containers",
      "D. Parallel monolith operation",
    ],
    answer: 0,
    explain: "Strangler fig pattern allows gradual migration with reduced risk"
  },
  {
    cat: "complex-org-design",
    q: "Restrict regions per OU?",
    options: [
      "A. IAM",
      "B. SCP deny",
      "C. Lambda",
      "D. Config",
    ],
    answer: 1,
    explain: "SCPs deny API to regions"
  },
  {
    cat: "complex-org-design",
    q: "Share AMI cross-account?",
    options: [
      "A. Copy",
      "B. Launch perms",
      "C. RAM",
      "D. Public",
    ],
    answer: 1,
    explain: "Launch permissions enable"
  },
  {
    cat: "complex-org-design",
    q: "Sandbox environment?",
    options: [
      "A. SCP segregation",
      "B. IAM",
      "C. VPC",
      "D. Manual",
    ],
    answer: 1,
    explain: "Restrictive SCPs work"
  },
  {
    cat: "complex-org-design",
    q: "Team autonomy governance?",
    options: [
      "A. Full+SCP",
      "B. Read-only",
      "C. Central",
      "D. None",
    ],
    answer: 1,
    explain: "IAM+SCP balance"
  },
  {
    cat: "complex-org-design",
    q: "Least-privilege IAM?",
    options: [
      "A. Broad",
      "B. Deny-all",
      "C. Managed",
      "D. Admin",
    ],
    answer: 1,
    explain: "Deny-all specific"
  },
  {
    cat: "complex-org-design",
    q: "Monitor API activity org?",
    options: [
      "A. Per",
      "B. Central+Lambda",
      "C. Manual",
      "D. Inspector",
    ],
    answer: 1,
    explain: "Centralized Lambda"
  },
  {
    cat: "complex-org-design",
    q: "AWS SSO multi-account?",
    options: [
      "A. No Trail",
      "B. Centralized",
      "C. Separate",
      "D. Console",
    ],
    answer: 1,
    explain: "SSO federation"
  },
  {
    cat: "complex-org-design",
    q: "Account onboarding?",
    options: [
      "A. VPC",
      "B. Landing zone",
      "C. Admin",
      "D. None",
    ],
    answer: 1,
    explain: "Landing zone setup"
  },
  {
    cat: "complex-org-design",
    q: "Contractor temp access?",
    options: [
      "A. Permanent",
      "B. Time-limited MFA",
      "C. Shared",
      "D. Root",
    ],
    answer: 1,
    explain: "Time-limited role"
  },
  {
    cat: "complex-org-design",
    q: "Config aggregator?",
    options: [
      "A. Aggregates",
      "B. No rules",
      "C. S3",
      "D. Manual",
    ],
    answer: 1,
    explain: "Aggregator collects"
  },
  {
    cat: "complex-org-design",
    q: "Org-wide encryption?",
    options: [
      "A. Per",
      "B. Central",
      "C. App",
      "D. None",
    ],
    answer: 1,
    explain: "Central KMS"
  },
  {
    cat: "complex-org-design",
    q: "Budget enforcement?",
    options: [
      "A. Manual",
      "B. Budgets",
      "C. None",
      "D. Deny",
    ],
    answer: 1,
    explain: "AWS Budgets"
  },
  {
    cat: "new-solutions",
    q: "Zero-downtime deploy?",
    options: [
      "A. Stop",
      "B. Blue-green",
      "C. Manual",
      "D. Canary",
    ],
    answer: 1,
    explain: "Blue-green switches"
  },
  {
    cat: "new-solutions",
    q: "10x traffic spike?",
    options: [
      "A. Over-provision",
      "B. SQS ASG",
      "C. Static",
      "D. Limited",
    ],
    answer: 1,
    explain: "SQS buffers"
  },
  {
    cat: "new-solutions",
    q: "Flexible schema?",
    options: [
      "A. RDS",
      "B. DynamoDB",
      "C. Cache",
      "D. S3",
    ],
    answer: 1,
    explain: "DynamoDB flexible"
  },
  {
    cat: "new-solutions",
    q: "Real-time dashboard?",
    options: [
      "A. Polling",
      "B. Kinesis",
      "C. Direct",
      "D. CSV",
    ],
    answer: 1,
    explain: "Kinesis ingests"
  },
  {
    cat: "new-solutions",
    q: "Session persistence?",
    options: [
      "A. Local",
      "B. ElastiCache",
      "C. EBS",
      "D. None",
    ],
    answer: 1,
    explain: "ElastiCache sessions"
  },
  {
    cat: "new-solutions",
    q: "Data lake analytics?",
    options: [
      "A. RDS",
      "B. S3 Athena",
      "C. EC2",
      "D. DynamoDB",
    ],
    answer: 1,
    explain: "S3 analytics"
  },
  {
    cat: "new-solutions",
    q: "Read-heavy caching?",
    options: [
      "A. All",
      "B. Write-through",
      "C. None",
      "D. Writes",
    ],
    answer: 1,
    explain: "Write-through optimizes"
  },
  {
    cat: "new-solutions",
    q: "Decouple publishers?",
    options: [
      "A. API",
      "B. SNS SQS",
      "C. Polling",
      "D. Email",
    ],
    answer: 1,
    explain: "SNS-SQS decouples"
  },
  {
    cat: "new-solutions",
    q: "Sub-second global?",
    options: [
      "A. Central",
      "B. CloudFront",
      "C. RDS",
      "D. None",
    ],
    answer: 1,
    explain: "Global tables"
  },
  {
    cat: "new-solutions",
    q: "Circuit breaker?",
    options: [
      "A. Lambda",
      "B. Gateway",
      "C. AppSync",
      "D. None",
    ],
    answer: 1,
    explain: "AppSync fallback"
  },
  {
    cat: "new-solutions",
    q: "Key-value relational?",
    options: [
      "A. RDS",
      "B. DynamoDB",
      "C. S3",
      "D. Cache",
    ],
    answer: 1,
    explain: "DynamoDB GSI"
  },
  {
    cat: "new-solutions",
    q: "Read not impact write?",
    options: [
      "A. Larger",
      "B. Replicas",
      "C. Disable",
      "D. Partition",
    ],
    answer: 1,
    explain: "Replicas offload"
  },
  {
    cat: "new-solutions",
    q: "IoT time-series?",
    options: [
      "A. RDS",
      "B. TimeStream",
      "C. CSV",
      "D. Cache",
    ],
    answer: 1,
    explain: "TimeStream optimized"
  },
  {
    cat: "new-solutions",
    q: "Lambda canary?",
    options: [
      "A. Manual",
      "B. CodeDeploy",
      "C. Direct",
      "D. None",
    ],
    answer: 1,
    explain: "CodeDeploy canary"
  },
  {
    cat: "new-solutions",
    q: "Idempotent ops?",
    options: [
      "A. Code",
      "B. DB tokens",
      "C. Gateway",
      "D. None",
    ],
    answer: 1,
    explain: "DB idempotency"
  },
  {
    cat: "new-solutions",
    q: "Millions events/sec?",
    options: [
      "A. SQS",
      "B. Kinesis",
      "C. DB",
      "D. Files",
    ],
    answer: 1,
    explain: "Kinesis sharding"
  },
  {
    cat: "new-solutions",
    q: "Sub-day analytics?",
    options: [
      "A. Single",
      "B. Hot-cold",
      "C. Glacier",
      "D. None",
    ],
    answer: 1,
    explain: "Hot-cold pattern"
  },
  {
    cat: "new-solutions",
    q: "Document collab?",
    options: [
      "A. RDS",
      "B. DocumentDB",
      "C. S3",
      "D. Cache",
    ],
    answer: 1,
    explain: "DocumentDB documents"
  },
  {
    cat: "migration-modernization",
    q: "Batch to event-driven?",
    options: [
      "A. Add Lambda",
      "B. Gradual",
      "C. Keep",
      "D. Eliminate",
    ],
    answer: 1,
    explain: "Gradual transition"
  },
  {
    cat: "migration-modernization",
    q: "Custom load balancing?",
    options: [
      "A. Re-impl",
      "B. ALB/NLB",
      "C. Keep",
      "D. None",
    ],
    answer: 1,
    explain: "ALB/NLB replace"
  },
  {
    cat: "migration-modernization",
    q: "Zero-downtime migration?",
    options: [
      "A. Window",
      "B. Parallel",
      "C. Stop",
      "D. Accept",
    ],
    answer: 1,
    explain: "Parallel run"
  },
  {
    cat: "migration-modernization",
    q: "Complex dependencies?",
    options: [
      "A. All",
      "B. Map",
      "C. Migrate fix",
      "D. None",
    ],
    answer: 1,
    explain: "Dependency mapping"
  },
  {
    cat: "migration-modernization",
    q: "Infrastructure IaC?",
    options: [
      "A. Manual",
      "B. CloudForm",
      "C. Hybrid",
      "D. None",
    ],
    answer: 1,
    explain: "IaC codifies"
  },
  {
    cat: "migration-modernization",
    q: "Monolithic schema?",
    options: [
      "A. Keep",
      "B. By service",
      "C. Schemaless",
      "D. None",
    ],
    answer: 1,
    explain: "Service ownership"
  },
  {
    cat: "migration-modernization",
    q: "Apps with licensing?",
    options: [
      "A. Assume",
      "B. Review",
      "C. Ignore",
      "D. On-prem",
    ],
    answer: 1,
    explain: "Review agreements"
  },
  {
    cat: "migration-modernization",
    q: "Gradual fallback?",
    options: [
      "A. Cutover",
      "B. Route53",
      "C. Immediate",
      "D. None",
    ],
    answer: 1,
    explain: "Weighted routing"
  },
  {
    cat: "migration-modernization",
    q: "Stateful to stateless?",
    options: [
      "A. None",
      "B. Extract",
      "C. Impossible",
      "D. Keep",
    ],
    answer: 1,
    explain: "State to cache"
  },
  {
    cat: "migration-modernization",
    q: "File-based exchange?",
    options: [
      "A. Continue",
      "B. S3 SNS",
      "C. Manual",
      "D. None",
    ],
    answer: 1,
    explain: "Messaging replaces"
  },
  {
    cat: "migration-modernization",
    q: "NFS migration?",
    options: [
      "A. S3",
      "B. EFS FSx",
      "C. EC2",
      "D. Snowball",
    ],
    answer: 1,
    explain: "EFS managed"
  },
  {
    cat: "migration-modernization",
    q: "Custom caching?",
    options: [
      "A. Re-impl",
      "B. ElastiCache",
      "C. Remove",
      "D. Keep",
    ],
    answer: 1,
    explain: "ElastiCache managed"
  },
  {
    cat: "migration-modernization",
    q: "Multi-wave prioritize?",
    options: [
      "A. Largest",
      "B. High value",
      "C. Random",
      "D. None",
    ],
    answer: 1,
    explain: "Value-driven"
  },
  {
    cat: "migration-modernization",
    q: "Legacy OS patching?",
    options: [
      "A. AWS",
      "B. Plan",
      "C. Don't",
      "D. On-prem",
    ],
    answer: 1,
    explain: "EC2 customer"
  },
  {
    cat: "migration-modernization",
    q: "ECS vs EKS?",
    options: [
      "A. ECS",
      "B. ECS simple",
      "C. EKS",
      "D. None",
    ],
    answer: 1,
    explain: "ECS simpler"
  },
  {
    cat: "migration-modernization",
    q: "Performance troubleshoot?",
    options: [
      "A. Revert",
      "B. Benchmark",
      "C. Accept",
      "D. None",
    ],
    answer: 1,
    explain: "Identify bottleneck"
  },
  {
    cat: "cost-optimization",
    q: "Predictable peaks?",
    options: [
      "A. Static",
      "B. Scheduled",
      "C. Manual",
      "D. None",
    ],
    answer: 1,
    explain: "Scheduled scaling"
  },
  {
    cat: "cost-optimization",
    q: "Multi-region costs?",
    options: [
      "A. Same",
      "B. Transfer",
      "C. No diff",
      "D. None",
    ],
    answer: 1,
    explain: "Transfer significant"
  },
  {
    cat: "cost-optimization",
    q: "Untracked spending?",
    options: [
      "A. Ignore",
      "B. Tags budgets",
      "C. Shutdown",
      "D. Manual",
    ],
    answer: 1,
    explain: "Tags enable"
  },
  {
    cat: "cost-optimization",
    q: "Expensive NAT?",
    options: [
      "A. Larger",
      "B. Endpoints",
      "C. Keep",
      "D. None",
    ],
    answer: 1,
    explain: "Endpoints better"
  },
  {
    cat: "cost-optimization",
    q: "High DynamoDB?",
    options: [
      "A. Accept",
      "B. Provisioned",
      "C. RDS",
      "D. None",
    ],
    answer: 1,
    explain: "Provisioned cheaper"
  },
  {
    cat: "cost-optimization",
    q: "Dev 24/7 hours?",
    options: [
      "A. Keep",
      "B. Stop",
      "C. Manual",
      "D. None",
    ],
    answer: 1,
    explain: "Scheduling saves"
  },
  {
    cat: "cost-optimization",
    q: "Stale CloudFront?",
    options: [
      "A. Increase",
      "B. Increase TTL",
      "C. Remove",
      "D. None",
    ],
    answer: 1,
    explain: "TTL reduces"
  },
  {
    cat: "accelerate-workload",
    q: "Large responses?",
    options: [
      "A. Larger",
      "B. Compress",
      "C. None",
      "D. Larger",
    ],
    answer: 1,
    explain: "Compression fast"
  },
  {
    cat: "accelerate-workload",
    q: "Variable latency?",
    options: [
      "A. Accept",
      "B. GA",
      "C. Single",
      "D. None",
    ],
    answer: 1,
    explain: "GA routes optimal"
  },
  {
    cat: "accelerate-workload",
    q: "Expensive queries?",
    options: [
      "A. Larger",
      "B. Cache",
      "C. None",
      "D. Accept",
    ],
    answer: 1,
    explain: "Cache results"
  },
  {
    cat: "accelerate-workload",
    q: "Sync third-party?",
    options: [
      "A. Timeout",
      "B. Async",
      "C. Sync",
      "D. None",
    ],
    answer: 1,
    explain: "Async prevents"
  },
  {
    cat: "accelerate-workload",
    q: "Long processing?",
    options: [
      "A. Larger",
      "B. Parallel",
      "C. Sequential",
      "D. None",
    ],
    answer: 1,
    explain: "Parallel faster"
  },
  {
    cat: "accelerate-workload",
    q: "Aggressive cache?",
    options: [
      "A. Never",
      "B. Reduce TTL",
      "C. All",
      "D. None",
    ],
    answer: 1,
    explain: "TTL balances"
  },
  {
    cat: "accelerate-workload",
    q: "Global unpredictable?",
    options: [
      "A. None",
      "B. CloudWatch",
      "C. Manual",
      "D. Accept",
    ],
    answer: 1,
    explain: "Monitor metrics"
  },
  {
    cat: "accelerate-workload",
    q: "Real-time low-latency?",
    options: [
      "A. Batch",
      "B. Kinesis",
      "C. Manual",
      "D. None",
    ],
    answer: 1,
    explain: "Kinesis real-time"
  },
  {
    cat: "complex-org-design",
    q: "What is the maximum number of AWS accounts in an organization without requesting an increase?",
    options: [
      "A. 10 accounts",
      "B. 20 accounts",
      "C. 50 accounts",
      "D. 100 accounts",
    ],
    answer: 1,
    explain: "Default limit is 20 accounts, but higher limits available via request"
  },
  {
    cat: "complex-org-design",
    q: "You need to centralize CloudTrail logs from all accounts. What should you use?",
    options: [
      "A. Individual CloudTrail in each account",
      "B. Organization Trail in the management account",
      "C. CloudWatch Logs aggregation",
      "D. S3 cross-account replication",
    ],
    answer: 1,
    explain: "Organization Trail aggregates logs from all accounts to central S3"
  },
  {
    cat: "new-solutions",
    q: "How does DynamoDB Accelerator (DAX) improve performance?",
    options: [
      "A. Increases write throughput",
      "B. Provides in-memory caching with microsecond latency",
      "C. Reduces storage costs",
      "D. Enables cross-region replication",
    ],
    answer: 1,
    explain: "DAX is an in-memory cache for DynamoDB with microsecond response time"
  },
  {
    cat: "new-solutions",
    q: "What is the key difference between SQS FIFO and standard queues?",
    options: [
      "A. Cost",
      "B. FIFO guarantees message ordering and exactly-once processing",
      "C. Throughput only",
      "D. Regional availability",
    ],
    answer: 1,
    explain: "FIFO queues guarantee ordering and exactly-once delivery"
  },
  {
    cat: "complex-org-design",
    q: "CloudTrail multi-account logging?",
    options: [
      "A. Separate",
      "B. Org CloudTrail",
      "C. Management",
      "D. Config",
    ],
    answer: 2,
    explain: "Org CloudTrail centralizes"
  },
  {
    cat: "complex-org-design",
    q: "Enforce resource tagging?",
    options: [
      "A. Manual",
      "B. SCP",
      "C. Config remediation",
      "D. IAM",
    ],
    answer: 2,
    explain: "Config auto-remediate"
  },
  {
    cat: "complex-org-design",
    q: "Centralized logging?",
    options: [
      "A. Per S3",
      "B. Central Logs",
      "C. CloudTrail+Logs",
      "D. Local",
    ],
    answer: 2,
    explain: "Combine CloudTrail Logs"
  },
  {
    cat: "complex-org-design",
    q: "Auto-remediate security groups?",
    options: [
      "A. Manual",
      "B. Config+SSM",
      "C. CloudFormation",
      "D. Inspector",
    ],
    answer: 2,
    explain: "Config rules remediate"
  },
  {
    cat: "complex-org-design",
    q: "Approval workflows?",
    options: [
      "A. Analyzer",
      "B. Service Catalog",
      "C. Email",
      "D. Auto",
    ],
    answer: 2,
    explain: "Service Catalog workflows"
  },
  {
    cat: "complex-org-design",
    q: "Enforce EC2 tagging?",
    options: [
      "A. Manual",
      "B. Config",
      "C. IAM",
      "D. Inspector",
    ],
    answer: 2,
    explain: "Config enforces"
  },
  {
    cat: "complex-org-design",
    q: "Sensitive data region lock?",
    options: [
      "A. Manual",
      "B. SCP deny",
      "C. Assume",
      "D. Local",
    ],
    answer: 2,
    explain: "SCP prevents export"
  },
  {
    cat: "complex-org-design",
    q: "Immutable audit logs?",
    options: [
      "A. Standard",
      "B. Object Lock",
      "C. Glacier",
      "D. None",
    ],
    answer: 2,
    explain: "Object Lock prevents"
  },
  {
    cat: "complex-org-design",
    q: "Backup retention?",
    options: [
      "A. Manual",
      "B. Lifecycle",
      "C. Versioning",
      "D. None",
    ],
    answer: 2,
    explain: "Backup plans"
  },
  {
    cat: "complex-org-design",
    q: "S3 private default?",
    options: [
      "A. Manual",
      "B. SCP+IAM",
      "C. Config",
      "D. None",
    ],
    answer: 2,
    explain: "SCPs prevent public"
  },
  {
    cat: "complex-org-design",
    q: "Audit trail immutable?",
    options: [
      "A. Standard",
      "B. Object Lock",
      "C. Version",
      "D. None",
    ],
    answer: 2,
    explain: "Object Lock"
  },
  {
    cat: "complex-org-design",
    q: "Backup automation?",
    options: [
      "A. Manual",
      "B. Lifecycle",
      "C. Daily",
      "D. None",
    ],
    answer: 2,
    explain: "Automated policies"
  },
  {
    cat: "new-solutions",
    q: "Strong ordering?",
    options: [
      "A. Eventual",
      "B. Event source",
      "C. None",
      "D. Manual",
    ],
    answer: 2,
    explain: "Event sourcing"
  },
  {
    cat: "new-solutions",
    q: "Feature rollout?",
    options: [
      "A. CloudForm",
      "B. AppConfig",
      "C. Manual",
      "D. Code",
    ],
    answer: 2,
    explain: "AppConfig flags"
  },
  {
    cat: "new-solutions",
    q: "Connection pooling?",
    options: [
      "A. Each Lambda",
      "B. RDS Proxy",
      "C. Manual",
      "D. None",
    ],
    answer: 2,
    explain: "RDS Proxy pools"
  },
  {
    cat: "new-solutions",
    q: "API routing?",
    options: [
      "A. DNS",
      "B. API Gateway",
      "C. Manual",
      "D. EC2",
    ],
    answer: 2,
    explain: "API Gateway routes"
  },
  {
    cat: "new-solutions",
    q: "Hot partitions?",
    options: [
      "A. Larger",
      "B. DAX",
      "C. More data",
      "D. None",
    ],
    answer: 2,
    explain: "DAX caches"
  },
  {
    cat: "new-solutions",
    q: "Saga pattern?",
    options: [
      "A. Direct",
      "B. Step Functions",
      "C. Manual",
      "D. None",
    ],
    answer: 2,
    explain: "Step Functions saga"
  },
  {
    cat: "new-solutions",
    q: "Attribute access?",
    options: [
      "A. IAM",
      "B. API auth",
      "C. Code",
      "D. None",
    ],
    answer: 2,
    explain: "API Gateway ABAC"
  },
  {
    cat: "new-solutions",
    q: "GraphQL scalable?",
    options: [
      "A. Direct",
      "B. AppSync",
      "C. Custom",
      "D. None",
    ],
    answer: 2,
    explain: "AppSync scales"
  },
  {
    cat: "new-solutions",
    q: "Webhook reliable?",
    options: [
      "A. Direct",
      "B. SNS SQS",
      "C. Polling",
      "D. None",
    ],
    answer: 2,
    explain: "Messaging reliable"
  },
  {
    cat: "new-solutions",
    q: "Stream processing?",
    options: [
      "A. Batch",
      "B. Kinesis",
      "C. Polling",
      "D. Manual",
    ],
    answer: 2,
    explain: "Kinesis streams"
  },
  {
    cat: "new-solutions",
    q: "Cache invalid?",
    options: [
      "A. TTL",
      "B. TTL events",
      "C. Never",
      "D. Always",
    ],
    answer: 2,
    explain: "Event-driven"
  },
  {
    cat: "new-solutions",
    q: "Query optimization?",
    options: [
      "A. Larger",
      "B. Indexes",
      "C. None",
      "D. Slow",
    ],
    answer: 2,
    explain: "Indexes cache"
  },
  {
    cat: "new-solutions",
    q: "Bulk processing?",
    options: [
      "A. Sync",
      "B. S3 Lambda",
      "C. Manual",
      "D. EC2",
    ],
    answer: 2,
    explain: "Async batch"
  },
  {
    cat: "new-solutions",
    q: "Recommend engine?",
    options: [
      "A. DB",
      "B. Cache",
      "C. ML",
      "D. None",
    ],
    answer: 2,
    explain: "ML recommendations"
  },
  {
    cat: "new-solutions",
    q: "API versioning?",
    options: [
      "A. URL",
      "B. Gateway",
      "C. Manual",
      "D. None",
    ],
    answer: 2,
    explain: "Gateway versions"
  },
  {
    cat: "new-solutions",
    q: "Scaling reads?",
    options: [
      "A. Larger",
      "B. Replicas",
      "C. None",
      "D. Partition",
    ],
    answer: 2,
    explain: "Replicas cache"
  },
  {
    cat: "new-solutions",
    q: "Serverless DB?",
    options: [
      "A. EC2",
      "B. Aurora",
      "C. RDS",
      "D. None",
    ],
    answer: 2,
    explain: "Aurora serverless"
  },
  {
    cat: "new-solutions",
    q: "Multi-tenant DB?",
    options: [
      "A. Separate",
      "B. Partitioned",
      "C. Single",
      "D. None",
    ],
    answer: 2,
    explain: "Partition tenant"
  },
  {
    cat: "new-solutions",
    q: "Change capture?",
    options: [
      "A. Polling",
      "B. DMS CDC",
      "C. Manual",
      "D. Logs",
    ],
    answer: 2,
    explain: "DMS captures"
  },
  {
    cat: "migration-modernization",
    q: "DB with replicas?",
    options: [
      "A. Separate",
      "B. Primary",
      "C. On-prem",
      "D. None",
    ],
    answer: 2,
    explain: "Primary then replicas"
  },
  {
    cat: "migration-modernization",
    q: "Immediate cutover?",
    options: [
      "A. Last-min",
      "B. Extensive",
      "C. Minimal",
      "D. Never",
    ],
    answer: 2,
    explain: "Extensive testing"
  },
  {
    cat: "migration-modernization",
    q: "Logging modernization?",
    options: [
      "A. Files",
      "B. CloudWatch",
      "C. DB",
      "D. None",
    ],
    answer: 2,
    explain: "CloudWatch Logs"
  },
  {
    cat: "migration-modernization",
    q: "Replication lag?",
    options: [
      "A. Accept",
      "B. Read local",
      "C. Single",
      "D. None",
    ],
    answer: 2,
    explain: "Local replicas"
  },
  {
    cat: "migration-modernization",
    q: "Replication ongoing?",
    options: [
      "A. One-time",
      "B. Ongoing",
      "C. Manual",
      "D. None",
    ],
    answer: 2,
    explain: "Continuous replication"
  },
  {
    cat: "migration-modernization",
    q: "Dependency sequencing?",
    options: [
      "A. Random",
      "B. Dependencies",
      "C. All",
      "D. None",
    ],
    answer: 2,
    explain: "Dependency-driven"
  },
  {
    cat: "migration-modernization",
    q: "Legacy monitoring?",
    options: [
      "A. Custom",
      "B. CloudWatch",
      "C. None",
      "D. Manual",
    ],
    answer: 2,
    explain: "CloudWatch unified"
  },
  {
    cat: "migration-modernization",
    q: "API migration?",
    options: [
      "A. Replace",
      "B. Parallel",
      "C. Cutover",
      "D. Manual",
    ],
    answer: 2,
    explain: "Parallel endpoints"
  },
  {
    cat: "migration-modernization",
    q: "DB post-migration?",
    options: [
      "A. None",
      "B. Tuning",
      "C. Larger",
      "D. Manual",
    ],
    answer: 2,
    explain: "Performance tuning"
  },
  {
    cat: "migration-modernization",
    q: "Security posture?",
    options: [
      "A. Same",
      "B. Enhance",
      "C. Reduce",
      "D. Ignore",
    ],
    answer: 2,
    explain: "Strengthen during"
  },
  {
    cat: "migration-modernization",
    q: "App testing?",
    options: [
      "A. Minimal",
      "B. Comprehensive",
      "C. UAT",
      "D. None",
    ],
    answer: 2,
    explain: "Thorough testing"
  },
  {
    cat: "migration-modernization",
    q: "Performance benchmarking?",
    options: [
      "A. None",
      "B. Before after",
      "C. Manual",
      "D. Skip",
    ],
    answer: 2,
    explain: "Before after compare"
  },
  {
    cat: "migration-modernization",
    q: "Rollback plan?",
    options: [
      "A. No",
      "B. Documented",
      "C. Manual",
      "D. Hope",
    ],
    answer: 2,
    explain: "Documented rollback"
  },
  {
    cat: "migration-modernization",
    q: "Data validation?",
    options: [
      "A. None",
      "B. Checksum",
      "C. Sampling",
      "D. Manual",
    ],
    answer: 2,
    explain: "Checksum validation"
  },
  {
    cat: "migration-modernization",
    q: "Network performance?",
    options: [
      "A. Same",
      "B. Test",
      "C. Assume",
      "D. None",
    ],
    answer: 2,
    explain: "Network testing"
  },
  {
    cat: "migration-modernization",
    q: "Cost analysis?",
    options: [
      "A. Ignore",
      "B. Compare",
      "C. Manual",
      "D. None",
    ],
    answer: 2,
    explain: "Cost comparison"
  },
  {
    cat: "cost-optimization",
    q: "Underutilized?",
    options: [
      "A. Keep",
      "B. Right-size",
      "C. Over",
      "D. None",
    ],
    answer: 2,
    explain: "Right-size saves"
  },
  {
    cat: "cost-optimization",
    q: "Data transfer?",
    options: [
      "A. Accept",
      "B. GA",
      "C. Centralize",
      "D. None",
    ],
    answer: 2,
    explain: "GA optimizes"
  },
  {
    cat: "cost-optimization",
    q: "Long-term planning?",
    options: [
      "A. None",
      "B. 3-year",
      "C. Yearly",
      "D. Quarterly",
    ],
    answer: 2,
    explain: "3-year best"
  },
  {
    cat: "cost-optimization",
    q: "RI recommendations?",
    options: [
      "A. Trail",
      "B. Optimizer",
      "C. Manual",
      "D. None",
    ],
    answer: 2,
    explain: "Optimizer recommends"
  },
  {
    cat: "cost-optimization",
    q: "Consolidated accounts?",
    options: [
      "A. None",
      "B. Share",
      "C. More",
      "D. No",
    ],
    answer: 2,
    explain: "Consolidated benefits"
  },
  {
    cat: "cost-optimization",
    q: "Bursty database?",
    options: [
      "A. Over",
      "B. On-demand",
      "C. Fixed",
      "D. None",
    ],
    answer: 2,
    explain: "On-demand aligns"
  },
  {
    cat: "cost-optimization",
    q: "Unattached EIP?",
    options: [
      "A. None",
      "B. Charges",
      "C. Same",
      "D. Saves",
    ],
    answer: 2,
    explain: "EIP charges"
  },
  {
    cat: "accelerate-workload",
    q: "Mobile API latency?",
    options: [
      "A. Larger",
      "B. Caching",
      "C. None",
      "D. Ignore",
    ],
    answer: 2,
    explain: "CloudFront mobile"
  },
  {
    cat: "accelerate-workload",
    q: "Variable response?",
    options: [
      "A. Ignore",
      "B. Pooling",
      "C. None",
      "D. Capacity",
    ],
    answer: 2,
    explain: "Connection pooling"
  },
  {
    cat: "accelerate-workload",
    q: "DynamoDB throttle?",
    options: [
      "A. Larger",
      "B. DAX",
      "C. Fixed",
      "D. None",
    ],
    answer: 2,
    explain: "DAX cache"
  },
  {
    cat: "accelerate-workload",
    q: "Multi-region lag?",
    options: [
      "A. Ignore",
      "B. Replicas",
      "C. Single",
      "D. None",
    ],
    answer: 2,
    explain: "Local replicas"
  },
  {
    cat: "accelerate-workload",
    q: "Global static fastest?",
    options: [
      "A. S3",
      "B. CloudFront",
      "C. EC2",
      "D. None",
    ],
    answer: 2,
    explain: "CloudFront fastest"
  },
  {
    cat: "accelerate-workload",
    q: "API sub-100ms?",
    options: [
      "A. Single",
      "B. Multi-region",
      "C. Higher",
      "D. None",
    ],
    answer: 2,
    explain: "Multi-region local"
  },
  {
    cat: "accelerate-workload",
    q: "Document slow?",
    options: [
      "A. Larger",
      "B. Cache",
      "C. Local",
      "D. None",
    ],
    answer: 2,
    explain: "Cache documents"
  },
  {
    cat: "complex-org-design",
    q: "How can you enforce AWS CloudFormation template compliance across accounts?",
    options: [
      "A. SCPs",
      "B. IAM policies only",
      "C. Service Control Policies with conditions",
      "D. StackSets with approval gates",
    ],
    answer: 2,
    explain: "StackSets with approval gates enforce template compliance across accounts"
  },
  {
    cat: "complex-org-design",
    q: "What AWS Control Tower feature helps maintain organizational compliance?",
    options: [
      "A. Landing Zone only",
      "B. GuardRails that enforce policies",
      "C. CloudFormation templates",
      "D. Direct AWS Config integration",
    ],
    answer: 2,
    explain: "GuardRails enforce preventive and detective policies in Control Tower"
  },
  {
    cat: "new-solutions",
    q: "When should you use AWS Lambda for data processing?",
    options: [
      "A. For all database operations",
      "B. For batch jobs always",
      "C. For event-driven, short-duration workloads with variable scale",
      "D. Only for less than 100 GB of data",
    ],
    answer: 2,
    explain: "Lambda excels at event-driven, scalable short-duration processing"
  },
  {
    cat: "new-solutions",
    q: "What AWS service provides real-time machine learning predictions at the edge?",
    options: [
      "A. SageMaker only",
      "B. MLOps",
      "C. SageMaker Neo with CloudFront or IoT Edge",
      "D. Lambda@Edge only",
    ],
    answer: 2,
    explain: "SageMaker Neo compiles models for edge deployment"
  },
  {
    cat: "complex-org-design",
    q: "Cross-account access setup?",
    options: [
      "A. Shared user",
      "B. Roles",
      "C. SSO",
      "D. Credentials",
    ],
    answer: 3,
    explain: "Cross-account roles secure"
  },
  {
    cat: "complex-org-design",
    q: "Transit Gateway RAM sharing?",
    options: [
      "A. Routing",
      "B. Encryption",
      "C. Peering",
      "D. DNS",
    ],
    answer: 3,
    explain: "RAM simplifies routing"
  },
  {
    cat: "complex-org-design",
    q: "Role naming across accounts?",
    options: [
      "A. Identical",
      "B. Prefixes",
      "C. Team IDs",
      "D. Random",
    ],
    answer: 3,
    explain: "Consistent names simplify"
  },
  {
    cat: "complex-org-design",
    q: "Third-party vendor access?",
    options: [
      "A. Credentials",
      "B. MFA role",
      "C. IAM user",
      "D. Admin",
    ],
    answer: 3,
    explain: "Time-limited with MFA"
  },
  {
    cat: "complex-org-design",
    q: "DR account structure?",
    options: [
      "A. Same",
      "B. Right-sized",
      "C. Replica",
      "D. External",
    ],
    answer: 3,
    explain: "Right-sized DR"
  },
  {
    cat: "complex-org-design",
    q: "Centralize network monitoring?",
    options: [
      "A. Per",
      "B. Central Logs",
      "C. None",
      "D. SG",
    ],
    answer: 3,
    explain: "Central VPC Logs"
  },
  {
    cat: "complex-org-design",
    q: "Service catalog benefit?",
    options: [
      "A. No provision",
      "B. Templates",
      "C. Manual",
      "D. Compute",
    ],
    answer: 3,
    explain: "Governance catalog"
  },
  {
    cat: "complex-org-design",
    q: "Cost allocation units?",
    options: [
      "A. Per",
      "B. Shared tags",
      "C. Consolidated",
      "D. Manual",
    ],
    answer: 3,
    explain: "Consolidated billing"
  },
  {
    cat: "complex-org-design",
    q: "Central encryption keys?",
    options: [
      "A. Per",
      "B. Multi-account",
      "C. Customer",
      "D. None",
    ],
    answer: 3,
    explain: "KMS policies"
  },
  {
    cat: "complex-org-design",
    q: "Multi-account log storage?",
    options: [
      "A. Per",
      "B. Central",
      "C. Logs only",
      "D. External",
    ],
    answer: 3,
    explain: "Central account"
  },
  {
    cat: "complex-org-design",
    q: "Multi-account monitor?",
    options: [
      "A. Per",
      "B. Central",
      "C. Manual",
      "D. None",
    ],
    answer: 3,
    explain: "Central dashboard"
  },
  {
    cat: "complex-org-design",
    q: "Disaster recovery?",
    options: [
      "A. Single region",
      "B. Multi-region",
      "C. On-prem",
      "D. Manual",
    ],
    answer: 3,
    explain: "Multi-region backup"
  },
  {
    cat: "new-solutions",
    q: "Event replay?",
    options: [
      "A. Snapshots",
      "B. Event log",
      "C. None",
      "D. Manual",
    ],
    answer: 3,
    explain: "Event log replay"
  },
  {
    cat: "new-solutions",
    q: "Data governance?",
    options: [
      "A. Manual",
      "B. Lake Formation",
      "C. None",
      "D. Roles",
    ],
    answer: 3,
    explain: "Lake Formation"
  },
  {
    cat: "new-solutions",
    q: "Model serving?",
    options: [
      "A. Direct",
      "B. SageMaker",
      "C. Custom",
      "D. None",
    ],
    answer: 3,
    explain: "SageMaker endpoints"
  },
  {
    cat: "new-solutions",
    q: "Batch scoring?",
    options: [
      "A. Real-time",
      "B. Batch",
      "C. Manual",
      "D. None",
    ],
    answer: 3,
    explain: "Batch with EMR"
  },
  {
    cat: "new-solutions",
    q: "Auto-scaling ML?",
    options: [
      "A. Static",
      "B. Metric-based",
      "C. Manual",
      "D. None",
    ],
    answer: 3,
    explain: "Metric-based scaling"
  },
  {
    cat: "new-solutions",
    q: "Feature store?",
    options: [
      "A. DB",
      "B. SageMaker",
      "C. S3",
      "D. None",
    ],
    answer: 3,
    explain: "SageMaker features"
  },
  {
    cat: "new-solutions",
    q: "Async workflow?",
    options: [
      "A. Direct",
      "B. Step Functions",
      "C. Polling",
      "D. None",
    ],
    answer: 3,
    explain: "Step Functions async"
  },
  {
    cat: "new-solutions",
    q: "Message replay?",
    options: [
      "A. Re-send",
      "B. DLQ",
      "C. Manual",
      "D. None",
    ],
    answer: 3,
    explain: "DLQ retry"
  },
  {
    cat: "new-solutions",
    q: "Event ordering?",
    options: [
      "A. Eventual",
      "B. Sequential",
      "C. None",
      "D. Manual",
    ],
    answer: 3,
    explain: "FIFO order"
  },
  {
    cat: "new-solutions",
    q: "Scaling queue?",
    options: [
      "A. Larger",
      "B. Multiple",
      "C. Single",
      "D. None",
    ],
    answer: 3,
    explain: "Multiple queues"
  },
  {
    cat: "new-solutions",
    q: "Eventual consistency?",
    options: [
      "A. Sync",
      "B. Async",
      "C. None",
      "D. Manual",
    ],
    answer: 3,
    explain: "Async eventual"
  },
  {
    cat: "new-solutions",
    q: "Read sharding?",
    options: [
      "A. No",
      "B. By ID",
      "C. Time",
      "D. None",
    ],
    answer: 3,
    explain: "Partition sharding"
  },
  {
    cat: "new-solutions",
    q: "Bulk insert?",
    options: [
      "A. One-by-one",
      "B. Batch",
      "C. Manual",
      "D. None",
    ],
    answer: 3,
    explain: "Batch insert"
  },
  {
    cat: "new-solutions",
    q: "Backup frequency?",
    options: [
      "A. None",
      "B. Hourly",
      "C. Daily",
      "D. Weekly",
    ],
    answer: 3,
    explain: "Frequent backup"
  },
  {
    cat: "migration-modernization",
    q: "Stakeholder communication?",
    options: [
      "A. None",
      "B. Scheduled",
      "C. Ad-hoc",
      "D. Email",
    ],
    answer: 3,
    explain: "Scheduled updates"
  },
  {
    cat: "migration-modernization",
    q: "Team training?",
    options: [
      "A. None",
      "B. Pre-migration",
      "C. After",
      "D. Self",
    ],
    answer: 3,
    explain: "Pre-migration train"
  },
  {
    cat: "migration-modernization",
    q: "Cutover timing?",
    options: [
      "A. Anytime",
      "B. Low-traffic",
      "C. Business",
      "D. Random",
    ],
    answer: 3,
    explain: "Low-traffic window"
  },
  {
    cat: "cost-optimization",
    q: "Tagging allocation?",
    options: [
      "A. None",
      "B. Basic",
      "C. All",
      "D. Random",
    ],
    answer: 3,
    explain: "Basic enables"
  },
  {
    cat: "cost-optimization",
    q: "Unused backups?",
    options: [
      "A. Keep",
      "B. Retention",
      "C. Manual",
      "D. Never",
    ],
    answer: 3,
    explain: "Policies reduce"
  },
  {
    cat: "cost-optimization",
    q: "EC2 vs serverless?",
    options: [
      "A. EC2",
      "B. Compare",
      "C. Serverless",
      "D. None",
    ],
    answer: 3,
    explain: "Variable cheaper"
  },
  {
    cat: "cost-optimization",
    q: "License optimization?",
    options: [
      "A. Standard",
      "B. BYOL",
      "C. Hybrid",
      "D. None",
    ],
    answer: 3,
    explain: "BYOL cheaper"
  },
  {
    cat: "cost-optimization",
    q: "Storage optimization?",
    options: [
      "A. Keep",
      "B. Archive",
      "C. Delete",
      "D. None",
    ],
    answer: 3,
    explain: "Archive old"
  },
  {
    cat: "cost-optimization",
    q: "Network optimization?",
    options: [
      "A. Same",
      "B. Optimize",
      "C. More",
      "D. None",
    ],
    answer: 3,
    explain: "Optimize paths"
  },
  {
    cat: "accelerate-workload",
    q: "Event pipeline?",
    options: [
      "A. Larger",
      "B. Kinesis",
      "C. Batch",
      "D. None",
    ],
    answer: 3,
    explain: "Kinesis low-latency"
  },
  {
    cat: "accelerate-workload",
    q: "Slow page TTFB?",
    options: [
      "A. Larger",
      "B. CloudFront",
      "C. None",
      "D. Accept",
    ],
    answer: 3,
    explain: "CloudFront TTFB"
  },
  {
    cat: "accelerate-workload",
    q: "Global consistency?",
    options: [
      "A. Single",
      "B. Global cache",
      "C. Sync",
      "D. None",
    ],
    answer: 3,
    explain: "Eventual consistency"
  },
  {
    cat: "accelerate-workload",
    q: "Read query cache?",
    options: [
      "A. Write",
      "B. Read cache",
      "C. None",
      "D. DB",
    ],
    answer: 3,
    explain: "Query caching"
  },
  {
    cat: "accelerate-workload",
    q: "Index optimization?",
    options: [
      "A. None",
      "B. Indexes",
      "C. Larger",
      "D. Manual",
    ],
    answer: 3,
    explain: "Indexes and cache"
  },
  {
    cat: "accelerate-workload",
    q: "Failover speed?",
    options: [
      "A. Manual",
      "B. Auto",
      "C. None",
      "D. Accept",
    ],
    answer: 3,
    explain: "Auto failover"
  },
  {
    cat: "accelerate-workload",
    q: "Connection timeout?",
    options: [
      "A. Increase",
      "B. Pool size",
      "C. None",
      "D. Larger",
    ],
    answer: 3,
    explain: "Pool sizing"
  },
  {
    cat: "complex-org-design",
    q: "You need to enforce encryption on all S3 buckets across a multi-account AWS Organization. Which approach provides centralized enforcement?",
    options: [
      "A. Use bucket policies in each account",
      "B. Create CloudFormation StackSets",
      "C. Implement SCPs to deny unencrypted uploads",
      "D. Use EventBridge to monitor compliance",
    ],
    answer: 3,
    explain: "SCPs at org level enforce encryption across all accounts"
  },
  {
    cat: "complex-org-design",
    q: "How should you implement a hub-spoke network topology across multiple AWS accounts?",
    options: [
      "A. VPC peering between all accounts",
      "B. Transit Gateway with attachments in each spoke VPC",
      "C. AWS DirectConnect multiplexing",
      "D. Multiple Site-to-Site VPN connections",
    ],
    answer: 3,
    explain: "Transit Gateway enables scalable multi-account network connectivity"
  },
  {
    cat: "complex-org-design",
    q: "Your organization needs cross-account EventBridge rules. What is the recommended approach?",
    options: [
      "A. Use IAM roles in the source account",
      "B. Grant EventBridge service cross-account permissions via resource-based policy",
      "C. Create a centralized EventBridge bus with cross-account authorization",
      "D. Use SNS topics as intermediate targets",
    ],
    answer: 3,
    explain: "Resource-based policies allow EventBridge to invoke targets in other accounts"
  },
  {
    cat: "complex-org-design",
    q: "For cross-account AWS Lambda invocations, what is the best practice?",
    options: [
      "A. Shared IAM user credentials",
      "B. Cross-account IAM roles with trust relationships",
      "C. Temporary credentials from STS",
      "D. Both B and C",
    ],
    answer: 3,
    explain: "Cross-account roles with trust relationships and STS are best practice"
  },
  {
    cat: "new-solutions",
    q: "You need a globally active-active database with sub-second replication. What is the best DynamoDB feature?",
    options: [
      "A. DynamoDB Streams",
      "B. DynamoDB auto-scaling",
      "C. DynamoDB global tables with multi-region write",
      "D. DynamoDB point-in-time recovery",
    ],
    answer: 3,
    explain: "Global tables provide active-active with automatic multi-region replication"
  },
  {
    cat: "new-solutions",
    q: "When should you use Aurora Serverless v2 over provisioned Aurora?",
    options: [
      "A. When you need maximum performance",
      "B. When workload is unpredictable and requires automatic scaling",
      "C. When you need dedicated capacity",
      "D. For read-heavy OLAP workloads only",
    ],
    answer: 3,
    explain: "Serverless v2 auto-scales for unpredictable workloads with pay-per-use pricing"
  },
  {
    cat: "new-solutions",
    q: "What is the purpose of API Gateway caching?",
    options: [
      "A. To reduce database queries",
      "B. To store credentials securely",
      "C. To reduce latency and backend load by caching responses",
      "D. To enable CORS",
    ],
    answer: 3,
    explain: "Caching reduces backend load and improves response time"
  },
  {
    cat: "new-solutions",
    q: "How does Kinesis Data Streams differ from Kinesis Firehose?",
    options: [
      "A. Streams is cheaper",
      "B. Streams enables real-time processing; Firehose is for delivery to storage",
      "C. Firehose scales better",
      "D. Both A and B",
    ],
    answer: 3,
    explain: "Streams for real-time processing, Firehose for automated data delivery"
  },
  {
    cat: "migration-modernization",
    q: "When should you use AWS MGN instead of AWS SMS for migration?",
    options: [
      "A. For Windows servers only",
      "B. For large-scale, complex migrations requiring continuous replication and minimal downtime",
      "C. For small test migrations",
      "D. MGN and SMS are identical",
    ],
    answer: 3,
    explain: "MGN provides continuous replication with lower RTO/RPO than SMS"
  },
  {
    cat: "migration-modernization",
    q: "You are migrating a large Oracle database (5 TB) to RDS. What is the best approach?",
    options: [
      "A. Use AWS DMS with full load only",
      "B. Use DMS with CDC for minimal downtime cutover",
      "C. Manual export/import",
      "D. AWS DataSync",
    ],
    answer: 3,
    explain: "DMS with Change Data Capture minimizes downtime during migration"
  },
  {
    cat: "migration-modernization",
    q: "Your data center lacks internet connectivity but needs to migrate 100 TB of data to AWS. What should you use?",
    options: [
      "A. AWS DMS over the internet",
      "B. AWS Snowball Edge for offline data transfer",
      "C. Direct Connect alone",
      "D. Application-level sync",
    ],
    answer: 3,
    explain: "Snowball Edge is designed for disconnected or offline data transfer"
  },
  {
    cat: "migration-modernization",
    q: "Which service is best for testing migration readiness and dependencies?",
    options: [
      "A. CloudFormation only",
      "B. Systems Manager",
      "C. Migration Evaluator",
      "D. AWS Application Migration Service",
    ],
    answer: 3,
    explain: "Migration Evaluator assesses readiness and generates business case"
  },
  {
    cat: "cost-optimization",
    q: "You have inconsistent EC2 instance sizing. What AWS service recommends right-sizing?",
    options: [
      "A. Cost Explorer",
      "B. Trusted Advisor",
      "C. CloudWatch",
      "D. Compute Optimizer",
    ],
    answer: 3,
    explain: "Compute Optimizer analyzes metrics to recommend optimal instance types"
  },
  {
    cat: "accelerate-workload",
    q: "How does CloudFront Lambda@Edge improve performance for global users?",
    options: [
      "A. Caches all content globally",
      "B. Executes functions at edge locations to customize responses before returning to users",
      "C. Reduces API calls only",
      "D. Encrypts content only",
    ],
    answer: 3,
    explain: "Lambda@Edge executes code at 200+ edge locations with minimal latency"
  },
  {
    cat: "accelerate-workload",
    q: "What is the primary purpose of AWS Global Accelerator endpoint groups?",
    options: [
      "A. Route traffic to optimal endpoints based on proximity and health",
      "B. Cache content like CloudFront",
      "C. Manage SSL certificates",
      "D. Reduce data transfer costs",
    ],
    answer: 3,
    explain: "Global Accelerator routes to healthy endpoints with anycast IP"
  },
  {
    cat: "accelerate-workload",
    q: "When should you use DynamoDB Accelerator (DAX) over ElastiCache?",
    options: [
      "A. For relational databases",
      "B. For DynamoDB workloads requiring microsecond latency",
      "C. For session management only",
      "D. For Lambda functions only",
    ],
    answer: 3,
    explain: "DAX is purpose-built for DynamoDB caching with minimal latency"
  },
  {
    cat: "accelerate-workload",
    q: "How should you optimize global content delivery for users across multiple regions?",
    options: [
      "A. Single-region S3 with CloudFront",
      "B. Use CloudFront with global distribution and origin groups",
      "C. Separate S3 buckets per region",
      "D. VPN tunnel to each region",
    ],
    answer: 3,
    explain: "CloudFront with origin groups and multiple origins provides optimal latency"
  },
  {
    cat: "migration-modernization",
    q: "What is the best strategy for migrating a multi-tier legacy application?",
    options: [
      "A. Big bang migration",
      "B. Migrate database first, then application",
      "C. Use strangler fig pattern with wave-based migration",
      "D. Parallel run entire stack",
    ],
    answer: 3,
    explain: "Strangler fig allows gradual replacement reducing risk"
  },
  {
    cat: "new-solutions",
    q: "When should you use Step Functions Map state for parallel processing?",
    options: [
      "A. For single-threaded work",
      "B. For processing arrays with parallel iterations",
      "C. For sequential database queries",
      "D. Never",
    ],
    answer: 3,
    explain: "Map state enables parallel execution of iterations over arrays"
  },
  {
    cat: "complex-org-design",
    q: "How should you implement least-privilege cross-account access in an organization?",
    options: [
      "A. Shared root credentials",
      "B. Cross-account roles with resource-based policy and condition limits",
      "C. SSM Parameter Store for credentials",
      "D. Direct IAM user federation",
    ],
    answer: 3,
    explain: "Cross-account roles with conditions enforce least privilege"
  },
  {
    cat: "cost-optimization",
    q: "What is the most effective way to optimize RDS costs across multiple workloads?",
    options: [
      "A. Always use smallest instance type",
      "B. Combine Reserved Instances, On-Demand, and Savings Plans with right-sizing",
      "C. Use Aurora Serverless for all",
      "D. Downgrade database tier",
    ],
    answer: 3,
    explain: "Mix of purchasing options aligned with workload patterns minimizes costs"
  },
  {
    cat: "new-solutions",
    q: "How does SQS Dead Letter Queue (DLQ) improve reliability?",
    options: [
      "A. It caches messages",
      "B. Captures failed messages for analysis and replay",
      "C. Encrypts messages",
      "D. Reduces latency",
    ],
    answer: 3,
    explain: "DLQ stores messages that fail processing for later analysis"
  },
  {
    cat: "migration-modernization",
    q: "What should you prioritize when planning a containerization migration?",
    options: [
      "A. GUI applications first",
      "B. Monolithic applications as-is",
      "C. Breaking monolith into microservices during migration",
      "D. Database containerization",
    ],
    answer: 3,
    explain: "Containerizing while refactoring enables long-term agility"
  }
];
