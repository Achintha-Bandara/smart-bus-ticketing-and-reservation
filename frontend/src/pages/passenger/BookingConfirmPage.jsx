import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, MapPin, Clock, Bus, User, CheckCircle, AlertCircle } from 'lucide-react'
import { createBooking } from '../../services/bookingService'
import { deductForBooking, getWallet } from '../../services/walletService'
import { useWallet } from '../../hooks/useWallet'
import { toast } from '../../components/common/Toast'

// Simple grid seat selector — 6 columns × 9 rows = 54 seats
function SeatGrid({ totalSeats = 54, selected, onSelect }) {
  const cols = 6
  const rows = Math.ceil(totalSeats / cols)
  // Mock booked seats
  const booked = new Set([3, 7, 12, 19, 24, 31, 38])

  return (
    <div>
      <div className="flex gap-4 text-xs text-gray-500 mb-3">
        <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded-sm bg-gray-100 border border-gray-200 inline-block" /> Available</span>
        <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded-sm bg-green-600 inline-block" /> Selected</span>
        <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded-sm bg-gray-400 inline-block" /> Booked</span>
      </div>
      {/* Driver area */}
      <div className="flex justify-end mb-2">
        <div className="flex items-center gap-1 text-xs text-gray-400 bg-gray-100 rounded-lg px-3 py-1.5">
          <Bus size={12} /> Driver
        </div>
      </div>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {Array.from({ length: totalSeats }, (_, i) => {
          const seatNo = i + 1
          const isBooked = booked.has(seatNo)
          const isSelected = selected === seatNo
          return (
            <button
              key={seatNo}
              disabled={isBooked}
              onClick={() => onSelect(isSelected ? null : seatNo)}
              className={`aspect-square rounded-lg text-xs font-bold transition-all
                ${isBooked ? 'bg-gray-400 text-white cursor-not-allowed'
                : isSelected ? 'bg-green-600 text-white shadow-lg scale-105'
                : 'bg-gray-100 hover:bg-green-100 text-gray-600 border border-gray-200 hover:border-green-400'}`}
            >
              {seatNo}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function BookingConfirmPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { trip, travelers } = location.state || {}
  const { balance, refresh } = useWallet()

  const [selectedSeat, setSelectedSeat] = useState(null)
  const [loading, setLoading] = useState(false)
  const [confirmed, setConfirmed] = useState(null)

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-10">
          <p className="text-gray-600 mb-4">No booking data found.</p>
          <button onClick={() => navigate('/booking')} className="text-green-600 font-semibold">← Back to search</button>
        </div>
      </div>
    )
  }

  const totalFare = trip.pricePerSeat * (travelers || 1)
  const hasEnoughBalance = balance !== null && balance >= totalFare

  async function handleConfirm() {
    if (!selectedSeat) { toast('Please select a seat first.', 'error'); return }
    if (!hasEnoughBalance) { toast('Insufficient wallet balance. Please top up.', 'error'); return }

    setLoading(true)
    try {
      await deductForBooking(totalFare)
      const booking = await createBooking({
        tripId: trip.id,
        seatNo: selectedSeat,
        fare: totalFare,
        from: trip.fromLabel || trip.from,
        to: trip.toLabel || trip.to,
        departureAt: trip.date + 'T' + (trip.time || '00:00'),
      })
      await refresh()
      setConfirmed(booking)
      toast('Booking confirmed! 🎉', 'success')
    } catch (e) {
      toast(e.message || 'Booking failed. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (confirmed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-lg p-10 text-center border border-gray-100">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={44} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-500 text-sm mb-6">Your seat has been reserved successfully.</p>
          <div className="bg-gray-50 rounded-2xl p-5 text-left space-y-2 mb-8">
            <p className="text-sm"><span className="text-gray-500">Booking ID:</span> <span className="font-bold">#{confirmed.bookingId}</span></p>
            <p className="text-sm"><span className="text-gray-500">Route:</span> <span className="font-bold">{confirmed.from} → {confirmed.to}</span></p>
            <p className="text-sm"><span className="text-gray-500">Seat:</span> <span className="font-bold">#{confirmed.seatNo}</span></p>
            <p className="text-sm"><span className="text-gray-500">Fare Paid:</span> <span className="font-bold text-green-600">Rs. {confirmed.fare.toLocaleString()}</span></p>
          </div>
          <div className="flex flex-col gap-3">
            <button onClick={() => navigate('/my-tickets')} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition">View My Tickets</button>
            <button onClick={() => navigate('/booking')} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-xl transition">Search More</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-4xl mx-auto px-4 pt-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 transition text-sm">
          <ArrowLeft size={16} /> Back to results
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-8">Confirm Your Booking</h1>

        <div className="grid lg:grid-cols-[1fr_380px] gap-6">
          {/* Left — Seat Selector */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-800 mb-4">Choose Your Seat</h2>
            <SeatGrid totalSeats={trip.totalSeats || 54} selected={selectedSeat} onSelect={setSelectedSeat} />
            {selectedSeat && (
              <p className="mt-4 text-sm text-green-700 bg-green-50 border border-green-100 rounded-xl px-4 py-2.5 font-medium">
                ✓ Seat #{selectedSeat} selected
              </p>
            )}
          </div>

          {/* Right — Summary */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-gray-800 mb-4">Trip Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Bus size={15} className="text-green-600 shrink-0" />
                  <span className="font-semibold text-gray-900">{trip.busName}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={15} className="text-green-600 shrink-0" />
                  <span>{trip.fromLabel || trip.from} → {trip.toLabel || trip.to}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock size={15} className="text-green-600 shrink-0" />
                  <span>{trip.time} → {trip.arrivalTime}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <User size={15} className="text-green-600 shrink-0" />
                  <span>{travelers} passenger{travelers > 1 ? 's' : ''}</span>
                </div>
              </div>

              <div className="border-t border-gray-100 mt-5 pt-4">
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>Rs. {trip.pricePerSeat.toLocaleString()} × {travelers}</span>
                  <span>Rs. {totalFare.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 text-base">
                  <span>Total</span>
                  <span className="text-green-600">Rs. {totalFare.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Wallet Balance</span>
                <span className={`font-bold ${hasEnoughBalance ? 'text-green-600' : 'text-red-500'}`}>
                  Rs. {balance?.toFixed(2) ?? '...'}
                </span>
              </div>
              {!hasEnoughBalance && balance !== null && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl p-3 text-red-600 text-xs">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <span>Insufficient balance. <button onClick={() => navigate('/payment')} className="underline font-semibold">Top up wallet</button></span>
                </div>
              )}
            </div>

            <button
              onClick={handleConfirm}
              disabled={loading || !selectedSeat || !hasEnoughBalance}
              className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition shadow-md"
            >
              {loading ? 'Processing...' : `Confirm & Pay Rs. ${totalFare.toLocaleString()}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
