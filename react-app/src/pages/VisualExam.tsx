import { useState, useRef, useEffect } from 'react'
import Layout from '../components/Layout'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// ── Types ────────────────────────────────────────────────────────────────────
type DNode   = { id: string; label: string; icon: string; color: string; x: number; y: number }
type ConnKey = string   // "a:b" — always sorted alphabetically for uniqueness

interface Question {
  id:       number
  scenario: string
  task:     string
  hint:     string
  nodes:    DNode[]
  correct:  ConnKey[]
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const ck = (a: string, b: string): ConnKey => [a, b].sort().join(':')

// ── Question Bank ────────────────────────────────────────────────────────────
const QUESTIONS: Question[] = [
  {
    id: 1,
    scenario: 'GlobalShop, an e-commerce platform with 8 million active users, suffers complete outages every Black Friday when traffic spikes 10× and their single EC2 instance in one AZ gets overwhelmed. Last year\'s 4-hour outage cost $2.4M in lost sales. The CTO mandates a redesign: traffic must be distributed across two Availability Zones, EC2 instances must scale out automatically when CPU exceeds 70%, scale in during off-peak hours to cut costs, and the app must remain online even if an entire AZ goes down.',
    task: 'Map the high-availability architecture — connect traffic from users through the load balancer to auto-scaled EC2 instances in both AZs, and show how Auto Scaling Group manages them.',
    hint: 'Users → ALB → EC2 (AZ-A) + EC2 (AZ-B). Auto Scaling Group manages both EC2 instances.',
    nodes: [
      { id: 'users', label: 'Users',              icon: '👥', color: '#475569', x: 340, y: 55  },
      { id: 'alb',   label: 'App Load\nBalancer', icon: '⚖️', color: '#2563eb', x: 340, y: 185 },
      { id: 'ec2a',  label: 'EC2\n(AZ-A)',        icon: '🖥️', color: '#0891b2', x: 160, y: 320 },
      { id: 'ec2b',  label: 'EC2\n(AZ-B)',        icon: '🖥️', color: '#0891b2', x: 520, y: 320 },
      { id: 'asg',   label: 'Auto Scaling\nGroup',icon: '📈', color: '#16a34a', x: 340, y: 410 },
    ],
    correct: [ck('users','alb'), ck('alb','ec2a'), ck('alb','ec2b'), ck('asg','ec2a'), ck('asg','ec2b')],
  },
  {
    id: 2,
    scenario: 'SnapVault, a photo-sharing startup with 4 engineers and zero DevOps capacity, receives 2 million image uploads per day. Every uploaded image must be automatically resized to 3 formats (150px thumbnail, 800px medium, 1920px HD) and stored in a delivery bucket for CDN distribution. The team wants no EC2 instances to manage, zero cost when there are zero uploads, and automatic invocation on every new upload with millisecond trigger latency.',
    task: 'Connect the serverless image processing pipeline from user upload through the event-driven trigger to the processing function and output storage.',
    hint: 'User → S3 (uploads bucket triggers event) → Lambda (resize function) → S3 (processed bucket)',
    nodes: [
      { id: 'user',     label: 'User\nUpload',      icon: '📤', color: '#475569', x: 90,  y: 220 },
      { id: 's3in',     label: 'S3\n(raw uploads)', icon: '🪣', color: '#16a34a', x: 270, y: 220 },
      { id: 'lambda',   label: 'Lambda\n(resize)',   icon: 'λ',  color: '#ea580c', x: 460, y: 220 },
      { id: 's3out',    label: 'S3\n(processed)',    icon: '🪣', color: '#0891b2', x: 640, y: 220 },
    ],
    correct: [ck('user','s3in'), ck('s3in','lambda'), ck('lambda','s3out')],
  },
  {
    id: 3,
    scenario: 'DataStream Corp monitors 80,000 industrial IoT sensors across 500 factories, each emitting a temperature reading every 2 seconds — totalling 40,000 events per second. The ops team needs: (1) a managed, serverless ingestion layer that handles 40k events/sec without provisioning servers, (2) real-time SQL analytics computing rolling averages and spike anomalies every 60 seconds to trigger alerts, and (3) all raw sensor data retained in S3 for 90-day compliance audits — queryable by the data science team.',
    task: 'Connect the real-time streaming analytics pipeline: from IoT sensors through managed ingestion, to live analytics, and raw data archival storage.',
    hint: 'IoT Sensors → Kinesis Data Streams → Kinesis Data Analytics → Live Dashboard. Kinesis → S3 (via Firehose for archival).',
    nodes: [
      { id: 'sensors',  label: 'IoT\nSensors',          icon: '📡', color: '#475569', x: 80,  y: 220 },
      { id: 'kinesis',  label: 'Kinesis\nData Streams',  icon: '🌊', color: '#7c3aed', x: 270, y: 220 },
      { id: 'kda',      label: 'Kinesis Data\nAnalytics', icon: '📊', color: '#2563eb', x: 470, y: 120 },
      { id: 'dashboard',label: 'Live\nDashboard',        icon: '🖥️', color: '#16a34a', x: 640, y: 120 },
      { id: 's3arch',   label: 'S3\n(archive)',          icon: '🪣', color: '#ea580c', x: 470, y: 350 },
    ],
    correct: [ck('sensors','kinesis'), ck('kinesis','kda'), ck('kda','dashboard'), ck('kinesis','s3arch')],
  },
  {
    id: 4,
    scenario: 'SecureBank\'s customer portal handles sensitive financial transactions under PCI-DSS compliance. A recent pen test revealed the database was reachable from the internet via a misconfigured security group. The CISO mandates strict network isolation: the load balancer accepts inbound internet traffic in a public subnet, application servers containing business logic and encryption keys live in a private subnet with no inbound internet route, and the PostgreSQL database must only accept connections from app servers — isolated in its own subnet with no internet gateway or NAT routing.',
    task: 'Connect the 3-tier VPC architecture showing the network path from internet traffic through each isolation boundary down to the database.',
    hint: 'Internet → ALB (public subnet) → App EC2 (private subnet) → RDS PostgreSQL (isolated subnet, no internet route)',
    nodes: [
      { id: 'inet', label: 'Internet\nGateway',       icon: '🌍', color: '#475569', x: 90,  y: 195 },
      { id: 'alb',  label: 'App Load\nBalancer',      icon: '⚖️', color: '#2563eb', x: 280, y: 195 },
      { id: 'app',  label: 'App EC2\n(private)',       icon: '🖥️', color: '#0891b2', x: 490, y: 195 },
      { id: 'rds',  label: 'RDS\nPostgreSQL',          icon: '💾', color: '#7c3aed', x: 490, y: 375 },
    ],
    correct: [ck('inet','alb'), ck('alb','app'), ck('app','rds')],
  },
  {
    id: 5,
    scenario: 'FleetCommerce processes 500,000 orders per hour on Black Friday. When an order is placed, three separate teams\' systems must each independently receive the order event: Billing charges the card, Inventory decrements stock, and Shipping schedules pickup. These teams deploy independently on different cadences. A billing outage must never block shipping. All three systems must receive every single order event — missed events mean lost revenue, unshipped packages, or inventory mismatches.',
    task: 'Connect the fan-out architecture so that one order event is published once and independently delivered to all three downstream service queues.',
    hint: 'Order Service → SNS Topic → SQS (Billing) + SQS (Inventory) + SQS (Shipping). Each SQS is an independent subscriber.',
    nodes: [
      { id: 'order', label: 'Order\nService',     icon: '🛒', color: '#475569', x: 90,  y: 220 },
      { id: 'sns',   label: 'SNS\nTopic',         icon: '📢', color: '#FF9900', x: 290, y: 220 },
      { id: 'sqsb',  label: 'SQS\n(Billing)',     icon: '📬', color: '#dc2626', x: 520, y: 90  },
      { id: 'sqsi',  label: 'SQS\n(Inventory)',   icon: '📬', color: '#dc2626', x: 520, y: 220 },
      { id: 'sqss',  label: 'SQS\n(Shipping)',    icon: '📬', color: '#dc2626', x: 520, y: 355 },
    ],
    correct: [ck('order','sns'), ck('sns','sqsb'), ck('sns','sqsi'), ck('sns','sqss')],
  },
  {
    id: 6,
    scenario: 'PayProcess Ltd handles credit card authorization jobs queued from 200 merchant APIs. Each job invokes a Lambda function that calls an external payment processor API. The external API fails 5% of the time during peak load. On-call engineers reported 3,000 silently lost transactions last month — jobs failed, were discarded, and merchants never knew. The fix must: retry failed jobs up to 3 times with exponential backoff, capture any job that still fails after retries into a separate durable queue for manual inspection, and alert the ops team within 5 minutes of DLQ activity.',
    task: 'Connect the resilient message processing flow: producer to queue to Lambda processor, and the failure capture path to the dead-letter queue.',
    hint: 'Producer → SQS Queue → Lambda (consumer). After maxReceiveCount exceeded: SQS → Dead Letter Queue (DLQ).',
    nodes: [
      { id: 'prod',   label: 'Merchant\nAPI',        icon: '📡', color: '#475569', x: 90,  y: 220 },
      { id: 'sqs',    label: 'SQS\nQueue',           icon: '📬', color: '#FF9900', x: 300, y: 220 },
      { id: 'lambda', label: 'Lambda\n(authorizer)', icon: 'λ',  color: '#ea580c', x: 510, y: 100 },
      { id: 'dlq',    label: 'Dead Letter\nQueue',   icon: '⚠️', color: '#dc2626', x: 510, y: 345 },
    ],
    correct: [ck('prod','sqs'), ck('sqs','lambda'), ck('sqs','dlq')],
  },
  {
    id: 7,
    scenario: 'HealthPortal\'s patient-facing web app was hit by a SQL injection attack that exfiltrated 40,000 patient records, triggering a $3.2M HIPAA fine and 6-month regulatory investigation. The CISO mandates: Layer 7 filtering blocking OWASP Top 10 attacks (SQLi, XSS, CSRF), rate-limiting to 1,000 req/IP/min to prevent credential stuffing, SLA-backed DDoS mitigation with <1-second response, TLS termination and geographic blocking at the CDN edge — all traffic must traverse these security layers before reaching any compute resource.',
    task: 'Connect the layered security architecture showing the exact order internet traffic passes through each protection service before reaching the application servers.',
    hint: 'Internet → CloudFront (TLS + geo-block) → AWS WAF (OWASP rules + rate limit) → ALB → EC2',
    nodes: [
      { id: 'inet', label: 'Internet',            icon: '🌍', color: '#475569', x: 70,  y: 220 },
      { id: 'cf',   label: 'CloudFront\n(TLS/geo)',icon: '🌐', color: '#FF9900', x: 240, y: 130 },
      { id: 'waf',  label: 'AWS WAF\n+ Shield',   icon: '🛡️', color: '#dc2626', x: 440, y: 130 },
      { id: 'alb',  label: 'App Load\nBalancer',  icon: '⚖️', color: '#2563eb', x: 600, y: 220 },
      { id: 'ec2',  label: 'EC2\nWeb Server',     icon: '🖥️', color: '#0891b2', x: 600, y: 360 },
    ],
    correct: [ck('inet','cf'), ck('cf','waf'), ck('waf','alb'), ck('alb','ec2')],
  },
  {
    id: 8,
    scenario: 'ComplianceLog Inc. stores application audit logs required for SOC 2 Type II and ISO 27001 certification — 7-year mandatory retention. The DevOps team analyzed access patterns: logs are queried multiple times daily during the first 30 days (live incident response), accessed for monthly compliance reports between 30–90 days, and almost never touched after 90 days but must remain restorable within 12 hours for external auditors. Current S3 Standard bill: $28,000/month. The CFO demands 85% cost reduction without deleting a single log.',
    task: 'Connect the S3 lifecycle tiers in the correct order showing how log data automatically moves through storage classes as it ages, reducing cost at each stage.',
    hint: 'App Logs → S3 Standard (0–30 days, frequent access) → S3 Standard-IA (30–90 days) → S3 Glacier (90+ days, archival)',
    nodes: [
      { id: 'app',     label: 'App\nLogs',       icon: '📋', color: '#475569', x: 90,  y: 220 },
      { id: 'std',     label: 'S3\nStandard',     icon: '🪣', color: '#16a34a', x: 270, y: 220 },
      { id: 'ia',      label: 'S3\nStandard-IA',  icon: '🗃️', color: '#ea580c', x: 460, y: 220 },
      { id: 'glacier', label: 'S3\nGlacier',      icon: '🏔️', color: '#64748b', x: 630, y: 220 },
    ],
    correct: [ck('app','std'), ck('std','ia'), ck('ia','glacier')],
  },
  {
    id: 9,
    scenario: 'MegaRetail\'s Chicago data center hosts an on-premises Oracle ERP with 8 years of inventory and financial transaction history. A pilot AWS migration requires AWS application servers to query the on-premises Oracle database in real time during an 18-month parallel-run period. The network team tested a Site-to-Site VPN but measured 180ms average latency and 2% packet loss under load — violating their 20ms SLA. A dedicated 10 Gbps AWS Direct Connect circuit has been provisioned at the colocation facility to provide a private, consistent, low-latency connection.',
    task: 'Connect the hybrid architecture showing how AWS app servers access on-premises data through the dedicated private connection, through the VPC gateway, to the application and database layer.',
    hint: 'On-Premises DC → Direct Connect → Virtual Private Gateway → VPC → App EC2 → RDS Aurora (for migrated data)',
    nodes: [
      { id: 'onprem',  label: 'On-Prem\nData Center', icon: '🏢', color: '#475569', x: 70,  y: 220 },
      { id: 'dx',      label: 'Direct\nConnect',       icon: '🔌', color: '#FF9900', x: 240, y: 220 },
      { id: 'vgw',     label: 'Virtual\nPrivate GW',   icon: '🔒', color: '#dc2626', x: 420, y: 220 },
      { id: 'ec2',     label: 'App EC2\n(VPC)',         icon: '🖥️', color: '#0891b2', x: 590, y: 120 },
      { id: 'rds',     label: 'RDS\nAurora',           icon: '💾', color: '#7c3aed', x: 590, y: 345 },
    ],
    correct: [ck('onprem','dx'), ck('dx','vgw'), ck('vgw','ec2'), ck('ec2','rds')],
  },
  {
    id: 10,
    scenario: 'MediScan AI trains a chest X-ray classification model that detects pneumonia with 94% accuracy across 3 hospital systems. FDA\'s 21 CFR Part 11 regulation requires full model lineage — every training run must be versioned with reproducible parameters. The MLOps team needs: automated weekly retraining as new labeled data accumulates in S3, every trained model registered with metadata before deployment, a real-time HTTPS inference endpoint the radiology software calls per scan, and continuous monitoring that alerts the ML team if inference accuracy drops below 90% (model drift).',
    task: 'Connect the end-to-end MLOps pipeline from training data storage through training, model registry, deployment endpoint, and drift monitoring.',
    hint: 'S3 (training data) → SageMaker Training Job → Model Registry → SageMaker Endpoint → CloudWatch (accuracy monitoring)',
    nodes: [
      { id: 's3',      label: 'S3\nTraining Data',     icon: '🪣', color: '#16a34a', x: 70,  y: 220 },
      { id: 'smtrain', label: 'SageMaker\nTraining',   icon: '🤖', color: '#7c3aed', x: 250, y: 220 },
      { id: 'modelreg',label: 'Model\nRegistry',       icon: '📦', color: '#2563eb', x: 440, y: 220 },
      { id: 'endpoint',label: 'SageMaker\nEndpoint',   icon: '🔮', color: '#ea580c', x: 620, y: 120 },
      { id: 'cw',      label: 'CloudWatch\n(monitor)', icon: '📊', color: '#475569', x: 620, y: 345 },
    ],
    correct: [ck('s3','smtrain'), ck('smtrain','modelreg'), ck('modelreg','endpoint'), ck('endpoint','cw')],
  },
  {
    id: 11,
    scenario: 'LogiTrack\'s fleet of 150,000 GPS-equipped delivery trucks emit location, speed, fuel consumption, and engine fault codes every 30 seconds — 5 million events per minute. The data engineering team needs to: ingest the stream with zero cluster management, store raw telemetry cheaply for 2-year regulatory retention, run automated ETL to cleanse GPS noise and enrich with road segment data, and make the curated dataset queryable by 200 supply-chain analysts using standard SQL without provisioning or managing any database clusters.',
    task: 'Connect the serverless data lake pipeline from truck telemetry through stream ingestion, raw storage, ETL transformation, and SQL analytics.',
    hint: 'Trucks → Kinesis Firehose → S3 (raw) → AWS Glue (ETL) → S3 (curated) → Amazon Athena (SQL queries)',
    nodes: [
      { id: 'trucks',  label: 'GPS\nTrucks',           icon: '🚚', color: '#475569', x: 70,  y: 220 },
      { id: 'firehose',label: 'Kinesis\nFirehose',     icon: '🌊', color: '#7c3aed', x: 230, y: 220 },
      { id: 's3raw',   label: 'S3\n(raw)',             icon: '🪣', color: '#FF9900', x: 400, y: 120 },
      { id: 'glue',    label: 'AWS\nGlue ETL',         icon: '⚙️', color: '#ea580c', x: 400, y: 340 },
      { id: 'athena',  label: 'Amazon\nAthena',        icon: '🔍', color: '#2563eb', x: 590, y: 220 },
    ],
    correct: [ck('trucks','firehose'), ck('firehose','s3raw'), ck('s3raw','glue'), ck('glue','athena')],
  },
  {
    id: 12,
    scenario: 'FitTrack\'s mobile fitness app has 3 million users syncing workout data to a REST API. After a breach where hardcoded API keys were found in a public GitHub repo, the security team mandates OAuth 2.0 for every API call. Requirements: users must authenticate via email or Google/Apple social login, receive a short-lived JWT (15-minute expiry), include the JWT in every API request header, and the API Gateway must validate the JWT using a Cognito Authorizer — rejecting all unauthenticated requests with HTTP 401 before any Lambda function is ever invoked, preventing unnecessary Lambda costs.',
    task: 'Connect the secure authentication and API flow: mobile app authenticates with Cognito, then calls API Gateway — showing where JWT validation happens before the backend processes the request.',
    hint: 'Mobile App → Amazon Cognito (authenticate, get JWT) → API Gateway (Cognito Authorizer validates JWT) → Lambda → DynamoDB',
    nodes: [
      { id: 'app',     label: 'Mobile\nApp',          icon: '📱', color: '#475569', x: 80,  y: 220 },
      { id: 'cognito', label: 'Amazon\nCognito',      icon: '🔑', color: '#dc2626', x: 270, y: 110 },
      { id: 'apigw',   label: 'API\nGateway',         icon: '🔀', color: '#7c3aed', x: 270, y: 340 },
      { id: 'lambda',  label: 'Lambda\nFunction',     icon: 'λ',  color: '#ea580c', x: 470, y: 220 },
      { id: 'dynamo',  label: 'DynamoDB',             icon: '🗄️', color: '#1A73E8', x: 640, y: 220 },
    ],
    correct: [ck('app','cognito'), ck('app','apigw'), ck('cognito','apigw'), ck('apigw','lambda'), ck('lambda','dynamo')],
  },
  {
    id: 13,
    scenario: 'InsureClaim Corp manually processes 10,000 insurance claims per day across a 5-step workflow: document validation → fraud ML scoring → payout calculation → manager approval (claims >$10K) → customer notification. Each step is a separate Lambda function owned by a different team. The current SQS-chain orchestration has caused 200 stuck claims this month — unhandled Lambda exceptions silently dropped jobs, leaving claimants waiting weeks. The solution needs durable state management, automatic retries with configurable backoff, conditional branching for high-value claims, and full execution history for compliance audits.',
    task: 'Connect the Step Functions orchestration pipeline: from claim intake through the workflow engine, across the Lambda processing steps, to the final customer notification.',
    hint: 'Claim Intake → Step Functions → Lambda (validate) → Lambda (fraud check) → Lambda (payout calc) → SNS (notify customer)',
    nodes: [
      { id: 'intake',  label: 'Claim\nIntake',         icon: '📄', color: '#475569', x: 80,  y: 220 },
      { id: 'sfn',     label: 'Step\nFunctions',       icon: '🔄', color: '#FF9900', x: 260, y: 220 },
      { id: 'lval',    label: 'Lambda\n(validate)',     icon: 'λ',  color: '#ea580c', x: 450, y: 100 },
      { id: 'lfraud',  label: 'Lambda\n(fraud check)', icon: 'λ',  color: '#ea580c', x: 450, y: 340 },
      { id: 'sns',     label: 'SNS\n(notify)',          icon: '📢', color: '#16a34a', x: 630, y: 220 },
    ],
    correct: [ck('intake','sfn'), ck('sfn','lval'), ck('sfn','lfraud'), ck('lval','sns'), ck('lfraud','sns')],
  },
  {
    id: 14,
    scenario: 'SportsBet\'s PostgreSQL database handles 80,000 queries/second during live Premier League matches. The DBA team discovered complex bet-settlement reports — running 45–60 seconds each — are causing table-level locks that degrade real-time bet placement from 50ms to 8 seconds. Separately, a single-AZ failure 3 months ago caused 22 minutes of downtime and £180,000 in lost bets before manual intervention restored service. The architecture must: (1) separate heavy read queries from write transactions, (2) auto-failover to a standby in a second AZ within 60 seconds, and (3) scale read capacity as match-day traffic grows.',
    task: 'Connect the multi-AZ RDS architecture: show write traffic to the primary, the synchronous standby for automatic failover, and the async read replica for analytics queries.',
    hint: 'App (writes) → RDS Primary → RDS Standby (Multi-AZ sync replication, auto-failover). RDS Primary → RDS Read Replica (async). App (reads/reports) → RDS Read Replica.',
    nodes: [
      { id: 'app',     label: 'App\nServers',         icon: '🖥️', color: '#475569', x: 80,  y: 220 },
      { id: 'primary', label: 'RDS\nPrimary',         icon: '💾', color: '#2563eb', x: 290, y: 220 },
      { id: 'standby', label: 'RDS\nStandby (AZ-B)', icon: '💾', color: '#16a34a', x: 520, y: 100 },
      { id: 'replica', label: 'RDS\nRead Replica',    icon: '💾', color: '#7c3aed', x: 520, y: 355 },
    ],
    correct: [ck('app','primary'), ck('primary','standby'), ck('primary','replica'), ck('app','replica')],
  },
  {
    id: 15,
    scenario: 'MedInfo hosts a React patient-education portal serving 400,000 monthly users across 60 countries. The current setup — a single EC2 t3.medium in us-east-1 — produces p99 load times of 8.4 seconds in Southeast Asia and costs $340/month. HIPAA requires TLS 1.2+ for all connections. Since the site is a static SPA (HTML/CSS/JS bundles with no server-side processing), the infrastructure team wants to: eliminate the EC2 entirely, serve content from CDN edge locations in all 60 countries, enforce TLS 1.2+ via a managed SSL certificate, and reduce global p99 load time below 800ms while cutting infrastructure costs by 95%.',
    task: 'Connect the serverless global delivery architecture: from users through DNS resolution, CDN edge delivery with TLS, static file storage, and managed certificate attachment.',
    hint: 'Global Users → Route 53 (DNS) → CloudFront (CDN + TLS 1.2+) → S3 (static SPA files). CloudFront references ACM (SSL certificate).',
    nodes: [
      { id: 'users',   label: 'Global\nUsers',         icon: '🌍', color: '#475569', x: 80,  y: 220 },
      { id: 'r53',     label: 'Route 53\n(DNS)',        icon: '🗺️', color: '#FF9900', x: 260, y: 120 },
      { id: 'cf',      label: 'CloudFront\n(CDN+TLS)', icon: '🌐', color: '#2563eb', x: 460, y: 120 },
      { id: 's3',      label: 'S3\n(static SPA)',       icon: '🪣', color: '#16a34a', x: 640, y: 220 },
      { id: 'acm',     label: 'ACM\n(SSL cert)',        icon: '🔒', color: '#dc2626', x: 460, y: 340 },
    ],
    correct: [ck('users','r53'), ck('r53','cf'), ck('cf','s3'), ck('cf','acm')],
  },
]

// ── Canvas constants ──────────────────────────────────────────────────────────
const NW = 120   // node width
const NH = 58    // node height
const SVG_W = 720
const SVG_H = 450

// ── Main Component ────────────────────────────────────────────────────────────
export default function VisualExam() {
  const { isPremium } = useAuth()
  const navigate = useNavigate()

  // ── Game state ──
  const [qIdx,      setQIdx]      = useState(0)
  const [conns,     setConns]     = useState<Set<ConnKey>>(new Set())
  const [selected,  setSelected]  = useState<string | null>(null)
  const [svgMouse,  setSvgMouse]  = useState({ x: 0, y: 0 })
  const [nodePos,   setNodePos]   = useState<Record<string, { x: number; y: number }>>({})
  const [submitted, setSubmitted] = useState(false)
  const [results,   setResults]   = useState<{
    correct: Set<ConnKey>; wrong: Set<ConnKey>; missing: Set<ConnKey>
  } | null>(null)
  const [scores, setScores] = useState<boolean[]>([])
  const [done,   setDone]   = useState(false)
  const [showHint, setShowHint] = useState(false)

  // ── Drag state (refs = no re-render during drag) ──
  const dragRef  = useRef<{ id: string; ox: number; oy: number; mx: number; my: number } | null>(null)
  const movedRef = useRef(false)
  const svgRef   = useRef<SVGSVGElement>(null)

  const q = QUESTIONS[qIdx]

  // Reset on question change
  useEffect(() => {
    setConns(new Set())
    setSelected(null)
    setSubmitted(false)
    setResults(null)
    setNodePos({})
    setShowHint(false)
    movedRef.current = false
    dragRef.current  = null
  }, [qIdx])

  // ── Helpers ──
  const getPos = (n: DNode) => nodePos[n.id] ?? { x: n.x, y: n.y }

  const toSvg = (e: React.MouseEvent): { x: number; y: number } => {
    const svg = svgRef.current
    if (!svg) return { x: 0, y: 0 }
    const r = svg.getBoundingClientRect()
    return {
      x: ((e.clientX - r.left) / r.width)  * SVG_W,
      y: ((e.clientY - r.top)  / r.height) * SVG_H,
    }
  }

  // ── SVG event handlers ──
  const onSvgMove = (e: React.MouseEvent) => {
    const pt = toSvg(e)
    setSvgMouse(pt)
    if (dragRef.current) {
      const dx = pt.x - dragRef.current.mx
      const dy = pt.y - dragRef.current.my
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        movedRef.current = true
        const { id, ox, oy } = dragRef.current
        setNodePos(p => ({ ...p, [id]: { x: ox + dx, y: oy + dy } }))
      }
    }
  }

