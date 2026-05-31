import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

// Mock user for development when Supabase keys are not set
const MOCK_USER = {
  id: 'mock-user-001',
  email: 'passenger@demo.com',
  user_metadata: { name: 'Demo Passenger' },
  app_metadata: { role: 'passenger' },
}

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (USE_MOCK) {
      // Auto-login with mock user in dev mode
      setUser(MOCK_USER)
      setSession({ access_token: 'mock-token', user: MOCK_USER })
      setRole('passenger')
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setRole(session?.user?.app_metadata?.role ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setRole(session?.user?.app_metadata?.role ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signIn(email, password) {
    if (USE_MOCK) {
      setUser(MOCK_USER)
      setSession({ access_token: 'mock-token', user: MOCK_USER })
      setRole('passenger')
      return { user: MOCK_USER, error: null }
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { user: data?.user, error }
  }

  async function signInWithGoogle() {
    if (USE_MOCK) return { error: new Error('Google auth not available in mock mode') }
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
    return { error }
  }

  async function signUp(email, password, name) {
    if (USE_MOCK) {
      const mockNew = { ...MOCK_USER, email, user_metadata: { name } }
      setUser(mockNew)
      setSession({ access_token: 'mock-token', user: mockNew })
      setRole('passenger')
      return { user: mockNew, error: null }
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, role: 'passenger' } },
    })
    return { user: data?.user, error }
  }

  async function signOut() {
    if (USE_MOCK) {
      setUser(null)
      setSession(null)
      setRole(null)
      return
    }
    await supabase.auth.signOut()
  }

  const value = { user, session, role, loading, signIn, signInWithGoogle, signUp, signOut }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
