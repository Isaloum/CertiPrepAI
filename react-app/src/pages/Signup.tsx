import { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout'

export default function Signup() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const plan = searchParams.get('plan') || 'free'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    // TODO: wire up Supabase auth + Stripe checkout
    setTimeout(() => {
      setLoading(false)
      navigate('/certifications')
    }, 800)
  }

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🚀</div>
            <h1 className="text-2xl font-black text-gray-900">Create your account</h1>
            <p className="text-gray-500 text-sm mt-1">
              {plan === 'lifetime' ? '🔥 Lifetime plan selected' : plan === 'monthly' ? '📦 Monthly plan selected' : '20 free questions — no credit card'}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 text-sm"
              >
                {loading ? 'Creating account...' : 'Sign Up Free'}
              </button>
            </form>

            <p className="text-xs text-gray-400 text-center mt-4">
              By signing up you agree to our <Link to="/terms.pdf" className="underline">Terms & Privacy Policy</Link>
            </p>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </Layout>
  )
}
