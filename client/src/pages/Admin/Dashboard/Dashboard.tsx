import React from 'react'
import { useState } from 'react'
import Header from '../../../components/Admin/Header'
import Sidebar from '../../../components/Admin/Sidebar'
import DashboardCards from '../../../components/Admin/DashboardCards'
function Dashboard() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#171730] text-white pt-16">
        <Sidebar onToggle={(expanded: boolean) => setIsSidebarExpanded(expanded)} />
        <main className={`transition-all duration-300 ${isSidebarExpanded ? 'ml-64' : 'ml-20'} p-5`}>
          <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
          <DashboardCards />
        </main>
      </div>
    </>
  );
}

export default Dashboard;