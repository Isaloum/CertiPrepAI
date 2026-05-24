/**
 * QuickFire.tsx — Active Recall Drill Mode
 * Flashcard-style quiz: Decision Matrix · Exam Traps · Numbers & Facts
 * isPremium gate — free users see 5-question preview then upsell
 */
import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../contexts/AuthContext'

type QuizMode = 'matrix' | 'traps' | 'numbers' | 'all'
type Phase = 'setup' | 'quiz' | 'complete'

interface QuizQ {
  id: string
  mode: 'matrix' | 'traps' | 'numbers'
  question: string
  correct: string
  explanation: string
}

// ─── SHUFFLE HELPERS ──────────────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function getOptions(q: QuizQ, pool: QuizQ[]): string[] {
  const others = pool
    .filter(x => x.id !== q.id && x.correct !== q.correct)
    .map(x => x.correct)
  const unique = [...new Set(others)]
  const wrong = shuffle(unique).slice(0, 3)
  return shuffle([q.correct, ...wrong])
}

// ─── DECISION MATRIX QUESTIONS ────────────────────────────────────────────────
const MATRIX_QS: QuizQ[] = [
  { id: 'm01', mode: 'matrix', question: 'Global low latency for static content (images, videos, HTML)', correct: 'CloudFront', explanation: 'Caches at 400+ Edge Locations closest to users. HTTP/HTTPS only — not TCP/UDP.' },
  { id: 'm02', mode: 'matrix', question: 'Decouple application components asynchronously', correct: 'SQS', explanation: 'Queue buffers messages; producers and consumers operate independently at their own pace.' },
  { id: 'm03', mode: 'matrix', question: 'Fan-out — send one event to multiple subscribers simultaneously', correct: 'SNS + SQS fan-out', explanation: 'SNS Pub/Sub pushes to Email, SMS, Lambda, SQS simultaneously. One SNS → many SQS queues.' },
  { id: 'm04', mode: 'matrix', question: 'RDS high availability with automatic failover', correct: 'RDS Multi-AZ', explanation: 'Synchronous standby in another AZ. Auto-failover < 2 mins. NOT for reads — standby is inaccessible.' },
  { id: 'm05', mode: 'matrix', question: 'Scale READ traffic on RDS without affecting the primary', correct: 'RDS Read Replicas', explanation: 'Async copies of primary. Serve SELECT queries. Can promote to primary. Not for failover.' },
  { id: 'm06', mode: 'matrix', question: 'EC2 instance needs secure access to S3 or other AWS services', correct: 'IAM Role attached to EC2', explanation: 'IAM Roles = auto-rotating temp credentials. Never store access keys on EC2 instances.' },
  { id: 'm07', mode: 'matrix', question: 'Block a specific IP address or CIDR range from reaching your VPC', correct: 'Network ACL Deny rule', explanation: 'Only NACLs support explicit Deny. Security Groups are allow-only — all unmatched is implicitly denied.' },
  { id: 'm08', mode: 'matrix', question: 'Stateful firewall at the instance level', correct: 'Security Group', explanation: 'Security Groups remember connection state — return traffic is automatically allowed without explicit rules.' },
  { id: 'm09', mode: 'matrix', question: 'Private subnet instances need outbound internet access only', correct: 'NAT Gateway in public subnet', explanation: 'Allows outbound. Blocks all inbound-initiated. Must live in public subnet. One per AZ for HA.' },
  { id: 'm10', mode: 'matrix', question: 'Fast setup encrypted tunnel to on-premises network', correct: 'Site-to-Site VPN (IPSec)', explanation: 'IPSec over public internet. Minutes to configure. Variable latency. Encrypted by default.' },
  { id: 'm11', mode: 'matrix', question: 'Dedicated private connection to on-premises with consistent latency', correct: 'AWS Direct Connect', explanation: 'Private fiber. Consistent latency. NOT encrypted by default — add VPN over DX for encryption.' },
  { id: 'm12', mode: 'matrix', question: 'Highest IOPS block storage for mission-critical databases', correct: 'EBS io2 Block Express', explanation: 'Up to 256,000 IOPS. Lowest latency. For Oracle, SQL Server, high-performance DBs.' },
  { id: 'm13', mode: 'matrix', question: 'Cheapest storage for data archived 10+ years, retrieved rarely', correct: 'S3 Glacier Deep Archive', explanation: '~$0.00099/GB/month. 12+ hour retrieval. Lowest cost storage on AWS. Min 180-day retention.' },
  { id: 'm14', mode: 'matrix', question: 'Run code without managing any servers (event-driven, short jobs)', correct: 'AWS Lambda', explanation: 'Serverless. Pay per request + duration (ms). Max 15 minutes. Auto-scales to demand.' },
  { id: 'm15', mode: 'matrix', question: 'Managed container orchestration with no EC2 management needed', correct: 'ECS or EKS with Fargate', explanation: 'Fargate = serverless containers. AWS manages underlying infrastructure, cluster, scaling.' },
  { id: 'm16', mode: 'matrix', question: 'Query petabytes of S3 data using SQL — no infrastructure needed', correct: 'Amazon Athena', explanation: 'Serverless. Query S3 directly with standard SQL. Pay per query. No servers or clusters.' },
  { id: 'm17', mode: 'matrix', question: 'Real-time streaming data with multiple independent consumers', correct: 'Kinesis Data Streams', explanation: 'Multiple consumers can read the same stream independently. Supports replay within retention window.' },
  { id: 'm18', mode: 'matrix', question: 'Deliver streaming data to S3 or Redshift — no management', correct: 'Kinesis Data Firehose', explanation: 'Fully managed delivery. Near real-time. No shards to manage. Supports Lambda for transformation.' },
  { id: 'm19', mode: 'matrix', question: 'Migrate 80TB+ of data offline (internet upload would take weeks)', correct: 'AWS Snowball Edge', explanation: 'Physical appliance. Faster than internet. Rule of thumb: use if upload takes >1 week.' },
  { id: 'm20', mode: 'matrix', question: 'Shared file system for multiple Linux EC2 instances simultaneously', correct: 'Amazon EFS', explanation: 'NFS protocol. Scales automatically. Multi-AZ. Thousands of concurrent EC2 connections.' },
  { id: 'm21', mode: 'matrix', question: 'Shared file system for Windows EC2 with Active Directory integration', correct: 'FSx for Windows File Server', explanation: 'SMB protocol. Full AD integration. DFS namespaces. Windows-native — EFS is Linux/POSIX only.' },
  { id: 'm22', mode: 'matrix', question: 'DDoS protection for all AWS resources automatically', correct: 'AWS Shield Standard (free)', explanation: 'Free, automatic. Protects against common network/transport layer DDoS. Shield Advanced adds 24/7 DRT.' },
  { id: 'm23', mode: 'matrix', question: 'Block SQL injection and cross-site scripting (XSS) attacks', correct: 'AWS WAF', explanation: 'Layer 7 (HTTP) rules. Integrates with ALB, CloudFront, API Gateway. Rate-based rules for DDoS.' },
  { id: 'm24', mode: 'matrix', question: 'Global TCP/UDP acceleration with static IP addresses required', correct: 'AWS Global Accelerator', explanation: '2 static Anycast IPs. Routes over AWS backbone. NOT a CDN — no caching. Great for gaming/VoIP/IoT.' },
  { id: 'm25', mode: 'matrix', question: 'Store database credentials with automatic rotation', correct: 'AWS Secrets Manager', explanation: 'Native rotation for RDS, Redshift, DocumentDB. ~$0.40/secret/month. Retrieves programmatically.' },
  { id: 'm26', mode: 'matrix', question: 'Store application config values — free, no rotation needed', correct: 'SSM Parameter Store (Standard)', explanation: 'Free for standard parameters. SecureString for encrypted values. No native rotation.' },
  { id: 'm27', mode: 'matrix', question: 'SSH to EC2 without a bastion host or opening port 22', correct: 'Systems Manager Session Manager', explanation: 'No open inbound ports. Full CloudTrail audit. Works via SSM Agent. Browser or CLI access.' },
  { id: 'm28', mode: 'matrix', question: 'Connect many VPCs and on-premises in a hub-and-spoke model', correct: 'AWS Transit Gateway', explanation: 'Central hub. Transitive routing. 10 VPCs = 10 TGW attachments vs 45 peering connections.' },
  { id: 'm29', mode: 'matrix', question: 'Expose a VPC service to other VPCs without peering or public internet', correct: 'VPC PrivateLink', explanation: 'Traffic stays on AWS network. No peering, IGW, or NAT. Provider creates endpoint service; consumer creates interface endpoint.' },
  { id: 'm30', mode: 'matrix', question: 'Route 10% of traffic to a new app version for A/B testing', correct: 'Route 53 Weighted Routing', explanation: 'Assign numeric weights to records. 10+90 = 10% to new, 90% to stable. Perfect for gradual rollouts.' },
  { id: 'm31', mode: 'matrix', question: 'Automatic DNS failover to backup site when primary is unhealthy', correct: 'Route 53 Failover Routing', explanation: 'Health check primary. Auto-route to secondary on failure. Active-passive configuration.' },
  { id: 'm32', mode: 'matrix', question: 'Route users to the lowest-latency AWS region', correct: 'Route 53 Latency Routing', explanation: 'Measures actual network latency to each region. User in Europe may go to us-east-1 if latency is lower.' },
  { id: 'm33', mode: 'matrix', question: 'Restrict content access by country for compliance', correct: 'Route 53 Geolocation Routing', explanation: 'Routes by country, continent, or US state. Must have Default record or unmatched queries fail.' },
  { id: 'm34', mode: 'matrix', question: 'On-premises partners upload files via SFTP directly to S3', correct: 'AWS Transfer Family', explanation: 'Managed SFTP/FTPS/FTP server backed by S3 or EFS. No code changes for existing SFTP clients.' },
  { id: 'm35', mode: 'matrix', question: 'Migrate files from on-premises NAS to S3 or EFS online', correct: 'AWS DataSync', explanation: 'Scheduled or one-time online sync. 10x faster than open-source tools. Agent installed on-prem.' },
  { id: 'm36', mode: 'matrix', question: 'Speed up S3 uploads from globally distributed users', correct: 'S3 Transfer Acceleration', explanation: 'Users upload to nearest CloudFront edge location → AWS backbone → S3. Up to 50–500% faster.' },
  { id: 'm37', mode: 'matrix', question: 'Coordinate multiple Lambda functions with retries and branching', correct: 'AWS Step Functions', explanation: 'Visual state machine. Handles retries, parallel execution, error catching, and timeouts.' },
  { id: 'm38', mode: 'matrix', question: 'In-memory cache for DynamoDB with microsecond latency', correct: 'DAX (DynamoDB Accelerator)', explanation: 'Purpose-built DynamoDB cache. 10x speedup. API-compatible — no application code changes.' },
  { id: 'm39', mode: 'matrix', question: 'Cache RDS query results to reduce database load', correct: 'ElastiCache (Redis or Memcached)', explanation: 'Redis for persistence, pub/sub, failover. Memcached for simple multi-threaded caching.' },
  { id: 'm40', mode: 'matrix', question: 'Grant cross-account temporary access to AWS resources', correct: 'IAM Role + sts:AssumeRole', explanation: 'Account A creates Role with Trust Policy. Account B user calls sts:AssumeRole to get temp credentials.' },
  { id: 'm41', mode: 'matrix', question: 'Add user sign-up and sign-in to a web or mobile application', correct: 'Amazon Cognito User Pool', explanation: 'Full IdP: sign-up, MFA, password policies. Returns JWT tokens. Does NOT grant AWS service access directly.' },
  { id: 'm42', mode: 'matrix', question: 'Let app users upload directly to S3 with temporary AWS credentials', correct: 'Cognito Identity Pool (Federated Identities)', explanation: 'Exchanges JWT for temporary IAM credentials via STS. Users call AWS services directly from client.' },
  { id: 'm43', mode: 'matrix', question: 'Immutable, cryptographically verifiable ledger database', correct: 'Amazon QLDB', explanation: 'Append-only journal. Every change is cryptographically hashed and provable. For financial records.' },
  { id: 'm44', mode: 'matrix', question: 'Automate EBS snapshot creation and deletion on a schedule', correct: 'EBS Data Lifecycle Manager (DLM)', explanation: 'Lifecycle policies that snapshot volumes, enforce retention, and delete old snapshots automatically.' },
  { id: 'm45', mode: 'matrix', question: 'Outbound-only internet access for IPv6 instances in private subnets', correct: 'Egress-Only Internet Gateway', explanation: 'Allows IPv6 instances to initiate outbound connections. Blocks all inbound-initiated IPv6. IPv6 NAT equivalent.' },
  { id: 'm46', mode: 'matrix', question: 'Lambda function getting "too many connections" errors to RDS', correct: 'RDS Proxy', explanation: 'Pools and reuses DB connections. Lambda scales to thousands of concurrent instances — each opens a new connection without Proxy.' },
  { id: 'm47', mode: 'matrix', question: 'Clients must whitelist a static IP to reach your load balancer', correct: 'Network Load Balancer with Elastic IP', explanation: 'NLB supports one EIP per AZ. ALB does NOT support Elastic IPs — its IPs are dynamic and DNS-based.' },
  { id: 'm48', mode: 'matrix', question: 'Video surveillance — detect unauthorised people with AI + SMS alert', correct: 'Kinesis Video Streams + Rekognition + SNS', explanation: 'Kinesis Video Streams ingests live feeds. Rekognition detects faces. SNS sends SMS alerts to security team.' },
  { id: 'm49', mode: 'matrix', question: 'VPC IPv4 addresses exhausted — cannot launch new EC2 instances', correct: 'Create an IPv6-only subnet', explanation: 'Cannot remove IPv4 from existing VPC. Add an IPv6-only subnet — new resources use IPv6 bypassing IPv4 exhaustion.' },
  { id: 'm50', mode: 'matrix', question: 'Track and report AWS spending broken down by department', correct: 'Tag resources + enable Cost Allocation Tags', explanation: 'Tag resources with department. Activate in Billing. AWS generates Cost Allocation Report (CSV) grouped by tags.' },
  { id: 'm51', mode: 'matrix', question: 'Priority queue — premium users processed before free users', correct: 'Two separate SQS queues (poll premium first)', explanation: 'SQS has no per-message priority. Two queues: consumers drain premium first, then poll free queue.' },
  { id: 'm52', mode: 'matrix', question: 'Access DynamoDB from VPC without traffic going over public internet', correct: 'DynamoDB Gateway VPC Endpoint (free)', explanation: 'S3 and DynamoDB use free Gateway Endpoints. All other services use Interface Endpoints (PrivateLink, costs money).' },
  { id: 'm53', mode: 'matrix', question: 'Automated cross-account or cross-region backup of DynamoDB', correct: 'AWS Backup', explanation: 'DynamoDB on-demand backups cannot be copied cross-account natively. AWS Backup adds this capability.' },
  { id: 'm54', mode: 'matrix', question: 'AI image/video content moderation — no ML training required', correct: 'Amazon Rekognition Content Moderation', explanation: 'Pre-built model detects explicit content, violence, nudity. Add Interface VPC Endpoint for private access.' },
  { id: 'm55', mode: 'matrix', question: 'Block malicious URLs and blacklisted FQDNs at the VPC perimeter', correct: 'AWS Network Firewall', explanation: 'Suricata-based stateful rules. Supports domain name allow/deny lists. Route VPC traffic through firewall endpoints.' },
  { id: 'm56', mode: 'matrix', question: 'Big data ETL (Hadoop/Spark) + BI analytics with standard SQL', correct: 'Amazon EMR + Amazon Redshift', explanation: 'EMR processes and transforms big data. Load into Redshift for massively parallel SQL analytics and BI tools.' },
  { id: 'm57', mode: 'matrix', question: 'Container orchestration — open-source, cloud-agnostic, portable', correct: 'Amazon EKS (Kubernetes)', explanation: 'Kubernetes runs on AWS, Azure, GCP, or on-prem. ECS is AWS-proprietary. Cloud-agnostic → always EKS.' },
  { id: 'm58', mode: 'matrix', question: 'Monitor EC2 swap space, memory utilization, OS-level metrics', correct: 'Install CloudWatch Agent on EC2', explanation: 'Default CloudWatch is hypervisor-level only. Agent collects memory, swap, disk inside the OS.' },
  { id: 'm59', mode: 'matrix', question: 'Create multiple AWS accounts with preapproved baseline configurations', correct: 'AWS Control Tower + Account Factory', explanation: 'Control Tower automates multi-account setup with guardrails (SCPs + Config rules). Account Factory provisions accounts.' },
  { id: 'm60', mode: 'matrix', question: 'Route more traffic to one AWS region by expanding its geographic coverage', correct: 'Route 53 Geoproximity Routing with positive bias', explanation: 'Bias expands (+) or shrinks (−) the geographic region routing to a resource. Different from Geolocation (exact country).' },
  { id: 'm61', mode: 'matrix', question: 'HTTP/HTTPS load balancing with path routing, host routing, and gRPC', correct: 'Application Load Balancer (ALB)', explanation: 'Layer 7. Routes by path, host, headers, query strings. Supports gRPC and WebSocket. No static IP.' },
  { id: 'm62', mode: 'matrix', question: 'TCP/UDP load balancing with ultra-low latency and static Elastic IP', correct: 'Network Load Balancer (NLB)', explanation: 'Layer 4. Millions of requests/sec. Supports Elastic IPs. No path or host routing capability.' },
  { id: 'm63', mode: 'matrix', question: 'Modify CloudFront requests or responses at the edge — nearest PoP', correct: 'Lambda@Edge', explanation: 'Runs at CloudFront PoPs. 4 trigger points: Viewer Request, Origin Request, Origin Response, Viewer Response.' },
  { id: 'm64', mode: 'matrix', question: 'On-premises tape backup — archive to cloud for 10 years, accessed once/year', correct: 'Storage Gateway Tape Gateway → Glacier Deep Archive', explanation: 'Tape Gateway = virtual tape library, no workflow changes. Deep Archive = cheapest (~$0.00099/GB/month).' },
  { id: 'm65', mode: 'matrix', question: 'Deliver SNS messages only to subscribers matching specific attributes', correct: 'SNS Message Filter Policy', explanation: 'Each subscription defines a JSON filter policy. Only matching messages are delivered — eliminates unnecessary Lambda fan-out.' },
]

