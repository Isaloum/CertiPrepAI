import { createContext, useContext, useEffect, useState } from 'react'
import { getSession, signOut as cognitoSignOut, type AuthUser } from '../lib/cognito'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  isPremium: boolean
  isFullAccess: boolean
  tier: 'free' | 'monthly' | 'yearly' | 'lifetime'
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isPremium: false,
  isFullAccess: false,
  tier: 'free',
  signOut: async () => {},
  refreshUser: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    const u = await getSession()
    setUser(u)
  }

  useEffect(() => {
    getSession().then((u) => {
      setUser(u)
      setLoading(false)
    })
  }, [])

  const tier = user?.tier ?? 'free'
  const isPremium = tier !== 'free'
  const isFullAccess = tier === 'yearly' || tier === 'lifetime'

  const signOut = async () => {
    cognitoSignOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, isPremium, isFullAccess, tier, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
