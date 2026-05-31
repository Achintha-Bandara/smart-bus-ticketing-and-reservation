import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Bus, Mail, Lock, Eye, EyeOff, Globe } from 'lucide-react'

export default function LoginPage() {
  const { signIn, signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const ROLE_ROUTES = {
    passenger: '/booking',
    driver: '/driver',
    owner: '/owner',
    admin: '/admin',
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    const { user, error: err } = await signIn(email, password)
    setLoading(false)
    if (err) { setError(err.message || 'Login failed. Please try again.'); return }
    const role = user?.app_metadata?.role || 'passenger'
    navigate(ROLE_ROUTES[role] || '/')
  }

  async function handleGoogle() {
    setError('')
    const { error: err } = await signInWithGoogle()
    if (err) setError(err.message)
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-950 via-green-950 to-slate-900">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col items-center justify-center w-1/2 px-16 text-white">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-green-500 p-3 rounded-2xl shadow-lg shadow-green-500/30">
            <Bus size={32} />
          </div>
          <span className="text-3xl font-bold tracking-tight">Smart Bus</span>
        </div>
        <h1 className="text-5xl font-extrabold mb-4 text-center leading-tight">
          Your journey<br />starts here.
        </h1>
        <p className="text-slate-400 text-center text-lg max-w-md">
          Book tickets, manage your wallet, and travel smarter across Sri Lanka.
        </p>
        <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-sm">
          {[
            { label: 'Routes Available', value: '200+' },
            { label: 'Daily Passengers', value: '10K+' },
            { label: 'Cities Covered', value: '25+' },
            { label: 'Uptime', value: '99.9%' },
          ].map(stat => (
            <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center backdrop-blur-sm">
              <p className="text-2xl font-bold text-green-400">{stat.value}</p>
              <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="bg-green-500 p-2 rounded-xl"><Bus size={22} className="text-white" /></div>
            <span className="text-xl font-bold text-white">Smart Bus</span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
          <p className="text-slate-400 text-sm mb-8">Sign in to your account</p>

          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-12 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition"
                />
                <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="text-right mt-2">
                <Link to="/forgot-password" className="text-xs text-green-400 hover:text-green-300 transition">Forgot password?</Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-green-900/40 mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-slate-500">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-3 rounded-xl transition"
          >
            <Globe size={18} />
            Continue with Google
          </button>

          <p className="text-center text-sm text-slate-400 mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-green-400 hover:text-green-300 font-semibold transition">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
