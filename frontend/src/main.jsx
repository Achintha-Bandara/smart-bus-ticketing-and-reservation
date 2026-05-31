import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'

import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/common/ProtectedRoute'

// Layout
import App from './App.jsx'

// Auth
import LoginPage from './components/auth/LoginPage.jsx'
import RegisterPage from './components/auth/RegisterPage.jsx'

// Passenger pages
import Home from './components/home.jsx'
import TicketBooking from './components/ticketBooking.jsx'
import Wallet from './components/wallet.jsx'
import PaymentPage from './components/PaymentPage.jsx'
import BookingConfirmPage from './pages/passenger/BookingConfirmPage.jsx'
import MyTicketsPage from './pages/passenger/MyTicketsPage.jsx'
import TicketDetailPage from './pages/passenger/TicketDetailPage.jsx'

// Role portals
import DriverPortal from './pages/driver/DriverPortal.jsx'
import OwnerPortal from './pages/owner/OwnerPortal.jsx'
import AdminPortal from './pages/admin/AdminPortal.jsx'

const router = createBrowserRouter(createRoutesFromElements(
  <>
    {/* Public auth routes */}
    <Route path='/login' element={<LoginPage />} />
    <Route path='/register' element={<RegisterPage />} />

    {/* Protected passenger routes */}
    <Route path='/' element={<ProtectedRoute><App /></ProtectedRoute>}>
      <Route index element={<Home />} />
      <Route path='booking' element={<TicketBooking />} />
      <Route path='booking/confirm' element={<BookingConfirmPage />} />
      <Route path='wallet' element={<Wallet />} />
      <Route path='payment' element={<PaymentPage />} />
      <Route path='my-tickets' element={<MyTicketsPage />} />
      <Route path='my-tickets/:bookingId' element={<TicketDetailPage />} />

      {/* Driver-only route */}
      <Route
        path='driver'
        element={
          <ProtectedRoute allowedRoles={['driver']}>
            <DriverPortal />
          </ProtectedRoute>
        }
      />

      {/* Owner-only route */}
      <Route
        path='owner'
        element={
          <ProtectedRoute allowedRoles={['owner']}>
            <OwnerPortal />
          </ProtectedRoute>
        }
      />

      {/* Admin-only route */}
      <Route
        path='admin'
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminPortal />
          </ProtectedRoute>
        }
      />
    </Route>
  </>
))

function Index() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Index />
  </StrictMode>
)
