// Mock data for bus owner portal
export const MOCK_OWNER_FLEET = [
  { busId: 1, plateNo: 'WP CAB-1234', busName: 'NCG Express', busType: 'Luxury', status: 'Active', routeName: 'Colombo - Kurunagala', driverName: 'Ruwan Jayasinghe', tripsThisMonth: 18, earnedThisMonth: 25200 },
  { busId: 2, plateNo: 'WP CAB-5678', busName: 'DS Gunasekara', busType: 'Semi-Luxury', status: 'Active', routeName: 'Colombo - Kurunagala', driverName: 'Ajith Bandara', tripsThisMonth: 15, earnedThisMonth: 18000 },
  { busId: 3, plateNo: 'WP CAB-9012', busName: 'NCG Express 2', busType: 'Luxury', status: 'Maintenance', routeName: 'Colombo - Matara', driverName: 'Nimal Perera', tripsThisMonth: 8, earnedThisMonth: 14400 },
]

export const MOCK_OWNER_DRIVERS = [
  { driverId: 1, name: 'Ruwan Jayasinghe', license: 'B/DL/2019/001234', status: 'Active', assignedBus: 'WP CAB-1234', joinedDate: '2022-03-15' },
  { driverId: 2, name: 'Ajith Bandara', license: 'B/DL/2020/005678', status: 'Active', assignedBus: 'WP CAB-5678', joinedDate: '2023-01-10' },
  { driverId: 3, name: 'Nimal Perera', license: 'B/DL/2018/009012', status: 'Active', assignedBus: 'WP CAB-9012', joinedDate: '2021-06-20' },
]

export const MOCK_OWNER_EARNINGS = {
  thisMonth: 57600,
  lastMonth: 61200,
  thisYear: 680000,
  breakdown: [
    { month: 'Jan', amount: 52000 },
    { month: 'Feb', amount: 48000 },
    { month: 'Mar', amount: 61000 },
    { month: 'Apr', amount: 59000 },
    { month: 'May', amount: 57600 },
  ],
}
