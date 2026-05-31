import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getBookingById } from '../../services/bookingService'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { ArrowLeft, Bus, MapPin, Clock, Hash, CheckCircle } from 'lucide-react'

// Simple QR code using a data URI canvas approach (no extra library needed)
function SimpleQR({ value }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white p-4 rounded-2xl shadow-inner border border-gray-100">
        <img
          src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(value)}&color=1e293b&bgcolor=ffffff`}
          alt="Ticket QR Code"
          className="w-44 h-44 rounded-xl"
        />
      </div>
      <p className="text-xs text-gray-400 mt-2">Show this to the driver</p>
    </div>
  )
}

const STATUS_CONFIG = {
  Confirmed: { color: 'text-green-700 bg-green-100 border-green-200', icon: CheckCircle },
  Completed: { color: 'text-blue-700 bg-blue-100 border-blue-200', icon: CheckCircle },
  Cancelled: { color: 'text-gray-500 bg-gray-100 border-gray-200', icon: CheckCircle },
}

export default function TicketDetailPage() {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBookingById(Number(bookingId))
      .then(setBooking)
      .catch(() => setBooking(null))
      .finally(() => setLoading(false))
  }, [bookingId])

  if (loading) return <LoadingSpinner fullScreen />

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-10">
          <p className="text-gray-500 mb-4">Ticket not found.</p>
          <button onClick={() => navigate('/my-tickets')} className="text-green-600 font-semibold">← My Tickets</button>
        </div>
      </div>
    )
  }

  const statusCfg = STATUS_CONFIG[booking.status] || STATUS_CONFIG.Confirmed

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-md mx-auto px-4 pt-8">
        <button onClick={() => navigate('/my-tickets')} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 transition text-sm">
          <ArrowLeft size={16} /> My Tickets
        </button>

        {/* Ticket Card */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-6 text-center text-white">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Bus size={18} className="text-green-400" />
              <span className="font-bold text-lg">{booking.busName}</span>
            </div>
            <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full border ${statusCfg.color}`}>
              {booking.status}
            </span>
          </div>

          {/* Route */}
          <div className="px-8 py-6 border-b border-dashed border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-center">
                <p className="text-2xl font-extrabold text-gray-900">{booking.from}</p>
                <p className="text-xs text-gray-500 mt-1">Departure</p>
              </div>
              <div className="flex-1 flex flex-col items-center px-4">
                <div className="w-full flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full border-2 border-green-500 shrink-0" />
                  <div className="flex-1 border-t-2 border-dashed border-gray-300" />
                  <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                </div>
                <Bus size={16} className="text-gray-400 mt-2" />
              </div>
              <div className="text-center">
                <p className="text-2xl font-extrabold text-gray-900">{booking.to}</p>
                <p className="text-xs text-gray-500 mt-1">Arrival</p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="px-8 py-5 grid grid-cols-2 gap-4 border-b border-dashed border-gray-200">
            {[
              { icon: Clock, label: 'Date & Time', value: new Date(booking.departureAt).toLocaleString('en-LK', { dateStyle: 'medium', timeStyle: 'short' }) },
              { icon: Hash, label: 'Seat Number', value: `#${booking.seatNo}` },
              { icon: MapPin, label: 'Booking ID', value: `#${booking.bookingId}` },
              { icon: CheckCircle, label: 'Fare Paid', value: `Rs. ${booking.fare.toLocaleString()}` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label}>
                <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                  <Icon size={12} />
                  <span className="text-xs">{label}</span>
                </div>
                <p className="font-bold text-gray-900 text-sm">{value}</p>
              </div>
            ))}
          </div>

          {/* QR Code */}
          <div className="px-8 py-6 flex flex-col items-center">
            <SimpleQR value={`SBTRS:${booking.bookingId}:SEAT-${booking.seatNo}`} />
          </div>
        </div>
      </div>
    </div>
  )
}