  const onSvgUp = () => { dragRef.current = null }

  const onSvgClick = () => { setSelected(null) }

  // ── Node event handlers ──
  const onNodeDown = (e: React.MouseEvent, n: DNode) => {
    e.stopPropagation()
    if (submitted) return
    const pt  = toSvg(e)
    const pos = getPos(n)
    movedRef.current = false
    dragRef.current  = { id: n.id, ox: pos.x, oy: pos.y, mx: pt.x, my: pt.y }
  }

  const onNodeUp = (e: React.MouseEvent, n: DNode) => {
    e.stopPropagation()
    dragRef.current = null
    if (submitted)        return
    if (movedRef.current) return   // was a drag — skip click logic

    // Single click: connect to already-selected node only
    if (selected && selected !== n.id) {
      const key = ck(selected, n.id)
      setConns(prev => {
        const next = new Set(prev)
        if (next.has(key)) next.delete(key)
        else               next.add(key)
        return next
      })
      setSelected(null)
    }
  }

  const onNodeDoubleClick = (e: React.MouseEvent, n: DNode) => {
    e.stopPropagation()
    if (submitted) return
    setSelected(prev => prev === n.id ? null : n.id)
  }

  const removeConn = (key: ConnKey, e: React.MouseEvent) => {
    e.stopPropagation()
    if (submitted) return
    setConns(prev => { const n = new Set(prev); n.delete(key); return n })
  }

