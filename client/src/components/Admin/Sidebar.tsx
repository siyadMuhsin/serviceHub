// components/Sidebar/Sidebar.tsx
import React from "react";

const Sidebar: React.FC = () => {
  return (
    <aside className="fixed top-16 left-0 w-64 h-[calc(100%-4rem)] bg-[#2A2A3C] bg-opacity-90 backdrop-blur-md pt-5 overflow-y-auto">
      <ul>
        {[
          { icon: "📊", text: "Dashboard" },
          { icon: "👥", text: "User Management" },
          { icon: "🛠", text: "Worker Management" },
          { icon: "📅", text: "Bookings Overview" },
          { icon: "💰", text: "Earnings & Reports" },
          { icon: "🔄", text: "Refund Requests" },
          { icon: "📣", text: "Notifications & Announcements" },
          { icon: "⚙️", text: "Settings" },
        ].map((item, index) => (
          <li
            key={index}
            className={`flex items-center px-5 py-3 cursor-pointer transition-all ${
              index === 0
                ? "bg-[#3F8CFF] bg-opacity-20 border-l-4 border-[#3F8CFF]"
                : "hover:bg-[#3F8CFF] hover:bg-opacity-10"
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;