// ─── EXAM TRAP QUESTIONS ──────────────────────────────────────────────────────
const TRAP_QS: QuizQ[] = [
  { id: 't01', mode: 'traps', question: '"Too many read queries slowing down RDS." What is the WRONG fix?', correct: 'Enable RDS Multi-AZ — standby CANNOT serve reads', explanation: 'Multi-AZ standby is completely inaccessible. Use Read Replicas for read scaling. Multi-AZ = HA/failover only.' },
  { id: 't02', mode: 'traps', question: '"Block traffic from a specific IP." Which service actually does this?', correct: 'Network ACL (NACLs support explicit Deny rules — SGs cannot)', explanation: 'Security Groups are allow-only. NACLs support both Allow and Deny, processed in numeric order at subnet level.' },
  { id: 't03', mode: 'traps', question: '"Dedicated connection with encryption required." Which is CORRECT?', correct: 'Direct Connect + VPN (DX alone is private but NOT encrypted)', explanation: 'DX alone = private, consistent, not encrypted. Add IPSec VPN over DX to get both dedicated AND encrypted.' },
  { id: 't04', mode: 'traps', question: '"Compliance data must survive AZ failure." Which S3 class is DANGEROUS?', correct: 'S3 One Zone-IA — single AZ, data permanently lost on AZ failure', explanation: 'One Zone-IA stores in one AZ only. Legal/compliance data must never use One Zone-IA. Use Standard-IA or Glacier.' },
  { id: 't05', mode: 'traps', question: '"Most cost-effective for stateful production database." Which is WRONG?', correct: 'Spot Instances — interrupted with 2-minute warning, data loss risk', explanation: 'Spot = stateless, fault-tolerant batch. DB/payments/critical = Reserved Instances or Savings Plans.' },
  { id: 't06', mode: 'traps', question: '"German users MUST always go to Frankfurt servers." Which routing?', correct: 'Geolocation Routing (routes by exact country — "MUST" = Geolocation)', explanation: 'Geolocation = compliance, must-route-to-X. Geoproximity = expand/shrink coverage. Latency = performance.' },
  { id: 't07', mode: 'traps', question: '"Enable encryption on an existing unencrypted RDS instance." Correct process?', correct: 'Snapshot → copy with encryption → restore to new encrypted instance', explanation: 'Cannot enable encryption on a running RDS in-place. Must snapshot → encrypted copy → restore → cutover.' },
  { id: 't08', mode: 'traps', question: 'Where must a NAT Gateway be placed?', correct: 'In a PUBLIC subnet (needs route to IGW to forward traffic to internet)', explanation: 'NAT GW needs internet access itself. Route: Private EC2 → NAT GW (public) → IGW → Internet. One per AZ for HA.' },
  { id: 't09', mode: 'traps', question: '"Gaming app needs fixed IP + UDP traffic globally." Which service?', correct: 'AWS Global Accelerator (2 static Anycast IPs, TCP/UDP support)', explanation: 'CloudFront = HTTP/HTTPS only, dynamic IPs. Global Accelerator = static IPs, TCP/UDP, gaming/VoIP/IoT.' },
  { id: 't10', mode: 'traps', question: '"Automatically rotate DB credentials every 30 days." Which service?', correct: 'AWS Secrets Manager (SSM Parameter Store has NO native rotation)', explanation: 'Secrets Manager has built-in Lambda rotation functions for RDS/Redshift. ~$0.40/secret/month.' },
  { id: 't11', mode: 'traps', question: 'SQS messages being processed more than once. What is the ROOT cause?', correct: 'Visibility timeout shorter than processing time (increase it)', explanation: 'If processing takes longer than visibility timeout, message reappears for another consumer. Not a FIFO issue.' },
  { id: 't12', mode: 'traps', question: '"Connect 8 VPCs together." Why is VPC Peering wrong?', correct: 'Non-transitive — 8 VPCs need 28 peering connections. Use Transit Gateway (8 attachments)', explanation: 'Formula: N×(N-1)/2. 8 VPCs = 28 connections. Transit Gateway = 8 attachments. Any many-VPC scenario → TGW.' },
  { id: 't13', mode: 'traps', question: '"Assign Elastic IP to load balancer." Which load balancer supports this?', correct: 'Network Load Balancer only (ALB does NOT support Elastic IPs)', explanation: 'ALB IPs are dynamic and DNS-based. NLB supports one EIP per AZ. Need both static IP and path routing → NLB in front of ALB.' },
  { id: 't14', mode: 'traps', question: '"Private VPC access to DynamoDB." Which endpoint type?', correct: 'Gateway Endpoint (free) — NOT Interface Endpoint (PrivateLink, costs money)', explanation: 'Only S3 and DynamoDB use free Gateway Endpoints. All other services use Interface Endpoints (PrivateLink).' },
  { id: 't15', mode: 'traps', question: '"What happens when RDS Multi-AZ primary fails?"', correct: 'CNAME record flips from primary endpoint to standby (1–2 min downtime)', explanation: 'Not an IP swap (IPs are AZ-scoped). Not a reboot. Not a new instance. Standby exists — CNAME is redirected.' },
  { id: 't16', mode: 'traps', question: 'EBS volume data is replicated across which scope?', correct: 'Within the same AZ only — NOT cross-AZ or cross-region', explanation: 'EBS protects against hardware failure in the AZ only. AZ outage = EBS at risk. Use snapshots (S3) for durability.' },
  { id: 't17', mode: 'traps', question: '"Block suspicious hosts based on GuardDuty findings." Can GuardDuty block?', correct: 'No — GuardDuty detects only. Use WAF/NACL + Lambda to block', explanation: 'GuardDuty = detection only. Route findings → EventBridge → Lambda → update WAF IP set or NACL deny rule.' },
  { id: 't18', mode: 'traps', question: 'What is the default Auto Scaling cooldown period?', correct: '300 seconds (5 minutes) — NOT 600 seconds', explanation: '300s is the default. Prevents ASG from launching/terminating additional instances before previous activity completes.' },
  { id: 't19', mode: 'traps', question: 'Which AES encryption standard does S3 SSE-S3 use?', correct: 'AES-256 only — AES-128 is NOT supported by Amazon S3', explanation: 'All S3 SSE options (SSE-S3, SSE-KMS, SSE-C) use AES-256. Any answer with AES-128 is always wrong.' },
  { id: 't20', mode: 'traps', question: '"Monitor EC2 memory and swap usage." What must you do?', correct: 'Install the CloudWatch Agent (detailed monitoring does NOT add memory/swap)', explanation: 'Default CloudWatch: CPU, Network, EBS I/O. Missing: memory, swap, disk. Enabling detailed monitoring does NOT add these.' },
]

