import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import ExpertSidebar from '@/components/Expert/Sidebar';
import Dashboard from '@/pages/Expert/Dashboard';
import ProtectedExpertRoute from './Protect.routes';
import SubscriptionPage from '@/pages/Expert/SubscriptionPage';
import ExpertProfile from '@/pages/Expert/ExpertProfile';
import ExpertSlot from '@/components/Expert/ExpertSLot';

const ExpertRoutes = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const handleToggleSidebar = (expanded: boolean) => {
    setIsSidebarExpanded(expanded);
  };

  return (
    <ProtectedExpertRoute>
      <div className="flex">
        <ExpertSidebar onToggle={handleToggleSidebar} />
        <div className={`flex-1 transition-all duration-300 ${isSidebarExpanded ? 'ml-64' : 'ml-16'}`}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path='/subscription' element={<SubscriptionPage/>} />
            <Route path='/profile' element={<ExpertProfile/>} />
            <Route path='/slot-management' element={<ExpertSlot/>} />
            {/* Add more routes here as needed */}
          </Routes>
        </div>
      </div>
    </ProtectedExpertRoute>
  );
};

export default ExpertRoutes;
