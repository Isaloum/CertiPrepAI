import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [practiceOpen, setPracticeOpen] = useState(false)
  const [studyOpen, setStudyOpen] = useState(false)
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-blue-600 no-underline">
          ☁️ <span>AWSPrepAI</span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-1">

          {/* Practice dropdown */}
          <div className="relative" onMouseEnter={() => setPracticeOpen(true)} onMouseLeave={() => setPracticeOpen(false)}>
            <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 rounded-md hover:bg-gray-50">
              Practice <span className="text-xs">▾</span>
            </button>
            {practiceOpen && (
              <div className="absolute top-full left-0 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                <Link to="/practice" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <span>📝</span><div><div className="font-semibold">Practice Quiz</div><div className="text-xs text-gray-400">SAA-C03 questions</div></div>
                </Link>
                <Link to="/practice?tab=exam" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <span>⏱️</span><div><div className="font-semibold">Mock Exam</div><div className="text-xs text-gray-400">Timed practice test</div></div>
                </Link>
                <Link to="/practice?tab=sample" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <span>📄</span><div><div className="font-semibold">Sample Questions</div><div className="text-xs text-gray-400">10 free preview</div></div>
                </Link>
              </div>
            )}
          </div>

          {/* Study dropdown */}
          <div className="relative" onMouseEnter={() => setStudyOpen(true)} onMouseLeave={() => setStudyOpen(false)}>
            <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 rounded-md hover:bg-gray-50">
              Study <span className="text-xs">▾</span>
            </button>
            {studyOpen && (
              <div className="absolute top-full left-0 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                <Link to="/glossary" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <span>📖</span><div><div className="font-semibold">Glossary</div><div className="text-xs text-gray-400">AWS terminology</div></div>
                </Link>
                <Link to="/resources" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <span>📚</span><div><div className="font-semibold">Resources</div><div className="text-xs text-gray-400">Study materials</div></div>
                </Link>
              </div>
            )}
          </div>

          <Link to="/certifications" className={`px-3 py-2 text-sm font-medium rounded-md ${isActive('/certifications') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}`}>Certifications</Link>
          <Link to="/about" className={`px-3 py-2 text-sm font-medium rounded-md ${isActive('/about') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}`}>About</Link>
          <Link to="/resources" className={`px-3 py-2 text-sm font-medium rounded-md ${isActive('/resources') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}`}>Resources</Link>
          <Link to="/pricing" className={`px-3 py-2 text-sm font-medium rounded-md ${isActive('/pricing') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}`}>Pricing</Link>
          <Link to="/chat" className={`px-3 py-2 text-sm font-medium rounded-md ${isActive('/chat') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}`}>AI Coach</Link>
        </div>

        {/* Auth Buttons — one place, works on ALL pages */}
        <div className="flex items-center gap-2">
          <Link to="/login" className="px-3 py-2 text-sm font-bold text-gray-700 hover:text-blue-600">Log In</Link>
          <Link to="/signup" className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">Sign Up Free</Link>
        </div>

      </div>
    </nav>
  )
}