// ─── NUMBERS QUESTIONS ────────────────────────────────────────────────────────
const NUMBER_QS: QuizQ[] = [
  { id: 'n01', mode: 'numbers', question: 'S3 — maximum single object size', correct: '5 TB', explanation: 'Files >5 GB require Multipart Upload. Recommended to use Multipart for anything >100 MB.' },
  { id: 'n02', mode: 'numbers', question: 'Lambda — maximum execution timeout', correct: '15 minutes (900 seconds)', explanation: 'Any job longer than 15 min needs EC2, ECS, Batch, or Step Functions — not Lambda.' },
  { id: 'n03', mode: 'numbers', question: 'Lambda — maximum memory allocation', correct: '10,240 MB (10 GB)', explanation: 'Lambda CPU is proportional to memory. More memory = more CPU and faster execution.' },
  { id: 'n04', mode: 'numbers', question: 'SQS — maximum message size', correct: '256 KB', explanation: 'For larger payloads, store in S3 and send the S3 reference in the SQS message (Extended Client Library).' },
  { id: 'n05', mode: 'numbers', question: 'SQS — maximum message retention period', correct: '14 days', explanation: 'Default retention is 4 days. Maximum is 14 days. Messages are deleted after retention period expires.' },
  { id: 'n06', mode: 'numbers', question: 'SQS — maximum visibility timeout', correct: '12 hours', explanation: 'Set visibility timeout > your maximum processing time to avoid duplicate processing. Default is 30 seconds.' },
  { id: 'n07', mode: 'numbers', question: 'DynamoDB — maximum item size', correct: '400 KB', explanation: 'Items larger than 400 KB must be broken up or stored in S3 with a reference key in DynamoDB.' },
  { id: 'n08', mode: 'numbers', question: 'Aurora — maximum storage (auto-scales)', correct: '128 TB', explanation: 'Aurora storage auto-scales from 10 GB to 128 TB in 10 GB increments. No manual provisioning needed.' },
  { id: 'n09', mode: 'numbers', question: 'Aurora — maximum read replicas', correct: '15 read replicas', explanation: 'Standard RDS = 5 read replicas. Aurora = 15. All replicas share the same underlying storage cluster.' },
  { id: 'n10', mode: 'numbers', question: 'Aurora — typical failover time', correct: 'Under 30 seconds', explanation: 'Aurora promotes a read replica. Much faster than RDS Multi-AZ (1–2 minutes) due to shared storage.' },
  { id: 'n11', mode: 'numbers', question: 'RDS Multi-AZ — typical failover time', correct: '1–2 minutes', explanation: 'CNAME flips from primary to standby. Aurora (< 30 sec) is faster due to shared storage architecture.' },
  { id: 'n12', mode: 'numbers', question: 'VPC — allowed CIDR range (smallest to largest)', correct: '/16 (65,536 IPs) to /28 (16 IPs)', explanation: 'Smallest VPC = /28 (16 IPs, 11 usable). Largest = /16 (65,536 IPs). Cannot be changed after creation.' },
  { id: 'n13', mode: 'numbers', question: 'VPC — reserved IPs per subnet (how many are unusable?)', correct: '5 IPs (first 4 + last 1)', explanation: 'Network address, VPC router, DNS, future use, broadcast. A /24 subnet has 251 usable IPs (256 - 5).' },
  { id: 'n14', mode: 'numbers', question: 'EC2 Spot — interruption warning notice', correct: '2 minutes', explanation: 'AWS sends a 2-minute termination notice before reclaiming a Spot instance. Poll instance metadata to detect it.' },
  { id: 'n15', mode: 'numbers', question: 'EBS gp3 — baseline IOPS (no extra provisioning)', correct: '3,000 IOPS (scalable to 16,000)', explanation: 'gp3 baseline is 3,000 IOPS regardless of volume size. gp2 scales IOPS with size (3 IOPS/GB).' },
  { id: 'n16', mode: 'numbers', question: 'EBS io2 Block Express — maximum IOPS', correct: '256,000 IOPS', explanation: 'Highest performing EBS type. For mission-critical databases requiring extreme IOPS. Supports Multi-Attach.' },
  { id: 'n17', mode: 'numbers', question: 'CloudFront — default TTL (time to live)', correct: '24 hours (86,400 seconds)', explanation: 'After 24 hours, CloudFront checks origin for updated content. Override with Cache-Control headers.' },
  { id: 'n18', mode: 'numbers', question: 'Kinesis Data Streams — write throughput per shard', correct: '1 MB/s or 1,000 records/second', explanation: 'Each shard handles 1 MB/s or 1,000 rec/s write. For higher throughput, add more shards.' },
  { id: 'n19', mode: 'numbers', question: 'Kinesis Data Streams — default retention period', correct: '24 hours (extendable to 365 days)', explanation: 'Default is 24 hours. Extended retention (7 days) and long-term (365 days) are additional cost options.' },
  { id: 'n20', mode: 'numbers', question: 'API Gateway — maximum integration timeout', correct: '29 seconds', explanation: 'If backend takes >29 seconds, use async patterns (SQS + Lambda) or WebSocket API.' },
  { id: 'n21', mode: 'numbers', question: 'Step Functions Standard — maximum workflow duration', correct: '1 year', explanation: 'Standard = long-running, exactly-once, auditable. Express = up to 5 minutes, high-volume, at-least-once.' },
  { id: 'n22', mode: 'numbers', question: 'Auto Scaling — default cooldown period', correct: '300 seconds (5 minutes)', explanation: 'ASG waits 300s after a scaling activity before processing another trigger. Prevents over-scaling.' },
  { id: 'n23', mode: 'numbers', question: 'NLB — Elastic IP support', correct: 'Yes — one EIP per AZ (ALB does NOT support EIP)', explanation: 'NLB with EIP gives clients a static IP to whitelist. ALB IPs are always dynamic and DNS-based.' },
  { id: 'n24', mode: 'numbers', question: 'S3 — server-side encryption algorithm supported', correct: 'AES-256 only (AES-128 is NOT available)', explanation: 'All S3 SSE options use AES-256. Any exam answer mentioning AES-128 for S3 is always wrong.' },
  { id: 'n25', mode: 'numbers', question: 'EBS — replication scope (where does data get replicated?)', correct: 'Within the same AZ only — NOT cross-AZ or cross-region', explanation: 'EBS protects against hardware failure in the AZ. AZ outage = EBS at risk. Use snapshots for durability.' },
  { id: 'n26', mode: 'numbers', question: 'EBS Snapshots — where are they stored?', correct: 'Amazon S3 (multi-AZ, 11 nines durability)', explanation: 'Snapshots go to S3 automatically. They do NOT appear in your S3 console — AWS manages the bucket.' },
  { id: 'n27', mode: 'numbers', question: 'S3 Standard-IA — availability SLA', correct: '99.9% (vs 99.99% for S3 Standard)', explanation: 'Lower availability than Standard but same 11 nines durability. Minimum 30-day storage charge.' },
  { id: 'n28', mode: 'numbers', question: 'S3 — durability across all storage classes', correct: '99.999999999% (11 nines) — except One Zone-IA', explanation: 'All S3 classes (except One Zone-IA) replicate across 3+ AZs giving 11 nines durability.' },
  { id: 'n29', mode: 'numbers', question: 'CloudWatch Agent — what key metrics does it add?', correct: 'Memory, Swap, disk/filesystem utilization (OS-level metrics)', explanation: 'Default CloudWatch: CPU, Network, EBS ops. Agent adds: MemoryUtilization, SwapUtilization, per-disk I/O.' },
  { id: 'n30', mode: 'numbers', question: 'Route 53 health check — minimum check interval', correct: '10 seconds (standard is 30 seconds)', explanation: 'Fast health checks (10s) cost more. Standard (30s) is sufficient for most failover scenarios.' },
]

