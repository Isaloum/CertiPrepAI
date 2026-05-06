import { useState } from 'react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Legend, ResponsiveContainer, Tooltip,
} from 'recharts'
import type { DomainScore as DBDomainScore } from '../lib/db'

// ── Official exam domain breakdown ───────────────────────────────
// catKey matches the `cat` field in question JSON files
interface DomainDef {
  catKey: string    // matches question JSON `cat` field
  label: string     // display label on radar
  examWeight: number // official exam guide weight %
}

const CERT_DOMAINS: Record<string, DomainDef[]> = {
  'saa-c03': [
    { catKey: 'resilient-arch',      label: 'Resilient Arch',  examWeight: 30 },
    { catKey: 'high-perf-arch',      label: 'High-Performing', examWeight: 28 },
    { catKey: 'secure-arch',         label: 'Secure Arch',     examWeight: 24 },
    { catKey: 'cost-optimized-arch', label: 'Cost-Optimized',  examWeight: 18 },
  ],
  'clf-c02': [
    { catKey: 'cloud-concepts',    label: 'Cloud Concepts',    examWeight: 24 },
    { catKey: 'security-compliance', label: 'Security',        examWeight: 30 },
    { catKey: 'cloud-technology',  label: 'Cloud Technology',  examWeight: 34 },
    { catKey: 'billing-pricing',   label: 'Billing & Pricing', examWeight: 12 },
  ],
  'dva-c02': [
    { catKey: 'development',    label: 'Development',    examWeight: 32 },
    { catKey: 'security',       label: 'Security',       examWeight: 26 },
    { catKey: 'deployment',     label: 'Deployment',     examWeight: 24 },
    { catKey: 'troubleshooting', label: 'Troubleshooting', examWeight: 18 },
  ],
  'soa-c02': [
    { catKey: 'monitoring',       label: 'Monitoring',    examWeight: 20 },
    { catKey: 'reliability',      label: 'Reliability',   examWeight: 16 },
    { catKey: 'deployment',       label: 'Deployment',    examWeight: 18 },
    { catKey: 'security',         label: 'Security',      examWeight: 16 },
    { catKey: 'networking',       label: 'Networking',    examWeight: 18 },
    { catKey: 'cost-performance', label: 'Cost & Perf',   examWeight: 12 },
  ],
  'dea-c01': [
    { catKey: 'data-ingestion-transformation', label: 'Ingestion & Transform', examWeight: 34 },
    { catKey: 'data-store-management',         label: 'Store & Manage',        examWeight: 26 },
    { catKey: 'data-operations',               label: 'Operate Pipelines',     examWeight: 22 },
    { catKey: 'data-security-governance',      label: 'Security',              examWeight: 18 },
  ],
  'mla-c01': [
    { catKey: 'data-preparation',        label: 'Data Preparation',  examWeight: 28 },
    { catKey: 'model-development',       label: 'Model Development', examWeight: 26 },
    { catKey: 'deployment-orchestration', label: 'Deployment',       examWeight: 22 },
    { catKey: 'monitoring-governance',   label: 'Monitoring',        examWeight: 24 },
  ],
  'scs-c03': [
    { catKey: 'threat-detection',    label: 'Threat Detection', examWeight: 14 },
    { catKey: 'security-logging',    label: 'Logging',          examWeight: 18 },
    { catKey: 'infrastructure-security', label: 'Infrastructure', examWeight: 20 },
    { catKey: 'iam',                 label: 'Identity & Access', examWeight: 16 },
    { catKey: 'data-protection',     label: 'Data Protection',  examWeight: 32 },
  ],
  'ans-c01': [
    { catKey: 'network-design',          label: 'Network Design',  examWeight: 30 },
    { catKey: 'network-implementation',  label: 'Implementation',  examWeight: 26 },
    { catKey: 'network-management',      label: 'Management',      examWeight: 20 },
    { catKey: 'network-security',        label: 'Security',        examWeight: 24 },
  ],
  'sap-c02': [
    { catKey: 'complex-org-design',      label: 'Org Complexity', examWeight: 26 },
    { catKey: 'new-solutions',           label: 'New Solutions',  examWeight: 29 },
    { catKey: 'cost-complexity',         label: 'Improvement',    examWeight: 25 },
    { catKey: 'migration-modernization', label: 'Migration',      examWeight: 20 },
  ],
  'dop-c02': [
    { catKey: 'sdlc-automation',          label: 'SDLC Automation',   examWeight: 22 },
    { catKey: 'configuration-management', label: 'Config & IaC',      examWeight: 17 },
    { catKey: 'high-availability',        label: 'Resilience',        examWeight: 15 },
    { catKey: 'monitoring-logging',       label: 'Monitoring',        examWeight: 15 },
    { catKey: 'incident-event-response',  label: 'Incident Response', examWeight: 14 },
  ],
  'aif-c01': [
    { catKey: 'ai-fundamentals',   label: 'AI & ML Basics',    examWeight: 20 },
    { catKey: 'generative-ai',     label: 'Generative AI',     examWeight: 24 },
    { catKey: 'foundation-models', label: 'Foundation Models', examWeight: 28 },
    { catKey: 'responsible-ai',    label: 'Responsible AI',    examWeight: 14 },
    { catKey: 'ai-security',       label: 'Security',          examWeight: 14 },
  ],
  'gai-c01': [
    { catKey: 'gen-ai-fundamentals', label: 'Gen AI Design',   examWeight: 30 },
    { catKey: 'foundation-models',   label: 'Model Selection', examWeight: 20 },
    { catKey: 'prompt-engineering',  label: 'Optimization',    examWeight: 25 },
    { catKey: 'responsible-ai',      label: 'Responsible AI',  examWeight: 25 },
  ],
}

