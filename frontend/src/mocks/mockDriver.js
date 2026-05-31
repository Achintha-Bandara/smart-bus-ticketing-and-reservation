// Mock data for driver portal
export const MOCK_DRIVER_TRIP = {
  tripId: 201,
  route: { from: 'Colombo', to: 'Kurunagala', routeName: 'Colombo - Kurunagala Express' },
  bus: { plateNo: 'WP CAB-1234', busType: 'Luxury', busName: 'NCG Express' },
  departureAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hrs from now
  arrivalAt: new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString(),
  status: 'Scheduled', // Scheduled | Departed | Arrived
  passengers: [
    { bookingId: 101, name: 'Kasun Perera', seatNo: 5, from: 'Colombo', to: 'Kurunagala', fare: 1400 },
    { bookingId: 102, name: 'Nimali Silva', seatNo: 12, from: 'Colombo', to: 'Kurunagala', fare: 1400 },
    { bookingId: 103, name: 'Tharaka Fernando', seatNo: 18, from: 'Colombo', to: 'Polgahawela', fare: 950 },
    { bookingId: 104, name: 'Dilshan Rajapaksa', seatNo: 23, from: 'Colombo', to: 'Kurunagala', fare: 1400 },
    { bookingId: 105, name: 'Sanduni Wickramasinghe', seatNo: 31, from: 'Colombo', to: 'Kurunagala', fare: 1400 },
    { bookingId: 106, name: 'Pradeep Kumara', seatNo: 44, from: 'Colombo', to: 'Polgahawela', fare: 950 },
  ],
}

export const MOCK_DRIVER_SHIFTS = [
  { shiftId: 1, date: '2026-05-30', from: 'Colombo', to: 'Kurunagala', status: 'Completed', passengers: 28 },
  { shiftId: 2, date: '2026-05-29', from: 'Kurunagala', to: 'Colombo', status: 'Completed', passengers: 31 },
  { shiftId: 3, date: '2026-05-28', from: 'Colombo', to: 'Kurunagala', status: 'Completed', passengers: 25 },
]
