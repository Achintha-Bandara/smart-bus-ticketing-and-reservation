import { api } from './api'
import { MOCK_WALLET, MOCK_TRANSACTIONS } from '../mocks/mockWallet'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'
const delay = (ms = 600) => new Promise(r => setTimeout(r, ms))

// In-memory mock state so top-ups persist within the session
let _balance = MOCK_WALLET.balance
let _transactions = [...MOCK_TRANSACTIONS]

export async function getWallet() {
  if (USE_MOCK) {
    await delay(400)
    return { ...MOCK_WALLET, balance: _balance }
  }
  return api.get('/wallet')
}

export async function getTransactions() {
  if (USE_MOCK) {
    await delay(400)
    return [..._transactions]
  }
  return api.get('/wallet/transactions')
}

export async function topUp(amount) {
  if (USE_MOCK) {
    await delay(1000)
    _balance = parseFloat((_balance + amount).toFixed(2))
    _transactions = [
      {
        id: Date.now(),
        label: 'Top-up',
        amount,
        date: new Date().toISOString().slice(0, 10),
        status: 'Completed',
        type: 'topup',
      },
      ..._transactions,
    ]
    return { success: true, newBalance: _balance }
  }
  return api.post('/wallet/topup', { amount })
}

export async function requestRefund(amount, reason) {
  if (USE_MOCK) {
    await delay(800)
    _transactions = [
      {
        id: Date.now(),
        label: reason ? `Refund: ${reason}` : 'Refund',
        amount,
        date: new Date().toISOString().slice(0, 10),
        status: 'Pending',
        type: 'refund',
      },
      ..._transactions,
    ]
    return { success: true }
  }
  return api.post('/wallet/refund', { amount, reason })
}

export async function deductForBooking(amount) {
  if (USE_MOCK) {
    if (_balance < amount) throw new Error('Insufficient wallet balance')
    _balance = parseFloat((_balance - amount).toFixed(2))
    return { success: true, newBalance: _balance }
  }
  return api.post('/wallet/deduct', { amount })
}
