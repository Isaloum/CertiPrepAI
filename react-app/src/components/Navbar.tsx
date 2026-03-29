import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// Proper SVG chevron — clearly a dropdown arrow, not a bullet
const ChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle', opacity: 0.5 }}>
    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function Navbar() {
  const [practiceOpen, setPracticeOpen] = useState(false)
  const [studyOpen, setStudyOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isPremium, tier, signOut, loading } = useAuth()

  const isActive = (path: string) => location.pathname === path

  const handleSignOut = async () => {
    await signOut()
    setUserMenuOpen(false)
    navigate('/')
  }

  const tierBadge: Record<string, string> = {
    monthly: '📦 Monthly',
    yearly: '📅 Yearly',
    lifetime: '🔥 Lifetime',
    free: '🆓 Free',
  }

  const linkClass = (path: string) =>
    `px-3 py-2 text-sm font-medium rounded-md transition-colors ${
      isActive(path) ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
    }`

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-blue-600 no-underline shrink-0">
          ☁️ <span>AWSPrepAI</span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center" style={{ gap: '4px' }}>

          {/* Practice dropdown */}
          <div className="relative" onMouseEnter={() => setPracticeOpen(true)} onMouseLeave={() => setPracticeOpen(false)}>
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 rounded-md hover:bg-gray-50 transition-colors">
              Practice <ChevronDown />
            </button>
            {practiceOpen && (
              <div className="absolute top-full left-0 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50 mt-1">
                <Link to="/certifications" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <span>📝</span>
                  <div>
                    <div className="font-semibold">Practice Quiz</div>
                    <div className="text-xs text-gray-400">All certifications</div>
                  </div>
                </Link>
                <Link to="/certifications" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <span>⏱️</span>
                  <div>
                    <div className="font-semibold">Mock Exam</div>
                    <div className="text-xs text-gray-400">65q · 90 min timed</div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Study dropdown */}
          <div className="relative" onMouseEnter={() => setStudyOpen(true)} onMouseLeave={() => setStudyOpen(false)}>
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 rounded-md hover:bg-gray-50 transition-colors">
              Study <ChevronDown />
            </button>
            {studyOpen && (
              <div className="absolute top-full left-0 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50 mt-1">
                <Link to="/glossary" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <span>📖</span>
                  <div>
                    <div className="font-semibold">Glossary</div>
                    <div className="text-xs text-gray-400">AWS terminology</div>
                  </div>
                </Link>
                <Link to="/resources" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <span>📚</span>
                  <div>
                    <div className="font-semibold">Resources</div>
                    <div className="text-xs text-gray-400">Study materials</div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Thin divider */}
          <div style={{ width: '1px', height: '20px', background: '#e5e7eb', margin: '0 6px', flexShrink: 0 }} />

          <Link to="/certifications" className={linkClass('/certifications')}>Certifications</Link>
          <Link to="/about" className={linkClass('/about')}>About</Link>
          <Link to="/pricing" className={linkClass('/pricing')}>Pricing</Link>
        </div>

        {/* Auth area */}
        <div className="flex items-center gap-2 shrink-0">
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
          ) : user ? (
            /* Logged-in user menu */
            <div className="relative" onMouseEnter={() => setUserMenuOpen(true)} onMouseLeave={() => setUserMenuOpen(false)}>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                  {(user.email?.[0] ?? 'U').toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block max-w-[120px] truncate">
                  {user.email?.split('@')[0]}
                </span>
                <ChevronDown />
              </button>
              {userMenuOpen && (
                <div className="absolute top-full right-0 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50 mt-1">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <div className="text-xs text-gray-400 truncate">{user.email}</div>
                    <div className="text-xs font-semibold text-blue-600 mt-0.5">{tierBadge[tier] ?? '🆓 Free'}</div>
                  </div>
                  <Link to="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <span>🏠</span> My Dashboard
                  </Link>
                  <Link to="/certifications" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <span>📝</span> Practice
                  </Link>
                  {!isPremium && (
                    <Link to="/pricing" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-yellow-600 font-semibold hover:bg-yellow-50">
                      <span>⚡</span> Upgrade to Premium
                    </Link>
                  )}
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50">
                      <span>👋</span> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Guest buttons */
            <>
              <Link to="/login" className="px-3 py-2 text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">Log In</Link>
              <Link to="/signup" className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">Sign Up Free</Link>
            </>
          )}
        </div>

      </div>
    </nav>
  )
}
