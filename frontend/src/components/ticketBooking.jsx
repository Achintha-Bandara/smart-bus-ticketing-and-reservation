import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TicketSearch from './ticketSearch'
import TicketCard from './ticketCard'
import LoadingSpinner from './common/LoadingSpinner'
import { useTrips } from '../hooks/useTrips'
import { useWallet } from '../hooks/useWallet'
import { Wallet, Plus, SearchX } from 'lucide-react'

export default function TicketBooking() {
  const navigate = useNavigate()
  const { trips, loading, error, searched, search } = useTrips()
  const { balance } = useWallet()
  const [filters, setFilters] = useState({ from: '', to: '', startDate: '', travelers: 1 })

  function handleSearch(newFilters) {
    setFilters(newFilters)
    if (newFilters.from || newFilters.to) search(newFilters)
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-8 pt-6 pb-12">
      <div className="max-w-6xl mx-auto">

        {/* Wallet Bar */}
        <div className="flex justify-end mb-6">
          <div className="bg-white shadow-sm border border-gray-200 rounded-2xl px-5 py-3 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Wallet size={18} className="text-green-600" />
              <div>
                <p className="text-xs text-gray-500">Wallet Balance</p>
                <p className="text-base font-bold text-green-600">
                  {balance !== null ? `Rs. ${balance.toFixed(2)}` : 'Loading...'}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/payment')}
              className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition"
            >
              <Plus size={14} /> Top Up
            </button>
          </div>
        </div>

        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Find Your Bus</h1>
          <p className="text-gray-500 text-sm mt-1">Search from hundreds of routes across Sri Lanka</p>
        </div>

        {/* Search Bar */}
        <TicketSearch onSearch={handleSearch} />

        {/* Results */}
        {loading && <LoadingSpinner />}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-600 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && searched && (
          <>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">
                {trips.length > 0 ? `${trips.length} buses found` : 'No results'}
              </h2>
            </div>

            {trips.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {trips.map(trip => (
                  <TicketCard key={trip.id} trip={trip} travelers={filters.travelers} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
                <SearchX size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 font-semibold text-lg">No buses found</p>
                <p className="text-gray-400 text-sm mt-2">Try adjusting your search filters</p>
              </div>
            )}
          </>
        )}

        {!loading && !searched && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="text-6xl mb-4">🚌</div>
            <p className="text-gray-600 font-semibold text-lg">Search for your journey</p>
            <p className="text-gray-400 text-sm mt-2">Enter departure and destination cities above</p>
          </div>
        )}

      </div>
    </div>
  )
}
