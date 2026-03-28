import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'

const steps = [
  { n: '1', title: 'Pick Your Cert', desc: 'Choose from 12 active AWS certifications based on your career path' },
  { n: '2', title: 'Start Free', desc: 'Try 20 free questions — no sign up needed' },
  { n: '3', title: 'Go Premium', desc: 'Unlock all certs, full question banks, mock exams & visual builder' },
  { n: '4', title: 'Pass with Confidence', desc: 'Arrive at exam day knowing you\'ve built real AWS knowledge' },
]

const features = [
  { icon: '📝', title: '3,120 Questions', desc: '260 per cert across all 12 active AWS certifications' },
  { icon: '⏱️', title: '4 Mock Exams', desc: 'Full timed exams per cert with instant scoring' },
  { icon: '🏗️', title: 'Architecture Builder', desc: 'Drag & drop AWS services to practice design' },
  { icon: '🎯', title: 'Visual Exam', desc: 'Build architecture answers — Lifetime exclusive' },
  { icon: '📊', title: 'Progress Tracking', desc: 'Domain-by-domain stats and streak tracking' },
  { icon: '🤖', title: 'AI Coach', desc: 'GPT-4o answers any AWS question instantly' },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-white/10 text-blue-300 text-sm font-semibold px-3 py-1 rounded-full mb-6">
              🎓 12 AWS Certifications · 3,000+ Questions
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
              Master Any AWS<br /><span className="text-blue-400">Certification</span>
            </h1>
            <p className="text-gray-300 text-lg mb-8 max-w-lg">
              Scenario-based practice, mock exams, visual architecture builder, and quick reference — for every active AWS cert.
            </p>
            <div className="flex gap-3 flex-wrap">
              <button onClick={() => navigate('/certifications')} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
                🚀 Start Practicing Free
              </button>
              <button onClick={() => navigate('/signup')} className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/20 transition-colors">
                ☁️ Sign Up Free
              </button>
            </div>
            <div className="flex gap-4 mt-4">
              <span className="flex items-center gap-1 text-sm text-green-400">✅ 20 Questions Free</span>
              <span className="flex items-center gap-1 text-sm text-gray-400">📦 Works Offline</span>
            </div>
          </div>

          {/* Sample architecture visual */}
          <div className="flex-1 max-w-sm w-full">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 font-mono text-sm">
              <div className="text-gray-400 text-xs mb-4 uppercase tracking-widest">Sample AWS Architecture</div>
              <div className="border-2 border-dashed border-blue-500/40 rounded-xl p-4 space-y-3">
                <div className="text-xs text-blue-400 mb-2">VPC</div>
                <div className="bg-teal-600/30 border border-teal-500/40 rounded-lg px-3 py-2 text-teal-300 flex items-center gap-2">🌐 Internet Gateway</div>
                <div className="bg-amber-600/30 border border-amber-500/40 rounded-lg px-3 py-2 text-amber-300 flex items-center gap-2">⚖️ Load Balancer</div>
                <div className="grid grid-cols-3 gap-2">
                  {['EC2','EC2','EC2'].map((s,i) => (
                    <div key={i} className="bg-gray-700/50 border border-gray-600 rounded-lg px-2 py-1 text-gray-300 text-xs text-center">🖥️ {s}</div>
                  ))}
                </div>
                <div className="bg-purple-600/30 border border-purple-500/40 rounded-lg px-3 py-2 text-purple-300 flex items-center gap-2">🗄️ RDS Database</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-black text-center text-gray-900 mb-10">How It Works</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-lg mx-auto mb-3">{s.n}</div>
                {i < steps.length - 1 && <div className="hidden md:block absolute" />}
                <h3 className="font-bold text-gray-900 mb-1">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-black text-center text-gray-900 mb-2">SAA-C03 Advanced Tools</h2>
          <p className="text-center text-gray-500 mb-10">Exclusive deep-dive tools for the Solutions Architect Associate exam</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-gray-900 mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-700 to-blue-900 text-white text-center">
        <h2 className="text-3xl font-black mb-3">Ready to Pass Any AWS Cert?</h2>
        <p className="text-blue-200 mb-8">20 free questions on SAA-C03 — no credit card needed.</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button onClick={() => navigate('/certifications')} className="px-8 py-3 bg-white text-blue-700 font-bold rounded-xl hover:bg-gray-100 transition-colors">
            Try 20 Free Questions →
          </button>
          <button onClick={() => navigate('/signup')} className="px-8 py-3 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl border border-blue-400 transition-colors">
            Create Free Account →
          </button>
        </div>
        <p className="mt-4 text-sm text-blue-300">Sign up free · Works offline · From $7/month</p>
      </section>
    </Layout>
  )
}
