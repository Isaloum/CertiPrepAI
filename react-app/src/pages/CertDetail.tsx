import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import Paywall from '../components/Paywall'

interface Question {
  cat: string
  q: string
  options: string[]
  answer: number
  explain: string
}

const certMeta: Record<string, { name: string; code: string; icon: string; domains: Record<string, string> }> = {
  'saa-c03': { name: 'Solutions Architect Associate', code: 'SAA-C03', icon: '🏗️', domains: { 'secure-arch': 'Secure', 'resilient-arch': 'Resilient', 'high-perf-arch': 'Performant', 'cost-optimized-arch': 'Cost-Optimized' } },
  'clf-c02': { name: 'Cloud Practitioner', code: 'CLF-C02', icon: '☁️', domains: { 'cloud-concepts': 'Cloud Concepts', 'security-compliance': 'Security', 'cloud-technology': 'Technology', 'billing-pricing': 'Billing' } },
  'aif-c01': { name: 'AI Practitioner', code: 'AIF-C01', icon: '🤖', domains: { 'ai-fundamentals': 'AI Fundamentals', 'generative-ai': 'Generative AI', 'foundation-models': 'Foundation Models', 'responsible-ai': 'Responsible AI', 'ai-security': 'Security' } },
  'dva-c02': { name: 'Developer Associate', code: 'DVA-C02', icon: '💻', domains: { 'development': 'Development', 'security': 'Security', 'deployment': 'Deployment', 'troubleshooting': 'Troubleshooting' } },
  'soa-c02': { name: 'SysOps Administrator', code: 'SOA-C02', icon: '⚙️', domains: { 'monitoring': 'Monitoring', 'reliability': 'Reliability', 'deployment': 'Deployment', 'networking': 'Networking', 'security': 'Security' } },
  'dea-c01': { name: 'Data Engineer Associate', code: 'DEA-C01', icon: '📊', domains: { 'data-ingestion-transformation': 'Ingestion', 'data-store-management': 'Data Store', 'data-operations': 'Operations', 'data-security-governance': 'Security' } },
  'mla-c01': { name: 'ML Engineer Associate', code: 'MLA-C01', icon: '🧠', domains: { 'data-preparation': 'Data Prep', 'model-development': 'Model Dev', 'deployment-orchestration': 'Deployment', 'monitoring-governance': 'Monitoring' } },
  'gai-c01': { name: 'Generative AI Developer', code: 'GAI-C01', icon: '✨', domains: { 'gen-ai-fundamentals': 'Gen AI Fundamentals', 'bedrock': 'Bedrock', 'foundation-models': 'Foundation Models', 'responsible-ai': 'Responsible AI' } },
  'sap-c02': { name: 'Solutions Architect Professional', code: 'SAP-C02', icon: '🏆', domains: { 'complex-org-design': 'Org Design', 'new-solutions': 'New Solutions', 'migration-modernization': 'Migration', 'cost-complexity': 'Cost' } },
  'dop-c02': { name: 'DevOps Engineer Professional', code: 'DOP-C02', icon: '🔧', domains: { 'sdlc-automation': 'SDLC', 'configuration-management': 'Config', 'monitoring-logging': 'Monitoring', 'high-availability': 'High Availability' } },
  'scs-c03': { name: 'Security Specialty', code: 'SCS-C03', icon: '🔒', domains: { 'threat-detection': 'Threat Detection', 'iam': 'IAM', 'data-protection': 'Data Protection', 'infrastructure-security': 'Infrastructure' } },
  'ans-c01': { name: 'Advanced Networking Specialty', code: 'ANS-C01', icon: '🌐', domains: { 'network-design': 'Design', 'network-implementation': 'Implementation', 'network-management': 'Management', 'network-security': 'Security' } },
}

const FREE_LIMIT = 20

