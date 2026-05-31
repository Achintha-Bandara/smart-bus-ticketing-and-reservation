import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { toast } from '../../components/common/Toast'
import { Bus, Users, Clock, MapPin, CheckCircle, Play, Flag, History } from 'lucide-react'
import { MOCK_DRIVER_TRIP, MOCK_DRIVER_SHIFTS } from '../../mocks/mockDriver'

const delay = (ms = 800) => new Promise(r => setTimeout(r, ms))

const STATUS_CONFIG = {
  Scheduled: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', next: 'Mark as Departed', nextStatus: 'Departed', icon: Clock },
  Departed: { color: 'bg-blue-100 text-blue-700 border-blue-200', next: 'Mark as Arrived', nextStatus: 'Arrived', icon: Play },
  Arrived: { color: 'bg-green-100 text-green-700 border-green-200', next: null, icon: CheckCircle },
}

export default function DriverPortal() {
  const { user } = useAuth()
  const [trip, setTrip] = useState(null)
  const [shifts, setShifts] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [activeTab, setActiveTab] = useState('today')
  const [searchTerm, setSearchTerm] = useState('')

  const driverName = user?.user_metadata?.name || 'Driver'

  useEffect(() => {
    async function load() {
      await delay(600)
      setTrip(MOCK_DRIVER_TRIP)
      setShifts(MOCK_DRIVER_SHIFTS)
      setLoading(false)
    }
    load()
  }, [])

  async function handleStatusUpdate() {
    const current = STATUS_CONFIG[trip.status]
    if (!current?.nextStatus) return
    setUpdating(true)
    await delay(1000)
    setTrip(prev => ({ ...prev, status: current.nextStatus }))
    toast(`Trip marked as ${current.nextStatus}!`, 'success')
    setUpdating(false)
  }

  const filteredPassengers = (trip?.passengers || []).filter(p =>
    !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase()) || String(p.seatNo).includes(searchTerm)
  )

  if (loading) return <LoadingSpinner fullScreen />

  const statusCfg = STATUS_CONFIG[trip?.status] || STATUS_CONFIG.Scheduled

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Portal Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-slate-400 text-sm mb-1">Driver Portal</p>
          <h1 className="text-2xl font-bold">Good day, {driverName} 👋</h1>
          <p className="text-slate-400 text-sm mt-1">
            {new Date().toLocaleDateString('en-LK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-4">
        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-gray-200 rounded-2xl p-1 mb-6 shadow-sm">
          {[
            { key: 'today', label: "Today's Trip", icon: Bus },
            { key: 'passengers', label: 'Passenger List', icon: Users },
            { key: 'history', label: 'Shift History', icon: History },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === key ? 'bg-slate-900 text-white shadow' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {/* TODAY'S TRIP TAB */}
        {activeTab === 'today' && trip && (
          <div className="space-y-4">
            {/* Status Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-gray-800">Current Trip Status</h2>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${statusCfg.color}`}>
                  {trip.status}
                </span>
              </div>

              {/* Route visual */}
              <div className="flex items-center gap-4 mb-6 bg-gray-50 rounded-2xl p-5">
                <div className="text-center flex-1">
                  <p className="text-2xl font-extrabold text-gray-900">{trip.route.from}</p>
                  <p className="text-xs text-gray-400 mt-1">Departure</p>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div className="flex items-center w-full gap-1">
                    <div className="w-2 h-2 rounded-full border-2 border-green-500 shrink-0" />
                    <div className="flex-1 border-t-2 border-dashed border-gray-300" />
                    <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                  </div>
                  <Bus size={20} className="text-gray-400 mt-2" />
                </div>
                <div className="text-center flex-1">
                  <p className="text-2xl font-extrabold text-gray-900">{trip.route.to}</p>
                  <p className="text-xs text-gray-400 mt-1">Destination</p>
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Departure', value: new Date(trip.departureAt).toLocaleTimeString('en-LK', { hour: '2-digit', minute: '2-digit' }) },
                  { label: 'Arrival', value: new Date(trip.arrivalAt).toLocaleTimeString('en-LK', { hour: '2-digit', minute: '2-digit' }) },
                  { label: 'Bus', value: trip.bus.plateNo },
                  { label: 'Passengers', value: `${trip.passengers.length} booked` },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">{label}</p>
                    <p className="font-bold text-gray-900 text-sm">{value}</p>
                  </div>
                ))}
              </div>

              {/* Status action */}
              {statusCfg.next && (
                <button
                  onClick={handleStatusUpdate}
                  disabled={updating}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2"
                >
                  <Flag size={16} />
                  {updating ? 'Updating...' : statusCfg.next}
                </button>
              )}
              {trip.status === 'Arrived' && (
                <div className="flex items-center justify-center gap-2 py-3 text-green-600 font-bold bg-green-50 rounded-xl">
                  <CheckCircle size={18} /> Trip Completed
                </div>
              )}
            </div>
          </div>
        )}

        {/* PASSENGER LIST TAB */}
        {activeTab === 'passengers' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-gray-800">Passenger Manifest</h2>
              <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{trip?.passengers.length} passengers</span>
            </div>

            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by name or seat number..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-400 mb-5 transition"
            />

            <div className="space-y-3">
              {filteredPassengers.map(p => (
                <div key={p.bookingId} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{p.name}</p>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                        <MapPin size={11} />
                        <span>{p.from} → {p.to}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Seat</p>
                    <p className="font-extrabold text-gray-900 text-lg">#{p.seatNo}</p>
                  </div>
                </div>
              ))}
              {filteredPassengers.length === 0 && (
                <p className="text-center text-gray-400 py-8 text-sm">No passengers found</p>
              )}
            </div>
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-800 mb-5">Recent Shifts</h2>
            <div className="space-y-3">
              {shifts.map(shift => (
                <div key={shift.shiftId} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{shift.from} → {shift.to}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{new Date(shift.date).toLocaleDateString('en-LK', { dateStyle: 'medium' })}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Passengers</p>
                      <p className="font-bold text-gray-900">{shift.passengers}</p>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-700 border border-green-200">{shift.status}</span>
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
