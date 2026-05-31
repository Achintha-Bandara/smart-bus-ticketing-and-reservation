// Mock data for admin portal
export const MOCK_ADMIN_USERS = [
  { userId: 1, name: 'Kasun Perera', email: 'kasun@example.com', role: 'passenger', createdAt: '2026-01-15', status: 'Active' },
  { userId: 2, name: 'Ruwan Jayasinghe', email: 'ruwan@example.com', role: 'driver', createdAt: '2026-02-10', status: 'Active' },
  { userId: 3, name: 'Chaminda Silva', email: 'chaminda@example.com', role: 'owner', createdAt: '2026-01-20', status: 'Active' },
  { userId: 4, name: 'Nimali Fernando', email: 'nimali@example.com', role: 'passenger', createdAt: '2026-03-05', status: 'Active' },
  { userId: 5, name: 'Admin User', email: 'admin@sbtrs.lk', role: 'admin', createdAt: '2025-12-01', status: 'Active' },
]

export const MOCK_ADMIN_ROUTES = [
  { routeId: 1, name: 'Colombo - Kurunagala Express', start: 'Colombo', end: 'Kurunagala', stops: 4, status: true, buses: 2 },
  { routeId: 2, name: 'Colombo - Matara Express', start: 'Colombo', end: 'Matara', stops: 6, status: true, buses: 3 },
  { routeId: 3, name: 'Colombo - Jaffna Overnight', start: 'Colombo', end: 'Jaffna', stops: 5, status: true, buses: 2 },
  { routeId: 4, name: 'Kandy - Nuwara Eliya', start: 'Kandy', end: 'Nuwara Eliya', stops: 3, status: false, buses: 1 },
]

export const MOCK_ADMIN_REFUNDS = [
  { refundId: 1, passengerName: 'Kasun Perera', bookingId: 99, amount: 1400, reason: 'Trip cancelled by operator', status: 'Pending', date: '2026-05-29' },
  { refundId: 2, passengerName: 'Nimali Fernando', bookingId: 88, amount: 950, reason: 'Missed bus due to delay', status: 'Pending', date: '2026-05-28' },
  { refundId: 3, passengerName: 'Dilshan Rajapaksa', bookingId: 77, amount: 1800, reason: 'Medical emergency', status: 'Approved', date: '2026-05-25' },
]

export const MOCK_ADMIN_STATS = {
  totalUsers: 1248,
  activeRoutes: 23,
  todayBookings: 342,
  pendingRefunds: 2,
}
