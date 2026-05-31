import { api } from './api'
import { searchMockTrips } from '../mocks/mockTrips'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

// Simulate network delay for realistic mock behaviour
const delay = (ms = 600) => new Promise(r => setTimeout(r, ms))

export async function searchTrips({ from, to, date, seats }) {
  if (USE_MOCK) {
    await delay()
    return searchMockTrips({ from, to, date, seats })
  }
  return api.get(`/trips/search?from=${from}&to=${to}&date=${date}&seats=${seats}`)
}

export async function getTripById(tripId) {
  if (USE_MOCK) {
    await delay(300)
    const { MOCK_TRIPS } = await import('../mocks/mockTrips')
    return MOCK_TRIPS.find(t => t.id === tripId) || null
  }
  return api.get(`/trips/${tripId}`)
}
