import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  FiChevronLeft, 
  FiChevronRight, 
  FiGrid, 
  FiUsers, 
  FiTool, 
  FiSettings, 
  FiDollarSign,
  FiFileText
} from "react-icons/fi";
import { MdOutlineCategory } from "react-icons/md";

const Sidebar: React.FC<{ onToggle: (expanded: boolean) => void }> = ({ onToggle }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: <FiGrid size={20} />, text: "Dashboard", path: "/admin/dashboard" },
    { icon: <FiUsers size={20} />, text: "User Management", path: "/admin/users" },
    { icon: <FiTool size={20} />, text: "Expert Management", path: "/admin/experts" },
    { icon: <MdOutlineCategory size={20} />, text: "Category Management", path: "/admin/categories" },
    { icon: <FiSettings size={20} />, text: "Service Management", path: "/admin/services" },
    { icon: <FiDollarSign size={20} />, text: "Earnings", path: "/admin/earnings" },
    { icon: <FiFileText size={20} />, text: "Subscription", path: "/admin/subscription" },
  ];

  const toggleSidebar = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    onToggle(newState);
  };

  return (
    <aside 
      className={`fixed top-16 left-0 h-[calc(100%-4rem)] bg-[#0d0d26] bg-opacity-90 backdrop-blur-md pt-5 overflow-y-auto transition-all duration-300 z-10
        ${isExpanded ? "w-64 rounded-r-xl" : "w-20 rounded-r-lg"}`}
    >
      <button
        onClick={toggleSidebar}
        className={`absolute -right-0 top-5 flex items-center justify-center text-white bg-[#3F8CFF] rounded-full p-2 shadow-lg hover:bg-[#2d6fd1] transition-all
          ${isExpanded ? "rotate-0" : "rotate-180"}`}
      >
        {isExpanded ? <FiChevronLeft size={18} /> : <FiChevronRight size={18} />}
      </button>
      
      <ul className="mt-8 px-2">
        {menuItems.map((item, index) => (
          <li
            key={index}
            onClick={() => navigate(item.path)}
            className={`flex items-center px-4 py-3 cursor-pointer transition-all rounded-lg mx-2 mb-1
              ${location.pathname === item.path
                ? "bg-[#3F8CFF] bg-opacity-20 text-white"
                : "hover:bg-[#3F8CFF] hover:bg-opacity-10 text-gray-300"}`}
          >
            <span className={`flex items-center justify-center ${isExpanded ? "mr-3" : "mx-auto"}`}>
              {React.cloneElement(item.icon, { 
                className: location.pathname === item.path ? "text-[#3F8CFF]" : "text-gray-400" 
              })}
            </span>
            {isExpanded && (
              <span className="whitespace-nowrap overflow-hidden text-sm font-medium">
                {item.text}
              </span>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;