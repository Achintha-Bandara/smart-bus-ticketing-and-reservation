export const MOCK_WALLET = {
  walletId: 1,
  balance: 5440.50,
  lastUpdated: '2026-05-31T08:00:00Z',
}

export const MOCK_TRANSACTIONS = [
  { id: 1, label: 'Ticket — Colombo → Kurunagala', amount: -1400.00, date: '2026-05-30', status: 'Completed', type: 'booking' },
  { id: 2, label: 'Top-up', amount: 5000.00, date: '2026-05-28', status: 'Completed', type: 'topup' },
  { id: 3, label: 'Ticket — Kandy → Colombo', amount: -950.00, date: '2026-05-25', status: 'Completed', type: 'booking' },
  { id: 4, label: 'Refund — Cancelled trip', amount: 1400.00, date: '2026-05-20', status: 'Completed', type: 'refund' },
  { id: 5, label: 'Top-up', amount: 2000.00, date: '2026-05-10', status: 'Completed', type: 'topup' },
  { id: 6, label: 'Ticket — Colombo → Galle', amount: -1100.00, date: '2026-05-05', status: 'Completed', type: 'booking' },
]
