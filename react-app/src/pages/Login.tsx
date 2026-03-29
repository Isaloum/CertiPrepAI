import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (authError) {
      setError(authError.message)
      return
    }
    navigate('/certifications')
  }

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Enter your email above first.')
      return
    }
    setError('')
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setResetSent(true)
  }

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">☁️</div>
            <h1 className="text-2xl font-black text-gray-900">Welcome back</h1>
            <p className="text-gray-500 text-sm mt-1">Log in to continue practicing</p>
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
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {resetSent && <p className="text-green-600 text-sm">Reset email sent — check your inbox.</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 text-sm"
              >
                {loading ? 'Logging in...' : 'Log In'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={handleForgotPassword}
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </button>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 font-semibold hover:underline">Sign up free</Link>
          </p>
        </div>
      </div>
    </Layout>
  )
}