  // ── Submit ──
  const submit = () => {
    const cset    = new Set(q.correct)
    const correct = new Set<ConnKey>()
    const wrong   = new Set<ConnKey>()
    const missing = new Set<ConnKey>()
    conns.forEach(k => cset.has(k) ? correct.add(k) : wrong.add(k))
    q.correct.forEach(k => { if (!conns.has(k)) missing.add(k) })
    setResults({ correct, wrong, missing })
    setSubmitted(true)
    setScores(prev => [...prev, wrong.size === 0 && missing.size === 0])
  }

  const nextQ = () => {
    if (qIdx + 1 >= QUESTIONS.length) setDone(true)
    else setQIdx(i => i + 1)
  }

  // ── Connection line color ──
  const lineColor = (key: ConnKey) => {
    if (!submitted || !results) return '#64748b'
    if (results.correct.has(key)) return '#16a34a'
    if (results.wrong.has(key))   return '#dc2626'
    return '#64748b'
  }

  // ── Render an arrow between two node centers ──
  const renderArrow = (
    key: ConnKey,
    opts: { color?: string; dashed?: boolean; onClick?: (e: React.MouseEvent) => void } = {}
  ) => {
    const ids = key.split(':')
    const an  = q.nodes.find(n => n.id === ids[0])
    const bn  = q.nodes.find(n => n.id === ids[1])
    if (!an || !bn) return null
    const ap = getPos(an), bp = getPos(bn)
    const dx = bp.x - ap.x, dy = bp.y - ap.y
    const len = Math.sqrt(dx * dx + dy * dy) || 1
    const ux = dx / len, uy = dy / len
    const sx = ap.x + ux * (NW / 2 + 5)
    const sy = ap.y + uy * (NH / 2 + 5)
    const ex = bp.x - ux * (NW / 2 + 18)
    const ey = bp.y - uy * (NH / 2 + 18)
    const color  = opts.color  ?? '#64748b'
    const dashed = opts.dashed ?? false
    const markId = `arr-${color.replace('#', '')}`

    return (
      <g key={key} onClick={opts.onClick} style={{ cursor: opts.onClick ? 'pointer' : 'default' }}>
        <line
          x1={sx} y1={sy} x2={ex} y2={ey}
          stroke={color}
          strokeWidth={dashed ? 2 : 2.5}
          strokeDasharray={dashed ? '9,5' : undefined}
          markerEnd={`url(#${markId})`}
        />
        {/* wider invisible hit area for easier clicking */}
        {opts.onClick && (
          <line x1={sx} y1={sy} x2={ex} y2={ey}
            stroke="transparent" strokeWidth={14} style={{ cursor: 'pointer' }} />
        )}
      </g>
    )
  }