export default function CertDetail() {
  const { certId } = useParams<{ certId: string }>()
  const navigate = useNavigate()

  const [questions, setQuestions] = useState<Question[]>([])
  const [filtered, setFiltered] = useState<Question[]>([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(0)
  const [domainFilter, setDomainFilter] = useState('all')
  const [showResults, setShowResults] = useState(false)
  const [showPaywall, setShowPaywall] = useState(false)
  const [questionCount, setQuestionCount] = useState(0)
  const [_wrongQuestions, setWrongQuestions] = useState<Question[]>([])

  const meta = certMeta[certId || ''] || { name: 'Unknown', code: '', icon: '❓', domains: {} }

  useEffect(() => {
    if (!certId || !certMeta[certId]) {
      navigate('/certifications')
      return
    }
    import(`../data/${certId}.json`).then((mod) => {
      const qs: Question[] = mod.default
      setQuestions(qs)
      setFiltered(qs)
    }).catch(() => navigate('/certifications'))
  }, [certId, navigate])

  useEffect(() => {
    if (domainFilter === 'all') {
      setFiltered(questions)
    } else {
      setFiltered(questions.filter(q => q.cat === domainFilter))
    }
    setCurrent(0)
    setSelected(null)
    setRevealed(false)
  }, [domainFilter, questions])

  const handleSelect = useCallback((idx: number) => {
    if (revealed) return
    setSelected(idx)
  }, [revealed])

  const handleReveal = useCallback(() => {
    if (selected === null) return
    setRevealed(true)
    setAnswered(a => a + 1)
    setQuestionCount(c => c + 1)
    if (selected === filtered[current].answer) {
      setScore(s => s + 1)
    } else {
      setWrongQuestions(w => [...w, filtered[current]])
    }
  }, [selected, revealed, filtered, current])

  const handleNext = useCallback(() => {
    const nextIdx = current + 1

    // Check paywall
    if (questionCount >= FREE_LIMIT) {
      setShowPaywall(true)
      return
    }

    if (nextIdx >= filtered.length) {
      setShowResults(true)
    } else {
      setCurrent(nextIdx)
      setSelected(null)
      setRevealed(false)
    }
  }, [current, filtered.length, questionCount])

  const handlePrev = () => {
    if (current > 0) {
      setCurrent(c => c - 1)
      setSelected(null)
      setRevealed(false)
    }
  }

  const restart = () => {
    setCurrent(0)
    setSelected(null)
    setRevealed(false)
    setScore(0)
    setAnswered(0)
    setQuestionCount(0)
    setShowResults(false)
    setWrongQuestions([])
  }

  if (questions.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4 animate-spin">⚙️</div>
            <p className="text-gray-500">Loading questions...</p>
          </div>
        </div>
      </Layout>
    )
  }

  const q = filtered[current]
  const progress = filtered.length > 0 ? Math.round((current / filtered.length) * 100) : 0
  const scorePercent = answered > 0 ? Math.round((score / answered) * 100) : 0
  const domains = Object.entries(meta.domains)

  // Results screen
  if (showResults) {
    const passed = scorePercent >= 72
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
            <div className="text-5xl mb-4">{passed ? '🎉' : '📚'}</div>
            <h1 className="text-2xl font-black text-gray-900 mb-1">{passed ? 'Great Work!' : 'Keep Practicing'}</h1>
            <p className="text-gray-500 mb-6">{meta.icon} {meta.name}</p>
            <div className="flex justify-center gap-8 mb-8">
              <div className="text-center">
                <div className={`text-3xl font-black ${passed ? 'text-green-600' : 'text-red-500'}`}>{scorePercent}%</div>
                <div className="text-xs text-gray-400 uppercase font-semibold mt-1">Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-gray-800">{score}/{answered}</div>
                <div className="text-xs text-gray-400 uppercase font-semibold mt-1">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-blue-600">72%</div>
                <div className="text-xs text-gray-400 uppercase font-semibold mt-1">Pass Mark</div>
              </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 mb-8">
              <div className={`h-3 rounded-full ${passed ? 'bg-green-500' : 'bg-red-400'}`} style={{ width: `${scorePercent}%` }} />
            </div>
            <div className="flex gap-3 flex-wrap justify-center">
              <button onClick={restart} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700">
                Practice Again
              </button>
              <button onClick={() => navigate('/certifications')} className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200">
                All Certs
              </button>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (!q) return null

  return (
    <Layout>
      {showPaywall && <Paywall reason="free-user" onClose={() => setShowPaywall(false)} />}

      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/certifications')} className="text-gray-400 hover:text-gray-600 text-sm flex items-center gap-1">
            ← Back
          </button>
          <span className="text-gray-300">|</span>
          <span className="text-sm font-bold text-gray-700">{meta.icon} {meta.code}</span>
          <span className="ml-auto text-sm text-gray-500">
            <span className="font-bold text-blue-600">{score}</span> correct · {answered} answered
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
          <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>

        {/* Domain filter */}
        <div className="flex gap-2 flex-wrap mb-6 overflow-x-auto pb-1">
          <button
            onClick={() => setDomainFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${domainFilter === 'all' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'}`}
          >
            All ({questions.length})
          </button>
          {domains.map(([cat, label]) => {
            const count = questions.filter(q => q.cat === cat).length
            if (count === 0) return null
            return (
              <button
                key={cat}
                onClick={() => setDomainFilter(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${domainFilter === cat ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'}`}
              >
                {label} ({count})
              </button>
            )
          })}
        </div>

        {/* Question card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{meta.domains[q.cat] || q.cat}</span>
            <span className="text-xs text-gray-400">{current + 1} / {filtered.length}</span>
          </div>

          <p className="text-gray-900 font-medium text-base leading-relaxed mb-6">{q.q}</p>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {q.options.map((opt, i) => {
              let cls = 'border border-gray-200 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50'
              if (revealed) {
                if (i === q.answer) cls = 'border-green-500 bg-green-50 text-green-800'
                else if (i === selected) cls = 'border-red-400 bg-red-50 text-red-700'
                else cls = 'border-gray-100 bg-gray-50 text-gray-400'
              } else if (i === selected) {
                cls = 'border-blue-500 bg-blue-50 text-blue-800'
              }
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={revealed}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all border-2 ${cls} ${!revealed ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span>
                  {opt}
                  {revealed && i === q.answer && <span className="ml-2 text-green-600">✓</span>}
                  {revealed && i === selected && i !== q.answer && <span className="ml-2 text-red-500">✗</span>}
                </button>
              )
            })}
          </div>

          {/* Explanation */}
          {revealed && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-2">
              <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-1">Explanation</p>
              <p className="text-sm text-blue-900 leading-relaxed">{q.explain}</p>
            </div>
          )}
        </div>

        {/* Free limit warning */}
        {questionCount >= FREE_LIMIT - 5 && questionCount < FREE_LIMIT && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4 text-sm text-amber-800">
            ⚠️ <span className="font-semibold">{FREE_LIMIT - questionCount} free questions left.</span> Upgrade to unlock all 260 questions.
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 justify-between">
          <button
            onClick={handlePrev}
            disabled={current === 0}
            className="px-5 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed text-sm"
          >
            ← Prev
          </button>

          {!revealed ? (
            <button
              onClick={handleReveal}
              disabled={selected === null}
              className="flex-1 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex-1 py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-700 text-sm"
            >
              {current + 1 >= filtered.length ? 'See Results' : 'Next Question →'}
            </button>
          )}
        </div>

        {/* Score tracker */}
        {answered > 0 && (
          <div className="mt-6 bg-gray-50 rounded-xl p-4 flex items-center justify-between">
            <span className="text-sm text-gray-500">Session score</span>
            <div className="flex items-center gap-3">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${scorePercent >= 72 ? 'bg-green-500' : 'bg-amber-500'}`}
                  style={{ width: `${scorePercent}%` }}
                />
              </div>
              <span className={`text-sm font-bold ${scorePercent >= 72 ? 'text-green-600' : 'text-amber-600'}`}>{scorePercent}%</span>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
