import { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'

/* ─── Animated Illustration: Card 1 — Electrical → Cloud ─── */
function IllustrationElectrical() {
  return (
    <svg width="172" height="114" viewBox="0 0 172 114" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* ── CHIP ── */}
      <rect x="8" y="14" width="52" height="76" rx="8" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2">
        <animate attributeName="opacity" values="0.8;1;0.8" dur="2.5s" repeatCount="indefinite"/>
      </rect>
      {/* Inner core grid */}
      <rect x="16" y="24" width="14" height="14" rx="3" fill="#93c5fd" stroke="#3b82f6" strokeWidth="1">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="1.6s" begin="0s" repeatCount="indefinite"/>
      </rect>
      <rect x="34" y="24" width="14" height="14" rx="3" fill="#93c5fd" stroke="#3b82f6" strokeWidth="1">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="1.6s" begin="0.4s" repeatCount="indefinite"/>
      </rect>
      <rect x="16" y="42" width="14" height="14" rx="3" fill="#60a5fa" stroke="#3b82f6" strokeWidth="1">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="1.6s" begin="0.8s" repeatCount="indefinite"/>
      </rect>
      <rect x="34" y="42" width="14" height="14" rx="3" fill="#60a5fa" stroke="#3b82f6" strokeWidth="1">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="1.6s" begin="1.2s" repeatCount="indefinite"/>
      </rect>
      {/* Chip labels */}
      <text x="11" y="70" fontSize="6.5" fontWeight="800" fill="#1d4ed8">ELEC. ENG</text>
      <text x="18" y="82" fontSize="7" fontWeight="700" fill="#3b82f6">⚡ ⚡ ⚡</text>
      {/* Pins — left */}
      {[28, 40, 52, 64].map((y, i) => (
        <g key={`pl${i}`}>
          <line x1="8" y1={y} x2="2" y2={y} stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
          <rect x="0" y={y - 3} width="4" height="6" rx="1" fill="#93c5fd"/>
        </g>
      ))}
      {/* Pins — right */}
      {[28, 40, 52, 64].map((y, i) => (
        <g key={`pr${i}`}>
          <line x1="60" y1={y} x2="66" y2={y} stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
          <rect x="64" y={y - 3} width="4" height="6" rx="1" fill="#93c5fd"/>
        </g>
      ))}

      {/* ── WIRE + PARTICLES ── */}
      <path d="M68 52 L84 52" stroke="#bfdbfe" strokeWidth="3" strokeLinecap="round"/>
      {/* Animated particle dots */}
      <circle r="3.5" fill="#3b82f6">
        <animateMotion path="M68,52 L84,52" dur="1.2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0;1;1;0" dur="1.2s" repeatCount="indefinite"/>
      </circle>
      <circle r="3.5" fill="#60a5fa">
        <animateMotion path="M68,52 L84,52" dur="1.2s" begin="0.4s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0;1;1;0" dur="1.2s" begin="0.4s" repeatCount="indefinite"/>
      </circle>
      <circle r="3.5" fill="#93c5fd">
        <animateMotion path="M68,52 L84,52" dur="1.2s" begin="0.8s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0;1;1;0" dur="1.2s" begin="0.8s" repeatCount="indefinite"/>
      </circle>
      {/* Arrow */}
      <polyline points="80,46 87,52 80,58" stroke="#2563eb" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>

      {/* ── AWS CLOUD ── */}
      {/* Cloud base */}
      <path d="M106 94 Q94 94 94 84 Q94 73 104 72 Q104 62 113 60 Q118 52 129 55 Q136 50 144 57 Q155 57 155 68 Q164 68 164 79 Q164 94 153 94 Z"
        fill="#dbeafe" stroke="#2563eb" strokeWidth="2">
        <animate attributeName="opacity" values="0.85;1;0.85" dur="3s" repeatCount="indefinite"/>
      </path>
      {/* AWS text */}
      <text x="111" y="80" fontSize="14" fontWeight="900" fill="#1d4ed8">AWS</text>
      {/* Service chips below */}
      {[
        { x: 96, label: 'EC2', d: '0s' },
        { x: 110, label: 'S3',  d: '0.4s' },
        { x: 123, label: 'RDS', d: '0.8s' },
        { x: 137, label: 'λ',   d: '1.2s' },
        { x: 149, label: 'CF',  d: '1.6s' },
      ].map(s => (
        <g key={s.label}>
          <circle cx={s.x + 4} cy="88" r="5" fill="#3b82f6">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin={s.d} repeatCount="indefinite"/>
          </circle>
          <text x={s.x} y="91" fontSize="4.5" fontWeight="800" fill="#fff">{s.label}</text>
        </g>
      ))}
    </svg>
  )
}

