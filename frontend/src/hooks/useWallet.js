import { useState, useEffect, useCallback } from 'react'
import { getWallet, getTransactions, topUp, requestRefund } from '../services/walletService'

export function useWallet() {
  const [balance, setBalance] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const [wallet, txs] = await Promise.all([getWallet(), getTransactions()])
      setBalance(wallet.balance)
      setTransactions(txs)
      setError(null)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  async function handleTopUp(amount) {
    const result = await topUp(amount)
    setBalance(result.newBalance)
    await refresh()
    return result
  }

  async function handleRefund(amount, reason) {
    const result = await requestRefund(amount, reason)
    await refresh()
    return result
  }

  return { balance, transactions, loading, error, refresh, topUp: handleTopUp, requestRefund: handleRefund }
}
