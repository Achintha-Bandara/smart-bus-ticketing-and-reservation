import { useState, useCallback } from 'react'
import { searchTrips } from '../services/tripService'

export function useTrips() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searched, setSearched] = useState(false)

  const search = useCallback(async (filters) => {
    setLoading(true)
    setSearched(true)
    setError(null)
    try {
      const results = await searchTrips(filters)
      setTrips(results)
    } catch (e) {
      setError(e.message)
      setTrips([])
    } finally {
      setLoading(false)
    }
  }, [])

  return { trips, loading, error, searched, search }
}
