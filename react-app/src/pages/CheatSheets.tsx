import { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'

// ── Data mined from 3,958 questions + explanations ───────────────
interface ServiceStat { name: string; count: number; domains: string[] }
interface ChooseWhen { service: string; when: string; not: string }
interface Trap { trap: string; why: string }
interface ArchPattern { name: string; services: string[]; use: string }

interface CertCheatSheet {
  id: string
  code: string
  name: string
  icon: string
  color: string
  passingScore: number
  duration: number
  questions: number
  domains: { name: string; weight: number; key: string[] }[]
  topServices: ServiceStat[]
  chooseWhen: ChooseWhen[]
  traps: Trap[]
  architecturePatterns: ArchPattern[]
}

const SHEETS: CertCheatSheet[] = [
  {
    id: 'saa-c03',
    code: 'SAA-C03',
    name: 'Solutions Architect Associate',
    icon: '🏗️',
    color: '#1d4ed8',
    passingScore: 720,
    duration: 130,
    questions: 65,
    domains: [
      { name: 'Resilient Architectures', weight: 30, key: ['Multi-AZ', 'Auto Scaling', 'ELB', 'Route 53 failover', 'RDS Multi-AZ'] },
      { name: 'High-Performing Architectures', weight: 28, key: ['CloudFront', 'ElastiCache', 'Read Replicas', 'S3 Transfer Acceleration', 'Global Accelerator'] },
      { name: 'Secure Architectures', weight: 24, key: ['IAM roles', 'KMS', 'Security Groups', 'VPC endpoints', 'Cognito'] },
      { name: 'Cost-Optimized Architectures', weight: 18, key: ['Reserved Instances', 'Spot Instances', 'S3 Intelligent-Tiering', 'Fargate', 'Lambda'] },
    ],
    topServices: [
      { name: 'EC2', count: 460, domains: ['Resilient', 'High-Perf', 'Cost'] },
      { name: 'S3', count: 326, domains: ['Resilient', 'Cost', 'Secure'] },
      { name: 'VPC', count: 139, domains: ['Secure', 'Resilient'] },
      { name: 'Auto Scaling', count: 119, domains: ['Resilient', 'Cost'] },
      { name: 'Lambda', count: 106, domains: ['Cost', 'High-Perf'] },
      { name: 'IAM', count: 101, domains: ['Secure'] },
      { name: 'RDS', count: 100, domains: ['Resilient', 'High-Perf'] },
      { name: 'DynamoDB', count: 69, domains: ['High-Perf', 'Cost'] },
      { name: 'CloudFront', count: 59, domains: ['High-Perf', 'Cost'] },
      { name: 'EBS', count: 56, domains: ['High-Perf', 'Cost'] },
    ],
    chooseWhen: [
      { service: 'Aurora', when: 'Need MySQL/PostgreSQL compatibility with automatic failover and up to 15 read replicas', not: 'Standard RDS — Aurora costs more but gives you 5x throughput' },
      { service: 'DynamoDB', when: 'Need single-digit millisecond latency at any scale, serverless, key-value or document', not: 'RDS — DynamoDB has no joins; use RDS when you need relational queries' },
      { service: 'ElastiCache', when: 'Caching database query results to reduce RDS load and improve read latency', not: 'CloudFront — ElastiCache is for dynamic data, CloudFront is for static/edge' },
      { service: 'S3 Glacier', when: 'Archiving data accessed less than once per year, lowest storage cost', not: 'S3 Standard-IA — Glacier retrieval takes hours, IA retrieval is instant' },
      { service: 'Spot Instances', when: 'Stateless, fault-tolerant, flexible workloads (batch, CI/CD, rendering)', not: 'Production web servers — Spot can be interrupted with 2-min notice' },
      { service: 'Global Accelerator', when: 'Need static IPs + low latency routing for TCP/UDP apps across regions', not: 'CloudFront — GA is for non-HTTP/TCP apps; CloudFront is for HTTP/HTTPS content' },
      { service: 'SQS', when: 'Decoupling components, handling traffic spikes, async processing', not: 'SNS — SQS is pull-based (consumer polls); SNS is push-based (fan-out)' },
      { service: 'Kinesis', when: 'Real-time streaming data, analytics, log ingestion at high velocity', not: 'SQS — Kinesis preserves order and supports multiple consumers; SQS does not' },
      { service: 'NAT Gateway', when: 'Private subnet instances need outbound internet access without exposing them', not: 'Internet Gateway — IGW is for public subnets only' },
      { service: 'VPC Endpoint', when: 'Access S3 or DynamoDB from private subnet without going through internet', not: 'NAT Gateway — VPC endpoints are free and stay within AWS network' },
    ],
    traps: [
      { trap: 'Multi-AZ vs Read Replicas', why: 'Multi-AZ is for high availability (failover). Read Replicas are for performance (read scaling). They are NOT the same thing.' },
      { trap: 'Scalability vs Availability', why: 'Auto Scaling = scalability. Multi-AZ = availability. Questions about "what if an AZ fails?" want Multi-AZ, not Auto Scaling.' },
      { trap: 'S3 is not a file system', why: 'EFS is a file system (NFS). S3 is object storage. Questions mentioning "mount" or "shared file system" → EFS, not S3.' },
      { trap: 'IAM roles vs IAM users for EC2', why: 'Always attach IAM roles to EC2 — never store access keys on instances. The exam will offer both; roles is always the answer.' },
      { trap: 'CloudFront signed URLs vs S3 pre-signed URLs', why: 'CloudFront signed URLs → control who accesses CloudFront content. S3 pre-signed URLs → temporary direct S3 access. Both look similar but are different.' },
      { trap: 'Reserved vs Spot vs On-Demand pricing', why: 'Reserved = predictable workload (save 72%). Spot = interruption-tolerant (save 90%). On-Demand = flexibility. Cost questions: Spot cheapest, Reserved next.' },
      { trap: 'SQS Standard vs FIFO', why: 'Standard = best-effort ordering, at-least-once delivery. FIFO = exactly-once, strict order, 3,000 msg/s max. If order matters → FIFO.' },
      { trap: 'Security Group vs NACL', why: 'SG = stateful (return traffic automatic), instance level. NACL = stateless (must allow inbound AND outbound), subnet level.' },
    ],
    architecturePatterns: [
      { name: 'Highly Available Web App', services: ['Route 53', 'ALB', 'EC2 (Multi-AZ)', 'Auto Scaling', 'RDS Multi-AZ'], use: 'Standard 3-tier HA architecture. Most common SAA-C03 pattern.' },
      { name: 'Serverless API', services: ['API Gateway', 'Lambda', 'DynamoDB'], use: 'No servers to manage, scales automatically, pay per request.' },
      { name: 'Static Website + CDN', services: ['S3', 'CloudFront', 'Route 53', 'ACM'], use: 'S3 hosts static files, CloudFront caches globally, ACM handles HTTPS.' },
      { name: 'Event-Driven Processing', services: ['S3', 'SQS', 'Lambda', 'DynamoDB'], use: 'S3 upload triggers SQS, Lambda processes queue, writes to DynamoDB.' },
      { name: 'Hybrid Connectivity', services: ['Direct Connect', 'VPN', 'Transit Gateway'], use: 'Direct Connect = dedicated line (consistent). VPN = encrypted overlay (backup).' },
    ],
  },
  {
    id: 'clf-c02',
    code: 'CLF-C02',
    name: 'Cloud Practitioner',
    icon: '☁️',
    color: '#0891b2',
    passingScore: 700,
    duration: 90,
    questions: 65,
    domains: [
      { name: 'Cloud Concepts', weight: 24, key: ['6 advantages of cloud', 'CapEx vs OpEx', 'Pay-as-you-go', 'Economies of scale', 'Global infrastructure'] },
      { name: 'Security & Compliance', weight: 30, key: ['Shared Responsibility Model', 'IAM', 'MFA', 'Encryption', 'Compliance programs'] },
      { name: 'Cloud Technology', weight: 34, key: ['EC2', 'S3', 'RDS', 'Lambda', 'CloudFront', 'VPC'] },
      { name: 'Billing & Pricing', weight: 12, key: ['Cost Explorer', 'Budgets', 'Pricing Calculator', 'Support plans', 'Reserved vs On-Demand'] },
    ],
    topServices: [
      { name: 'EC2', count: 180, domains: ['Technology'] },
      { name: 'S3', count: 140, domains: ['Technology'] },
      { name: 'IAM', count: 120, domains: ['Security'] },
      { name: 'RDS', count: 80, domains: ['Technology'] },
      { name: 'Lambda', count: 70, domains: ['Technology'] },
      { name: 'CloudFront', count: 60, domains: ['Technology'] },
      { name: 'VPC', count: 55, domains: ['Security', 'Technology'] },
      { name: 'CloudWatch', count: 50, domains: ['Technology'] },
      { name: 'DynamoDB', count: 45, domains: ['Technology'] },
      { name: 'Route 53', count: 40, domains: ['Technology'] },
    ],
    chooseWhen: [
      { service: 'EC2', when: 'Need full control over OS, custom software, persistent compute', not: 'Lambda — EC2 is not serverless and requires management' },
      { service: 'Lambda', when: 'Short-duration, event-driven, serverless functions (max 15 min)', not: 'EC2 — Lambda cannot run long-running or persistent processes' },
      { service: 'S3', when: 'Store and retrieve any amount of data, static website hosting, backups', not: 'EBS — EBS is attached to a single EC2; S3 is globally accessible' },
      { service: 'CloudWatch', when: 'Monitor AWS resources, set alarms, view metrics and logs', not: 'CloudTrail — CloudWatch is for performance metrics; CloudTrail is for API activity' },
      { service: 'Trusted Advisor', when: 'Get recommendations on cost, security, performance, fault tolerance', not: 'Cost Explorer — TA gives recommendations; CE shows spending patterns' },
    ],
    traps: [
      { trap: 'Shared Responsibility Model', why: 'AWS responsible for "security OF the cloud" (hardware, facilities, network). Customer responsible for "security IN the cloud" (data, IAM, OS patching).' },
      { trap: 'CapEx vs OpEx', why: 'On-premise = CapEx (upfront capital). Cloud = OpEx (operational, pay as you go). Cloud converts CapEx to OpEx.' },
      { trap: 'CloudTrail vs CloudWatch', why: 'CloudTrail = WHO did WHAT (API calls, audit log). CloudWatch = WHAT is happening (metrics, alarms, performance).' },
      { trap: 'Support plans', why: 'Basic (free) → Developer → Business → Enterprise On-Ramp → Enterprise. Only Business+ gets 24/7 phone support and a TAM at Enterprise.' },
    ],
    architecturePatterns: [
      { name: 'Basic Web Hosting', services: ['EC2', 'S3', 'RDS', 'Route 53'], use: 'Most common entry-level architecture.' },
      { name: 'Serverless', services: ['Lambda', 'API Gateway', 'DynamoDB', 'S3'], use: 'No infrastructure to manage.' },
      { name: 'Static Site', services: ['S3', 'CloudFront', 'Route 53'], use: 'Cheapest way to host a website.' },
    ],
  },
  {
    id: 'dva-c02',
    code: 'DVA-C02',
    name: 'Developer Associate',
    icon: '💻',
    color: '#7c3aed',
    passingScore: 720,
    duration: 130,
    questions: 65,
    domains: [
      { name: 'Development', weight: 32, key: ['SDK', 'CLI', 'APIs', 'Lambda', 'DynamoDB', 'S3 SDK', 'SQS/SNS'] },
      { name: 'Security', weight: 26, key: ['IAM roles', 'Cognito', 'KMS', 'Secrets Manager', 'STS'] },
      { name: 'Deployment', weight: 24, key: ['CodePipeline', 'CodeBuild', 'CodeDeploy', 'Elastic Beanstalk', 'CloudFormation'] },
      { name: 'Troubleshooting', weight: 18, key: ['X-Ray', 'CloudWatch Logs', 'CloudTrail', 'error codes', 'retry logic'] },
    ],
    topServices: [
      { name: 'Lambda', count: 200, domains: ['Development', 'Deployment'] },
      { name: 'DynamoDB', count: 180, domains: ['Development'] },
      { name: 'API Gateway', count: 150, domains: ['Development', 'Security'] },
      { name: 'SQS', count: 120, domains: ['Development'] },
      { name: 'Cognito', count: 100, domains: ['Security'] },
      { name: 'CloudFormation', count: 90, domains: ['Deployment'] },
      { name: 'X-Ray', count: 80, domains: ['Troubleshooting'] },
      { name: 'CodeDeploy', count: 75, domains: ['Deployment'] },
      { name: 'ElastiCache', count: 70, domains: ['Development'] },
      { name: 'Kinesis', count: 65, domains: ['Development'] },
    ],
    chooseWhen: [
      { service: 'Secrets Manager', when: 'Store and auto-rotate database credentials, API keys, secrets', not: 'Parameter Store — Secrets Manager has auto-rotation; Parameter Store is for config values' },
      { service: 'DynamoDB DAX', when: 'Need microsecond read latency for DynamoDB (in-memory cache)', not: 'ElastiCache — DAX is DynamoDB-specific; ElastiCache works with any DB' },
      { service: 'SQS FIFO', when: 'Message ordering matters, exactly-once processing required', not: 'SQS Standard — Standard is faster but unordered with possible duplicates' },
      { service: 'Cognito User Pools', when: 'User authentication (sign up, sign in, MFA)', not: 'Cognito Identity Pools — Identity Pools give AWS credentials; User Pools give JWT tokens' },
      { service: 'X-Ray', when: 'Trace and debug distributed applications, identify bottlenecks', not: 'CloudWatch — X-Ray shows request traces across services; CloudWatch shows metrics' },
    ],
    traps: [
      { trap: 'Lambda cold start', why: 'Cold starts happen when a new container is initialized. Provisioned Concurrency eliminates cold starts. SnapStart is for Java Lambdas.' },
      { trap: 'DynamoDB partition key design', why: 'High cardinality partition keys distribute data evenly. Poor partition key = hot partition = throttling. Always choose high-cardinality keys.' },
      { trap: 'CodeDeploy deployment types', why: 'In-place = replace on existing servers. Blue/Green = new fleet, swap traffic. Blue/Green has zero downtime.' },
      { trap: 'API Gateway integration types', why: 'Lambda Proxy = full request/response to Lambda. Lambda integration = transform request. Proxy is simpler and most common.' },
    ],
    architecturePatterns: [
      { name: 'Serverless API', services: ['API Gateway', 'Lambda', 'DynamoDB', 'Cognito'], use: 'Standard serverless REST API with auth.' },
      { name: 'CI/CD Pipeline', services: ['CodeCommit', 'CodeBuild', 'CodeDeploy', 'CodePipeline'], use: 'Full AWS-native CI/CD.' },
      { name: 'Event-Driven', services: ['SQS', 'Lambda', 'DynamoDB', 'SNS'], use: 'Decouple producers from consumers.' },
    ],
  },
]

// Add placeholder sheets for remaining certs
const CERT_STUBS = [
  { id: 'soa-c02', code: 'SOA-C02', name: 'SysOps Administrator', icon: '⚙️', color: '#0369a1' },
  { id: 'dea-c01', code: 'DEA-C01', name: 'Data Engineer Associate', icon: '📊', color: '#0891b2' },
  { id: 'mla-c01', code: 'MLA-C01', name: 'ML Engineer Associate', icon: '🤖', color: '#7c3aed' },
  { id: 'sap-c02', code: 'SAP-C02', name: 'Solutions Architect Pro', icon: '🏛️', color: '#1d4ed8' },
  { id: 'dop-c02', code: 'DOP-C02', name: 'DevOps Engineer Pro', icon: '🔄', color: '#15803d' },
  { id: 'scs-c03', code: 'SCS-C03', name: 'Security Specialty', icon: '🔒', color: '#dc2626' },
  { id: 'ans-c01', code: 'ANS-C01', name: 'Advanced Networking', icon: '🌐', color: '#0369a1' },
  { id: 'aif-c01', code: 'AIF-C01', name: 'AI Practitioner', icon: '🧠', color: '#7c3aed' },
  { id: 'gai-c01', code: 'GAI-C01', name: 'Generative AI Specialty', icon: '✨', color: '#9333ea' },
]

export default function CheatSheets() {
  const [selectedId, setSelectedId] = useState('saa-c03')
  const [activeTab, setActiveTab] = useState<'domains' | 'services' | 'choose' | 'traps' | 'patterns'>('domains')

  const sheet = SHEETS.find(s => s.id === selectedId)
  const stub = CERT_STUBS.find(s => s.id === selectedId)

  const tabs: { id: typeof activeTab; label: string }[] = [
    { id: 'domains', label: '📋 Domains' },
    { id: 'services', label: '🔥 Top Services' },
    { id: 'choose', label: '✅ Choose When' },
    { id: 'traps', label: '⚠️ Traps' },
    { id: 'patterns', label: '🏗️ Patterns' },
  ]

  return (
    <Layout>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(160deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%)', padding: '3.5rem 1.5rem 2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-60px', left: '15%', width: '300px', height: '300px', background: 'rgba(96,165,250,0.12)', borderRadius: '50%', filter: 'blur(70px)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '999px', padding: '0.4rem 1rem', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Mined from 3,958 questions</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, color: '#fff', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
            AWS Certification Cheat Sheets
          </h1>
          <p style={{ color: '#93c5fd', fontSize: '1rem', maxWidth: '500px', margin: '0 auto', lineHeight: 1.7 }}>
            Exam domains, top tested services, choose-when patterns, and traps — extracted from real practice questions.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Cert selector */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {SHEETS.map(s => (
            <button
              key={s.id}
              onClick={() => { setSelectedId(s.id); setActiveTab('domains') }}
              style={{
                padding: '0.45rem 1rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700,
                border: 'none', cursor: 'pointer',
                background: selectedId === s.id ? s.color : '#fff',
                color: selectedId === s.id ? '#fff' : '#6b7280',
                boxShadow: selectedId === s.id ? 'none' : '0 0 0 1px #e5e7eb',
              }}
            >
              {s.icon} {s.code}
            </button>
          ))}
          {CERT_STUBS.map(s => (
            <button
              key={s.id}
              onClick={() => { setSelectedId(s.id); setActiveTab('domains') }}
              style={{
                padding: '0.45rem 1rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700,
                border: 'none', cursor: 'pointer',
                background: selectedId === s.id ? s.color : '#f9fafb',
                color: selectedId === s.id ? '#fff' : '#9ca3af',
                boxShadow: '0 0 0 1px #e5e7eb',
              }}
            >
              {s.icon} {s.code}
            </button>
          ))}
        </div>

        {/* Sheet not built yet */}
        {!sheet && stub && (
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '1.25rem', padding: '3rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{stub.icon}</div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>{stub.code} Cheat Sheet</h2>
            <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Coming soon — being mined from {stub.code === 'SAP-C02' || stub.code === 'DOP-C02' ? '260 Pro-level' : '260'} practice questions.</p>
            <Link to={`/cert/${stub.id}`} style={{ display: 'inline-block', padding: '0.625rem 1.25rem', background: stub.color, color: '#fff', borderRadius: '0.75rem', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}>
              Practice {stub.code} Questions →
            </Link>
          </div>
        )}

        {/* Full sheet */}
        {sheet && (
          <>
            {/* Sheet header */}
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '1.25rem', padding: '1.5rem 1.75rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: sheet.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>{sheet.code}</div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: '0 0 0.25rem' }}>{sheet.name}</h2>
                <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.8rem', color: '#6b7280', fontWeight: 600 }}>
                  <span>⏱ {sheet.duration} min</span>
                  <span>❓ {sheet.questions} questions</span>
                  <span>🎯 {sheet.passingScore}/1000 to pass</span>
                </div>
              </div>
              <Link to={`/cert/${sheet.id}`} style={{ padding: '0.625rem 1.25rem', background: sheet.color, color: '#fff', borderRadius: '0.75rem', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                Practice Questions →
              </Link>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              {tabs.map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  style={{
                    padding: '0.5rem 1rem', borderRadius: '0.75rem', fontSize: '0.82rem', fontWeight: 700,
                    border: 'none', cursor: 'pointer',
                    background: activeTab === t.id ? sheet.color : '#f3f4f6',
                    color: activeTab === t.id ? '#fff' : '#374151',
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab: Domains */}
            {activeTab === 'domains' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {sheet.domains.map(d => (
                  <div key={d.name} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '1rem', padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111827', margin: 0 }}>{d.name}</h3>
                      <span style={{ background: sheet.color, color: '#fff', borderRadius: '999px', padding: '0.2rem 0.75rem', fontSize: '0.8rem', fontWeight: 800 }}>{d.weight}%</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: '#f3f4f6', borderRadius: '999px', marginBottom: '1rem' }}>
                      <div style={{ width: `${d.weight}%`, height: '100%', background: sheet.color, borderRadius: '999px' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {d.key.map(k => (
                        <span key={k} style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '0.5rem', padding: '0.25rem 0.625rem', fontSize: '0.75rem', fontWeight: 700, color: '#0369a1' }}>
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Top Services */}
            {activeTab === 'services' && (
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '1rem', overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111827', margin: 0 }}>Most Tested Services</h3>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>computed from {sheet.code} question data</span>
                </div>
                {sheet.topServices.map((svc, i) => {
                  const max = sheet.topServices[0].count
                  const pct = Math.round((svc.count / max) * 100)
                  return (
                    <div key={svc.name} style={{ padding: '0.875rem 1.5rem', borderBottom: i < sheet.topServices.length - 1 ? '1px solid #f9fafb' : 'none', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#9ca3af', width: '20px', textAlign: 'right' }}>#{i + 1}</span>
                      <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#111827', width: '140px' }}>{svc.name}</span>
                      <div style={{ flex: 1, height: '8px', background: '#f3f4f6', borderRadius: '999px' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: sheet.color, borderRadius: '999px', opacity: 0.8 }} />
                      </div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#374151', width: '60px', textAlign: 'right' }}>{svc.count} q's</span>
                      <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', width: '120px' }}>
                        {svc.domains.map(d => (
                          <span key={d} style={{ fontSize: '0.65rem', fontWeight: 700, color: sheet.color, background: `${sheet.color}15`, borderRadius: '0.375rem', padding: '0.1rem 0.4rem' }}>{d}</span>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Tab: Choose When */}
            {activeTab === 'choose' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {sheet.chooseWhen.map((item, i) => (
                  <div key={i} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '1rem', padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.625rem' }}>
                      <span style={{ background: sheet.color, color: '#fff', borderRadius: '0.5rem', padding: '0.2rem 0.75rem', fontSize: '0.8rem', fontWeight: 800 }}>{item.service}</span>
                    </div>
                    <p style={{ margin: '0 0 0.625rem', fontSize: '0.875rem', color: '#111827', lineHeight: 1.6 }}>
                      <span style={{ fontWeight: 700, color: '#16a34a' }}>✓ Use when: </span>{item.when}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#6b7280', lineHeight: 1.6 }}>
                      <span style={{ fontWeight: 700, color: '#dc2626' }}>✗ Not: </span>{item.not}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Traps */}
            {activeTab === 'traps' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {sheet.traps.map((item, i) => (
                  <div key={i} style={{ background: '#fff', border: '1px solid #fecaca', borderRadius: '1rem', padding: '1.25rem 1.5rem', borderLeft: `4px solid #dc2626` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '1rem' }}>⚠️</span>
                      <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#dc2626' }}>{item.trap}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#374151', lineHeight: 1.65 }}>{item.why}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Architecture Patterns */}
            {activeTab === 'patterns' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {sheet.architecturePatterns.map((p, i) => (
                  <div key={i} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '1rem', padding: '1.25rem 1.5rem' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111827', margin: '0 0 0.75rem' }}>{p.name}</h3>
                    <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                      {p.services.map((s, si) => (
                        <span key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <span style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '0.5rem', padding: '0.25rem 0.625rem', fontSize: '0.75rem', fontWeight: 700, color: '#0369a1' }}>{s}</span>
                          {si < p.services.length - 1 && <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>→</span>}
                        </span>
                      ))}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#6b7280', lineHeight: 1.6 }}>{p.use}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Practice CTA */}
            <div style={{ marginTop: '2rem', background: 'linear-gradient(135deg, #0f172a, #1e3a8a)', borderRadius: '1.25rem', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff', margin: '0 0 0.25rem' }}>Ready to test yourself?</p>
                <p style={{ fontSize: '0.82rem', color: '#93c5fd', margin: 0 }}>Practice with real {sheet.code} questions to reinforce what you just studied.</p>
              </div>
              <Link to={`/cert/${sheet.id}`} style={{ flexShrink: 0, padding: '0.625rem 1.25rem', background: sheet.color, color: '#fff', borderRadius: '0.75rem', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}>
                Start Practicing →
              </Link>
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}
