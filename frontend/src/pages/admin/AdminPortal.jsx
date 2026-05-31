import { useState, useEffect } from 'react'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { toast } from '../../components/common/Toast'
import { Users, Map, RefreshCw, CheckCircle, XCircle, ToggleLeft, ToggleRight, Shield } from 'lucide-react'
import { MOCK_ADMIN_USERS, MOCK_ADMIN_ROUTES, MOCK_ADMIN_REFUNDS, MOCK_ADMIN_STATS } from '../../mocks/mockAdmin'

const delay = (ms = 700) => new Promise(r => setTimeout(r, ms))

const ROLE_PILL = {
  passenger: 'bg-blue-100 text-blue-700',
  driver: 'bg-yellow-100 text-yellow-700',
  owner: 'bg-purple-100 text-purple-700',
  admin: 'bg-red-100 text-red-700',
}

export default function AdminPortal() {
  const [users, setUsers] = useState([])
  const [routes, setRoutes] = useState([])
  const [refunds, setRefunds] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [userSearch, setUserSearch] = useState('')
  const [processingId, setProcessingId] = useState(null)

  useEffect(() => {
    async function load() {
      await delay()
      setUsers(MOCK_ADMIN_USERS)
      setRoutes(MOCK_ADMIN_ROUTES)
      setRefunds(MOCK_ADMIN_REFUNDS)
      setStats(MOCK_ADMIN_STATS)
      setLoading(false)
    }
    load()
  }, [])

  async function handleRefundAction(refundId, action) {
    setProcessingId(refundId)
    await delay(800)
    setRefunds(prev => prev.map(r => r.refundId === refundId ? { ...r, status: action === 'approve' ? 'Approved' : 'Rejected' } : r))
    toast(`Refund ${action === 'approve' ? 'approved' : 'rejected'} successfully.`, 'success')
    setProcessingId(null)
  }

  async function handleRouteToggle(routeId) {
    setRoutes(prev => prev.map(r => r.routeId === routeId ? { ...r, status: !r.status } : r))
    const route = routes.find(r => r.routeId === routeId)
    toast(`Route ${route.status ? 'deactivated' : 'activated'}.`, 'success')
  }

  const filteredUsers = users.filter(u =>
    !userSearch || u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase())
  )

  if (loading) return <LoadingSpinner fullScreen />

  const pendingRefunds = refunds.filter(r => r.status === 'Pending').length

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <Shield size={16} className="text-red-400" />
            <p className="text-slate-400 text-sm">Admin Portal</p>
          </div>
          <h1 className="text-2xl font-bold">System Administration</h1>
          <p className="text-slate-400 text-sm mt-1">Manage users, routes, and resolve disputes</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-4">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: Users, color: 'text-blue-600 bg-blue-50' },
              { label: 'Active Routes', value: stats.activeRoutes, icon: Map, color: 'text-green-600 bg-green-50' },
              { label: "Today's Bookings", value: stats.todayBookings, icon: CheckCircle, color: 'text-purple-600 bg-purple-50' },
              { label: 'Pending Refunds', value: pendingRefunds, icon: RefreshCw, color: 'text-orange-600 bg-orange-50' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className={`inline-flex p-2.5 rounded-xl mb-3 ${color}`}><Icon size={18} /></div>
                <p className="text-xl font-extrabold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-gray-200 rounded-2xl p-1 mb-6 shadow-sm">
          {[
            { key: 'overview', label: 'Refund Queue', count: pendingRefunds },
            { key: 'users', label: 'Users' },
            { key: 'routes', label: 'Routes' },
          ].map(({ key, label, count }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === key ? 'bg-slate-900 text-white shadow' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {label}
              {count > 0 && <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${activeTab === key ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-700'}`}>{count}</span>}
            </button>
          ))}
        </div>

        {/* REFUND QUEUE TAB */}
        {activeTab === 'overview' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-800 mb-5">Refund Requests</h2>
            <div className="space-y-3">
              {refunds.map(r => (
                <div key={r.refundId} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{r.passengerName}</p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{r.reason}</p>
                    <p className="text-xs text-gray-400">Booking #{r.bookingId} · {r.date}</p>
                  </div>
                  <p className="font-bold text-gray-900 shrink-0">Rs. {r.amount.toLocaleString()}</p>
                  {r.status === 'Pending' ? (
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => handleRefundAction(r.refundId, 'approve')} disabled={processingId === r.refundId}
                        className="flex items-center gap-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-xs font-bold px-3 py-2 rounded-lg transition">
                        <CheckCircle size={13} /> Approve
                      </button>
                      <button onClick={() => handleRefundAction(r.refundId, 'reject')} disabled={processingId === r.refundId}
                        className="flex items-center gap-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-xs font-bold px-3 py-2 rounded-lg transition">
                        <XCircle size={13} /> Reject
                      </button>
                    </div>
                  ) : (
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full border shrink-0 ${r.status === 'Approved' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-600 border-red-200'}`}>
                      {r.status}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-gray-800">All Users</h2>
              <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{users.length} users</span>
            </div>
            <input type="text" value={userSearch} onChange={e => setUserSearch(e.target.value)}
              placeholder="Search users by name or email..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-400 mb-5 transition" />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                    <th className="text-left pb-3 font-semibold">Name</th>
                    <th className="text-left pb-3 font-semibold">Email</th>
                    <th className="text-left pb-3 font-semibold">Role</th>
                    <th className="text-left pb-3 font-semibold">Status</th>
                    <th className="text-left pb-3 font-semibold">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredUsers.map(u => (
                    <tr key={u.userId} className="hover:bg-gray-50 transition">
                      <td className="py-3 font-semibold text-gray-900">{u.name}</td>
                      <td className="py-3 text-gray-500">{u.email}</td>
                      <td className="py-3">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${ROLE_PILL[u.role]}`}>{u.role}</span>
                      </td>
                      <td className="py-3">
                        <span className="text-xs font-medium text-green-700 bg-green-100 px-2.5 py-1 rounded-full">{u.status}</span>
                      </td>
                      <td className="py-3 text-gray-500">{new Date(u.createdAt).toLocaleDateString('en-LK', { dateStyle: 'medium' })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ROUTES TAB */}
        {activeTab === 'routes' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-800 mb-5">Route Management</h2>
            <div className="space-y-3">
              {routes.map(route => (
                <div key={route.routeId} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{route.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{route.stops} stops · {route.buses} buses assigned</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${route.status ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                      {route.status ? 'Active' : 'Inactive'}
                    </span>
                    <button onClick={() => handleRouteToggle(route.routeId)}
                      className="p-1.5 rounded-lg hover:bg-gray-200 transition text-gray-500 hover:text-gray-700" title="Toggle status">
                      {route.status ? <ToggleRight size={22} className="text-green-600" /> : <ToggleLeft size={22} />}
                    </button>
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
