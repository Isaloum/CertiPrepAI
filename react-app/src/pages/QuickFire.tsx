/**
 * QuickFire.tsx — Active Recall Drill Mode
 * Flashcard-style quiz: Decision Matrix · Exam Traps · Numbers & Facts
 * isPremium gate — free users see 5-question preview then upsell
 */
import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../contexts/AuthContext'

type QuizMode = 'matrix' | 'traps' | 'numbers' | 'scenarios' | 'compare' | 'all'
type Phase = 'setup' | 'quiz' | 'complete'

interface QuizQ {
  id: string
  mode: 'matrix' | 'traps' | 'numbers' | 'scenarios' | 'compare'
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

function getOptions(q: QuizQ, allPool: QuizQ[]): string[] {
  const sameMode = allPool.filter(x => x.mode === q.mode && x.id !== q.id && x.correct !== q.correct)
  const crossMode = allPool.filter(x => x.mode !== q.mode && x.id !== q.id && x.correct !== q.correct)
  const sameUnique = [...new Set(sameMode.map(x => x.correct))]
  const shuffledSame = shuffle(sameUnique)
  const wrong = shuffledSame.length >= 3
    ? shuffledSame.slice(0, 3)
    : [...shuffledSame, ...shuffle([...new Set(crossMode.map(x => x.correct))]).slice(0, 3 - shuffledSame.length)]
  return shuffle([q.correct, ...wrong.slice(0, 3)])
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
  { id: 'm66', mode: 'matrix', question: 'Audit every API call made in your AWS account — who, what, when, from where', correct: 'AWS CloudTrail', explanation: 'CloudTrail records every API call with user identity, timestamp, source IP. Stored in S3. Required for compliance and forensics.' },
  { id: 'm67', mode: 'matrix', question: 'Automatically detect threats like cryptocurrency mining or compromised EC2 instances', correct: 'Amazon GuardDuty', explanation: 'Analyzes VPC Flow Logs, CloudTrail, DNS logs. Detects threats automatically. No agents to install. Regional service.' },
  { id: 'm68', mode: 'matrix', question: 'Scan EC2 instances for OS vulnerabilities, CVEs, and unpatched software', correct: 'Amazon Inspector', explanation: 'Automated vulnerability assessment. Finds unpatched software, open ports, CIS benchmark deviations. Agentless (v2).' },
  { id: 'm69', mode: 'matrix', question: 'Discover and classify sensitive data (PII, credit cards) stored across S3 buckets', correct: 'Amazon Macie', explanation: 'Uses ML to find PII, financial data, credentials in S3 buckets automatically. Generates findings and alerts.' },
  { id: 'm70', mode: 'matrix', question: 'Aggregate findings from GuardDuty, Inspector, and Macie into one security dashboard', correct: 'AWS Security Hub', explanation: 'Centralizes findings from multiple security services. Runs compliance checks against CIS, PCI DSS, NIST frameworks.' },
  { id: 'm71', mode: 'matrix', question: 'Enforce that no account in the organization can ever disable CloudTrail', correct: 'Service Control Policies (SCPs)', explanation: 'SCPs restrict what account administrators can do. Explicit Deny in SCP prevents any override, even by root.' },
  { id: 'm72', mode: 'matrix', question: 'Consolidated billing and volume discounts across 20+ AWS accounts', correct: 'AWS Organizations', explanation: 'Groups accounts under a management account for single bill. Shares RI and Savings Plan discounts across all member accounts.' },
  { id: 'm73', mode: 'matrix', question: 'Build, train, and deploy custom machine learning models at scale', correct: 'Amazon SageMaker', explanation: 'End-to-end ML platform. Managed Jupyter notebooks, distributed training, one-click model deployment. No ML infra to manage.' },
  { id: 'm74', mode: 'matrix', question: 'Convert text to lifelike speech for voice apps or accessibility features', correct: 'Amazon Polly', explanation: 'Pre-built TTS. 29 languages, neural voices. Pay per character synthesized. Use for IVR, audiobooks, accessibility.' },
  { id: 'm75', mode: 'matrix', question: 'Transcribe customer call recordings to text automatically', correct: 'Amazon Transcribe', explanation: 'Pre-built speech-to-text. Multiple languages, custom vocabularies, speaker identification, call analytics.' },
  { id: 'm76', mode: 'matrix', question: 'Graph database for social networks, recommendation engines, fraud detection', correct: 'Amazon Neptune', explanation: 'Managed graph DB. Gremlin (property graph) and SPARQL (RDF). Low-latency graph traversals across billions of relationships.' },
  { id: 'm77', mode: 'matrix', question: 'Time-series database for IoT sensor readings and DevOps metrics', correct: 'Amazon Timestream', explanation: 'Purpose-built for time-series. 1,000x faster and 1/10 cost of relational DBs for time-series. Auto-scales.' },
  { id: 'm78', mode: 'matrix', question: 'Petabyte-scale data warehouse for complex SQL analytics and BI reports', correct: 'Amazon Redshift', explanation: 'Columnar storage, massively parallel processing. Integrates with QuickSight, Tableau, S3. 10x faster than traditional DW.' },
  { id: 'm79', mode: 'matrix', question: 'Run Spark and Hadoop big data processing on managed clusters — terminate after job', correct: 'Amazon EMR', explanation: 'Managed Hadoop/Spark/Hive clusters. Launch, run, terminate — pay per use. Process data in S3 (S3-native storage).' },
  { id: 'm80', mode: 'matrix', question: 'Patch, inventory, and run commands on 1,000 EC2 instances without SSH', correct: 'AWS Systems Manager (SSM)', explanation: 'Patch Manager automates patching. Run Command executes scripts. Inventory collects metadata. No SSH or port 22 needed.' },
  { id: 'm81', mode: 'matrix', question: 'Send 10,000 transactional emails per day — password resets, notifications', correct: 'Amazon SES', explanation: 'High-volume email sending. DKIM, SPF, DMARC. Pay per email. Handles deliverability, bounce, and complaint management.' },
  { id: 'm82', mode: 'matrix', question: 'Push notifications to iOS and Android mobile devices at scale', correct: 'Amazon SNS Mobile Push', explanation: 'SNS integrates with APNs (Apple) and FCM (Google). One API to send to millions of mobile endpoints simultaneously.' },
  { id: 'm83', mode: 'matrix', question: 'Prevent any S3 bucket in your account from ever being made public', correct: 'S3 Block Public Access (account level)', explanation: 'Account-level setting overrides all individual bucket policies and ACLs. Prevents public access regardless of bucket config.' },
  { id: 'm84', mode: 'matrix', question: 'Ensure S3 objects cannot be deleted or overwritten for 7 years — even by root', correct: 'S3 Object Lock (Compliance mode)', explanation: 'WORM storage. Compliance mode: no user including root can delete until retention expires. Governance mode: admins can override.' },
  { id: 'm85', mode: 'matrix', question: 'Identify over-provisioned EC2 instances and get right-sizing recommendations', correct: 'AWS Compute Optimizer', explanation: 'Analyzes 14 days of CloudWatch metrics. Recommends optimal EC2, EBS, Lambda, ECS on Fargate configurations.' },
  { id: 'm86', mode: 'matrix', question: 'Set alerts when monthly AWS spending exceeds a specific dollar threshold', correct: 'AWS Budgets', explanation: 'Cost and usage budgets with email/SNS alerts. Can trigger automated actions (e.g., stop EC2 via Lambda) when threshold hit.' },
  { id: 'm87', mode: 'matrix', question: 'Automated CI/CD pipeline: code commit → build → test → deploy', correct: 'AWS CodePipeline', explanation: 'Orchestrates CodeCommit/GitHub → CodeBuild → CodeDeploy. Triggers on commits. Supports manual approval stages.' },
  { id: 'm88', mode: 'matrix', question: 'Store, manage, and scan Docker container images in a private registry', correct: 'Amazon ECR', explanation: 'Fully managed Docker/OCI registry. Integrates with ECS, EKS, CodeBuild. Vulnerability scanning on push.' },
  { id: 'm89', mode: 'matrix', question: 'Managed Kubernetes — run K8s without managing control plane', correct: 'Amazon EKS', explanation: 'AWS manages K8s control plane. Use when cloud-agnostic, existing K8s workloads, or team already knows Kubernetes.' },
  { id: 'm90', mode: 'matrix', question: 'Private REST API accessible ONLY from within your VPC — not the public internet', correct: 'API Gateway Private API + VPC Endpoint', explanation: 'Private API uses Interface VPC Endpoint (PrivateLink). Resource policy restricts access to the VPC. External clients cannot reach it.' },
  { id: 'm91', mode: 'matrix', question: 'Restrict premium video content — only paid subscribers can generate download links', correct: 'CloudFront Signed URLs', explanation: 'Application generates time-limited signed URLs after verifying subscription. CloudFront blocks unsigned requests.' },
  { id: 'm92', mode: 'matrix', question: 'Automatically replicate S3 bucket from us-east-1 to eu-west-1 for disaster recovery', correct: 'S3 Cross-Region Replication (CRR)', explanation: 'Async replication to another region. Requires versioning on both buckets. Can change storage class on replica.' },
  { id: 'm93', mode: 'matrix', question: 'EC2 instances need lowest possible network latency — HPC/MPI workloads', correct: 'Cluster Placement Group', explanation: 'Packs instances on same rack. 10 Gbps+ between instances. Risk: single rack failure. For HPC, big data, low latency.' },
  { id: 'm94', mode: 'matrix', question: 'Max fault isolation — each critical EC2 instance on separate physical hardware', correct: 'Spread Placement Group', explanation: 'Each instance on distinct hardware. Max 7 instances per AZ per placement group. For critical single instances.' },
  { id: 'm95', mode: 'matrix', question: 'Connect on-premises Microsoft Active Directory to AWS without full AD migration', correct: 'AWS Directory Service AD Connector', explanation: 'Proxy redirects auth requests to on-prem AD. No directory data stored in AWS. Use Managed AD for full AWS-native AD.' },
  { id: 'm96', mode: 'matrix', question: 'BI dashboards for non-technical business users — data is in Redshift or S3', correct: 'Amazon QuickSight', explanation: 'Serverless BI. Connects to Redshift, S3, RDS, Athena. SPICE in-memory engine. Pay per session. No SQL required for users.' },
  { id: 'm97', mode: 'matrix', question: 'Provision identical infrastructure across DEV, STAGING, PROD environments', correct: 'AWS CloudFormation', explanation: 'Infrastructure as Code (IaC). JSON/YAML templates. Drift detection. StackSets for multi-account/region deployments.' },
  { id: 'm98', mode: 'matrix', question: 'Automatically move S3 objects between storage tiers based on access patterns', correct: 'S3 Intelligent-Tiering', explanation: 'Monitors access frequency. Auto-moves between Frequent, Infrequent, Archive tiers. No retrieval fees. Ideal for unknown patterns.' },
  { id: 'm99', mode: 'matrix', question: 'Identify unused EC2, unattached EBS volumes, and idle load balancers', correct: 'AWS Trusted Advisor', explanation: 'Best practice checks across cost, security, performance, fault tolerance, service limits. Core checks free for all accounts.' },
  { id: 'm100', mode: 'matrix', question: 'Distributed tracing — follow a single request through 10 microservices to find bottleneck', correct: 'AWS X-Ray', explanation: 'End-to-end distributed tracing. Trace map shows all services a request touched. Identifies latency, errors, and throttles.' },
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
  { id: 't21', mode: 'traps', question: '"RDS Read Replica automatically becomes the primary when primary fails." Is this TRUE?', correct: 'FALSE — Read Replica promotion is MANUAL. Use Multi-AZ for automatic failover.', explanation: 'Read Replicas require manual promotion (you initiate it). Multi-AZ standby has automatic CNAME failover in 1-2 minutes.' },
  { id: 't22', mode: 'traps', question: '"Lambda scales automatically to any load." What is the DEFAULT limit?', correct: '1,000 concurrent executions per region (throttling occurs above this — must request increase)', explanation: 'Hitting 1,000 concurrent Lambdas causes 429 throttling errors. Request limit increase via Service Quotas for high-traffic apps.' },
  { id: 't23', mode: 'traps', question: '"SQS FIFO guarantees order and exactly-once delivery." What is the throughput limit?', correct: '300 TPS without batching (3,000 TPS with batch of 10 — NOT unlimited like SQS Standard)', explanation: 'SQS Standard = unlimited TPS. FIFO = 300 TPS (3,000 batched). Cannot use FIFO for extremely high-volume workloads.' },
  { id: 't24', mode: 'traps', question: '"Cognito User Pool grants IAM credentials to call AWS services." Is this TRUE?', correct: 'FALSE — User Pool = authentication/JWT only. Identity Pool (Federated Identities) provides IAM credentials via STS.', explanation: 'User Pool: sign-up, sign-in, JWT tokens. Identity Pool: exchanges JWT for temporary IAM credentials to call DynamoDB, S3, etc.' },
  { id: 't25', mode: 'traps', question: '"DynamoDB reads are strongly consistent by default." Is this TRUE?', correct: 'FALSE — DynamoDB reads are EVENTUALLY consistent by default (0.5 RCU). Strongly consistent = 1 RCU.', explanation: 'Specify ConsistentRead=true for strongly consistent reads. Costs 2x RCUs. Default = eventually consistent (cheaper).' },
  { id: 't26', mode: 'traps', question: '"Direct Connect provides a secure encrypted connection to AWS." Is this TRUE?', correct: 'FALSE — Direct Connect is private but NOT encrypted. Add MACsec or IPSec VPN over DX for encryption.', explanation: 'DX = dedicated fiber, consistent latency, NOT encrypted by default. Exam often pairs DX + VPN for private AND encrypted.' },
  { id: 't27', mode: 'traps', question: '"AWS KMS keys are global and work across all regions." Is this TRUE?', correct: 'FALSE — KMS keys are REGIONAL. A key in us-east-1 cannot decrypt data encrypted in eu-west-1.', explanation: 'For cross-region encryption, create a KMS key in each region. S3 CRR re-encrypts with the destination region key.' },
  { id: 't28', mode: 'traps', question: '"S3 Lifecycle can transition objects to Glacier on Day 1." Is this TRUE?', correct: 'FALSE — Minimum 30 days in S3 Standard before transitioning to Standard-IA or Glacier.', explanation: 'Standard → Standard-IA: min 30 days. Standard-IA → Glacier: min 30 days. Min storage duration charges apply per tier.' },
  { id: 't29', mode: 'traps', question: '"Enabling EC2 Detailed Monitoring adds memory and swap metrics." Is this TRUE?', correct: 'FALSE — Detailed monitoring only reduces collection interval to 1-minute. Memory/swap always require CloudWatch Agent.', explanation: 'Detailed monitoring: 1-min intervals for CPU/Network/EBS. Memory and swap are inside the OS — Agent required.' },
  { id: 't30', mode: 'traps', question: '"VPC Peering is transitive — A↔B and B↔C means A can reach C." Is this TRUE?', correct: 'FALSE — VPC peering is NOT transitive. A and C need their own direct peering connection.', explanation: 'For transitive routing across many VPCs use Transit Gateway. Peering is strictly point-to-point.' },
  { id: 't31', mode: 'traps', question: '"If both Allow and Deny IAM policies exist for an action, Allow wins." Is this TRUE?', correct: 'FALSE — Explicit Deny ALWAYS overrides Allow, regardless of other policies.', explanation: 'AWS evaluation: explicit Deny → explicit Allow → implicit Deny. An explicit Deny can never be overridden.' },
  { id: 't32', mode: 'traps', question: '"Auto Scaling default termination policy removes the NEWEST instance first." Is this TRUE?', correct: 'FALSE — Default policy targets the AZ with most instances, then terminates the instance with the OLDEST launch configuration.', explanation: 'Oldest LC/LT first. Customizable. AZ balancing is the first step, then the oldest config within that AZ.' },
  { id: 't33', mode: 'traps', question: '"Elastic IP addresses are free." Is this TRUE?', correct: 'FALSE — EIPs are charged when NOT attached to a running instance (~$0.005/hour when idle).', explanation: 'EIP is free only when attached to a running EC2. Charged if unattached, attached to stopped instance, or if you have multiple EIPs.' },
  { id: 't34', mode: 'traps', question: '"SQS Standard Queue delivers each message exactly once." Is this TRUE?', correct: 'FALSE — SQS Standard delivers at-least-once (duplicates possible). Use FIFO for exactly-once delivery.', explanation: 'Standard: at-least-once, best-effort order. Always design consumers to be idempotent when using Standard queues.' },
  { id: 't35', mode: 'traps', question: '"Lambda@Edge runs in the same AWS region as your Lambda function." Is this TRUE?', correct: 'FALSE — Lambda@Edge runs at CloudFront edge locations globally, nearest to the user.', explanation: 'Lambda@Edge is replicated to all CloudFront PoPs. Code runs in the PoP closest to viewer, not your home Lambda region.' },
  { id: 't36', mode: 'traps', question: '"RDS automated backups are kept after you delete the RDS instance." Is this TRUE?', correct: 'FALSE — Automated backups are DELETED when the instance is deleted. Manual snapshots are retained.', explanation: 'Take a final manual snapshot before deleting RDS. Automated backups have 0-35 day retention and are tied to the instance.' },
  { id: 't37', mode: 'traps', question: '"CloudWatch Logs and CloudTrail both record AWS API calls." Is this TRUE?', correct: 'FALSE — CloudTrail records AWS API calls. CloudWatch Logs records application/OS logs and service logs.', explanation: 'CloudTrail = governance audit (who called which API). CloudWatch Logs = application-level logs, Lambda logs, VPC Flow Logs.' },
  { id: 't38', mode: 'traps', question: '"An Internet Gateway is a single point of failure for VPC internet access." Is this TRUE?', correct: 'FALSE — IGW is horizontally scaled, redundant, and HA. It is NOT a single point of failure.', explanation: 'AWS manages IGW redundancy automatically. The bottleneck for internet access is NAT Gateway (one per AZ for HA).' },
  { id: 't39', mode: 'traps', question: '"AWS Shield Standard must be purchased and activated separately." Is this TRUE?', correct: 'FALSE — Shield Standard is FREE and automatically activated for ALL AWS customers.', explanation: 'Standard: free automatic L3/L4 DDoS protection. Shield Advanced: $3,000/month, 24/7 DRT access, financial protection.' },
  { id: 't40', mode: 'traps', question: '"S3 Glacier Instant Retrieval has the same retrieval speed as S3 Standard." Is this TRUE?', correct: 'FALSE — Instant Retrieval is milliseconds (same speed) but has 90-day minimum storage and higher retrieval fees than Standard.', explanation: 'Glacier Instant = ms retrieval but 90-day minimum duration charge and per-GB retrieval fee. Cheaper storage per GB than Standard.' },
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
  { id: 'n31', mode: 'numbers', question: 'Lambda — default concurrent execution limit per region', correct: '1,000 concurrent executions (soft limit — request increase for more)', explanation: 'Hitting this causes throttling. Reserved concurrency = allocate from pool. Provisioned concurrency = pre-warm for low latency.' },
  { id: 'n32', mode: 'numbers', question: 'Lambda — maximum deployment package size (zipped)', correct: '50 MB zipped / 250 MB unzipped (container images up to 10 GB)', explanation: 'For large dependencies use Lambda Layers (up to 250 MB each, max 5 layers). Or deploy as container image (10 GB).' },
  { id: 'n33', mode: 'numbers', question: 'SQS — default visibility timeout', correct: '30 seconds (max 12 hours)', explanation: 'Set > your processing time to avoid duplicate delivery. Lambda SQS triggers auto-extend visibility during processing.' },
  { id: 'n34', mode: 'numbers', question: 'SQS FIFO — maximum throughput without batching', correct: '300 TPS (3,000 TPS with batching of 10 messages)', explanation: 'Standard SQS = unlimited TPS. FIFO limit is why Standard is used for high-volume order-insensitive workloads.' },
  { id: 'n35', mode: 'numbers', question: 'DynamoDB — maximum Global Secondary Indexes per table', correct: '20 GSIs per table', explanation: 'GSIs can be added/removed after creation. Each has its own throughput. LSIs: max 5, defined at table creation only.' },
  { id: 'n36', mode: 'numbers', question: 'DynamoDB — RCU cost for strongly consistent read of a 4 KB item per second', correct: '1 RCU (eventually consistent = 0.5 RCU)', explanation: '1 RCU = 1 strongly consistent read/s up to 4 KB. Items >4 KB round up. Transactional reads cost 2 RCU.' },
  { id: 'n37', mode: 'numbers', question: 'DynamoDB — WCU cost to write a 3 KB item once per second', correct: '3 WCUs (1 WCU = 1 KB written per second, round up)', explanation: '1 WCU = write up to 1 KB per second. 3 KB = 3 WCUs. Transactional writes cost 2x (6 WCUs for a 3 KB item).' },
  { id: 'n38', mode: 'numbers', question: 'S3 Standard-IA — minimum storage duration charge', correct: '30 days (charged for 30 days even if deleted sooner)', explanation: 'If deleted before 30 days, charged for the remaining days. Glacier = 90 days minimum. Deep Archive = 180 days minimum.' },
  { id: 'n39', mode: 'numbers', question: 'S3 Glacier Flexible Retrieval — minimum storage duration', correct: '90 days', explanation: 'Objects deleted before 90 days charged for remainder. Deep Archive = 180 days minimum. Instant Retrieval = 90 days minimum.' },
  { id: 'n40', mode: 'numbers', question: 'S3 Glacier Deep Archive — minimum storage duration', correct: '180 days', explanation: 'Cheapest storage (~$0.00099/GB/month). 12-hour retrieval. 180-day minimum charge. For compliance data accessed once/year.' },
  { id: 'n41', mode: 'numbers', question: 'EBS — maximum single volume size (gp3 and io2)', correct: '16 TB', explanation: 'gp3 and io2 max at 16 TB. For larger: RAID 0 across multiple EBS volumes, or use S3, EFS, or FSx for Windows.' },
  { id: 'n42', mode: 'numbers', question: 'Reserved Instances — maximum discount vs On-Demand pricing', correct: 'Up to 72% (3-year, all upfront, Standard RI)', explanation: '1-year partial upfront ~40%. 3-year all upfront Standard RI = max 72%. Convertible RI = up to 66% (flexible instance family).' },
  { id: 'n43', mode: 'numbers', question: 'Spot Instances — maximum discount vs On-Demand pricing', correct: 'Up to 90% savings', explanation: 'Spot = unused EC2 capacity at variable price. 2-minute interruption notice. Best for fault-tolerant, stateless, batch workloads.' },
  { id: 'n44', mode: 'numbers', question: 'IAM — maximum managed policies attachable to a user, role, or group', correct: '10 managed policies', explanation: 'Inline policies count separately (no limit but not recommended). If hitting 10 limit, consolidate into fewer policies.' },
  { id: 'n45', mode: 'numbers', question: 'CloudFront — maximum number of origins per distribution', correct: '25 origins per distribution', explanation: 'One distribution can have up to 25 origins (S3, ALB, EC2, custom HTTP) with cache behaviors routing to each.' },
  { id: 'n46', mode: 'numbers', question: 'API Gateway — maximum integration timeout (cannot be increased)', correct: '29 seconds', explanation: 'Anything taking >29s must use async patterns: SQS queue for processing, or return 202 and client polls for result.' },
  { id: 'n47', mode: 'numbers', question: 'Step Functions Standard Workflow — maximum execution duration', correct: '1 year', explanation: 'Standard = long-running, exactly-once, full audit history, up to 1 year. Express = up to 5 minutes, high-volume, at-least-once.' },
  { id: 'n48', mode: 'numbers', question: 'Kinesis Data Firehose — buffer interval range (time-based delivery)', correct: '60 to 900 seconds', explanation: 'Firehose buffers data before delivery. Smaller interval = near real-time. Larger interval = fewer S3 PUT requests, lower cost.' },
  { id: 'n49', mode: 'numbers', question: 'RDS — maximum storage for standard engines (MySQL, PostgreSQL, Oracle)', correct: '64 TB (with Storage Auto Scaling)', explanation: 'Aurora auto-scales to 128 TB. Standard RDS engines max at 64 TB. Enable Storage Auto Scaling to avoid manual intervention.' },
  { id: 'n50', mode: 'numbers', question: 'DynamoDB Global Tables — replication latency between regions', correct: 'Under 1 second (sub-second RPO)', explanation: 'Global Tables active-active multi-region. Writes replicate in <1s. Suitable for globally distributed active-active applications.' },
  { id: 'n51', mode: 'numbers', question: 'VPC — maximum number of subnets per VPC (default)', correct: '200 subnets per VPC (can request increase)', explanation: '200 subnets default limit. Each subnet is in exactly one AZ. Can have up to 200 route tables per VPC by default.' },
  { id: 'n52', mode: 'numbers', question: 'CloudWatch — how long are standard (5-minute) metric data points retained?', correct: '63 days (1-min metrics: 15 days. 1-hour metrics: 455 days)', explanation: 'High-resolution 1-min data: 15 days. 5-min standard: 63 days. 1-hour: 455 days. Plan dashboards for metric retention.' },
  { id: 'n53', mode: 'numbers', question: 'Secrets Manager — cost per secret per month', correct: '~$0.40 per secret per month + $0.05 per 10,000 API calls', explanation: 'Cheaper alternative: SSM Parameter Store SecureString (free for standard tier parameters). Secrets Manager adds native rotation.' },
  { id: 'n54', mode: 'numbers', question: 'EC2 Spot — interruption notice before instance termination', correct: '2-minute termination notice via instance metadata', explanation: 'Poll http://169.254.169.254/latest/meta-data/spot/termination-time. Use to checkpoint state or drain connections.' },
  { id: 'n55', mode: 'numbers', question: 'DynamoDB — maximum number of Local Secondary Indexes per table', correct: '5 LSIs (must be defined at table creation — cannot add later)', explanation: 'LSIs share the table throughput (provisioned or on-demand). GSIs have their own throughput and can be added anytime.' },
  { id: 'n56', mode: 'numbers', question: 'CloudFront — number of edge locations (Points of Presence) worldwide', correct: '400+ PoPs in 90+ cities across 47 countries', explanation: 'CloudFront has 400+ edge locations + regional edge caches. Largest CDN network globally. Cache-Control headers control TTL.' },
  { id: 'n57', mode: 'numbers', question: 'Aurora Global Database — maximum secondary regions', correct: '5 secondary regions (replication < 1 second, cross-region failover < 1 minute)', explanation: 'Aurora Global: 1 primary + up to 5 read-only secondary regions. Promote secondary to primary in <1 minute for DR.' },
]

// ─── REAL EXAM SCENARIO QUESTIONS ─────────────────────────────────────────────
const SCENARIO_QS: QuizQ[] = [
  { id: 's01', mode: 'scenarios', question: 'A 3-tier web app needs its RDS database to automatically survive an AZ failure without manual intervention. RPO ≈ 0.', correct: 'RDS Multi-AZ deployment', explanation: 'Synchronous standby in another AZ. Automatic CNAME failover in 1-2 minutes. Zero data loss due to synchronous replication.' },
  { id: 's02', mode: 'scenarios', question: 'E-commerce site runs at 10% capacity for 11 months, then needs 10x capacity every Black Friday. Minimize cost while handling peak.', correct: 'Auto Scaling with scheduled scaling + Reserved Instances for baseline', explanation: 'Reserved Instances for predictable baseline (72% savings). Scheduled scaling triggers before Black Friday. ASG handles overflow.' },
  { id: 's03', mode: 'scenarios', question: 'Mobile app needs user registration, login with MFA, and "Sign in with Google." Backend must be fully managed with no servers.', correct: 'Amazon Cognito User Pool', explanation: 'User Pools: managed user directory, MFA, social IdP federation (Google, Facebook, Apple). Returns JWT. No backend code needed.' },
  { id: 's04', mode: 'scenarios', question: 'Financial company must retain ALL AWS API activity logs for 7 years. Logs must be immutable — even root cannot delete them.', correct: 'CloudTrail + S3 Object Lock (Compliance mode)', explanation: 'CloudTrail writes to S3. Compliance mode Object Lock: no one including root can delete until retention expires. True WORM.' },
  { id: 's05', mode: 'scenarios', question: 'Lambda throws "TooManyConnections" on RDS MySQL when scaling to 500 concurrent executions during traffic spikes.', correct: 'Add RDS Proxy to pool and reuse connections', explanation: 'RDS Proxy pools connections. 500 Lambda instances share a connection pool instead of opening 500 direct database connections.' },
  { id: 's06', mode: 'scenarios', question: 'Web app in us-east-1. Users in Southeast Asia report 5-second image load times. App code is fast — only static assets are slow.', correct: 'CloudFront with S3 origin for static assets', explanation: 'CloudFront caches images/videos at 400+ edge locations. Asia users get assets from Singapore PoP instead of Virginia.' },
  { id: 's07', mode: 'scenarios', question: 'Startup needs REST API with user auth, zero server management, and pay-per-request pricing. Budget is very limited.', correct: 'API Gateway + Lambda + Cognito User Pool', explanation: 'Fully serverless: API Gateway routes → Lambda processes → Cognito authenticates. Pay only when used. Zero idle costs.' },
  { id: 's08', mode: 'scenarios', question: 'IoT company sends 2 million sensor readings per second. Needs real-time anomaly detection and long-term storage in S3.', correct: 'Kinesis Data Streams → Lambda → Kinesis Firehose → S3', explanation: 'Streams: multiple consumers, replay. Lambda detects anomalies. Firehose buffers and delivers to S3. Classic streaming pipeline.' },
  { id: 's09', mode: 'scenarios', question: '500 TB of on-premises data needs to move to S3. Internet is 1 Gbps shared. Transfer would take ~45 days over internet.', correct: 'AWS Snowball Edge (offline migration)', explanation: 'Rule: if internet transfer >1 week → Snowball. Physical device ships out, loaded locally (80 TB/device), shipped back to AWS.' },
  { id: 's10', mode: 'scenarios', question: 'When an order is placed, inventory, billing, and shipping services must all process it independently without losing messages.', correct: 'SNS topic → fan-out to 3 SQS queues (one per service)', explanation: 'SNS fans out to multiple SQS queues simultaneously. Each service has its own queue and processes at its own rate.' },
  { id: 's11', mode: 'scenarios', question: 'DynamoDB queries take 8-12ms at peak. Application requires under 1ms latency. No application code changes allowed.', correct: 'DAX (DynamoDB Accelerator)', explanation: 'DAX is API-compatible — zero code changes. Microsecond read latency. Caches both item and query results.' },
  { id: 's12', mode: 'scenarios', question: 'VPC /24 has run out of IPv4 addresses. VPC CIDR cannot be changed. New EC2 instances cannot launch.', correct: 'Create new IPv6-only subnets for new instances', explanation: 'You cannot expand VPC CIDR after creation. IPv6 subnets sidestep IPv4 exhaustion. Egress-Only IGW for outbound-only access.' },
  { id: 's13', mode: 'scenarios', question: 'EC2 in private subnet needs to download OS patches from internet without being directly reachable from outside.', correct: 'NAT Gateway in public subnet + route in private subnet route table', explanation: 'NAT GW: allows outbound, blocks all inbound-initiated. Must be in public subnet. Route: private subnet → NAT GW → IGW.' },
  { id: 's14', mode: 'scenarios', question: 'Company wants Docker containers at scale with zero EC2 management, OS patching, or Kubernetes control plane to maintain.', correct: 'ECS or EKS with AWS Fargate', explanation: 'Fargate: AWS manages the underlying EC2 fleet. Specify CPU/memory per task. No node management, no cluster patching.' },
  { id: 's15', mode: 'scenarios', question: 'Order processing must handle messages in strict first-in-first-out order with no duplicates. Volume is 200 orders/second.', correct: 'SQS FIFO queue', explanation: 'FIFO guarantees order + exactly-once within a message group. 300 TPS limit (3,000 with batching). 200 TPS is within limits.' },
  { id: 's16', mode: 'scenarios', question: 'Global app in 3 regions. Users go to the fastest region. If one region goes down, traffic must redirect automatically.', correct: 'Route 53 Latency Routing + Health Checks', explanation: 'Latency routing sends users to lowest-latency region. Health checks detect failure and stop routing to that region.' },
  { id: 's17', mode: 'scenarios', question: 'Healthcare company stores patient data in thousands of S3 buckets. Need to automatically identify which buckets contain PII.', correct: 'Amazon Macie', explanation: 'Macie uses ML to automatically discover and classify sensitive data (SSNs, PHI, credit cards) across all S3 buckets.' },
  { id: 's18', mode: 'scenarios', question: '8 VPCs + 3 on-premises offices all need full connectivity. VPC peering requires 28 connections and is becoming unmanageable.', correct: 'AWS Transit Gateway', explanation: 'TGW = central hub. 8 VPCs + 3 on-prem = 11 TGW attachments (vs 28 peering connections). Supports transitive routing.' },
  { id: 's19', mode: 'scenarios', question: 'DynamoDB write operations fail with ProvisionedThroughputExceededException during flash sale events.', correct: 'Enable DynamoDB Auto Scaling or switch to On-Demand mode', explanation: 'Auto Scaling adjusts WCU based on CloudWatch utilization target. On-Demand mode handles any traffic level instantly.' },
  { id: 's20', mode: 'scenarios', question: 'Third-party auditor needs read-only AWS account access for compliance review. Sharing IAM user credentials is not allowed.', correct: 'IAM Cross-Account Role + sts:AssumeRole', explanation: 'Create Role in your account with Trust Policy allowing auditor account. Auditor calls sts:AssumeRole for temp credentials.' },
  { id: 's21', mode: 'scenarios', question: 'Premium video streaming — paying subscribers can stream, free users see paywall. Content stored in S3 behind CloudFront.', correct: 'CloudFront Signed URLs (time-limited per user)', explanation: 'App generates signed URLs after verifying subscription. Unsigned requests to CloudFront distribution are rejected.' },
  { id: 's22', mode: 'scenarios', question: 'Security team suspects EC2 instances are mining cryptocurrency. Need automated detection without installing any agents.', correct: 'Enable Amazon GuardDuty', explanation: 'GuardDuty analyzes VPC Flow Logs, CloudTrail, DNS. Detects CryptoCurrency:EC2/BitcoinTool.B findings automatically. No agent.' },
  { id: 's23', mode: 'scenarios', question: 'Gaming company runs UDP game servers on EC2. Players need a fixed IP. Server must handle millions of connections per second.', correct: 'Network Load Balancer with Elastic IP + EC2 backend', explanation: 'NLB: Layer 4, UDP support, static EIP per AZ, millions req/sec. ALB is HTTP/HTTPS only and has no static IP.' },
  { id: 's24', mode: 'scenarios', question: 'Lambda processes SQS messages. Certain malformed messages fail every time and keep blocking the queue. Must isolate them.', correct: 'SQS Dead Letter Queue (DLQ) with maxReceiveCount', explanation: 'After maxReceiveCount failures, message moves to DLQ. Stops poison-pill messages from blocking. Inspect DLQ for debugging.' },
  { id: 's25', mode: 'scenarios', question: 'Checkout orchestrates 8 microservices sequentially with error handling, retries, and parallel steps. Lambda alone cannot manage this.', correct: 'AWS Step Functions (Standard Workflow)', explanation: 'Step Functions: visual state machine with sequence, parallel, catch/retry, and choice branching. Exactly-once execution.' },
  { id: 's26', mode: 'scenarios', question: 'Developers store DB passwords in EC2 environment variables in plaintext. Security audit demands automatic rotation every 30 days.', correct: 'AWS Secrets Manager with automatic rotation', explanation: 'Secrets Manager: stores, encrypts, and auto-rotates RDS credentials. App fetches secret by name via SDK — never hard-coded.' },
  { id: 's27', mode: 'scenarios', question: 'Developers need SSH to EC2 for debugging. Security policy prohibits port 22 open or bastion hosts of any kind.', correct: 'AWS Systems Manager Session Manager', explanation: 'Session Manager: browser/CLI shell with no open inbound ports. Full CloudTrail audit trail. IAM-controlled access, not SSH keys.' },
  { id: 's28', mode: 'scenarios', question: 'Company runs genomics batch jobs processing 500 GB files for 4-6 hours. Must minimize cost — jobs can be restarted if interrupted.', correct: 'AWS Batch with Spot Instances + checkpointing', explanation: 'Batch manages job queues and EC2 provisioning. Spot saves 90% for fault-tolerant batch. Checkpoint to resume after interruption.' },
  { id: 's29', mode: 'scenarios', question: 'Web app in VPC writes to S3 frequently. Traffic must not leave AWS network. NAT Gateway data transfer costs are too high.', correct: 'S3 Gateway VPC Endpoint (free)', explanation: 'Gateway endpoints for S3 and DynamoDB are free. Traffic stays on AWS private network. No NAT Gateway charges for S3 traffic.' },
  { id: 's30', mode: 'scenarios', question: 'Multi-account org. Security must ensure NO account can EVER disable CloudTrail — even account administrators.', correct: 'AWS Organizations SCP denying cloudtrail:StopLogging and cloudtrail:DeleteTrail', explanation: 'SCPs apply to all principals in member accounts. Even account admins cannot perform SCP-denied actions. Apply to entire org.' },
  { id: 's31', mode: 'scenarios', question: 'Company migrates Oracle DB to Aurora PostgreSQL. Schema has Oracle-specific SQL. Need minimum downtime during cutover.', correct: 'AWS Schema Conversion Tool (SCT) + AWS DMS continuous replication', explanation: 'SCT converts schema. DMS replicates continuously with CDC (change data capture). Cut over when target is fully in sync.' },
  { id: 's32', mode: 'scenarios', question: 'App sends 10,000 password-reset emails and 50,000 marketing emails daily. Current SMTP server is unreliable.', correct: 'Amazon SES (Simple Email Service)', explanation: 'SES: high-volume sending, DKIM/SPF/DMARC, bounce/complaint handling, dedicated IPs for reputation. Pay per email.' },
  { id: 's33', mode: 'scenarios', question: 'Multi-tenant SaaS — each of 1,000 customers must only read/write their own DynamoDB items. No separate tables per customer.', correct: 'IAM policy with DynamoDB LeadingKeys condition key', explanation: 'Condition: dynamodb:LeadingKeys restricts access to partition key matching the user ID from the Cognito JWT. Row-level security.' },
  { id: 's34', mode: 'scenarios', question: 'S3 image upload service must automatically generate thumbnails per upload. No polling. No servers. Scales automatically.', correct: 'S3 Event Notification → Lambda function', explanation: 'S3 fires ObjectCreated event. Lambda invoked automatically with the key. Serverless, no polling, scales per upload.' },
  { id: 's35', mode: 'scenarios', question: '200 EC2 instances across 5 regions. Need centralized patch compliance reporting and automated patching windows.', correct: 'AWS Systems Manager Patch Manager', explanation: 'Define patch baselines and maintenance windows. Scan and install patches across all regions. Patch compliance in console.' },
  { id: 's36', mode: 'scenarios', question: 'Global app needs database replication to secondary regions in <1 second RPO and <1 minute RTO for cross-region failover.', correct: 'Aurora Global Database', explanation: 'Physical replication <1s to up to 5 secondary regions. Promote secondary to primary in <1 minute for RPO/RTO targets.' },
  { id: 's37', mode: 'scenarios', question: 'Legacy app uses a CNAME hostname hardcoded to connect to DB. The hostname must automatically redirect when primary DB fails.', correct: 'RDS Multi-AZ (single CNAME endpoint auto-flips to standby on failover)', explanation: 'RDS Multi-AZ uses a single endpoint. CNAME automatically points to standby after failover. Zero application configuration changes.' },
  { id: 's38', mode: 'scenarios', question: 'Company suspects overpaying for EC2. Many instances run at 10-20% CPU utilization. Need specific right-sizing recommendations.', correct: 'AWS Compute Optimizer', explanation: 'Analyzes 14 days of CloudWatch metrics. Recommends optimal EC2 instance type, EBS, Lambda memory, ECS on Fargate sizing.' },
  { id: 's39', mode: 'scenarios', question: 'BI team needs dashboards on Redshift sales data. Business users have no SQL knowledge. Dashboards must be shareable.', correct: 'Amazon QuickSight', explanation: 'Serverless BI — connects to Redshift/S3/Athena. SPICE in-memory engine. Share dashboards with groups. No SQL needed.' },
  { id: 's40', mode: 'scenarios', question: 'Security team needs to find out who deleted a production S3 bucket 3 days ago and from which IP address.', correct: 'Query CloudTrail logs in S3 using Amazon Athena', explanation: 'CloudTrail stores API calls in S3 as JSON. Athena queries: SELECT * WHERE eventName=DeleteBucket AND eventTime>3 days ago.' },
  { id: 's41', mode: 'scenarios', question: 'Users upload 50 GB video files to S3. Uploads frequently fail at 40 GB due to network instability.', correct: 'S3 Multipart Upload + lifecycle rule to abort incomplete uploads', explanation: 'Multipart: upload in parallel parts, retry only failed parts. Lifecycle rule cleans up incomplete uploads to prevent excess storage charges.' },
  { id: 's42', mode: 'scenarios', question: 'App calls an external API taking 45 seconds. API Gateway has a 29-second timeout. Users currently get 504 errors.', correct: 'Async pattern: SQS → Lambda processes in background → client polls for result', explanation: 'Return 202 Accepted immediately → SQS job → Lambda calls slow API → stores result → client polls. Never await >29s in API Gateway.' },
  { id: 's43', mode: 'scenarios', question: 'Need to provision 100 developer AWS accounts in 2 days with SCPs, security guardrails, and consolidated billing pre-configured.', correct: 'AWS Control Tower + Account Factory', explanation: 'Control Tower automates multi-account landing zone. Account Factory vends new accounts with guardrails pre-applied. Done in hours.' },
  { id: 's44', mode: 'scenarios', question: 'Web app serves different content to EU vs US users for GDPR. EU users must never receive US-origin content.', correct: 'Route 53 Geolocation Routing (strict country-based routing)', explanation: 'Geolocation strictly routes by country/continent. EU → EU servers. Must have Default record for unmatched locations.' },
  { id: 's45', mode: 'scenarios', question: 'ElastiCache Redis cluster loses all data when the primary node fails. Need auto-failover with data preserved.', correct: 'ElastiCache Redis Replication Group with Multi-AZ and automatic failover', explanation: 'Replication group: primary + replicas. Multi-AZ auto-promotes a replica in seconds. AOF persistence preserves data on restart.' },
  { id: 's46', mode: 'scenarios', question: 'Lambda needs to query RDS in private VPC AND call an external HTTPS API on the public internet.', correct: 'Lambda VPC configuration (private subnet) + NAT Gateway in public subnet', explanation: 'Lambda in VPC: reaches private RDS. For internet from VPC Lambda: route → NAT Gateway in public subnet → Internet Gateway.' },
  { id: 's47', mode: 'scenarios', question: 'Team needs to trace a single request flowing through 10 microservices to identify which service is causing latency.', correct: 'AWS X-Ray distributed tracing', explanation: 'X-Ray: end-to-end trace maps across Lambda, API Gateway, EC2, DynamoDB. Shows each service latency, errors, throttles.' },
  { id: 's48', mode: 'scenarios', question: 'Common internal auth microservice in VPC-A must be shared with 20 other VPCs privately without peering or public exposure.', correct: 'VPC PrivateLink (endpoint service in VPC-A, interface endpoints in consumer VPCs)', explanation: 'PrivateLink: provider creates endpoint service. 20 VPCs create interface endpoints. Traffic stays private. No peering or TGW.' },
  { id: 's49', mode: 'scenarios', question: 'SQS messages fail processing 3 times then must be isolated for manual review without blocking the main queue.', correct: 'SQS Dead Letter Queue with maxReceiveCount=3', explanation: 'After 3 failures, message moves to DLQ automatically. Monitor DLQ depth with CloudWatch alarm for alerting ops team.' },
  { id: 's50', mode: 'scenarios', question: 'HPC simulation cluster needs EC2 nodes to communicate at 100 Gbps with the lowest possible MPI network latency.', correct: 'Cluster Placement Group + Elastic Fabric Adapter (EFA)', explanation: 'Cluster Placement Group: same rack/AZ for lowest latency. EFA: OS-bypass networking for HPC/MPI. 100 Gbps between instances.' },
]

// ─── SERVICE COMPARISON QUESTIONS ─────────────────────────────────────────────
const COMPARE_QS: QuizQ[] = [
  { id: 'c01', mode: 'compare', question: 'RDS Multi-AZ vs Read Replicas — you need AUTOMATIC FAILOVER when the primary database fails.', correct: 'RDS Multi-AZ (auto CNAME failover in 1-2 min — Read Replica promotion is manual)', explanation: 'Multi-AZ = HA/failover. Standby is NOT readable. Read Replicas = read scaling, manual promotion only. Never use RR for HA.' },
  { id: 'c02', mode: 'compare', question: 'SQS vs SNS — one order event must trigger inventory, billing, AND shipping services simultaneously.', correct: 'SNS fan-out → multiple SQS queues (SNS pushes to all subscribers simultaneously)', explanation: 'SQS alone = one consumer per message. SNS = push to many. Fan-out: SNS → multiple SQS queues, one per service.' },
  { id: 'c03', mode: 'compare', question: 'CloudFront vs Global Accelerator — clients need a static IP to whitelist for global TCP/UDP access.', correct: 'AWS Global Accelerator (2 static Anycast IPs, TCP/UDP — CloudFront has dynamic IPs, HTTP only)', explanation: 'CloudFront: dynamic IPs, HTTP/HTTPS CDN. Global Accelerator: 2 static IPs, TCP/UDP, routes over AWS backbone, no caching.' },
  { id: 'c04', mode: 'compare', question: 'Security Groups vs NACLs — you must EXPLICITLY BLOCK traffic from a specific IP range.', correct: 'Network ACL (NACLs support explicit Deny — Security Groups have only allow rules)', explanation: 'Security Groups: allow-only rules, stateful. NACLs: explicit allow AND deny, stateless, processed in numeric order.' },
  { id: 'c05', mode: 'compare', question: 'ElastiCache Redis vs Memcached — you need sorted leaderboards, pub/sub messaging, AND Multi-AZ replication.', correct: 'ElastiCache Redis (sorted sets, pub/sub, persistence, replication — Memcached has none of these)', explanation: 'Memcached: simple multi-threaded cache only. Redis: data structures, persistence (RDB/AOF), replication, pub/sub, Lua scripting.' },
  { id: 'c06', mode: 'compare', question: 'EBS vs EFS — 50 EC2 instances across multiple AZs need simultaneous read/write to a shared file system.', correct: 'Amazon EFS (NFS shared filesystem, multi-AZ, unlimited concurrent connections)', explanation: 'EBS: single EC2 attachment. EFS: NFS protocol, thousands of concurrent connections across multiple AZs, auto-scales.' },
  { id: 'c07', mode: 'compare', question: 'Secrets Manager vs SSM Parameter Store — need FREE storage for DB connection strings with NO automatic rotation.', correct: 'SSM Parameter Store Standard (free — Secrets Manager costs $0.40/secret/month)', explanation: 'Parameter Store Standard: free up to 10,000 params. SecureString for encryption. Secrets Manager: paid, native rotation.' },
  { id: 'c08', mode: 'compare', question: 'DynamoDB vs RDS — application needs complex SQL JOINs across multiple tables with foreign key constraints.', correct: 'Amazon RDS (relational DB — DynamoDB is NoSQL with no JOINs or foreign keys)', explanation: 'DynamoDB: NoSQL, single-table design, no JOINs. RDS: SQL, JOINs, complex queries, ACID transactions, referential integrity.' },
  { id: 'c09', mode: 'compare', question: 'Kinesis Data Streams vs Firehose — multiple independent apps need to consume and replay the same stream.', correct: 'Kinesis Data Streams (multiple consumers, replay — Firehose has no custom consumers or replay)', explanation: 'Streams: custom consumers (Lambda, KCL), replay within retention period. Firehose: managed delivery to S3/Redshift only.' },
  { id: 'c10', mode: 'compare', question: 'Route 53 Geolocation vs Geoproximity — German users MUST by compliance law always go to Frankfurt. No exceptions.', correct: 'Route 53 Geolocation (strict by country — Geoproximity is bias-based, users can cross borders)', explanation: 'Geolocation: strict country/continent routing for compliance. Geoproximity: expands/shrinks coverage areas, not compliance-grade.' },
  { id: 'c11', mode: 'compare', question: 'Direct Connect vs Site-to-Site VPN — need consistent 10 Gbps throughput with predictable latency for real-time trading.', correct: 'AWS Direct Connect (dedicated fiber, consistent latency — VPN over internet has variable latency, max 1.25 Gbps)', explanation: 'Direct Connect: dedicated 1/10/100 Gbps private circuit, <5ms consistent latency. VPN: shared internet, variable, encrypted.' },
  { id: 'c12', mode: 'compare', question: 'On-Demand vs Reserved vs Spot — fault-tolerant genomics batch pipeline. Can be interrupted. Minimize cost.', correct: 'EC2 Spot Instances (up to 90% savings — fault-tolerant interruptible batch is the primary Spot use case)', explanation: 'Spot = unused EC2 capacity, 90% savings, 2-min interruption warning. Perfect for fault-tolerant batch workloads.' },
  { id: 'c13', mode: 'compare', question: 'ALB vs NLB — route /api/* to one target group and /static/* to another based on URL path.', correct: 'Application Load Balancer (Layer 7 path-based routing — NLB is Layer 4, no URL awareness)', explanation: 'ALB: path-based, host-based, header-based routing, WebSocket, gRPC. NLB: TCP/UDP Layer 4 only, no URL path routing.' },
  { id: 'c14', mode: 'compare', question: 'S3 Standard vs Standard-IA vs Intelligent-Tiering — objects accessed frequently for 2 months then rarely. Pattern is predictable.', correct: 'S3 Lifecycle policy: Standard for 60 days → transition to Standard-IA (predictable = Lifecycle, not Intelligent-Tiering)', explanation: 'Known pattern → Lifecycle policy is cheaper. Intelligent-Tiering charges per-object monitoring fee. Use IT for unknown patterns.' },
  { id: 'c15', mode: 'compare', question: 'CloudTrail vs CloudWatch — which tells you EXACTLY which IAM user deleted a production database at 2am?', correct: 'AWS CloudTrail (API audit: who/what/when/source IP — CloudWatch monitors metrics and performance)', explanation: 'CloudTrail = governance audit log. CloudWatch = operational monitoring (CPU, memory, custom metrics, alarms, log aggregation).' },
  { id: 'c16', mode: 'compare', question: 'Aurora vs RDS MySQL — you need 15 read replicas and storage auto-scaling from 10 GB to 64 TB.', correct: 'Amazon Aurora (auto-scales to 128 TB, 15 read replicas — RDS MySQL max 5 replicas, 64 TB)', explanation: 'Aurora: cloud-native, shared storage cluster, 15 replicas, 5x faster. RDS MySQL: standard, max 5 replicas, manual storage scaling.' },
  { id: 'c17', mode: 'compare', question: 'ECS vs EKS — company has existing Kubernetes workloads on-premises and wants to move to AWS with minimal changes.', correct: 'Amazon EKS (standard Kubernetes — ECS is AWS-proprietary, requires rewriting K8s configs)', explanation: 'EKS: runs standard K8s. Existing kubectl, Helm, YAML configs work as-is. ECS: AWS task definitions, not K8s compatible.' },
  { id: 'c18', mode: 'compare', question: 'Lambda vs Fargate — run a container that processes a 2-hour video encoding job requiring 60 GB memory.', correct: 'AWS Fargate (no timeout limit — Lambda max 15 min timeout and 10 GB memory)', explanation: 'Lambda: max 15 min, max 10 GB memory. Fargate: no timeout limit, configurable CPU/memory. Perfect for long batch container jobs.' },
  { id: 'c19', mode: 'compare', question: 'S3 CRR vs SRR — copy production logs to a separate security account in the same AWS region for isolation.', correct: 'S3 Same-Region Replication (SRR) — CRR is for cross-region, SRR is for same-region different account', explanation: 'SRR: same region, different bucket or account. Log aggregation, dev/test copies, same-region compliance. CRR: different region.' },
  { id: 'c20', mode: 'compare', question: 'SQS Standard vs FIFO — process financial transactions where each must be processed exactly once in submission order.', correct: 'SQS FIFO (exactly-once, strict order — Standard is at-least-once with best-effort ordering)', explanation: 'Standard: unlimited TPS, at-least-once (duplicates possible). FIFO: 300 TPS, exactly-once, guaranteed FIFO order.' },
  { id: 'c21', mode: 'compare', question: 'VPC Peering vs Transit Gateway — 15 VPCs all need to communicate with each other (full mesh required).', correct: 'AWS Transit Gateway (hub-and-spoke — peering would need 105 connections: 15×14÷2)', explanation: 'N×(N-1)/2 = 105 peering connections for 15 VPCs. TGW = 15 attachments, transitive routing, centralized management.' },
  { id: 'c22', mode: 'compare', question: 'Shield Standard vs Shield Advanced — need 24/7 DDoS response team and financial protection against attack-driven AWS cost spikes.', correct: 'AWS Shield Advanced ($3,000/month — Standard is free but has no DRT or financial protection)', explanation: 'Standard: free, automatic L3/L4. Advanced: $3,000/mo, 24/7 DRT team, L7 protection, credits for attack-related costs.' },
  { id: 'c23', mode: 'compare', question: 'GuardDuty vs Inspector vs Macie — find unpatched CVEs and OS vulnerabilities on your EC2 instances.', correct: 'Amazon Inspector (vulnerability assessment — GuardDuty detects threats, Macie finds PII in S3)', explanation: 'Inspector: scans for CVEs, CIS benchmarks, network exposure. GuardDuty: active threat detection. Macie: sensitive data in S3.' },
  { id: 'c24', mode: 'compare', question: 'Cluster vs Spread vs Partition Placement Groups — 50-node Cassandra cluster needs isolation across separate hardware racks.', correct: 'Partition Placement Group (nodes isolated to separate partitions/racks — Spread limited to 7 per AZ)', explanation: 'Partition: large distributed systems (Cassandra, Kafka, HDFS), up to 7 partitions per AZ. Spread: only 7 instances per AZ total.' },
  { id: 'c25', mode: 'compare', question: 'Snowball vs DataSync — sync 5 TB of new data nightly from on-premises NAS to S3 over existing 1 Gbps connection.', correct: 'AWS DataSync (online scheduled sync — Snowball is offline for large one-time migration)', explanation: 'DataSync: online agent-based, scheduled, incremental. Snowball: offline physical appliance for large one-time data migrations.' },
  { id: 'c26', mode: 'compare', question: 'API Gateway REST API vs HTTP API — need lowest cost and latency for a simple Lambda proxy with JWT auth only.', correct: 'API Gateway HTTP API (up to 70% cheaper and lower latency — REST API has more features but higher cost)', explanation: 'HTTP API: simple, cheap, JWT/OIDC, Lambda proxy. REST API: API keys, usage plans, caching, request validation, WAF.' },
  { id: 'c27', mode: 'compare', question: 'Cognito User Pools vs Identity Pools — mobile app needs to call DynamoDB directly with user-specific IAM permissions.', correct: 'Cognito Identity Pool (exchanges JWT for temporary IAM credentials — User Pools only return JWT tokens)', explanation: 'Identity Pool: federates identity into IAM role. Mobile app gets temp AWS credentials. User Pool: authentication/JWT only.' },
  { id: 'c28', mode: 'compare', question: 'S3 Glacier Instant vs Flexible vs Deep Archive — data accessed once per year. Cost is top priority. 12-hour retrieval is OK.', correct: 'S3 Glacier Deep Archive (~$0.00099/GB/month — cheapest storage on AWS, 12-hour retrieval)', explanation: 'Deep Archive: cheapest, 12+ hour retrieval, 180-day minimum. Instant: ms retrieval but 4x more expensive per GB.' },
  { id: 'c29', mode: 'compare', question: 'WAF vs Shield — attackers send SQL injection and XSS payloads through your ALB to compromise the application.', correct: 'AWS WAF (Layer 7 rules for SQL injection/XSS — Shield protects against DDoS/volumetric, not injection attacks)', explanation: 'WAF: L7 app firewall, custom rules, injection/XSS/rate limiting. Shield: DDoS at L3/L4. Shield Advanced adds L7 DDoS.' },
  { id: 'c30', mode: 'compare', question: 'S3 Event Notifications vs EventBridge — route S3 events to 5 different targets with content-based attribute filtering.', correct: 'Amazon EventBridge (advanced filtering, multiple rules/targets — S3 Events go to one destination per event type)', explanation: 'S3 Events: simple, one Lambda/SQS/SNS per event type. EventBridge: rich filtering, multiple rules, event archive, replay.' },
]

const ALL_QS: QuizQ[] = [...MATRIX_QS, ...TRAP_QS, ...NUMBER_QS, ...SCENARIO_QS, ...COMPARE_QS]

// ─── MODE CONFIG ──────────────────────────────────────────────────────────────
const MODE_CONFIG = {
  matrix:    { label: 'Decision Matrix',     icon: '🎯', color: '#3b82f6', bg: '#eff6ff', qs: MATRIX_QS,   desc: 'Scenario → pick the right AWS service (100 questions)' },
  traps:     { label: 'Exam Traps',          icon: '⚠️', color: '#ef4444', bg: '#fef2f2', qs: TRAP_QS,     desc: 'Spot the wrong answer before the exam does (40 questions)' },
  numbers:   { label: 'Numbers & Facts',     icon: '📊', color: '#8b5cf6', bg: '#f5f3ff', qs: NUMBER_QS,   desc: 'Limits, defaults, and critical values (57 questions)' },
  scenarios: { label: 'Real Exam Scenarios', icon: '🏗️', color: '#059669', bg: '#ecfdf5', qs: SCENARIO_QS, desc: 'Multi-step architecture questions like the real exam (50 questions)' },
  compare:   { label: 'Service Comparisons', icon: '⚖️', color: '#d97706', bg: '#fffbeb', qs: COMPARE_QS,  desc: 'X vs Y — know exactly when to use which service (30 questions)' },
  all:       { label: 'Full Drill',          icon: '🔥', color: '#dc2626', bg: '#fff1f2', qs: ALL_QS,      desc: 'All 277 questions across 5 modes — the ultimate session' },
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
    const opts: Record<string, string[]> = {}
    limited.forEach(q => { opts[q.id] = getOptions(q, ALL_QS) })
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
            Active recall training for SAA-C03 · 277 questions · 6 drill modes. Pick a mode, answer fast, review what you miss.
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
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
            <button
              onClick={handleRestart}
              title="Exit to mode selection"
              style={{
                background: 'transparent', border: '1.5px solid #e5e7eb', borderRadius: '8px',
                padding: '4px 10px', fontSize: '0.78rem', fontWeight: 700, color: '#6b7280',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#ef4444'; (e.currentTarget as HTMLButtonElement).style.color = '#ef4444' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#e5e7eb'; (e.currentTarget as HTMLButtonElement).style.color = '#6b7280' }}
            >
              ✕ Exit
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: '6px', background: '#e5e7eb', borderRadius: '99px', marginBottom: '24px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}99)`, borderRadius: '99px', transition: 'width 0.3s' }} />
        </div>

        {/* Question card */}
        <div style={{ background: '#fff', border: '2px solid #e5e7eb', borderRadius: '20px', padding: '28px', marginBottom: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: cfg.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
            {q.mode === 'matrix' ? '🎯 Which service?' : q.mode === 'traps' ? '⚠️ Spot the trap' : q.mode === 'numbers' ? '📊 What is the value?' : q.mode === 'scenarios' ? '🏗️ Best architecture?' : '⚖️ Which fits better?'}
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
