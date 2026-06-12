/**
 * CertLanding.tsx
 * Public SEO landing view for /cert/:certId — shown to logged-out visitors.
 * Logged-in users never see this; they get the practice experience (CertDetail).
 *
 * Why this exists: previously /cert/* redirected anonymous visitors (including
 * Googlebot) to /signup, so Google indexed these pages as "Sign Up Free" or
 * skipped them entirely ("Discovered - currently not indexed").
 * This view renders real, crawlable content on the same URL.
 */
import { Link } from 'react-router-dom'
import Layout from './Layout'

interface Question {
  cat: string
  q: string
  options: string[]
  answer: number
  explain: string
}

interface CertMeta {
  name: string
  code: string
  icon: string
  domains: Record<string, string>
}

interface Props {
  certId: string
  meta: CertMeta
  questions: Question[]
}

interface CertContent {
  level?: string
  examQuestions?: number
  durationMin?: number
  passingScore?: number
  costUsd?: number
  overview: string
  faqs: { q: string; a: string }[]
}

const CONTENT: Record<string, CertContent> = {
  'saa-c03': {
    level: 'Associate', examQuestions: 65, durationMin: 130, passingScore: 720, costUsd: 150,
    overview: 'The AWS Certified Solutions Architect – Associate (SAA-C03) validates your ability to design secure, resilient, high-performing, and cost-optimized architectures on AWS. It is the most popular AWS certification and a common requirement for cloud architect, engineer, and consultant roles. The exam is heavily scenario-based, testing your judgment across core services like EC2, S3, RDS, VPC, Lambda, CloudFront, and Route 53.',
    faqs: [
      { q: 'How hard is the SAA-C03 exam?', a: 'SAA-C03 is intermediate difficulty. It covers four domains: Design Secure Architectures (30%), Design Resilient Architectures (26%), Design High-Performing Architectures (24%), and Design Cost-Optimized Architectures (20%). Most candidates prepare for 1–3 months.' },
      { q: 'What score do you need to pass SAA-C03?', a: 'You need a scaled score of 720 out of 1000. The exam has 65 questions and a 130-minute time limit.' },
      { q: 'How long should I study for SAA-C03?', a: 'With prior AWS experience, 4–6 weeks of consistent practice is typical. Starting from scratch, plan for 2–3 months combining a video course with scenario-based practice questions.' },
      { q: 'Are these practice questions like the real SAA-C03 exam?', a: 'Yes — every question is scenario-based and derived from the official SAA-C03 exam guide and AWS documentation, with a detailed explanation of why the right answer wins and the others lose.' },
    ],
  },
  'clf-c02': {
    level: 'Foundational', examQuestions: 65, durationMin: 90, passingScore: 700, costUsd: 100,
    overview: 'The AWS Certified Cloud Practitioner (CLF-C02) is the entry-level AWS certification, designed for anyone starting a cloud career — no technical background required. It validates a high-level understanding of AWS services, the shared responsibility model, security, pricing, and support plans, and is the most common first step before the Associate-level exams.',
    faqs: [
      { q: 'Is CLF-C02 good for beginners?', a: 'Yes — CLF-C02 is built for beginners. It assumes no hands-on AWS experience and covers four domains: Cloud Concepts (24%), Security and Compliance (30%), Cloud Technology and Services (34%), and Billing, Pricing, and Support (12%).' },
      { q: 'What score do you need to pass CLF-C02?', a: 'You need a scaled score of 700 out of 1000. The exam has 65 questions with a 90-minute time limit.' },
      { q: 'How long does it take to prepare for CLF-C02?', a: 'Most candidates with no cloud background pass after 2–6 weeks of study. Practicing exam-style questions is the fastest way to expose knowledge gaps.' },
      { q: 'Should I take CLF-C02 or go straight to SAA-C03?', a: 'If you already work with AWS, you can skip to SAA-C03. If you are new to cloud computing or want a confidence-building first win, CLF-C02 is the natural starting point.' },
    ],
  },
  'aif-c01': {
    level: 'Foundational', examQuestions: 65, durationMin: 90, passingScore: 700, costUsd: 100,
    overview: 'The AWS Certified AI Practitioner (AIF-C01) validates foundational knowledge of artificial intelligence, machine learning, and generative AI on AWS. It covers core AI/ML concepts, AWS services like Amazon Bedrock and SageMaker, prompt engineering, RAG, fine-tuning, responsible AI, and AI security — making it the go-to certification for professionals entering the AI space.',
    faqs: [
      { q: 'Who should take the AIF-C01 exam?', a: 'AIF-C01 is aimed at business and technical professionals who work with AI but do not necessarily build models — analysts, project managers, developers, and architects who need fluency in AWS AI services and generative AI concepts.' },
      { q: 'What score do you need to pass AIF-C01?', a: 'You need a scaled score of 700 out of 1000. The exam has 65 questions and a 90-minute time limit.' },
      { q: 'What topics does AIF-C01 cover?', a: 'AI/ML fundamentals, generative AI and foundation models, Amazon Bedrock (including Knowledge Bases, Agents, and Guardrails), prompt engineering, RAG vs fine-tuning, responsible AI, and securing AI workloads.' },
      { q: 'Are these practice questions like the real AIF-C01 exam?', a: 'Yes — questions mirror the official exam guide, focusing on choosing the right AWS AI service or technique for a scenario, with detailed explanations.' },
    ],
  },
  'dva-c02': {
    level: 'Associate', examQuestions: 65, durationMin: 130, passingScore: 720, costUsd: 150,
    overview: 'The AWS Certified Developer – Associate (DVA-C02) validates your ability to develop, deploy, and debug cloud applications on AWS. It goes deep on Lambda, API Gateway, DynamoDB, IAM, CI/CD with CodePipeline, container services, and observability — the daily toolkit of an AWS application developer.',
    faqs: [
      { q: 'How hard is the DVA-C02 exam?', a: 'DVA-C02 is intermediate difficulty with a developer focus. Its domains are Development with AWS Services (32%), Security (26%), Deployment (24%), and Troubleshooting and Optimization (18%). Hands-on coding experience with AWS makes it significantly easier.' },
      { q: 'What score do you need to pass DVA-C02?', a: 'You need a scaled score of 720 out of 1000. The exam has 65 questions and a 130-minute time limit.' },
      { q: 'DVA-C02 vs SAA-C03 — which should I take?', a: 'SAA-C03 tests architecture breadth; DVA-C02 tests developer depth (SDKs, Lambda internals, DynamoDB design, CI/CD). If you write code daily, DVA-C02 often feels more natural.' },
      { q: 'Are these practice questions like the real DVA-C02 exam?', a: 'Yes — scenario-based questions built from the official exam guide and AWS documentation, each with a detailed explanation.' },
    ],
  },
  'soa-c02': {
    level: 'Associate', examQuestions: 65, durationMin: 130, passingScore: 720, costUsd: 150,
    overview: 'The AWS Certified SysOps Administrator – Associate (SOA-C02) validates your ability to deploy, manage, and operate workloads on AWS. It emphasizes monitoring with CloudWatch, reliability and business continuity, deployment automation, networking, and security — the core skills of cloud operations and support engineers.',
    faqs: [
      { q: 'How hard is the SOA-C02 exam?', a: 'SOA-C02 is widely considered the most operationally demanding Associate exam. It covers Monitoring and Remediation (20%), Reliability (16%), Deployment and Automation (18%), Security (16%), Networking (18%), and Cost Optimization (12%).' },
      { q: 'What score do you need to pass SOA-C02?', a: 'You need a scaled score of 720 out of 1000. The exam has 65 questions and a 130-minute time limit.' },
      { q: 'Who should take SOA-C02?', a: 'Cloud operations engineers, system administrators, and support engineers who run production AWS workloads. Deep CloudWatch, Systems Manager, and troubleshooting knowledge is rewarded.' },
      { q: 'Are these practice questions like the real SOA-C02 exam?', a: 'Yes — operations-focused scenarios derived from the official exam guide, each with detailed explanations.' },
    ],
  },
  'dea-c01': {
    level: 'Associate', examQuestions: 65, durationMin: 130, passingScore: 720, costUsd: 150,
    overview: 'The AWS Certified Data Engineer – Associate (DEA-C01) validates your ability to design and operate data pipelines on AWS. It covers ingestion and transformation with Glue, Kinesis, and EMR, data stores like Redshift, S3, and DynamoDB, pipeline orchestration, and data security and governance.',
    faqs: [
      { q: 'What does the DEA-C01 exam cover?', a: 'Four domains: Data Ingestion and Transformation (34%), Data Store Management (26%), Data Operations and Support (22%), and Data Security and Governance (18%).' },
      { q: 'What score do you need to pass DEA-C01?', a: 'You need a scaled score of 720 out of 1000. The exam has 65 questions and a 130-minute time limit.' },
      { q: 'Who should take DEA-C01?', a: 'Data engineers, analytics engineers, and developers building ETL/ELT pipelines on AWS. Familiarity with Glue, Kinesis, Redshift, Athena, and S3 data lake patterns is essential.' },
      { q: 'Are these practice questions like the real DEA-C01 exam?', a: 'Yes — pipeline and data-store scenarios built from the official exam guide, each with a detailed explanation.' },
    ],
  },
  'mla-c01': {
    level: 'Associate', examQuestions: 65, durationMin: 130, passingScore: 720, costUsd: 150,
    overview: 'The AWS Certified Machine Learning Engineer – Associate (MLA-C01) validates your ability to build, deploy, and operationalize ML solutions on AWS. It focuses on data preparation, model development and tuning in SageMaker, deployment and orchestration of ML pipelines, and monitoring models in production.',
    faqs: [
      { q: 'What does the MLA-C01 exam cover?', a: 'Four domains: Data Preparation for ML (28%), ML Model Development (26%), Deployment and Orchestration of ML Workflows (22%), and ML Solution Monitoring, Maintenance, and Security (24%).' },
      { q: 'What score do you need to pass MLA-C01?', a: 'You need a scaled score of 720 out of 1000. The exam has 65 questions and a 130-minute time limit.' },
      { q: 'MLA-C01 vs AIF-C01 — which one is for me?', a: 'AIF-C01 is foundational and conceptual; MLA-C01 is hands-on engineering. If you build and deploy models with SageMaker, MLA-C01 is the right target.' },
      { q: 'Are these practice questions like the real MLA-C01 exam?', a: 'Yes — SageMaker and MLOps scenarios derived from the official exam guide, each with detailed explanations.' },
    ],
  },
  'gai-c01': {
    overview: 'The AWS Certified Generative AI Developer (GAI-C01) validates your ability to design and build generative AI applications on AWS. It focuses on Amazon Bedrock, foundation model selection and customization, RAG architectures, agents, prompt engineering, and responsible AI practices for production generative AI workloads.',
    faqs: [
      { q: 'Who should take the GAI-C01 exam?', a: 'Developers and architects building generative AI applications on AWS — especially those working with Amazon Bedrock, foundation models, RAG pipelines, and AI agents.' },
      { q: 'What topics does GAI-C01 cover?', a: 'Generative AI fundamentals, Amazon Bedrock (Knowledge Bases, Agents, Guardrails), foundation model selection and customization, prompt engineering, and responsible AI for production workloads.' },
      { q: 'GAI-C01 vs AIF-C01 — what is the difference?', a: 'AIF-C01 is a broad, foundational AI certification. GAI-C01 goes deeper into actually building generative AI applications: architecture choices, model customization, and production concerns.' },
      { q: 'Are these practice questions like the real GAI-C01 exam?', a: 'Yes — scenario-based questions covering Bedrock, RAG, agents, and responsible AI, each with a detailed explanation.' },
    ],
  },
  'sap-c02': {
    level: 'Professional', examQuestions: 75, durationMin: 180, passingScore: 750, costUsd: 300,
    overview: 'The AWS Certified Solutions Architect – Professional (SAP-C02) is one of the most challenging AWS certifications. It validates advanced ability to design complex, multi-account solutions for organizations: large-scale migrations, hybrid connectivity, cost governance, and continuous improvement of existing architectures.',
    faqs: [
      { q: 'How hard is the SAP-C02 exam?', a: 'SAP-C02 is among the hardest AWS exams. Questions are long, multi-layered scenarios across four domains: Design Solutions for Organizational Complexity (26%), Design for New Solutions (29%), Continuous Improvement for Existing Solutions (25%), and Accelerate Workload Migration and Modernization (20%).' },
      { q: 'What score do you need to pass SAP-C02?', a: 'You need a scaled score of 750 out of 1000. The exam has 75 questions and a 180-minute time limit.' },
      { q: 'Do I need SAA-C03 before SAP-C02?', a: 'AWS removed formal prerequisites, but the Associate-level knowledge is assumed. Most successful candidates have 2+ years of hands-on AWS architecture experience.' },
      { q: 'Are these practice questions like the real SAP-C02 exam?', a: 'Yes — long-form, multi-account scenarios derived from the official exam guide, each with a detailed explanation of the trade-offs.' },
    ],
  },
  'dop-c02': {
    level: 'Professional', examQuestions: 75, durationMin: 180, passingScore: 750, costUsd: 300,
    overview: 'The AWS Certified DevOps Engineer – Professional (DOP-C02) validates advanced ability to automate, operate, and secure AWS environments at scale. It covers CI/CD with CodePipeline, infrastructure as code with CloudFormation and CDK, configuration management, observability, incident response, and high availability.',
    faqs: [
      { q: 'How hard is the DOP-C02 exam?', a: 'DOP-C02 is a Professional-level exam with deep automation scenarios. Domains include SDLC Automation (22%), Configuration Management and IaC (17%), Resilient Cloud Solutions (15%), Monitoring and Logging (15%), Incident and Event Response (14%), and Security and Compliance (17%).' },
      { q: 'What score do you need to pass DOP-C02?', a: 'You need a scaled score of 750 out of 1000. The exam has 75 questions and a 180-minute time limit.' },
      { q: 'Who should take DOP-C02?', a: 'DevOps and platform engineers who automate AWS at scale — heavy users of CodePipeline, CloudFormation/CDK, Systems Manager, CloudWatch, and EventBridge.' },
      { q: 'Are these practice questions like the real DOP-C02 exam?', a: 'Yes — automation and operations scenarios derived from the official exam guide, each with a detailed explanation.' },
    ],
  },
  'scs-c03': {
    level: 'Specialty',
    overview: 'The AWS Certified Security – Specialty (SCS-C03) validates deep expertise in securing AWS workloads: threat detection and incident response with GuardDuty and Security Hub, identity and access management, infrastructure protection, data protection with KMS, and security logging, monitoring, and governance.',
    faqs: [
      { q: 'Who should take the SCS-C03 exam?', a: 'Security engineers, cloud security architects, and SecOps professionals with hands-on AWS security experience. Deep IAM and KMS knowledge is essential.' },
      { q: 'What does SCS-C03 cover?', a: 'Threat detection and incident response, security logging and monitoring, infrastructure security, identity and access management, and data protection — across services like GuardDuty, Security Hub, IAM, KMS, and CloudTrail.' },
      { q: 'How should I prepare for SCS-C03?', a: 'Combine hands-on practice in IAM policy evaluation, KMS key policies, and incident-response runbooks with scenario-based practice questions to learn how AWS frames security trade-offs.' },
      { q: 'Are these practice questions like the real SCS-C03 exam?', a: 'Yes — security scenarios derived from the official exam guide and AWS documentation, each with a detailed explanation.' },
    ],
  },
  'ans-c01': {
    level: 'Specialty', examQuestions: 65, durationMin: 170, passingScore: 750, costUsd: 300,
    overview: 'The AWS Certified Advanced Networking – Specialty (ANS-C01) validates expert-level networking on AWS: VPC design at scale, hybrid connectivity with Direct Connect and Site-to-Site VPN, Transit Gateway architectures, Route 53 DNS strategies, and network security and management.',
    faqs: [
      { q: 'How hard is the ANS-C01 exam?', a: 'ANS-C01 is considered one of the hardest AWS specialty exams. It assumes deep networking fundamentals (BGP, routing, DNS) plus AWS-specific design: Network Design (30%), Network Implementation (26%), Network Management and Operation (20%), and Network Security, Compliance, and Governance (24%).' },
      { q: 'What score do you need to pass ANS-C01?', a: 'You need a scaled score of 750 out of 1000. The exam has 65 questions and a 170-minute time limit.' },
      { q: 'Who should take ANS-C01?', a: 'Network engineers and architects managing hybrid or large multi-VPC AWS environments — heavy users of Transit Gateway, Direct Connect, Route 53, and VPC networking features.' },
      { q: 'Are these practice questions like the real ANS-C01 exam?', a: 'Yes — complex networking scenarios derived from the official exam guide, each with a detailed explanation.' },
    ],
  },
}

