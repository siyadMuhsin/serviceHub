import React, { useEffect, useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar: React.FC<{ onToggle: (expanded: boolean) => void }> = ({onToggle}) => {
  const [isExpanded, setIsExpanded] = useState(true);
 
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: "📊", text: "Dashboard", path: "/admin/dashboard" },
    { icon: "👥", text: "User Management", path: "/admin/users" },
    { icon: "🛠", text: "Expert Management", path: "/admin/expert-management" },
    { icon: "🗂️", text: "Category Management", path: "/admin/categories" },
    { icon: "🔧", text: "Service Management", path: "/admin/services" },
    { icon: "💰", text: "Earnings", path: "/admin/earnings" },
    { icon: "📝", text: "Subscription", path: "/admin/subscription" },
  ];

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
    onToggle(!isExpanded); // Notify parent component
  };

  return (
    <aside 
      className={`fixed top-16 left-0 h-[calc(100%-4rem)] bg-[#2A2A3C] bg-opacity-90 backdrop-blur-md pt-5 overflow-y-auto transition-all duration-300 ${
        isExpanded ? "w-64" : "w-16"
      }`}
    >
      <button
        onClick={toggleSidebar}
        className="absolute right-0 top-2 text-white bg-[#3F8CFF] bg-opacity-20 rounded-l-md p-1"
      >
        {isExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>
      
      <ul className="mt-8">
        {menuItems.map((item, index) => (
          <li
            key={index}
            onClick={() => navigate(item.path)}
            className={`flex items-center px-4 py-3 cursor-pointer transition-all ${
              location.pathname === item.path
                ? "bg-[#3F8CFF] bg-opacity-20 border-l-4 border-[#3F8CFF] text-white"
                : "hover:bg-[#3F8CFF] hover:bg-opacity-10 text-gray-300"
            }`}
          >
            <span className="text-xl flex-shrink-0 w-6 flex justify-center">{item.icon}</span>
            {isExpanded && <span className="ml-3 whitespace-nowrap overflow-hidden">{item.text}</span>}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;