import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import ExpertSidebar from '@/components/Expert/Sidebar';
import Dashboard from '@/pages/Expert/Dashboard';

const ExpertRoutes = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const handleToggleSidebar = (expanded: boolean) => {
    setIsSidebarExpanded(expanded);
  };

  return (
    <div className="flex">
      <ExpertSidebar onToggle={handleToggleSidebar} />
      <div className={`flex-1 transition-all duration-300 ${isSidebarExpanded ? 'ml-64' : 'ml-16'}`}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          {/* Add more routes here as needed */}
        </Routes>
      </div>
    </div>
  );
};

export default ExpertRoutes;