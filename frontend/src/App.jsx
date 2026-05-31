import { Outlet } from 'react-router-dom'
import Header from './components/header'
import { ToastContainer } from './components/common/Toast'
import './App.css'

export default function Layout() {
  return (
    <div className="min-h-screen pt-16">
      <Header />
      <main>
        <Outlet />
      </main>
      <ToastContainer />
    </div>
  )
}