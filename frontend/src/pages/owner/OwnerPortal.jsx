import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { Bus, Users, DollarSign, TrendingUp, CheckCircle, Wrench, BarChart2 } from 'lucide-react'
import { MOCK_OWNER_FLEET, MOCK_OWNER_DRIVERS, MOCK_OWNER_EARNINGS } from '../../mocks/mockOwner'

const delay = (ms = 700) => new Promise(r => setTimeout(r, ms))

const STATUS_PILL = {
  Active: 'bg-green-100 text-green-700 border-green-200',
  Maintenance: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Inactive: 'bg-gray-100 text-gray-500 border-gray-200',
}

export default function OwnerPortal() {
  const { user } = useAuth()
  const [fleet, setFleet] = useState([])
  const [drivers, setDrivers] = useState([])
  const [earnings, setEarnings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  const ownerName = user?.user_metadata?.name || 'Owner'

  useEffect(() => {
    async function load() {
      await delay()
      setFleet(MOCK_OWNER_FLEET)
      setDrivers(MOCK_OWNER_DRIVERS)
      setEarnings(MOCK_OWNER_EARNINGS)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <LoadingSpinner fullScreen />

  const totalBuses = fleet.length
  const activeBuses = fleet.filter(b => b.status === 'Active').length
  const totalTrips = fleet.reduce((s, b) => s + b.tripsThisMonth, 0)

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-slate-400 text-sm mb-1">Owner Portal</p>
          <h1 className="text-2xl font-bold">Welcome, {ownerName} 👋</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your fleet and track earnings</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-4">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Buses', value: totalBuses, icon: Bus, color: 'text-blue-600 bg-blue-50' },
            { label: 'Active Buses', value: activeBuses, icon: CheckCircle, color: 'text-green-600 bg-green-50' },
            { label: 'Trips This Month', value: totalTrips, icon: TrendingUp, color: 'text-purple-600 bg-purple-50' },
            { label: 'Earnings (May)', value: `Rs. ${earnings?.thisMonth?.toLocaleString() ?? '—'}`, icon: DollarSign, color: 'text-emerald-600 bg-emerald-50' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className={`inline-flex p-2.5 rounded-xl mb-3 ${color}`}><Icon size={18} /></div>
              <p className="text-xl font-extrabold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-gray-200 rounded-2xl p-1 mb-6 shadow-sm">
          {[
            { key: 'overview', label: 'Fleet Overview', icon: Bus },
            { key: 'earnings', label: 'Earnings', icon: BarChart2 },
            { key: 'drivers', label: 'Drivers', icon: Users },
          ].map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === key ? 'bg-slate-900 text-white shadow' : 'text-gray-500 hover:text-gray-700'
              }`}>
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {/* FLEET OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {fleet.map(bus => (
              <div key={bus.busId} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Bus size={16} className="text-slate-600" />
                      <p className="font-bold text-gray-900">{bus.busName}</p>
                    </div>
                    <p className="text-sm text-gray-500">{bus.plateNo} · {bus.busType}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${STATUS_PILL[bus.status] || STATUS_PILL.Inactive}`}>
                    {bus.status === 'Maintenance' && <Wrench size={10} className="inline mr-1" />}
                    {bus.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Route', value: bus.routeName },
                    { label: 'Driver', value: bus.driverName },
                    { label: 'Trips This Month', value: bus.tripsThisMonth },
                    { label: 'Earned This Month', value: `Rs. ${bus.earnedThisMonth.toLocaleString()}` },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500 mb-1">{label}</p>
                      <p className="font-semibold text-gray-900 text-sm">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EARNINGS */}
        {activeTab === 'earnings' && earnings && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { label: 'This Month', value: earnings.thisMonth, color: 'text-green-600' },
                { label: 'Last Month', value: earnings.lastMonth, color: 'text-gray-700' },
                { label: 'This Year', value: earnings.thisYear, color: 'text-blue-600' },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
                  <p className="text-xs text-gray-500 mb-2">{label}</p>
                  <p className={`text-3xl font-extrabold ${color}`}>Rs. {value.toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-800 mb-6">Monthly Earnings Trend</h3>
              <div className="flex items-end gap-4 h-40">
                {earnings.breakdown.map(({ month, amount }) => {
                  const max = Math.max(...earnings.breakdown.map(b => b.amount))
                  const pct = Math.round((amount / max) * 100)
                  return (
                    <div key={month} className="flex-1 flex flex-col items-center gap-2">
                      <p className="text-xs font-bold text-gray-600">Rs.{(amount / 1000).toFixed(0)}k</p>
                      <div className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t-lg hover:opacity-80 transition" style={{ height: `${pct}%` }} />
                      <p className="text-xs text-gray-500">{month}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* DRIVERS */}
        {activeTab === 'drivers' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-800 mb-5">Your Drivers</h2>
            <div className="space-y-3">
              {drivers.map(driver => (
                <div key={driver.driverId} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {driver.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{driver.name}</p>
                      <p className="text-xs text-gray-500">License: {driver.license}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Assigned Bus</p>
                    <p className="font-bold text-gray-900 text-sm">{driver.assignedBus}</p>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">{driver.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