  // ── Marker defs for arrowheads ──────────────────────────────────────────────
  const MARKER_COLORS = ['#64748b', '#16a34a', '#dc2626', '#f59e0b', '#2563eb']
  const markers = MARKER_COLORS.map(c => (
    <marker
      key={c}
      id={`arr-${c.replace('#','')}`}
      markerWidth="8" markerHeight="8"
      refX="6" refY="3"
      orient="auto"
    >
      <path d="M0,0 L0,6 L8,3 z" fill={c} />
    </marker>
  ))

  // ── Premium gate ──────────────────────────────────────────────────────────────
  if (!isPremium) {
    return (
      <Layout>
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
          <div style={{ background: '#fff', borderRadius: '24px', padding: '48px 40px', maxWidth: '480px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔒</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>Premium Feature</h2>
            <p style={{ color: '#64748b', margin: '0 0 28px', lineHeight: '1.6' }}>
              Visual Exam — drag-and-connect — is available on monthly, yearly, and lifetime plans.
            </p>
            <button
              onClick={() => navigate('/pricing')}
              style={{ background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: '#fff', border: 'none', borderRadius: '14px', padding: '14px 32px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', width: '100%' }}
            >
              View Plans
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  // ── Done / Results screen ─────────────────────────────────────────────────────
  if (done) {
    const total   = QUESTIONS.length
    const correct = scores.filter(Boolean).length
    const pct     = Math.round((correct / total) * 100)
    const passed  = pct >= 70
    return (
      <Layout>
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
          <div style={{ background: '#fff', borderRadius: '24px', padding: '48px 40px', maxWidth: '520px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>{passed ? '🏆' : '📚'}</div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: '0 0 8px' }}>
              {passed ? 'Great job!' : 'Keep practicing!'}
            </h2>
            <p style={{ color: '#64748b', margin: '0 0 28px' }}>
              You got <strong>{correct}/{total}</strong> diagrams fully correct
            </p>
            {/* Score circle */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
              <div style={{
                width: '120px', height: '120px', borderRadius: '50%',
                background: passed ? 'linear-gradient(135deg,#16a34a,#15803d)' : 'linear-gradient(135deg,#dc2626,#b91c1c)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              }}>
                <span style={{ color: '#fff', fontSize: '2rem', fontWeight: 900 }}>{pct}%</span>
              </div>
            </div>
            {/* Per-question breakdown */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '32px' }}>
              {scores.map((ok, i) => (
                <div key={i} style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: ok ? '#dcfce7' : '#fee2e2',
                  color: ok ? '#16a34a' : '#dc2626',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '0.85rem',
                }}>
                  {ok ? '✓' : '✗'}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => { setDone(false); setQIdx(0); setScores([]) }}
                style={{ flex: 1, background: '#f1f5f9', color: '#0f172a', border: 'none', borderRadius: '12px', padding: '13px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}
              >
                Retry
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                style={{ flex: 1, background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: '#fff', border: 'none', borderRadius: '12px', padding: '13px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  // ── Main exam UI ──────────────────────────────────────────────────────────────
  const isCorrectQ = submitted && results && results.wrong.size === 0 && results.missing.size === 0

  return (
    <Layout>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '28px 16px 48px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <span style={{ background: '#dbeafe', color: '#1d4ed8', borderRadius: '8px', padding: '4px 12px', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.05em' }}>
                VISUAL EXAM
              </span>
              <span style={{ color: '#64748b', fontSize: '0.85rem' }}>
                Question {qIdx + 1} of {QUESTIONS.length}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
                Connect the AWS Architecture
              </h1>
              <span style={{ display: 'inline-block', background: '#FF9900', color: '#fff', padding: '3px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em', flexShrink: 0 }}>
                ☁️ SAA-C03
              </span>
            </div>
          </div>
          {/* Progress dots */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {QUESTIONS.map((_, i) => (
              <div key={i} style={{
                width: '10px', height: '10px', borderRadius: '50%',
                background: i < scores.length
                  ? (scores[i] ? '#16a34a' : '#dc2626')
                  : i === qIdx ? '#2563eb' : '#e2e8f0',
              }} />
            ))}
          </div>
        </div>

        {/* Scenario card */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px 24px', marginBottom: '16px' }}>
          <p style={{ margin: '0 0 8px', color: '#0f172a', fontWeight: 600, lineHeight: '1.55' }}>
            📋 {q.scenario}
          </p>
          <p style={{ margin: 0, color: '#2563eb', fontWeight: 500, fontSize: '0.9rem' }}>
            🎯 {q.task}
          </p>
        </div>

        {/* Instructions row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: '#64748b' }}>
            <span>🖱️ <strong>Drag</strong> to reposition</span>
            <span>🔗 <strong>Double-click</strong> to select → <strong>click</strong> another to connect</span>
            <span>✂️ <strong>Click arrow</strong> to remove</span>
          </div>
          <button
            onClick={() => setShowHint(h => !h)}
            style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '5px 14px', fontSize: '0.8rem', color: '#64748b', cursor: 'pointer' }}
          >
            {showHint ? '🙈 Hide hint' : '💡 Hint'}
          </button>
        </div>

        {showHint && (
          <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '10px', padding: '10px 16px', marginBottom: '12px', fontSize: '0.85rem', color: '#92400e' }}>
            💡 {q.hint}
          </div>
        )}

        {/* SVG Canvas */}
        <div style={{
          background: '#fff', border: `2px solid ${selected ? '#2563eb' : '#e2e8f0'}`,
          borderRadius: '16px', overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          transition: 'border-color 0.2s',
          userSelect: 'none',
        }}>
          <svg
            ref={svgRef}
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            width="100%"
            style={{ display: 'block', cursor: 'default' }}
            onMouseMove={onSvgMove}
            onMouseUp={onSvgUp}
            onMouseLeave={onSvgUp}
            onClick={onSvgClick}
          >
            <defs>
              {markers}
            </defs>

            {/* Grid background */}
            <rect width={SVG_W} height={SVG_H} fill="#fafbfc" />
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f1f5f9" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width={SVG_W} height={SVG_H} fill="url(#grid)" />

            {/* ── Draw existing connections ── */}
            {Array.from(conns).map(key => {
              const color = lineColor(key)
              return renderArrow(key, {
                color,
                onClick: (e) => removeConn(key, e),
              })
            })}

            {/* ── Draw missing connections (after submit) ── */}
            {submitted && results && Array.from(results.missing).map(key =>
              renderArrow(key, { color: '#f59e0b', dashed: true })
            )}

            {/* ── Live "rubber-band" line while connecting ── */}
            {selected && (() => {
              const sn = q.nodes.find(n => n.id === selected)
              if (!sn) return null
              const sp = getPos(sn)
              const dx = svgMouse.x - sp.x, dy = svgMouse.y - sp.y
              const len = Math.sqrt(dx*dx+dy*dy)||1
              const ux = dx/len, uy = dy/len
              const sx = sp.x + ux*(NW/2+5), sy = sp.y + uy*(NH/2+5)
              return (
                <line
                  x1={sx} y1={sy} x2={svgMouse.x} y2={svgMouse.y}
                  stroke="#2563eb" strokeWidth="2" strokeDasharray="8,5"
                  markerEnd="url(#arr-2563eb)"
                />
              )
            })()}

            {/* ── Draw nodes ── */}
            {q.nodes.map(n => {
              const { x, y } = getPos(n)
              const isSel    = selected === n.id
              const lines    = n.label.split('\n')
              const lineH    = 16
              const totalTH  = lines.length * lineH
              const startY   = y - totalTH / 2 + lineH / 2 - 4

              return (
                <g
                  key={n.id}
                  onMouseDown={e    => onNodeDown(e, n)}
                  onMouseUp={e      => onNodeUp(e, n)}
                  onDoubleClick={e  => onNodeDoubleClick(e, n)}
                  style={{ cursor: submitted ? 'default' : 'pointer' }}
                >
                  {/* Selection glow */}
                  {isSel && (
                    <rect
                      x={x - NW/2 - 6} y={y - NH/2 - 6}
                      width={NW + 12} height={NH + 12}
                      rx="14" fill="none"
                      stroke="#2563eb" strokeWidth="2.5"
                      strokeDasharray="6,4"
                      opacity="0.7"
                    />
                  )}

                  {/* Node body */}
                  <rect
                    x={x - NW/2} y={y - NH/2}
                    width={NW} height={NH}
                    rx="10"
                    fill={n.color}
                    opacity={isSel ? 1 : 0.92}
                    filter={isSel ? 'url(#glow)' : undefined}
                  />

                  {/* Subtle inner highlight */}
                  <rect
                    x={x - NW/2 + 1} y={y - NH/2 + 1}
                    width={NW - 2} height={NH/2}
                    rx="9"
                    fill="rgba(255,255,255,0.12)"
                  />

                  {/* Icon */}
                  <text
                    x={x - NW/2 + 14} y={y + 5}
                    fontSize="18" dominantBaseline="middle"
                    style={{ userSelect: 'none' }}
                  >
                    {n.icon}
                  </text>

                  {/* Label lines */}
                  {lines.map((line, li) => (
                    <text
                      key={li}
                      x={x + 6} y={startY + li * lineH}
                      fontSize="11.5" fontWeight="700"
                      fill="#fff" textAnchor="middle"
                      dominantBaseline="middle"
                      style={{ userSelect: 'none' }}
                    >
                      {line}
                    </text>
                  ))}

                  {/* Result badge */}
                  {submitted && results && (() => {
                    const nodeConns = Array.from(conns).filter(k => k.includes(n.id))
                    const nodeCorrect = nodeConns.every(k => results.correct.has(k))
                    const hasMissing  = q.correct.some(k => k.includes(n.id) && results.missing.has(k))
                    if (hasMissing) return (
                      <circle cx={x + NW/2 - 8} cy={y - NH/2 + 8} r="7" fill="#f59e0b" />
                    )
                    if (nodeCorrect && !hasMissing) return (
                      <circle cx={x + NW/2 - 8} cy={y - NH/2 + 8} r="7" fill="#16a34a" />
                    )
                    return (
                      <circle cx={x + NW/2 - 8} cy={y - NH/2 + 8} r="7" fill="#dc2626" />
                    )
                  })()}
                </g>
              )
            })}

            {/* Glow filter */}
            <defs>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>
        </div>

        {/* Connection count + status */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
            {selected
              ? <span style={{ color: '#2563eb', fontWeight: 600 }}>✔ Node selected — single-click another to connect</span>
              : <span>{conns.size} connection{conns.size !== 1 ? 's' : ''} drawn</span>
            }
          </div>
          {submitted && results && (
            <div style={{ display: 'flex', gap: '12px', fontSize: '0.82rem', fontWeight: 600 }}>
              <span style={{ color: '#16a34a' }}>✓ {results.correct.size} correct</span>
              <span style={{ color: '#dc2626' }}>✗ {results.wrong.size} wrong</span>
              <span style={{ color: '#f59e0b' }}>○ {results.missing.size} missing</span>
            </div>
          )}
        </div>

        {/* Feedback banner */}
        {submitted && (
          <div style={{
            background: isCorrectQ ? '#f0fdf4' : '#fef2f2',
            border: `1px solid ${isCorrectQ ? '#bbf7d0' : '#fecaca'}`,
            borderRadius: '12px', padding: '14px 20px', marginBottom: '16px',
            color: isCorrectQ ? '#166534' : '#991b1b',
            fontWeight: 600, fontSize: '0.9rem',
          }}>
            {isCorrectQ
              ? '🎉 Perfect! All connections are correct.'
              : `❌ Not quite. ${results!.wrong.size > 0 ? 'Remove wrong connections (red). ' : ''}${results!.missing.size > 0 ? 'Orange dashed lines show missing connections.' : ''}`
            }
          </div>
        )}

        {/* Legend (after submit) */}
        {submitted && (
          <div style={{ display: 'flex', gap: '20px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {[['#16a34a','Correct'], ['#dc2626','Wrong — remove'], ['#f59e0b','Missing']].map(([c,l]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#475569' }}>
                <div style={{ width: '28px', height: '3px', background: c, borderRadius: '2px' }} />
                {l}
              </div>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {!submitted ? (
            <>
              <button
                onClick={() => { setConns(new Set()); setSelected(null) }}
                style={{ flex: 0, background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '12px', padding: '13px 24px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}
              >
                Clear
              </button>
              <button
                onClick={submit}
                disabled={conns.size === 0}
                style={{
                  flex: 1, background: conns.size === 0 ? '#e2e8f0' : 'linear-gradient(135deg,#2563eb,#1d4ed8)',
                  color: conns.size === 0 ? '#94a3b8' : '#fff', border: 'none', borderRadius: '12px',
                  padding: '13px 24px', fontWeight: 700, fontSize: '1rem', cursor: conns.size === 0 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                Submit Answer
              </button>
            </>
          ) : (
            <button
              onClick={nextQ}
              style={{ flex: 1, background: 'linear-gradient(135deg,#16a34a,#15803d)', color: '#fff', border: 'none', borderRadius: '12px', padding: '14px 24px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}
            >
              {qIdx + 1 >= QUESTIONS.length ? '🏁 See Results' : 'Next Question →'}
            </button>
          )}
        </div>

      </div>
    </Layout>
  )
}
