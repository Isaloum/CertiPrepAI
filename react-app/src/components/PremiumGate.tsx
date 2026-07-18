import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Layout from './Layout'

/**
 * PremiumGate — shared full-page lock card for "any paid plan" features.
 *
 * Replaces the near-identical `if (!isPremium) return (...)` blocks that were
 * copy-pasted across the study-tool pages (CheatSheets, StudyGuide, Glossary,
 * Keywords, ServiceGroups, ServiceComparison, Diagrams, ArchitectureBuilder,
 * VisualExam). One lock, one place to update when plans change.
 *
 * This does NOT change who-sees-what — pages still decide when to render it
 * (typically `if (!isPremium) return <PremiumGate .../>`). It only unifies the UI.
 */
interface PremiumGateProps {
  icon?: string
  title?: string
  message: string
  /** Optional smaller second line (e.g. "Available on Monthly, Yearly, Lifetime plans"). */
  subMessage?: string
  buttonLabel?: string
  /** Show a "Sign Up Free" button for logged-out visitors alongside "View Plans". */
  showSignUp?: boolean
}

export default function PremiumGate({
  icon = '🔒',
  title = 'Study Tools are for members only',
  message,
  subMessage,
  buttonLabel = 'See Plans →',
  showSignUp = false,
}: PremiumGateProps) {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <Layout>
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
        <div style={{ background: '#fff', borderRadius: '24px', padding: '48px 40px', maxWidth: '480px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>{icon}</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>{title}</h2>
          <p style={{ color: '#64748b', margin: '0 0 8px', lineHeight: 1.6 }}>{message}</p>
          {subMessage && <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0 0 8px' }}>{subMessage}</p>}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '20px' }}>
            {showSignUp && !user && (
              <button onClick={() => navigate('/signup')} style={{ padding: '13px 24px', borderRadius: '12px', background: '#f1f5f9', color: '#475569', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem' }}>
                Sign Up Free
              </button>
            )}
            <button onClick={() => navigate('/pricing')} style={{ padding: '13px 28px', borderRadius: '12px', background: '#2563eb', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}>
              {buttonLabel}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