/* ─── Animated Illustration: Card 2 — Cloud is Lego ─── */
function IllustrationLego() {
  return (
    <svg width="172" height="114" viewBox="0 0 172 114" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* ── Three floating service blocks ── */}

      {/* Block EC2 */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-6;0,0" dur="2.2s" repeatCount="indefinite"/>
        <rect x="8" y="30" width="42" height="36" rx="6" fill="#bbf7d0" stroke="#16a34a" strokeWidth="2"/>
        {/* Lego studs on top */}
        <ellipse cx="22" cy="30" rx="6" ry="3.5" fill="#86efac" stroke="#16a34a" strokeWidth="1.5"/>
        <ellipse cx="38" cy="30" rx="6" ry="3.5" fill="#86efac" stroke="#16a34a" strokeWidth="1.5"/>
        <text x="14" y="48" fontSize="8" fontWeight="800" fill="#166534">🖥 EC2</text>
        <text x="12" y="60" fontSize="5.5" fill="#15803d">compute</text>
      </g>

      {/* Block S3 */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,-4;0,4;0,-4" dur="2.8s" repeatCount="indefinite"/>
        <rect x="65" y="18" width="42" height="36" rx="6" fill="#6ee7b7" stroke="#059669" strokeWidth="2"/>
        <ellipse cx="79" cy="18" rx="6" ry="3.5" fill="#34d399" stroke="#059669" strokeWidth="1.5"/>
        <ellipse cx="95" cy="18" rx="6" ry="3.5" fill="#34d399" stroke="#059669" strokeWidth="1.5"/>
        <text x="72" y="36" fontSize="8" fontWeight="800" fill="#065f46">🪣 S3</text>
        <text x="70" y="48" fontSize="5.5" fill="#047857">storage</text>
      </g>

      {/* Block Lambda */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,-2;0,-8;0,-2" dur="2.5s" repeatCount="indefinite"/>
        <rect x="122" y="30" width="42" height="36" rx="6" fill="#a7f3d0" stroke="#10b981" strokeWidth="2"/>
        <ellipse cx="136" cy="30" rx="6" ry="3.5" fill="#6ee7b7" stroke="#10b981" strokeWidth="1.5"/>
        <ellipse cx="152" cy="30" rx="6" ry="3.5" fill="#6ee7b7" stroke="#10b981" strokeWidth="1.5"/>
        <text x="126" y="48" fontSize="8" fontWeight="800" fill="#065f46">⚡ λ</text>
        <text x="126" y="60" fontSize="5.5" fill="#047857">serverless</text>
      </g>

      {/* ── Connectors between blocks ── */}
      <line x1="50" y1="48" x2="65" y2="36" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4,3">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite"/>
      </line>
      <line x1="107" y1="36" x2="122" y2="48" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4,3">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" begin="0.5s" repeatCount="indefinite"/>
      </line>

      {/* ── Bottom: Assembled result ── */}
      <rect x="44" y="80" width="84" height="28" rx="8" fill="#dcfce7" stroke="#16a34a" strokeWidth="2">
        <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite"/>
      </rect>
      <text x="52" y="96" fontSize="8" fontWeight="800" fill="#166534">🏗 Architecture</text>
      <text x="55" y="106" fontSize="6" fill="#15803d">EC2 + S3 + Lambda</text>

      {/* Down arrows showing assembly */}
      <line x1="29" y1="66" x2="60" y2="80" stroke="#16a34a" strokeWidth="1.5" strokeDasharray="3,2" opacity="0.6"/>
      <line x1="86" y1="54" x2="86" y2="80" stroke="#16a34a" strokeWidth="1.5" strokeDasharray="3,2" opacity="0.6"/>
      <line x1="143" y1="66" x2="112" y2="80" stroke="#16a34a" strokeWidth="1.5" strokeDasharray="3,2" opacity="0.6"/>

      {/* Snap sparkles */}
      {[[60, 80], [86, 80], [112, 80]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3" fill="#22c55e">
          <animate attributeName="r" values="2;5;2" dur="1.8s" begin={`${i * 0.4}s`} repeatCount="indefinite"/>
          <animate attributeName="opacity" values="1;0;1" dur="1.8s" begin={`${i * 0.4}s`} repeatCount="indefinite"/>
        </circle>
      ))}
    </svg>
  )
}

/* ─── Animated Illustration: Card 3 — Visual Learning ─── */
function IllustrationVisual() {
  return (
    <svg width="172" height="114" viewBox="0 0 172 114" fill="none" xmlns="http://www.w3.org/2000/svg">

      {/* ── LEFT: Boring text wall ── */}
      <rect x="2" y="10" width="62" height="90" rx="7" fill="#ede9fe" stroke="#c4b5fd" strokeWidth="1.5"/>
      <text x="9" y="26" fontSize="7" fontWeight="700" fill="#6d28d9">📄 Notes.txt</text>
      {/* Blurred text lines */}
      {[34, 44, 54, 64, 74, 84, 94].map((y, i) => (
        <rect key={i} x="9" y={y} width={i % 2 === 0 ? 44 : 36} height="5" rx="2" fill="#c4b5fd" opacity="0.6"/>
      ))}
      {/* Big X overlay */}
      <circle cx="50" cy="24" r="10" fill="#fecaca" stroke="#ef4444" strokeWidth="1.5">
        <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite"/>
      </circle>
      <line x1="44" y1="18" x2="56" y2="30" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="56" y1="18" x2="44" y2="30" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"/>

      {/* ── MIDDLE: Animated eye / lens ── */}
      {/* Eye white */}
      <ellipse cx="86" cy="55" rx="10" ry="7" fill="#f5f3ff" stroke="#8b5cf6" strokeWidth="1.8">
        <animate attributeName="ry" values="7;3;7" dur="3s" repeatCount="indefinite"/>
      </ellipse>
      {/* Pupil */}
      <circle cx="86" cy="55" r="4" fill="#7c3aed">
        <animate attributeName="r" values="4;2;4" dur="3s" repeatCount="indefinite"/>
      </circle>
      {/* Highlight */}
      <circle cx="88" cy="53" r="1.2" fill="white"/>
      {/* Arrow right */}
      <polyline points="98,50 105,55 98,60" stroke="#7c3aed" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite"/>
      </polyline>

      {/* ── RIGHT: Architecture diagram drawing in ── */}
      <rect x="108" y="10" width="62" height="90" rx="7" fill="#f5f3ff" stroke="#8b5cf6" strokeWidth="1.5"/>
      <text x="114" y="25" fontSize="7" fontWeight="700" fill="#6d28d9">🏗 Diagram</text>

      {/* Node: User */}
      <rect x="118" y="30" width="32" height="16" rx="4" fill="#ddd6fe" stroke="#7c3aed" strokeWidth="1.5">
        <animate attributeName="opacity" values="0;1" dur="0.5s" begin="0s" fill="freeze" repeatCount="1"/>
      </rect>
      <text x="123" y="42" fontSize="6.5" fontWeight="700" fill="#5b21b6">👤 User</text>

      {/* Arrow 1 drawing in */}
      <line x1="134" y1="46" x2="134" y2="56" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round">
        <animate attributeName="strokeDasharray" values="0,20;12,0" dur="0.4s" begin="0.5s" fill="freeze" repeatCount="1"/>
        <animate attributeName="opacity" values="0;1;1;0;1" dur="3s" repeatCount="indefinite"/>
      </line>
      <polyline points="130,53 134,57 138,53" stroke="#8b5cf6" strokeWidth="1.5" fill="none" strokeLinecap="round">
        <animate attributeName="opacity" values="0;0;1;1;0;1" dur="3s" repeatCount="indefinite"/>
      </polyline>

      {/* Node: ALB */}
      <rect x="118" y="57" width="32" height="16" rx="4" fill="#c4b5fd" stroke="#7c3aed" strokeWidth="1.5">
        <animate attributeName="opacity" values="0;0;1" dur="1s" begin="0s" fill="freeze" repeatCount="1"/>
      </rect>
      <text x="123" y="69" fontSize="6.5" fontWeight="700" fill="#4c1d95">⚖ ALB</text>

      {/* Arrow 2 */}
      <line x1="134" y1="73" x2="134" y2="82" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round">
        <animate attributeName="opacity" values="0;0;1;1;0;1" dur="3s" repeatCount="indefinite"/>
      </line>
      <polyline points="130,79 134,83 138,79" stroke="#8b5cf6" strokeWidth="1.5" fill="none" strokeLinecap="round">
        <animate attributeName="opacity" values="0;0;1;1;0;1" dur="3s" repeatCount="indefinite"/>
      </polyline>

      {/* Node: EC2 cluster */}
      <rect x="112" y="83" width="44" height="14" rx="4" fill="#a78bfa" stroke="#7c3aed" strokeWidth="1.5">
        <animate attributeName="opacity" values="0;0;0;1" dur="1.5s" begin="0s" fill="freeze" repeatCount="1"/>
      </rect>
      <text x="117" y="93" fontSize="6.5" fontWeight="700" fill="white">🖥 EC2 × 3</text>

      {/* Green checkmark — all good */}
      <circle cx="163" cy="22" r="8" fill="#bbf7d0" stroke="#16a34a" strokeWidth="1.5">
        <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite"/>
      </circle>
      <polyline points="158,22 161,26 168,17" stroke="#16a34a" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

/* ─── Animated Illustration: Card 4 — Too many subscriptions ─── */
function IllustrationSubscriptions() {
  return (
    <svg width="172" height="114" viewBox="0 0 172 114" fill="none" xmlns="http://www.w3.org/2000/svg">

      {/* ── LEFT: Stacked subscription receipts ── */}

      {/* Udemy */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-3;0,0" dur="2s" repeatCount="indefinite"/>
        <rect x="4" y="8" width="54" height="28" rx="5" fill="#fde68a" stroke="#d97706" strokeWidth="1.8"/>
        <text x="10" y="21" fontSize="7.5" fontWeight="800" fill="#92400e">Udemy</text>
        <text x="10" y="31" fontSize="6" fill="#b45309">Video Course</text>
        <rect x="36" y="10" width="20" height="12" rx="3" fill="#f59e0b"/>
        <text x="39" y="19.5" fontSize="8" fontWeight="900" fill="white">$23+</text>
      </g>

      {/* YouTube */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-2;0,0" dur="2.5s" begin="0.3s" repeatCount="indefinite"/>
        <rect x="4" y="42" width="54" height="28" rx="5" fill="#fecaca" stroke="#ef4444" strokeWidth="1.8"/>
        <text x="10" y="55" fontSize="7.5" fontWeight="800" fill="#991b1b">YouTube</text>
        <text x="10" y="65" fontSize="6" fill="#b91c1c">Hunt videos</text>
        <rect x="36" y="44" width="20" height="12" rx="3" fill="#dc2626"/>
        <text x="38" y="53.5" fontSize="7.5" fontWeight="900" fill="white">free?</text>
      </g>

      {/* TutorialsDojo */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-4;0,0" dur="1.8s" begin="0.6s" repeatCount="indefinite"/>
        <rect x="4" y="76" width="54" height="28" rx="5" fill="#fed7aa" stroke="#f97316" strokeWidth="1.8"/>
        <text x="10" y="89" fontSize="6.5" fontWeight="800" fill="#9a3412">T. Dojo</text>
        <text x="10" y="99" fontSize="6" fill="#c2410c">Practice</text>
        <rect x="36" y="78" width="20" height="12" rx="3" fill="#ea580c"/>
        <text x="39" y="87.5" fontSize="8" fontWeight="900" fill="white">$15</text>
      </g>

      {/* Plus signs */}
      <text x="59" y="42" fontSize="16" fontWeight="900" fill="#fb923c">
        +
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite"/>
      </text>
      <text x="59" y="78" fontSize="16" fontWeight="900" fill="#fb923c">
        +
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" begin="0.3s" repeatCount="indefinite"/>
      </text>

      {/* ── MERGE ARROW ── */}
      <line x1="68" y1="55" x2="84" y2="55" stroke="#f97316" strokeWidth="3" strokeLinecap="round">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1.2s" repeatCount="indefinite"/>
      </line>
      <polyline points="79,48 86,55 79,62" stroke="#ea580c" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1.2s" repeatCount="indefinite"/>
      </polyline>

      {/* ── RIGHT: One AWSPrepAI card ── */}
      <rect x="88" y="14" width="80" height="82" rx="10" fill="#fff7ed" stroke="#ea580c" strokeWidth="2.5">
        <animate attributeName="opacity" values="0.85;1;0.85" dur="2.5s" repeatCount="indefinite"/>
      </rect>
      {/* Header */}
      <rect x="88" y="14" width="80" height="24" rx="10" fill="#ea580c"/>
      <rect x="88" y="28" width="80" height="10" fill="#ea580c"/>
      <text x="99" y="30" fontSize="8" fontWeight="900" fill="white">AWSPrepAI</text>

      {/* Feature checkmarks */}
      {[
        { y: 52, label: 'Questions ✓' },
        { y: 64, label: 'Diagrams ✓' },
        { y: 76, label: 'Explanations ✓' },
        { y: 88, label: 'Visual Exam ✓' },
      ].map((f, i) => (
        <g key={i}>
          <text x="96" y={f.y} fontSize="6.5" fontWeight="700" fill="#c2410c">
            {f.label}
            <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" begin={`${i * 0.4}s`} repeatCount="indefinite"/>
          </text>
        </g>
      ))}

      {/* ONE tab badge */}
      <rect x="104" y="96" width="48" height="16" rx="6" fill="#16a34a">
        <animate attributeName="opacity" values="0.8;1;0.8" dur="1.5s" repeatCount="indefinite"/>
      </rect>
      <text x="110" y="107.5" fontSize="8" fontWeight="900" fill="white">1 tab. Done. ✓</text>
    </svg>
  )
}

/* ─── Main About Page ─── */
export default function About() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  const faqs = [
    { q: 'Can I try before buying?', a: 'Yes — create a free account and get 20 questions. No credit card needed. See the quality before you pay.' },
    { q: "What's the pass rate for AWS exams?", a: "AWS exams require 72% or higher. My questions are scenario-based and match the real exam difficulty — the same style you'll face on test day." },
    { q: 'Does Lifetime include future certs?', a: 'Yes. Every new AWS certification I add is automatically included in your Lifetime plan at no extra cost, forever.' },
    { q: 'Can I cancel Monthly or Yearly anytime?', a: 'Absolutely. Cancel from your dashboard with one click. No cancellation fees, no questions asked.' },
    { q: 'What is the AI Coach?', a: 'AI Coach is an intelligent tutor that answers your questions, explains AWS concepts in depth, and builds personalized study plans. Available exclusively on the Lifetime plan.' },
  ]

  const features = [
    { icon: '📝', title: '3,120 Questions', desc: '260 per cert across all 12 AWS certifications, updated regularly', color: '#eff6ff', border: '#bfdbfe' },
    { icon: '⏱️', title: 'Mock Exams', desc: '65-question timed tests that mirror the real exam format exactly', color: '#f0fdf4', border: '#bbf7d0' },
    { icon: '💡', title: 'Instant Explanations', desc: 'Every answer explained — learn why options are right or wrong', color: '#faf5ff', border: '#e9d5ff' },
    { icon: '🎯', title: 'Domain Filtering', desc: 'Filter by exam domain to focus on your weakest areas first', color: '#fff7ed', border: '#fed7aa' },
    { icon: '🏗️', title: 'Architecture Builder', desc: 'Drag-and-drop AWS diagrams — learn by building, not just reading', color: '#eff6ff', border: '#bfdbfe' },
    { icon: '🖼️', title: 'Visual Exam', desc: 'Diagram-based questions so you see the problem, not just read it', color: '#f0fdf4', border: '#bbf7d0' },
  ]

  const certs = [
    { code: 'CLF-C02', name: 'Cloud Practitioner', level: 'Foundational', color: '#dcfce7', text: '#15803d' },
    { code: 'AIF-C01', name: 'AI Practitioner', level: 'Foundational', color: '#dcfce7', text: '#15803d' },
    { code: 'SAA-C03', name: 'Solutions Architect Associate', level: 'Associate', color: '#dbeafe', text: '#1d4ed8' },
    { code: 'DVA-C02', name: 'Developer Associate', level: 'Associate', color: '#dbeafe', text: '#1d4ed8' },
    { code: 'SOA-C02', name: 'SysOps Administrator', level: 'Associate', color: '#dbeafe', text: '#1d4ed8' },
    { code: 'DEA-C01', name: 'Data Engineer Associate', level: 'Associate', color: '#dbeafe', text: '#1d4ed8' },
    { code: 'MLA-C01', name: 'ML Engineer Associate', level: 'Associate', color: '#dbeafe', text: '#1d4ed8' },
    { code: 'GAI-C01', name: 'Generative AI Developer', level: 'Associate', color: '#dbeafe', text: '#1d4ed8' },
    { code: 'SAP-C02', name: 'Solutions Architect Pro', level: 'Professional', color: '#ede9fe', text: '#6d28d9' },
    { code: 'DOP-C02', name: 'DevOps Engineer Pro', level: 'Professional', color: '#ede9fe', text: '#6d28d9' },
    { code: 'SCS-C03', name: 'Security Specialty', level: 'Specialty', color: '#fce7f3', text: '#be185d' },
    { code: 'ANS-C01', name: 'Advanced Networking', level: 'Specialty', color: '#fce7f3', text: '#be185d' },
  ]

  const stats = [
    { value: '3,120', label: 'Practice Questions' },
    { value: '12', label: 'AWS Certifications' },
    { value: '72%', label: 'Pass Mark Required' },
    { value: '4', label: 'Exam Levels' },
  ]

  return (
    <Layout>

      {/* ── Hero ── */}
      <div style={{ background: 'linear-gradient(160deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%)', padding: '5rem 1.5rem 4rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-80px', left: '10%', width: '400px', height: '400px', background: 'rgba(96,165,250,0.12)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', right: '10%', width: '300px', height: '300px', background: 'rgba(139,92,246,0.1)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '999px', padding: '0.4rem 1rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Built by an engineer, for engineers</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: '#fff', marginBottom: '1rem', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
            Hi, I'm Ihab.<br />This is why I built AWSPrepAI.
          </h1>
          <p style={{ color: '#93c5fd', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: '540px', margin: '0 auto 3rem' }}>
            An electrical engineer shifting into cloud — and tired of paying for five different things just to study for one exam.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            {stats.map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.75rem', color: '#93c5fd', fontWeight: 600, marginTop: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem' }}>

        {/* ── My Story ── */}
        <div style={{ marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#111827', marginBottom: '1.5rem' }}>My Story</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Card 1 */}
            <div style={{ background: 'linear-gradient(135deg, #eff6ff, #e0f2fe)', border: '1px solid #bfdbfe', borderRadius: '1.25rem', padding: '1.75rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontWeight: 800, color: '#1d4ed8', marginBottom: '0.5rem', fontSize: '1rem' }}>From Electrical Engineering to Cloud</h3>
                <p style={{ color: '#1e40af', lineHeight: 1.75, margin: 0, fontSize: '0.925rem' }}>
                  I'm originally an electrical engineer. Like a lot of engineers today, I realized that to shift my career and stay relevant, I needed to go deep into cloud engineering and backend. That meant AWS certifications — and that meant studying.
                </p>
              </div>
              <div style={{ flexShrink: 0 }}><IllustrationElectrical /></div>
            </div>

            {/* Card 2 */}
            <div style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', border: '1px solid #bbf7d0', borderRadius: '1.25rem', padding: '1.75rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontWeight: 800, color: '#15803d', marginBottom: '0.5rem', fontSize: '1rem' }}>Cloud is Lego — and I love Lego</h3>
                <p style={{ color: '#166534', lineHeight: 1.75, margin: 0, fontSize: '0.925rem' }}>
                  My personal take: to succeed in cloud, you need to be good at building Lego and genuinely love finding solutions to problems. You need to be solutions-oriented. Cloud architecture is exactly that — you take pieces, understand how they connect, and build something that works. That mindset is everything.
                </p>
              </div>
              <div style={{ flexShrink: 0 }}><IllustrationLego /></div>
            </div>

            {/* Card 3 */}
            <div style={{ background: 'linear-gradient(135deg, #faf5ff, #ede9fe)', border: '1px solid #e9d5ff', borderRadius: '1.25rem', padding: '1.75rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontWeight: 800, color: '#6d28d9', marginBottom: '0.5rem', fontSize: '1rem' }}>I learn by seeing, not just reading</h3>
                <p style={{ color: '#5b21b6', lineHeight: 1.75, margin: 0, fontSize: '0.925rem' }}>
                  I personally learn best when I can see the problem and visualize the solution — understanding what the elements are and how they fit together. That's exactly why I built the Visual Exam and the Architecture Builder. I wanted to see the architecture, not just memorize bullet points about it.
                </p>
              </div>
              <div style={{ flexShrink: 0 }}><IllustrationVisual /></div>
            </div>

            {/* Card 4 */}
            <div style={{ background: 'linear-gradient(135deg, #fff7ed, #ffedd5)', border: '1px solid #fed7aa', borderRadius: '1.25rem', padding: '1.75rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontWeight: 800, color: '#c2410c', marginBottom: '0.5rem', fontSize: '1rem' }}>The real problem: too many tabs, too many subscriptions</h3>
                <p style={{ color: '#9a3412', lineHeight: 1.75, margin: 0, fontSize: '0.925rem' }}>
                  When I started studying, the typical path looked like this: a Udemy course — which is genuinely great, easily worth more than $23 — then YouTube to find someone walking through exam questions, then a platform like Dojo for more practice. These are all legitimate, high-quality resources. My only problem wasn't the quality — it was the fragmentation. Suddenly you've paid for three separate things and you're still jumping between tabs. I built AWSPrepAI to bring everything into one place: the questions, the explanations, the diagrams, and the resources — so you can focus on learning, not on managing five browser tabs.
                </p>
              </div>
              <div style={{ flexShrink: 0 }}><IllustrationSubscriptions /></div>
            </div>

          </div>
        </div>

        {/* ── What I Built ── */}
        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#111827', marginBottom: '1.25rem' }}>What I Built Into It</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '3.5rem' }}>
          {features.map((f, i) => (
            <div key={f.title}
              onMouseEnter={() => setHoveredFeature(i)}
              onMouseLeave={() => setHoveredFeature(null)}
              style={{
                background: hoveredFeature === i ? f.color : '#fff',
                border: `1px solid ${hoveredFeature === i ? f.border : '#e5e7eb'}`,
                borderRadius: '1rem', padding: '1.25rem',
                transition: 'all 0.2s', cursor: 'default',
                transform: hoveredFeature === i ? 'translateY(-3px)' : 'none',
                boxShadow: hoveredFeature === i ? '0 8px 24px rgba(0,0,0,0.08)' : 'none',
              }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.625rem' }}>{f.icon}</div>
              <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.9rem', marginBottom: '0.375rem' }}>{f.title}</div>
              <div style={{ fontSize: '0.8rem', color: '#6b7280', lineHeight: 1.55 }}>{f.desc}</div>
            </div>
          ))}
        </div>

        {/* ── Certifications ── */}
        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#111827', marginBottom: '0.5rem' }}>12 Certifications Covered</h2>
        <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.25rem' }}>All active AWS certification paths — from Foundational to Specialty.</p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {[
            { level: 'Foundational', color: '#dcfce7', text: '#15803d' },
            { level: 'Associate', color: '#dbeafe', text: '#1d4ed8' },
            { level: 'Professional', color: '#ede9fe', text: '#6d28d9' },
            { level: 'Specialty', color: '#fce7f3', text: '#be185d' },
          ].map(l => (
            <div key={l.level} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: l.color, border: `1px solid ${l.text}40` }} />
              <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>{l.level}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '3.5rem' }}>
          {certs.map(cert => (
            <span key={cert.code} style={{ padding: '0.4rem 0.875rem', background: cert.color, borderRadius: '999px', fontSize: '0.78rem', fontWeight: 700, color: cert.text, border: `1px solid ${cert.text}30` }}>
              {cert.code} · {cert.name}
            </span>
          ))}
        </div>

        {/* ── FAQ ── */}
        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#111827', marginBottom: '1.25rem' }}>Frequently Asked Questions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '3.5rem' }}>
          {faqs.map((faq, i) => (
            <div key={i}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              style={{ background: '#fff', border: `1px solid ${openFaq === i ? '#bfdbfe' : '#e5e7eb'}`, borderRadius: '0.875rem', padding: '1.1rem 1.25rem', cursor: 'pointer', transition: 'border-color 0.15s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                <p style={{ fontWeight: 700, color: '#111827', margin: 0, fontSize: '0.9rem' }}>{faq.q}</p>
                <span style={{ color: '#3b82f6', fontWeight: 800, fontSize: '1.1rem', flexShrink: 0, transition: 'transform 0.2s', display: 'inline-block', transform: openFaq === i ? 'rotate(45deg)' : 'none' }}>+</span>
              </div>
              {openFaq === i && (
                <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0.75rem 0 0', lineHeight: 1.65 }}>{faq.a}</p>
              )}
            </div>
          ))}
        </div>

        {/* ── CTA ── */}
        <div style={{ background: 'linear-gradient(160deg, #0f172a, #1e3a8a)', borderRadius: '1.5rem', padding: '3rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-40px', left: '20%', width: '200px', height: '200px', background: 'rgba(96,165,250,0.15)', borderRadius: '50%', filter: 'blur(50px)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#fff', marginBottom: '0.75rem' }}>Stop juggling tabs. Start here.</h2>
            <p style={{ color: '#93c5fd', marginBottom: '2rem', fontSize: '1rem' }}>
              Everything you need to pass your AWS exam — in one place.
            </p>
            <div style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/signup" style={{ padding: '0.875rem 2rem', background: '#2563eb', color: '#fff', borderRadius: '0.875rem', fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem', boxShadow: '0 4px 14px rgba(37,99,235,0.4)' }}>
                Create Free Account
              </Link>
              <Link to="/pricing" style={{ padding: '0.875rem 2rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '0.875rem', fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem' }}>
                View Plans →
              </Link>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  )
}
