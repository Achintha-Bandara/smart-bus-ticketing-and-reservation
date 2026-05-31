import { useState } from 'react'
import { useWallet } from '../hooks/useWallet'
import { toast } from './common/Toast'
import { ArrowUpCircle, ArrowDownCircle, Wallet as WalletIcon, TrendingDown, TrendingUp } from 'lucide-react'
import LoadingSpinner from './common/LoadingSpinner'

const TOP_UP_OPTIONS = [500, 1000, 2000, 5000]

const TX_ICONS = {
  topup: <TrendingUp size={16} className="text-green-500" />,
  booking: <TrendingDown size={16} className="text-red-400" />,
  refund: <ArrowUpCircle size={16} className="text-blue-500" />,
}

export default function Wallet() {
  const { balance, transactions, loading, topUp, requestRefund } = useWallet()

  const [selectedAmount, setSelectedAmount] = useState(1000)
  const [customTopUp, setCustomTopUp] = useState('')
  const [refundAmount, setRefundAmount] = useState('')
  const [refundReason, setRefundReason] = useState('')
  const [topUpLoading, setTopUpLoading] = useState(false)
  const [refundLoading, setRefundLoading] = useState(false)

  const activeAmount = customTopUp ? Number(customTopUp) : selectedAmount

  async function handleTopUp() {
    if (!activeAmount || activeAmount < 100) { toast('Minimum top-up is Rs. 100', 'error'); return }
    if (activeAmount > 50000) { toast('Maximum top-up is Rs. 50,000', 'error'); return }
    setTopUpLoading(true)
    try {
      await topUp(activeAmount)
      toast(`Rs. ${activeAmount.toLocaleString()} added to wallet!`, 'success')
      setCustomTopUp('')
    } catch (e) {
      toast(e.message, 'error')
    } finally {
      setTopUpLoading(false)
    }
  }

  async function handleRefund() {
    const amt = Number(refundAmount)
    if (!amt || amt <= 0) { toast('Enter a valid refund amount', 'error'); return }
    setRefundLoading(true)
    try {
      await requestRefund(amt, refundReason)
      toast('Refund request submitted!', 'success')
      setRefundAmount('')
      setRefundReason('')
    } catch (e) {
      toast(e.message, 'error')
    } finally {
      setRefundLoading(false)
    }
  }

  const spentThisMonth = transactions
    .filter(tx => tx.type === 'booking' && tx.date?.startsWith(new Date().toISOString().slice(0, 7)))
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0)

  const lastTopUp = transactions.find(tx => tx.type === 'topup')

  if (loading) return <LoadingSpinner fullScreen />

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-8 py-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Hero Balance Card */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 text-white shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <WalletIcon size={18} className="text-green-400" />
              <span className="text-slate-400 text-sm font-medium uppercase tracking-widest">Wallet Balance</span>
            </div>
            <p className="text-5xl font-extrabold mb-1">Rs. {balance?.toFixed(2) ?? '—'}</p>
            <p className="text-slate-400 text-sm">Available for ticket bookings</p>
          </div>
          <div className="relative grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10">
            <div>
              <p className="text-slate-400 text-xs mb-1">Spent This Month</p>
              <p className="font-bold text-red-300">Rs. {spentThisMonth.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs mb-1">Last Top-up</p>
              <p className="font-bold text-green-400">Rs. {lastTopUp ? lastTopUp.amount.toLocaleString() : '—'}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs mb-1">Status</p>
              <span className="inline-block bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-full border border-green-500/30">Active</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-6">
          {/* Transactions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-800 mb-5">Recent Transactions</h2>
            <div className="space-y-3">
              {transactions.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">No transactions yet.</p>
              ) : transactions.map(tx => (
                <div key={tx.id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm shrink-0">
                    {TX_ICONS[tx.type] || <ArrowDownCircle size={16} className="text-gray-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{tx.label}</p>
                    <p className="text-xs text-gray-400">{tx.date}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-sm font-bold ${tx.amount >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {tx.amount >= 0 ? '+' : ''}Rs. {Math.abs(tx.amount).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tx.status === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Top Up */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-gray-800 mb-4">Top Up Wallet</h2>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {TOP_UP_OPTIONS.map(amt => (
                  <button
                    key={amt}
                    onClick={() => { setSelectedAmount(amt); setCustomTopUp('') }}
                    className={`py-3 rounded-xl text-sm font-bold border-2 transition ${selectedAmount === amt && !customTopUp
                      ? 'border-green-600 bg-green-600 text-white'
                      : 'border-gray-200 text-gray-700 hover:border-green-400'}`}
                  >
                    Rs. {amt.toLocaleString()}
                  </button>
                ))}
              </div>
              <div className="flex rounded-xl border border-gray-200 overflow-hidden mb-4">
                <span className="flex items-center px-4 bg-gray-50 text-gray-500 text-sm border-r border-gray-200">Rs.</span>
                <input
                  type="text"
                  value={customTopUp}
                  onChange={e => { const v = e.target.value.replace(/[^0-9]/g, ''); setCustomTopUp(v); if (v) setSelectedAmount(Number(v)) }}
                  placeholder="Custom amount"
                  className="flex-1 px-4 py-3 text-sm outline-none text-gray-800"
                />
              </div>
              <button
                onClick={handleTopUp}
                disabled={topUpLoading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition"
              >
                {topUpLoading ? 'Processing...' : `Top Up Rs. ${activeAmount?.toLocaleString() || '—'}`}
              </button>
            </div>

            {/* Refund */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-gray-800 mb-4">Request Refund</h2>
              <div className="space-y-3">
                <div className="flex rounded-xl border border-gray-200 overflow-hidden">
                  <span className="flex items-center px-4 bg-gray-50 text-gray-500 text-sm border-r border-gray-200">Rs.</span>
                  <input
                    type="text"
                    value={refundAmount}
                    onChange={e => setRefundAmount(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="Amount"
                    className="flex-1 px-4 py-3 text-sm outline-none text-gray-800"
                  />
                </div>
                <input
                  type="text"
                  value={refundReason}
                  onChange={e => setRefundReason(e.target.value)}
                  placeholder="Reason (e.g. trip cancelled)"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none text-gray-800 focus:border-green-400 transition"
                />
                <button
                  onClick={handleRefund}
                  disabled={refundLoading}
                  className="w-full bg-slate-800 hover:bg-slate-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition"
                >
                  {refundLoading ? 'Submitting...' : 'Submit Refund'}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-3">Refunds are processed within 24–48 hours.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
