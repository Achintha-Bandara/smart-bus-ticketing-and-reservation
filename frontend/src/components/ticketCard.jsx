import { useNavigate } from 'react-router-dom'
import { Clock, Users, Zap } from 'lucide-react'

export default function TicketCard({ trip, travelers }) {
  const navigate = useNavigate()
  const canBook = travelers <= trip.seatsAvailable
  const totalPrice = trip.pricePerSeat * travelers

  return (
    <div className={`bg-white rounded-2xl shadow-sm border transition-all hover:shadow-md hover:-translate-y-0.5 overflow-hidden ${!canBook ? 'opacity-50' : 'border-gray-100 hover:border-green-200'}`}>
      {/* Header strip */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-5 py-3 flex items-center justify-between">
        <div>
          <p className="text-white font-bold text-sm">{trip.busName}</p>
          <p className="text-slate-400 text-xs">{trip.busPlate} · {trip.busType}</p>
        </div>
        <div className="text-right">
          <p className="text-green-400 font-extrabold text-lg">Rs. {trip.pricePerSeat.toLocaleString()}</p>
          <p className="text-slate-500 text-xs">per seat</p>
        </div>
      </div>

      <div className="p-5">
        {/* Route */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-0.5">From</p>
            <p className="font-bold text-gray-900 capitalize">{trip.fromLabel || trip.from}</p>
          </div>
          <div className="flex flex-col items-center gap-1 text-gray-300">
            <div className="w-2 h-2 rounded-full border-2 border-green-500" />
            <div className="w-px h-6 bg-gray-200" />
            <div className="w-2 h-2 rounded-full bg-green-500" />
          </div>
          <div className="flex-1 text-right">
            <p className="text-xs text-gray-500 mb-0.5">To</p>
            <p className="font-bold text-gray-900 capitalize">{trip.toLabel || trip.to}</p>
          </div>
        </div>

        {/* Time row */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4 bg-gray-50 rounded-xl px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-green-600" />
            <span className="font-semibold">{trip.time}</span>
          </div>
          <span className="text-gray-400 text-xs">→</span>
          <span className="font-semibold">{trip.arrivalTime}</span>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Users size={13} />
            <span>{trip.seatsAvailable} left</span>
          </div>
        </div>

        {/* Amenities */}
        {trip.amenities?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {trip.amenities.map(a => (
              <span key={a} className="flex items-center gap-1 text-xs bg-green-50 text-green-700 border border-green-100 rounded-full px-2.5 py-1">
                <Zap size={10} /> {a}
              </span>
            ))}
          </div>
        )}

        {/* Total + CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500">Total for {travelers} {travelers === 1 ? 'seat' : 'seats'}</p>
            <p className="font-extrabold text-gray-900 text-lg">Rs. {totalPrice.toLocaleString()}</p>
          </div>
          <button
            disabled={!canBook}
            onClick={() => navigate('/booking/confirm', { state: { trip, travelers } })}
            className={`font-bold py-2.5 px-5 rounded-xl transition text-sm ${canBook
              ? 'bg-green-600 hover:bg-green-700 text-white shadow-sm'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {canBook ? 'Book Now' : 'Full'}
          </button>
        </div>
      </div>
    </div>
  )
}