const ALL_QS: QuizQ[] = [...MATRIX_QS, ...TRAP_QS, ...NUMBER_QS]

// ─── MODE CONFIG ──────────────────────────────────────────────────────────────
const MODE_CONFIG = {
  matrix: { label: 'Decision Matrix', icon: '🎯', color: '#3b82f6', bg: '#eff6ff', qs: MATRIX_QS, desc: 'Scenario → pick the right AWS service' },
  traps:  { label: 'Exam Traps',      icon: '⚠️', color: '#ef4444', bg: '#fef2f2', qs: TRAP_QS,   desc: 'Spot the wrong answer before the exam does' },
  numbers: { label: 'Numbers & Facts', icon: '📊', color: '#8b5cf6', bg: '#f5f3ff', qs: NUMBER_QS, desc: 'Limits, defaults, and critical values' },
  all:    { label: 'Full Drill',      icon: '🔥', color: '#f59e0b', bg: '#fffbeb', qs: ALL_QS,   desc: 'All 115 questions — the ultimate session' },
}

const FREE_LIMIT = 5

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function QuickFire() {
  const { isPremium } = useAuth()
  const navigate = useNavigate()

  const [selectedMode, setSelectedMode] = useState<QuizMode>('matrix')
  const [phase, setPhase]               = useState<Phase>('setup')
  const [questions, setQuestions]       = useState<QuizQ[]>([])
  const [optionsMap, setOptionsMap]     = useState<Record<string, string[]>>({})
  const [currentIdx, setCurrentIdx]     = useState(0)
  const [selected, setSelected]         = useState<string | null>(null)
  const [score, setScore]               = useState(0)
  const [wrongIds, setWrongIds]         = useState<Set<string>>(new Set())
  const [wrongList, setWrongList]       = useState<QuizQ[]>([])
  const [retryingWrong, setRetryingWrong] = useState(false)

  const startQuiz = useCallback((mode: QuizMode, retryList?: QuizQ[]) => {
    const pool = retryList ?? shuffle(MODE_CONFIG[mode].qs)
    const limited = (!isPremium && !retryList) ? pool.slice(0, FREE_LIMIT) : pool
    const allPool = mode === 'all' ? ALL_QS : MODE_CONFIG[mode].qs
    const opts: Record<string, string[]> = {}
    limited.forEach(q => { opts[q.id] = getOptions(q, allPool) })
    setQuestions(limited)
    setOptionsMap(opts)
    setCurrentIdx(0)
    setSelected(null)
    setScore(0)
    setWrongIds(new Set())
    setWrongList([])
    setPhase('quiz')
  }, [isPremium])

  const handleSelect = useCallback((opt: string) => {
    if (selected !== null) return
    setSelected(opt)
    const q = questions[currentIdx]
    if (opt === q.correct) {
      setScore(s => s + 1)
    } else {
      setWrongIds(prev => new Set([...prev, q.id]))
      setWrongList(prev => [...prev, q])
    }
  }, [selected, questions, currentIdx])

  const handleNext = useCallback(() => {
    if (currentIdx + 1 >= questions.length) {
      setPhase('complete')
    } else {
      setCurrentIdx(i => i + 1)
      setSelected(null)
    }
  }, [currentIdx, questions.length])

  const handleRetryWrong = useCallback(() => {
    setRetryingWrong(true)
    startQuiz(selectedMode, shuffle(wrongList))
  }, [wrongList, selectedMode, startQuiz])

  const handleRestart = useCallback(() => {
    setRetryingWrong(false)
    setPhase('setup')
  }, [])

  // keyboard shortcuts
  useEffect(() => {
    if (phase !== 'quiz') return
    const handler = (e: KeyboardEvent) => {
      const opts = optionsMap[questions[currentIdx]?.id] ?? []
      if (e.key === '1' && opts[0]) handleSelect(opts[0])
      if (e.key === '2' && opts[1]) handleSelect(opts[1])
      if (e.key === '3' && opts[2]) handleSelect(opts[2])
      if (e.key === '4' && opts[3]) handleSelect(opts[3])
      if (e.key === 'Enter' && selected !== null) handleNext()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [phase, questions, currentIdx, optionsMap, selected, handleSelect, handleNext])

  const q = questions[currentIdx]
  const opts = q ? (optionsMap[q.id] ?? []) : []
  const pct = questions.length > 0 ? Math.round(((currentIdx + (selected ? 1 : 0)) / questions.length) * 100) : 0
  const scorePct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0

  // ── SETUP SCREEN ────────────────────────────────────────────────────────────
  if (phase === 'setup') {
    return (
      <Layout>
        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #1e40af 100%)', padding: '48px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>⚡</div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 900, color: '#fff', margin: '0 0 12px' }}>Quick Fire Drill</h1>
          <p style={{ color: '#bfdbfe', fontSize: '1.05rem', margin: '0 auto', maxWidth: '520px', lineHeight: 1.5 }}>
            Active recall training for SAA-C03. Pick a mode, answer fast, review what you miss.
          </p>
          {!isPremium && (
            <div style={{ display: 'inline-block', background: '#fef3c7', color: '#92400e', borderRadius: '20px', padding: '6px 16px', fontSize: '0.82rem', fontWeight: 700, marginTop: '16px' }}>
              ⚡ Free preview: 5 questions · Unlock all {ALL_QS.length} with Premium
            </div>
          )}
        </div>

        {/* Mode Cards */}
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
          <h2 style={{ textAlign: 'center', fontSize: '1.1rem', fontWeight: 700, color: '#374151', marginBottom: '24px' }}>Choose your drill mode</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            {(Object.keys(MODE_CONFIG) as QuizMode[]).map(m => {
              const cfg = MODE_CONFIG[m]
              const isSelected = selectedMode === m
              return (
                <button
                  key={m}
                  onClick={() => setSelectedMode(m)}
                  style={{
                    background: isSelected ? cfg.bg : '#fff',
                    border: `2px solid ${isSelected ? cfg.color : '#e5e7eb'}`,
                    borderRadius: '16px',
                    padding: '20px 16px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s',
                    boxShadow: isSelected ? `0 0 0 3px ${cfg.color}30` : '0 1px 3px rgba(0,0,0,0.08)',
                  }}
                >
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>{cfg.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: isSelected ? cfg.color : '#111827', marginBottom: '4px' }}>{cfg.label}</div>
                  <div style={{ fontSize: '0.78rem', color: '#6b7280', lineHeight: 1.4, marginBottom: '8px' }}>{cfg.desc}</div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: cfg.color }}>
                    {isPremium ? cfg.qs.length : Math.min(cfg.qs.length, FREE_LIMIT)} questions
                  </div>
                </button>
              )
            })}
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => startQuiz(selectedMode)}
              style={{
                background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
                color: '#fff',
                border: 'none',
                borderRadius: '14px',
                padding: '16px 48px',
                fontSize: '1.1rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(59,130,246,0.35)',
              }}
            >
              {MODE_CONFIG[selectedMode].icon} Start {MODE_CONFIG[selectedMode].label}
            </button>
            <p style={{ color: '#9ca3af', fontSize: '0.8rem', marginTop: '10px' }}>Tip: use keys 1–4 to answer, Enter to continue</p>
          </div>
        </div>
      </Layout>
    )
  }

  // ── COMPLETE SCREEN ──────────────────────────────────────────────────────────
  if (phase === 'complete') {
    const cfg = MODE_CONFIG[selectedMode]
    const grade = scorePct >= 90 ? { label: 'Excellent! 🏆', color: '#10b981' }
                : scorePct >= 75 ? { label: 'Good job! 👍', color: '#3b82f6' }
                : scorePct >= 60 ? { label: 'Getting there 📈', color: '#f59e0b' }
                : { label: 'Keep drilling 💪', color: '#ef4444' }

    return (
      <Layout>
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '48px 20px', textAlign: 'center' }}>

          {/* Score */}
          <div style={{ background: '#fff', border: '2px solid #e5e7eb', borderRadius: '24px', padding: '40px 32px', marginBottom: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: '56px', marginBottom: '12px' }}>
              {scorePct >= 90 ? '🏆' : scorePct >= 75 ? '🎯' : scorePct >= 60 ? '📈' : '💪'}
            </div>
            <div style={{ fontSize: '3rem', fontWeight: 900, color: grade.color, marginBottom: '4px' }}>{scorePct}%</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>{grade.label}</div>
            <div style={{ color: '#6b7280', fontSize: '0.95rem' }}>
              {score} correct out of {questions.length} · {retryingWrong ? 'Wrong answer retry' : cfg.label}
            </div>
          </div>

          {/* Wrong answers review */}
          {wrongList.length > 0 && (
            <div style={{ background: '#fef2f2', border: '2px solid #fecaca', borderRadius: '16px', padding: '20px', marginBottom: '24px', textAlign: 'left' }}>
              <div style={{ fontWeight: 800, color: '#dc2626', marginBottom: '12px', fontSize: '0.95rem' }}>
                ❌ {wrongList.length} missed — review these:
              </div>
              {wrongList.map(wq => (
                <div key={wq.id} style={{ borderTop: '1px solid #fecaca', paddingTop: '10px', marginTop: '10px' }}>
                  <div style={{ fontSize: '0.85rem', color: '#374151', fontWeight: 600, marginBottom: '3px' }}>{wq.question}</div>
                  <div style={{ fontSize: '0.82rem', color: '#16a34a', fontWeight: 700 }}>✅ {wq.correct}</div>
                  <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '2px' }}>{wq.explanation}</div>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {wrongList.length > 0 && (
              <button onClick={handleRetryWrong} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 24px', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem' }}>
                🔁 Retry {wrongList.length} missed
              </button>
            )}
            <button onClick={() => { setRetryingWrong(false); startQuiz(selectedMode) }} style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 24px', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem' }}>
              🔀 New shuffle
            </button>
            <button onClick={handleRestart} style={{ background: '#f3f4f6', color: '#374151', border: '2px solid #e5e7eb', borderRadius: '12px', padding: '12px 24px', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem' }}>
              🏠 Change mode
            </button>
          </div>

          {!isPremium && (
            <div style={{ marginTop: '24px', background: 'linear-gradient(135deg, #eff6ff, #f5f3ff)', border: '2px solid #bfdbfe', borderRadius: '16px', padding: '20px' }}>
              <div style={{ fontWeight: 800, color: '#1e40af', marginBottom: '6px' }}>🔓 Unlock all {ALL_QS.length} questions</div>
              <div style={{ color: '#6b7280', fontSize: '0.88rem', marginBottom: '12px' }}>You're on the free preview (5 questions). Go Premium for all drills, retry wrong answers, and full score tracking.</div>
              <button onClick={() => navigate('/pricing')} style={{ background: 'linear-gradient(135deg, #1e40af, #3b82f6)', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 24px', fontWeight: 700, cursor: 'pointer' }}>
                Upgrade to Premium →
              </button>
            </div>
          )}
        </div>
      </Layout>
    )
  }

  // ── QUIZ SCREEN ──────────────────────────────────────────────────────────────
  if (!q) return null
  const cfg = MODE_CONFIG[selectedMode]
  const isCorrect = selected === q.correct

  return (
    <Layout>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '24px 20px 48px' }}>

        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}40`, borderRadius: '20px', padding: '4px 12px', fontSize: '0.78rem', fontWeight: 700 }}>
              {cfg.icon} {cfg.label}
            </span>
            {retryingWrong && (
              <span style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '20px', padding: '4px 12px', fontSize: '0.78rem', fontWeight: 700 }}>
                🔁 Retry mode
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.88rem', color: '#6b7280', fontWeight: 600 }}>
              {currentIdx + 1} / {questions.length}
            </span>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#10b981' }}>
              ✅ {score}
            </span>
            {wrongIds.size > 0 && (
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ef4444' }}>
                ❌ {wrongIds.size}
              </span>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: '6px', background: '#e5e7eb', borderRadius: '99px', marginBottom: '24px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}99)`, borderRadius: '99px', transition: 'width 0.3s' }} />
        </div>

        {/* Question card */}
        <div style={{ background: '#fff', border: '2px solid #e5e7eb', borderRadius: '20px', padding: '28px', marginBottom: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: cfg.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
            {q.mode === 'matrix' ? '🎯 Which service?' : q.mode === 'traps' ? '⚠️ Spot the trap' : '📊 What is the value?'}
          </div>
          <div style={{ fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', fontWeight: 700, color: '#111827', lineHeight: 1.55 }}>
            {q.question}
          </div>
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {opts.map((opt, i) => {
            const isThis = selected === opt
            const isRight = opt === q.correct
            let bg = '#fff', border = '#e5e7eb', color = '#111827', shadow = ''
            if (selected !== null) {
              if (isRight) { bg = '#f0fdf4'; border = '#16a34a'; color = '#15803d'; shadow = '0 0 0 3px #bbf7d0' }
              else if (isThis && !isRight) { bg = '#fef2f2'; border = '#dc2626'; color = '#dc2626'; shadow = '0 0 0 3px #fecaca' }
              else { bg = '#f9fafb'; color = '#9ca3af' }
            }
            return (
              <button
                key={opt}
                onClick={() => handleSelect(opt)}
                style={{
                  background: bg, border: `2px solid ${border}`, borderRadius: '14px',
                  padding: '14px 18px', cursor: selected ? 'default' : 'pointer',
                  textAlign: 'left', display: 'flex', alignItems: 'flex-start', gap: '12px',
                  boxShadow: shadow, transition: 'all 0.15s', color,
                }}
              >
                <span style={{ minWidth: '24px', height: '24px', background: selected !== null ? 'transparent' : '#f3f4f6', border: selected !== null ? 'none' : '2px solid #d1d5db', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700, color: '#6b7280', flexShrink: 0 }}>
                  {selected !== null
                    ? (isRight ? '✅' : isThis ? '❌' : String(i + 1))
                    : String(i + 1)}
                </span>
                <span style={{ fontSize: '0.92rem', fontWeight: isThis || (selected && isRight) ? 700 : 500, lineHeight: 1.4 }}>{opt}</span>
              </button>
            )
          })}
        </div>

        {/* Feedback */}
        {selected !== null && (
          <div style={{
            background: isCorrect ? '#f0fdf4' : '#fef2f2',
            border: `2px solid ${isCorrect ? '#86efac' : '#fecaca'}`,
            borderRadius: '16px', padding: '16px 20px', marginBottom: '20px',
          }}>
            <div style={{ fontWeight: 800, color: isCorrect ? '#15803d' : '#dc2626', marginBottom: '6px', fontSize: '0.95rem' }}>
              {isCorrect ? '✅ Correct!' : `❌ Incorrect — correct answer: ${q.correct}`}
            </div>
            <div style={{ color: '#374151', fontSize: '0.88rem', lineHeight: 1.55 }}>{q.explanation}</div>
          </div>
        )}

        {/* Next button */}
        {selected !== null && (
          <button
            onClick={handleNext}
            style={{
              width: '100%', background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
              color: '#fff', border: 'none', borderRadius: '14px', padding: '16px',
              fontSize: '1rem', fontWeight: 800, cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(59,130,246,0.35)',
            }}
          >
            {currentIdx + 1 >= questions.length ? '🏁 See Results' : 'Next Question →'} <span style={{ opacity: 0.6, fontSize: '0.8rem' }}>(Enter)</span>
          </button>
        )}

        {/* Free upsell mid-quiz */}
        {!isPremium && currentIdx === FREE_LIMIT - 1 && selected !== null && (
          <div style={{ marginTop: '16px', background: '#fffbeb', border: '2px solid #fcd34d', borderRadius: '14px', padding: '16px', textAlign: 'center' }}>
            <div style={{ fontWeight: 800, color: '#92400e', marginBottom: '6px' }}>⚡ That's your 5 free questions</div>
            <div style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '10px' }}>Unlock all {ALL_QS.length} questions across all modes + retry wrong answers</div>
            <button onClick={() => navigate('/pricing')} style={{ background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '10px', padding: '8px 20px', fontWeight: 700, cursor: 'pointer' }}>
              Upgrade →
            </button>
          </div>
        )}
      </div>
    </Layout>
  )
}