interface CertOption {
  id: string
  code: string
  name: string
}

interface Props {
  certOptions: CertOption[]
  /** cert_id → overall correct% (0–100). Used as fallback. */
  progressMap: Record<string, number>
  /** cert_id → domain_catKey → { attempted, correct } from DynamoDB */
  domainScoresMap: Record<string, Record<string, DBDomainScore>>
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '0.5rem', padding: '0.5rem 0.85rem', fontSize: '0.78rem', color: '#f1f5f9', lineHeight: 1.7 }}>
      {payload.map(p => (
        <div key={p.name}>
          <span style={{ color: p.name === 'Exam Weight' ? '#60a5fa' : '#f87171' }}>■ </span>
          {p.name}: <strong>{p.value}%</strong>
        </div>
      ))}
    </div>
  )
}

export default function SkillRadarChart({ certOptions, progressMap, domainScoresMap }: Props) {
  const [selectedId, setSelectedId] = useState(certOptions[0]?.id ?? 'saa-c03')

  const hasPracticed = selectedId in progressMap
  const domains = CERT_DOMAINS[selectedId] ?? CERT_DOMAINS['saa-c03']
  const certDomainScores = domainScoresMap[selectedId] ?? {}
  const overallPct = progressMap[selectedId] ?? 0

  const data = domains.map(d => {
    const ds = certDomainScores[d.catKey]
    // Use real per-domain score if available, else fall back to overall %
    const userScore = ds && ds.attempted > 0
      ? Math.round((ds.correct / ds.attempted) * 100)
      : (hasPracticed ? overallPct : 0)
    return {
      domain: d.label,
      examWeight: d.examWeight,
      userScore,
      hasRealData: !!(ds && ds.attempted > 0),
    }
  })

  const hasRealDomainData = data.some(d => d.hasRealData)

  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '1rem', padding: '1.5rem', marginBottom: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827', margin: 0 }}>🕸️ Skill Radar</h2>
        <select
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
          style={{
            fontSize: '0.78rem', fontWeight: 700,
            color: hasPracticed ? '#1d4ed8' : '#92400e',
            background: hasPracticed ? '#eff6ff' : '#fef3c7',
            border: `1px solid ${hasPracticed ? '#bfdbfe' : '#fde68a'}`,
            borderRadius: '999px', padding: '0.2rem 0.75rem',
            cursor: 'pointer', outline: 'none',
          }}
        >
          {certOptions.map(c => (
            <option key={c.id} value={c.id}>
              {c.code}{progressMap[c.id] !== undefined ? ' ✓' : ''}
            </option>
          ))}
        </select>
      </div>

      <p style={{ fontSize: '0.78rem', color: '#6b7280', marginBottom: '1.25rem', marginTop: '0.2rem' }}>
        {hasRealDomainData
          ? `Real per-domain scores from your practice · blue = exam focus`
          : hasPracticed
            ? `Overall score: ${overallPct}% · Take more exams to see per-domain scores`
            : 'No practice yet · blue = what the exam tests'}
      </p>

      <ResponsiveContainer width="100%" height={320}>
        <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis dataKey="domain" tick={{ fill: '#374151', fontSize: 12, fontWeight: 600 }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#9ca3af', fontSize: 10 }} tickCount={5} />
          <Radar name="Exam Weight" dataKey="examWeight" stroke="#2563eb" fill="#2563eb" fillOpacity={0.12} strokeWidth={2} />
          <Radar name="Your Score"  dataKey="userScore"  stroke="#dc2626" fill="#dc2626" fillOpacity={0.15} strokeWidth={2} strokeDasharray="5 3" />
          <Tooltip content={<CustomTooltip />} />
          <Legend formatter={value => <span style={{ fontSize: '0.78rem', color: '#374151', fontWeight: 600 }}>{value}</span>} />
        </RadarChart>
      </ResponsiveContainer>

      {/* Domain score table */}
      <div style={{ marginTop: '0.75rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.5rem' }}>
        {data.map(d => {
          const gap = d.userScore - d.examWeight
          const gapColor = gap >= 0 ? '#16a34a' : gap >= -15 ? '#d97706' : '#dc2626'
          const gapLabel = hasPracticed ? (gap >= 0 ? `+${gap}%` : `${gap}%`) : '—'
          return (
            <div key={d.domain} style={{ background: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: '0.65rem', padding: '0.6rem 0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#374151' }}>{d.domain}</span>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: hasPracticed ? gapColor : '#9ca3af' }}>{gapLabel}</span>
            </div>
          )
        })}
      </div>
      <p style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '0.75rem', textAlign: 'right' }}>
        {hasPracticed ? 'Gap = Your Score − Exam Weight · 🟢 above · 🔴 below' : 'Practice this cert to see your gap score'}
      </p>
    </div>
  )
}
