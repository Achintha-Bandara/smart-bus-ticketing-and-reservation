import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyBookings, cancelBooking } from '../../services/bookingService'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { toast } from '../../components/common/Toast'
import { Clock, MapPin, Ticket, XCircle } from 'lucide-react'

const STATUS_STYLES = {
  Confirmed: 'bg-green-100 text-green-700 border-green-200',
  Completed: 'bg-blue-100 text-blue-700 border-blue-200',
  Cancelled: 'bg-gray-100 text-gray-500 border-gray-200',
}

export default function MyTicketsPage() {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('upcoming')
  const [cancelling, setCancelling] = useState(null)

  useEffect(() => {
    getMyBookings()
      .then(setBookings)
      .catch(e => toast(e.message, 'error'))
      .finally(() => setLoading(false))
  }, [])

  const now = new Date()

  const filterMap = {
    upcoming: bookings.filter(b => b.status === 'Confirmed' && new Date(b.departureAt) > now),
    past: bookings.filter(b => b.status === 'Completed' || (b.status === 'Confirmed' && new Date(b.departureAt) <= now)),
    cancelled: bookings.filter(b => b.status === 'Cancelled'),
  }

  const filtered = filterMap[tab] || []

  async function handleCancel(bookingId) {
    setCancelling(bookingId)
    try {
      await cancelBooking(bookingId)
      setBookings(prev => prev.map(b => b.bookingId === bookingId ? { ...b, status: 'Cancelled' } : b))
      toast('Booking cancelled.', 'success')
    } catch (e) {
      toast(e.message, 'error')
    } finally {
      setCancelling(null)
    }
  }

  const TABS = [
    { key: 'upcoming', label: 'Upcoming', count: filterMap.upcoming.length },
    { key: 'past', label: 'Past', count: filterMap.past.length },
    { key: 'cancelled', label: 'Cancelled', count: filterMap.cancelled.length },
  ]

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">My Tickets</h1>
        <p className="text-gray-500 text-sm mb-8">All your bus bookings in one place</p>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-gray-200 rounded-2xl p-1 mb-8 shadow-sm">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                tab === t.key ? 'bg-green-600 text-white shadow' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
              {t.count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${tab === t.key ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? <LoadingSpinner /> : (
          filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
              <Ticket size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-semibold">No {tab} bookings</p>
              {tab === 'upcoming' && (
                <button onClick={() => navigate('/booking')} className="mt-4 text-green-600 font-semibold text-sm hover:text-green-700 transition">
                  Search for buses →
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map(booking => (
                <div
                  key={booking.bookingId}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/my-tickets/${booking.bookingId}`)}
                >
                  <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-5 py-3 flex items-center justify-between">
                    <p className="text-white font-bold text-sm">{booking.busName}</p>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${STATUS_STYLES[booking.status] || 'bg-gray-100 text-gray-500'}`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin size={14} className="text-green-600 shrink-0" />
                      <span className="text-gray-800 font-semibold text-sm">{booking.from} → {booking.to}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Clock size={13} />
                        <span>{new Date(booking.departureAt).toLocaleString('en-LK', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400">Seat #{booking.seatNo}</span>
                        <span className="font-bold text-green-600">Rs. {booking.fare.toLocaleString()}</span>
                      </div>
                    </div>
                    {tab === 'upcoming' && (
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={e => { e.stopPropagation(); handleCancel(booking.bookingId) }}
                          disabled={cancelling === booking.bookingId}
                          className="flex items-center gap-1.5 text-red-500 hover:text-red-600 text-xs font-semibold transition disabled:opacity-50"
                        >
                          <XCircle size={14} /> {cancelling === booking.bookingId ? 'Cancelling...' : 'Cancel Booking'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  )
}
