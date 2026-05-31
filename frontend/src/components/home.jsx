import { useNavigate } from 'react-router-dom'
import { Bus, Wallet, Shield, MapPin, ArrowRight, Star } from 'lucide-react'

const POPULAR_ROUTES = [
  { from: 'Colombo', to: 'Kandy', price: 'Rs. 800', duration: '2.5 hrs' },
  { from: 'Colombo', to: 'Galle', price: 'Rs. 1,100', duration: '2.5 hrs' },
  { from: 'Colombo', to: 'Jaffna', price: 'Rs. 2,800', duration: '10 hrs' },
  { from: 'Kandy', to: 'Nuwara Eliya', price: 'Rs. 450', duration: '1.5 hrs' },
  { from: 'Colombo', to: 'Matara', price: 'Rs. 1,200', duration: '3 hrs' },
  { from: 'Negombo', to: 'Kurunagala', price: 'Rs. 950', duration: '2 hrs' },
]

const FEATURES = [
  { icon: Wallet, title: 'Digital Wallet', desc: 'Top up once, book anytime. Your balance is always ready.', color: 'bg-emerald-500/10 text-emerald-400' },
  { icon: Shield, title: 'Secure Booking', desc: 'Unique ID verification prevents duplicate bookings.', color: 'bg-blue-500/10 text-blue-400' },
  { icon: Bus, title: 'Island-Wide Routes', desc: 'Covering 25+ cities and 200+ bus routes across Sri Lanka.', color: 'bg-purple-500/10 text-purple-400' },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pt-24 pb-32">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-green-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 text-green-400 text-sm font-medium mb-8">
            <Star size={14} className="fill-green-400" />
            Sri Lanka's Smartest Bus Platform
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
            Travel Smarter,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
              Book Faster.
            </span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            Search routes, reserve your seat, and pay instantly with your digital wallet —
            all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/booking')}
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-xl shadow-green-900/40 text-base"
            >
              Search Buses <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate('/wallet')}
              className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 py-4 rounded-2xl transition text-base"
            >
              <Wallet size={18} /> My Wallet
            </button>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-white/5 bg-white/2">
        <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '200+', label: 'Bus Routes' },
            { value: '25+', label: 'Cities Covered' },
            { value: '10K+', label: 'Daily Passengers' },
            { value: '99.9%', label: 'System Uptime' },
          ].map(s => (
            <div key={s.label}>
              <p className="text-3xl font-extrabold text-green-400">{s.value}</p>
              <p className="text-slate-500 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Why Smart Bus?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-white/15 transition-all hover:-translate-y-1">
              <div className={`inline-flex p-3 rounded-xl mb-4 ${color}`}>
                <Icon size={22} />
              </div>
              <h3 className="font-bold text-lg mb-2">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Routes Section */}
      <section className="px-6 pb-24 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Popular Routes</h2>
          <button onClick={() => navigate('/booking')} className="text-green-400 hover:text-green-300 text-sm font-medium flex items-center gap-1 transition">
            View all <ArrowRight size={14} />
          </button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {POPULAR_ROUTES.map(route => (
            <button
              key={`${route.from}-${route.to}`}
              onClick={() => navigate('/booking')}
              className="text-left bg-white/3 border border-white/8 rounded-2xl p-5 hover:border-green-500/40 hover:bg-green-500/5 transition-all group"
            >
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={14} className="text-green-400 shrink-0" />
                <span className="text-sm text-slate-400">{route.from}</span>
                <ArrowRight size={12} className="text-slate-600" />
                <span className="text-sm text-slate-400">{route.to}</span>
              </div>
              <p className="font-bold text-lg group-hover:text-green-400 transition">{route.price}</p>
              <p className="text-xs text-slate-500 mt-1">{route.duration} journey</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}