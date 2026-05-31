import { api } from './api'
import { MOCK_BOOKINGS } from '../mocks/mockBookings'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'
const delay = (ms = 700) => new Promise(r => setTimeout(r, ms))

let _bookings = [...MOCK_BOOKINGS]

export async function getMyBookings() {
  if (USE_MOCK) {
    await delay()
    return [..._bookings]
  }
  return api.get('/bookings/my')
}

export async function createBooking({ tripId, seatNo, fare, from, to, departureAt }) {
  if (USE_MOCK) {
    await delay(1200)
    const newBooking = {
      bookingId: Date.now(),
      tripId,
      busName: 'Express Bus',
      from,
      to,
      departureAt,
      seatNo,
      fare,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    }
    _bookings = [newBooking, ..._bookings]
    return newBooking
  }
  return api.post('/bookings', { tripId, seatNo, fare, from, to, departureAt })
}

export async function cancelBooking(bookingId) {
  if (USE_MOCK) {
    await delay(800)
    _bookings = _bookings.map(b =>
      b.bookingId === bookingId ? { ...b, status: 'Cancelled' } : b
    )
    return { success: true }
  }
  return api.put(`/bookings/${bookingId}/cancel`)
}

export async function getBookingById(bookingId) {
  if (USE_MOCK) {
    await delay(300)
    return _bookings.find(b => b.bookingId === bookingId) || null
  }
  return api.get(`/bookings/${bookingId}`)
}
