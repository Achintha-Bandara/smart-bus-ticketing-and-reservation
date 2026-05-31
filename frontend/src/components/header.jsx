import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Bus, LogOut, User, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const ROLE_LABELS = { passenger: 'Passenger', driver: 'Driver', owner: 'Bus Owner', admin: 'Admin' }

const NAV_LINKS = {
  passenger: [
    { to: '/booking', label: 'Book Ticket' },
    { to: '/my-tickets', label: 'My Tickets' },
    { to: '/wallet', label: 'Wallet' },
  ],
  driver: [{ to: '/driver', label: 'Driver Portal' }],
  owner: [{ to: '/owner', label: 'Owner Portal' }],
  admin: [{ to: '/admin', label: 'Admin Portal' }],
}

export default function Header() {
  const { user, role, signOut } = useAuth()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const links = NAV_LINKS[role] || NAV_LINKS.passenger
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'
  const userInitial = userName.charAt(0).toUpperCase()

  async function handleLogout() {
    await signOut()
    navigate('/login')
  }

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${isActive ? 'text-green-400' : 'text-slate-300 hover:text-white'}`

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 border-b border-white/5 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2 group">
          <div className="bg-green-600 p-1.5 rounded-lg group-hover:bg-green-500 transition">
            <Bus size={18} className="text-white" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">Smart Bus</span>
        </NavLink>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          {links.map(link => (
            <NavLink key={link.to} to={link.to} className={linkClass}>{link.label}</NavLink>
          ))}
        </nav>

        {/* User Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(p => !p)}
            className="flex items-center gap-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-3 py-2 transition"
          >
            <div className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {userInitial}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-white text-xs font-semibold leading-tight">{userName}</p>
              <p className="text-slate-500 text-xs">{ROLE_LABELS[role] || 'Passenger'}</p>
            </div>
            <ChevronDown size={14} className={`text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-white/5">
                <p className="text-white text-sm font-semibold">{userName}</p>
                <p className="text-slate-500 text-xs truncate">{user?.email}</p>
              </div>
              <div className="p-1">
                <button
                  onClick={() => { setDropdownOpen(false); navigate('/my-tickets') }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white text-sm transition"
                >
                  <User size={15} /> My Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 text-sm transition"
                >
                  <LogOut size={15} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
