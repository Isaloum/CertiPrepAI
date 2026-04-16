import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

export interface DomainScore {
  domain: string
  examWeight: number   // 0–100, exam guide weight %
  userScore: number    // 0–100, user's correct % in that domain
}

interface Props {
  data: DomainScore[]
  /** If true, shows a "Sample data" badge */
  isMock?: boolean
}

// Custom tooltip
const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#1e293b',
      border: '1px solid #334155',
      borderRadius: '0.5rem',
      padding: '0.5rem 0.85rem',
      fontSize: '0.78rem',
      color: '#f1f5f9',
      lineHeight: 1.7,
    }}>
      {payload.map(p => (
        <div key={p.name}>
          <span style={{ color: p.name === 'Exam Weight' ? '#60a5fa' : '#f87171' }}>■ </span>
          {p.name}: <strong>{p.value}%</strong>
        </div>
      ))}
    </div>
  )
}

export default function SkillRadarChart({ data, isMock = false }: Props) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: '1rem',
      padding: '1.5rem',
      marginBottom: '2rem',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827', margin: 0 }}>
          🕸️ Skill Radar
        </h2>
        {isMock && (
          <span style={{
            fontSize: '0.7rem', fontWeight: 700, color: '#92400e',
            background: '#fef3c7', border: '1px solid #fde68a',
            padding: '0.15rem 0.6rem', borderRadius: '999px',
          }}>
            Sample data
          </span>
        )}
      </div>
      <p style={{ fontSize: '0.78rem', color: '#6b7280', marginBottom: '1.25rem', marginTop: '0.2rem' }}>
        Your score vs what the exam actually tests
      </p>

      <ResponsiveContainer width="100%" height={320}>
        <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis
            dataKey="domain"
            tick={{ fill: '#374151', fontSize: 12, fontWeight: 600 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: '#9ca3af', fontSize: 10 }}
            tickCount={5}
          />
          <Radar
            name="Exam Weight"
            dataKey="examWeight"
            stroke="#2563eb"
            fill="#2563eb"
            fillOpacity={0.12}
            strokeWidth={2}
          />
          <Radar
            name="Your Score"
            dataKey="userScore"
            stroke="#dc2626"
            fill="#dc2626"
            fillOpacity={0.15}
            strokeWidth={2}
            strokeDasharray="5 3"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => (
              <span style={{ fontSize: '0.78rem', color: '#374151', fontWeight: 600 }}>{value}</span>
            )}
          />
        </RadarChart>
      </ResponsiveContainer>

      {/* Domain score table */}
      <div style={{ marginTop: '0.75rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.5rem' }}>
        {data.map(d => {
          const gap = d.userScore - d.examWeight
          const gapColor = gap >= 0 ? '#16a34a' : gap >= -15 ? '#d97706' : '#dc2626'
          const gapLabel = gap >= 0 ? `+${gap}%` : `${gap}%`
          return (
            <div key={d.domain} style={{
              background: '#f9fafb',
              border: '1px solid #f3f4f6',
              borderRadius: '0.65rem',
              padding: '0.6rem 0.85rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#374151' }}>{d.domain}</span>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: gapColor }}>{gapLabel}</span>
            </div>
          )
        })}
      </div>
      <p style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '0.75rem', textAlign: 'right' }}>
        Gap = Your Score − Exam Weight · 🟢 above · 🔴 below
      </p>
    </div>
  )
}
