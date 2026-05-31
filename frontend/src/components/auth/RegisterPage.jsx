import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Bus, Mail, Lock, User, Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)

  function validate() {
    const e = {}
    if (!name.trim()) e.name = 'Name is required'
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Valid email required'
    if (!password || password.length < 8) e.password = 'Password must be at least 8 characters'
    if (password !== confirm) e.confirm = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    const { error } = await signUp(email, password, name)
    setLoading(false)
    if (error) { setErrors({ form: error.message }); return }
    setSuccess(true)
    setTimeout(() => navigate('/booking'), 2000)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-green-950 to-slate-900 px-6">
        <div className="text-center bg-white/5 border border-white/10 rounded-3xl p-12 backdrop-blur-md">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✓</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">You're in!</h2>
          <p className="text-slate-400 text-sm">Account created. Redirecting you now...</p>
        </div>
      </div>
    )
  }

  const Field = ({ label, icon: Icon, error, children }) => (
    <div>
      <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">{label}</label>
      <div className="relative">
        <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
        {children}
      </div>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-green-950 to-slate-900 px-6 py-12">
      <div className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-green-500 p-2 rounded-xl"><Bus size={22} className="text-white" /></div>
          <span className="text-xl font-bold text-white">Smart Bus</span>
        </div>

        <h2 className="text-2xl font-bold text-white mb-1">Create account</h2>
        <p className="text-slate-400 text-sm mb-8">Join thousands of commuters</p>

        {errors.form && (
          <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">{errors.form}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="Full Name" icon={User} error={errors.name}>
            <input
              type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="Kasun Perera"
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition"
            />
          </Field>

          <Field label="Email" icon={Mail} error={errors.email}>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition"
            />
          </Field>

          <Field label="Password" icon={Lock} error={errors.password}>
            <input
              type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-12 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition"
            />
            <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </Field>

          <Field label="Confirm Password" icon={Lock} error={errors.confirm}>
            <input
              type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
              placeholder="Repeat password"
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition"
            />
          </Field>

          <button
            type="submit" disabled={loading}
            className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-green-900/40 mt-2"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-green-400 hover:text-green-300 font-semibold transition">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
