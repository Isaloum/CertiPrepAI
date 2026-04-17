// Service Comparison Data
// Extracted from 3221 questions across 12 AWS certifications
// Source: AWS official exam guides and documentation
// Generated: 2026-04-17

const SERVICE_COMPARISONS = [
  {
    "group": "Compute",
    "icon": "⚡",
    "comparisons": [
      {
        "a": "EC2",
        "b": "Lambda",
        "aFull": "Amazon EC2",
        "bFull": "AWS Lambda",
        "aSummary": "Virtual servers — full control, persistent, stateful workloads",
        "bSummary": "Serverless functions — event-driven, auto-scaling, pay-per-execution",
        "chooseA": [
          "Need full OS or custom runtime control",
          "Workloads running >15 minutes",
          "Stateful applications requiring persistent storage",
          "Legacy applications requiring specific OS config"
        ],
        "chooseB": [
          "Event-driven processing (S3 events, API calls)",
          "Unpredictable or intermittent traffic",
          "Microservices with short execution time",
          "Zero server management required"
        ]
      },
      {
        "a": "ECS",
        "b": "EKS",
        "aFull": "Amazon ECS",
        "bFull": "Amazon EKS",
        "aSummary": "AWS-native container orchestration — simpler, tightly integrated with AWS",
        "bSummary": "Managed Kubernetes — industry standard, multi-cloud portability",
        "chooseA": [
          "AWS-native workloads, no Kubernetes expertise needed",
          "Simpler orchestration with less operational overhead",
          "Tight integration with ALB, IAM, CloudWatch"
        ],
        "chooseB": [
          "Existing Kubernetes workloads",
          "Multi-cloud or hybrid strategy",
          "Need Kubernetes ecosystem (Helm, operators)"
        ]
      },
      {
        "a": "ECS",
        "b": "Fargate",
        "aFull": "ECS on EC2",
        "bFull": "ECS on Fargate",
        "aSummary": "Containers on EC2 — manage the underlying instances yourself",
        "bSummary": "Serverless containers — no EC2 management, pay per task",
        "chooseA": [
          "Need GPU instances or specific instance types",
          "Cost optimization with reserved capacity",
          "Require daemonsets or host-level access"
        ],
        "chooseB": [
          "No desire to manage EC2 clusters",
          "Variable or unpredictable container workloads",
          "Simplest container deployment path"
        ]
      }
    ]
  },
  {
    "group": "Storage",
    "icon": "🗄️",
    "comparisons": [
      {
        "a": "S3",
        "b": "EBS",
        "aFull": "Amazon S3",
        "bFull": "Amazon EBS",
        "aSummary": "Object storage — unlimited scale, accessed via HTTP, decoupled from compute",
        "bSummary": "Block storage — attached to single EC2 instance, low-latency disk",
        "chooseA": [
          "Static files, images, backups, data lakes",
          "Shared access across many services",
          "Cost-effective large-scale storage",
          "Static website hosting"
        ],
        "chooseB": [
          "OS root volume for EC2",
          "Database files requiring low-latency block I/O",
          "Transactional workloads (IOPS-intensive)"
        ]
      },
      {
        "a": "S3",
        "b": "EFS",
        "aFull": "Amazon S3",
        "bFull": "Amazon EFS",
        "aSummary": "Object storage — HTTP access, unlimited, cheapest at scale",
        "bSummary": "File system — POSIX-compliant, mountable on multiple EC2 simultaneously",
        "chooseA": [
          "Web-accessible content, backups, archives",
          "Object-level access via SDK or HTTP"
        ],
        "chooseB": [
          "Shared file system across many EC2 instances",
          "Applications that require a POSIX file system",
          "Content management or home directories"
        ]
      },
      {
        "a": "S3",
        "b": "Glacier",
        "aFull": "Amazon S3 Standard",
        "bFull": "S3 Glacier",
        "aSummary": "Frequent access — millisecond retrieval, standard pricing",
        "bSummary": "Archive storage — minutes to hours retrieval, 80%+ cheaper",
        "chooseA": [
          "Data accessed frequently or unpredictably",
          "Real-time applications requiring instant access"
        ],
        "chooseB": [
          "Long-term backup and compliance archives (7+ years)",
          "Data rarely accessed — DR copies, audit logs"
        ]
      }
    ]
  },
  {
    "group": "Database",
    "icon": "🗃️",
    "comparisons": [
      {
        "a": "RDS",
        "b": "DynamoDB",
        "aFull": "Amazon RDS",
        "bFull": "Amazon DynamoDB",
        "aSummary": "Managed relational DB — SQL, ACID transactions, structured schema",
        "bSummary": "NoSQL key-value/document DB — single-digit ms latency at any scale",
        "chooseA": [
          "Complex SQL queries and joins",
          "ACID transactions across multiple tables",
          "Structured relational data with fixed schema"
        ],
        "chooseB": [
          "Millions of requests/sec with consistent low latency",
          "Flexible schema, semi-structured data",
          "Serverless, scales automatically to zero"
        ]
      },
      {
        "a": "RDS",
        "b": "Aurora",
        "aFull": "Amazon RDS",
        "bFull": "Amazon Aurora",
        "aSummary": "Standard managed relational DB — MySQL/PostgreSQL/SQL Server/Oracle",
        "bSummary": "AWS-built relational DB — 5x MySQL speed, 3x PostgreSQL, auto-scales storage",
        "chooseA": [
          "Non-MySQL/PostgreSQL engines (Oracle, SQL Server, MariaDB)",
          "Cost-sensitive workloads (Aurora costs more)"
        ],
        "chooseB": [
          "High-performance MySQL or PostgreSQL workloads",
          "Need Aurora Serverless for variable traffic",
          "Up to 15 read replicas with Aurora"
        ]
      },
      {
        "a": "DynamoDB",
        "b": "ElastiCache",
        "aFull": "Amazon DynamoDB",
        "bFull": "Amazon ElastiCache",
        "aSummary": "Durable NoSQL DB — persists data, single-digit ms at scale",
        "bSummary": "In-memory cache — sub-ms latency, ephemeral, for read acceleration",
        "chooseA": [
          "Primary data store that needs to persist",
          "Write-heavy workloads with durable storage"
        ],
        "chooseB": [
          "Cache frequently-read data to reduce DB load",
          "Session storage, leaderboards, real-time analytics",
          "Sub-millisecond latency required"
        ]
      }
    ]
  },
  {
    "group": "Messaging",
    "icon": "📨",
    "comparisons": [
      {
        "a": "SQS",
        "b": "SNS",
        "aFull": "Amazon SQS",
        "bFull": "Amazon SNS",
        "aSummary": "Queue — decouples producers and consumers, messages persist until processed",
        "bSummary": "Pub/Sub — fan-out messages to multiple subscribers simultaneously",
        "chooseA": [
          "Decouple microservices with a buffer",
          "Ensure each message is processed exactly once (FIFO)",
          "Handle traffic spikes without losing messages"
        ],
        "chooseB": [
          "Send notifications to multiple endpoints at once",
          "Fan-out to SQS + Lambda + email + SMS simultaneously",
          "Push-based delivery to subscribers"
        ]
      },
      {
        "a": "SQS",
        "b": "EventBridge",
        "aFull": "Amazon SQS",
        "bFull": "Amazon EventBridge",
        "aSummary": "Simple queue — point-to-point, pull-based, reliable delivery",
        "bSummary": "Event bus — content-based routing, 90+ AWS sources, SaaS integrations",
        "chooseA": [
          "Simple point-to-point decoupling",
          "Need persistent queue with retry logic"
        ],
        "chooseB": [
          "Route events based on content/patterns",
          "Integrate with SaaS apps (Salesforce, Zendesk)",
          "React to AWS service events (EC2 state changes)"
        ]
      }
    ]
  },
  {
    "group": "Networking",
    "icon": "🌐",
    "comparisons": [
      {
        "a": "ALB",
        "b": "NLB",
        "aFull": "Application Load Balancer",
        "bFull": "Network Load Balancer",
        "aSummary": "Layer 7 — HTTP/HTTPS routing, path/host-based rules, WebSockets",
        "bSummary": "Layer 4 — TCP/UDP, ultra-low latency, millions of req/sec, static IP",
        "chooseA": [
          "Web applications with HTTP/HTTPS traffic",
          "Content-based routing (path, host, headers)",
          "WebSocket or HTTP/2 support needed"
        ],
        "chooseB": [
          "Extreme performance — millions of requests/second",
          "TCP/UDP workloads (gaming, IoT, VoIP)",
          "Need static IP or Elastic IP on load balancer"
        ]
      },
      {
        "a": "CloudFront",
        "b": "Global Accelerator",
        "aFull": "Amazon CloudFront",
        "bFull": "AWS Global Accelerator",
        "aSummary": "CDN — cache content at edge for HTTP, best for static/media delivery",
        "bSummary": "Network accelerator — routes TCP/UDP over AWS backbone, non-HTTP traffic",
        "chooseA": [
          "Cache and serve static content (images, JS, CSS, video)",
          "Reduce latency for global web users",
          "DDoS protection with AWS WAF integration"
        ],
        "chooseB": [
          "Non-HTTP workloads (TCP/UDP, gaming, IoT)",
          "Need static Anycast IP addresses",
          "Consistent performance regardless of content cacheability"
        ]
      },
      {
        "a": "Direct Connect",
        "b": "VPN",
        "aFull": "AWS Direct Connect",
        "bFull": "AWS Site-to-Site VPN",
        "aSummary": "Dedicated private line — consistent bandwidth, low latency, not over internet",
        "bSummary": "Encrypted tunnel over internet — fast setup, lower cost, variable latency",
        "chooseA": [
          "Consistent, high-bandwidth connection to AWS",
          "Sensitive data requiring private link (compliance)",
          "Production workloads needing predictable performance"
        ],
        "chooseB": [
          "Quick setup (hours vs weeks for Direct Connect)",
          "Backup connection for Direct Connect failover",
          "Lower cost, acceptable variable latency"
        ]
      }
    ]
  },
  {
    "group": "Security",
    "icon": "🔒",
    "comparisons": [
      {
        "a": "WAF",
        "b": "Shield",
        "aFull": "AWS WAF",
        "bFull": "AWS Shield",
        "aSummary": "Web Application Firewall — blocks SQL injection, XSS, custom rules at Layer 7",
        "bSummary": "DDoS protection — absorbs volumetric attacks at Layer 3/4",
        "chooseA": [
          "Block application-layer attacks (SQL injection, XSS)",
          "Rate limiting and bot control",
          "Custom rules based on IP, geo, request patterns"
        ],
        "chooseB": [
          "Protection against volumetric DDoS attacks",
          "Shield Standard: free, automatic for all AWS customers",
          "Shield Advanced: 24/7 DRT team, cost protection, Layer 7"
        ]
      },
      {
        "a": "GuardDuty",
        "b": "Inspector",
        "aFull": "Amazon GuardDuty",
        "bFull": "Amazon Inspector",
        "aSummary": "Threat detection — monitors logs/network for active threats and anomalies",
        "bSummary": "Vulnerability scanner — scans EC2/containers/Lambda for CVEs and misconfigs",
        "chooseA": [
          "Detect compromised instances, crypto mining, unusual API calls",
          "Continuous monitoring of CloudTrail, VPC Flow Logs, DNS logs"
        ],
        "chooseB": [
          "Scan workloads for known CVEs before attackers find them",
          "Compliance: identify unpatched OS/packages",
          "Automated vulnerability assessment"
        ]
      },
      {
        "a": "Secrets Manager",
        "b": "KMS",
        "aFull": "AWS Secrets Manager",
        "bFull": "AWS KMS",
        "aSummary": "Stores and rotates secrets (DB passwords, API keys) — with automatic rotation",
        "bSummary": "Creates and manages encryption keys — used to encrypt data at rest",
        "chooseA": [
          "Store database credentials with automatic rotation",
          "Inject secrets into Lambda/ECS without hardcoding"
        ],
        "chooseB": [
          "Encrypt S3 objects, EBS volumes, RDS instances",
          "Customer-managed key rotation and auditing via CloudTrail"
        ]
      }
    ]
  },
  {
    "group": "Monitoring",
    "icon": "📊",
    "comparisons": [
      {
        "a": "CloudWatch",
        "b": "CloudTrail",
        "aFull": "Amazon CloudWatch",
        "bFull": "AWS CloudTrail",
        "aSummary": "Performance monitoring — metrics, logs, alarms, dashboards",
        "bSummary": "API audit log — who did what, when, from where across your AWS account",
        "chooseA": [
          "Monitor EC2 CPU, Lambda duration, RDS connections",
          "Set alarms to auto-scale or notify on thresholds",
          "Centralize application logs"
        ],
        "chooseB": [
          "Audit: who deleted the S3 bucket?",
          "Compliance: prove all API calls are logged",
          "Detect unauthorized IAM changes"
        ]
      },
      {
        "a": "CloudWatch",
        "b": "X-Ray",
        "aFull": "Amazon CloudWatch",
        "bFull": "AWS X-Ray",
        "aSummary": "Infrastructure metrics and logs — broad monitoring across all AWS services",
        "bSummary": "Distributed tracing — follow a request through microservices end-to-end",
        "chooseA": [
          "Monitor infrastructure health and set alarms",
          "Aggregate logs from EC2, Lambda, containers"
        ],
        "chooseB": [
          "Debug why a microservice call is slow",
          "Trace requests across Lambda → API Gateway → DynamoDB",
          "Identify bottlenecks in distributed applications"
        ]
      },
      {
        "a": "CloudTrail",
        "b": "Config",
        "aFull": "AWS CloudTrail",
        "bFull": "AWS Config",
        "aSummary": "API activity log — captures every API call made in your account",
        "bSummary": "Configuration history — tracks what your resources look like over time",
        "chooseA": [
          "Who made this change? (IAM user, role, time)",
          "Security investigation and forensics"
        ],
        "chooseB": [
          "Was this S3 bucket public last Tuesday?",
          "Compliance: are all EC2 instances using approved AMIs?",
          "Remediate non-compliant resources automatically"
        ]
      }
    ]
  }
];
