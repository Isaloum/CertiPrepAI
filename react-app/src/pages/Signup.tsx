import { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'

const STRIPE_MONTHLY_LINK = import.meta.env.VITE_STRIPE_MONTHLY_LINK as string
const STRIPE_YEARLY_LINK = import.meta.env.VITE_STRIPE_YEARLY_LINK as string
const STRIPE_LIFETIME_LINK = import.meta.env.VITE_STRIPE_LIFETIME_LINK as string

export default function Signup() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const plan = searchParams.get('plan') || 'free'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirmSent, setConfirmSent] = useState(false)

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

    const { error: authError } = await supabase.auth.signUp({ email, password })
    setLoading(false)

    if (authError) {
      setError(authError.message)
      return
    }

    // Paid plan — redirect to Stripe with email prefilled
    const stripeLinks: Record<string, string> = {
      monthly: STRIPE_MONTHLY_LINK,
      yearly: STRIPE_YEARLY_LINK,
      lifetime: STRIPE_LIFETIME_LINK,
    }
    if (plan !== 'free' && stripeLinks[plan]) {
      window.location.href = `${stripeLinks[plan]}?prefilled_email=${encodeURIComponent(email)}`
      return
    }

    // Free plan — confirm email then go to certifications
    setConfirmSent(true)
  }

  if (confirmSent) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
          <div className="text-center max-w-sm">
            <div className="text-5xl mb-4">📬</div>
            <h2 className="text-xl font-black text-gray-900 mb-2">Check your email</h2>
            <p className="text-gray-500 text-sm mb-6">
              We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
            </p>
            <button
              onClick={() => navigate('/certifications')}
              className="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors"
            >
              Start practicing (20 free questions)
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🚀</div>
            <h1 className="text-2xl font-black text-gray-900">Create your account</h1>
            <p className="text-gray-500 text-sm mt-1">
              {plan === 'lifetime'
                ? '🔥 Lifetime plan — pay once, access forever'
                : plan === 'yearly'
                ? '📅 Yearly plan — best value, cancel anytime'
                : plan === 'monthly'
                ? '📦 Monthly plan — cancel anytime'
                : '20 free questions — no credit card required'}
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
                {loading
                  ? 'Creating account...'
                  : plan === 'free'
                  ? 'Sign Up Free'
                  : `Sign Up & Pay →`}
              </button>
            </form>

            <p className="text-xs text-gray-400 text-center mt-4">
              By signing up you agree to our{' '}
              <a href="/terms" className="underline">Terms & Privacy Policy</a>
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
