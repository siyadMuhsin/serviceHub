import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import ExpertSidebar from '@/components/Expert/Sidebar';
import Dashboard from '@/pages/Expert/Dashboard';
import ProtectedExpertRoute from './Protect.routes';
import SubscriptionPage from '@/pages/Expert/SubscriptionPage';
import ExpertProfile from '@/pages/Expert/ExpertProfile';

import ExpertSlot from '@/components/Expert/Expert.slot';

import BookingMangement from '@/pages/Expert/BookingManagement';
import ReviewsManagement from '@/pages/Expert/ReviewsManagement';
import ExpertChatPage from '@/pages/Expert/ChatPage';

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
            <Route path='/booking-management' element={<BookingMangement/>} />
            <Route path='/reviews' element={<ReviewsManagement/>}/>
            <Route path='/messages' element={<ExpertChatPage/>}/>
            {/* Add more routes here as needed */}
          </Routes>
        </div>
      </div>
    </ProtectedExpertRoute>
  );
};

export default ExpertRoutes;
