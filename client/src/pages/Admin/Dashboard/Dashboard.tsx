import React from 'react'
import Header from '../../../components/Admin/Header'
import Sidebar from '../../../components/Admin/Sidebar'
import DashboardCards from '../../../components/Admin/DashboardCards'
function Dashboard() {
  return (
    <div className="min-h-screen bg-[#1E1E2F] text-white">
      <Header />
      <Sidebar />
      <main className="ml-64 mt-16 p-5">
        <DashboardCards />
      </main>
    </div>
  )
}

export default Dashboard