const card: React.CSSProperties = { background: '#fff', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '16px' }
const h2Style: React.CSSProperties = { fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 14px' }

export default function CertLanding({ certId, meta, questions }: Props) {
  const content = CONTENT[certId]
  const samples = questions.slice(0, 5)
  const facts = content && content.examQuestions
    ? [
        { label: 'Level', value: content.level || '—' },
        { label: 'Exam questions', value: String(content.examQuestions) },
        { label: 'Time limit', value: `${content.durationMin} min` },
        { label: 'Passing score', value: `${content.passingScore}/1000` },
        { label: 'Exam cost', value: `$${content.costUsd} USD` },
      ]
    : null

  return (
    <Layout>
      <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '40px 20px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>

          {/* Hero */}
          <header style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }} aria-hidden="true">{meta.icon}</div>
            <div style={{ display: 'inline-block', background: '#eff6ff', color: '#2563eb', padding: '4px 14px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '12px', letterSpacing: '0.05em' }}>
              {meta.code}
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 10px' }}>
              {meta.code} Practice Exam — AWS {meta.name}
            </h1>
            <p style={{ color: '#475569', fontSize: '1.05rem', margin: 0 }}>
              {questions.length.toLocaleString()} scenario-based practice questions with detailed explanations.
              Try {samples.length} free below — no account required.
            </p>
          </header>

          {/* Exam facts */}
          {facts && (
            <div style={{ ...card, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '14px', textAlign: 'center' }}>
              {facts.map(f => (
                <div key={f.label}>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>{f.value}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>{f.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Overview */}
          {content && (
            <section style={card}>
              <h2 style={h2Style}>About the AWS {meta.name} ({meta.code}) exam</h2>
              <p style={{ color: '#334155', lineHeight: 1.7, margin: 0 }}>{content.overview}</p>
            </section>
          )}

          {/* Domains */}
          {Object.keys(meta.domains).length > 0 && (
            <section style={card}>
              <h2 style={h2Style}>Exam domains covered</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {Object.values(meta.domains).map(d => (
                  <span key={d} style={{ background: '#f1f5f9', color: '#334155', padding: '6px 14px', borderRadius: '999px', fontSize: '0.88rem', fontWeight: 600 }}>{d}</span>
                ))}
              </div>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '14px', marginBottom: 0 }}>
                Filter practice questions by domain to target your weak areas, then confirm with a timed mock exam.
              </p>
            </section>
          )}

          {/* Free sample questions */}
          {samples.length > 0 && (
            <section style={card}>
              <h2 style={h2Style}>Free {meta.code} sample questions</h2>
              <ol style={{ paddingLeft: '20px', margin: 0, display: 'grid', gap: '20px' }}>
                {samples.map((s, i) => (
                  <li key={i} style={{ color: '#0f172a' }}>
                    <p style={{ fontWeight: 600, lineHeight: 1.6, marginTop: 0 }}>{s.q}</p>
                    <ul style={{ listStyle: 'none', paddingLeft: 0, margin: '0 0 10px', display: 'grid', gap: '6px' }}>
                      {s.options.map((opt, j) => (
                        <li key={j} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 14px', color: '#334155', fontSize: '0.93rem' }}>
                          {String.fromCharCode(65 + j)}. {opt}
                        </li>
                      ))}
                    </ul>
                    <details>
                      <summary style={{ cursor: 'pointer', color: '#2563eb', fontWeight: 700, fontSize: '0.9rem' }}>Show answer & explanation</summary>
                      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '12px 14px', marginTop: '8px', fontSize: '0.92rem', color: '#166534' }}>
                        <strong>Correct answer: {String.fromCharCode(65 + s.answer)}.</strong> {s.explain}
                      </div>
                    </details>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* CTA */}
          <section style={{ ...card, textAlign: 'center', background: '#0f172a' }}>
            <h2 style={{ ...h2Style, color: '#fff' }}>Practice all {questions.length.toLocaleString()} {meta.code} questions</h2>
            <p style={{ color: '#cbd5e1', marginTop: 0 }}>
              Free account: 50 practice questions across any cert. No credit card required.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/signup" style={{ padding: '12px 28px', borderRadius: '10px', background: '#2563eb', color: '#fff', fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem' }}>
                Start practicing free
              </Link>
              <Link to="/sample-questions" style={{ padding: '12px 28px', borderRadius: '10px', background: '#1e293b', color: '#e2e8f0', fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem' }}>
                More free samples
              </Link>
            </div>
          </section>

          {/* FAQ */}
          {content && content.faqs.length > 0 && (
            <section style={card}>
              <h2 style={h2Style}>{meta.code} frequently asked questions</h2>
              <div style={{ display: 'grid', gap: '18px' }}>
                {content.faqs.map(f => (
                  <div key={f.q}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>{f.q}</h3>
                    <p style={{ color: '#475569', lineHeight: 1.65, margin: 0, fontSize: '0.95rem' }}>{f.a}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </Layout>
  )
}
