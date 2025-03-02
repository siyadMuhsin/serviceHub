// components/DashboardCards/DashboardCards.tsx
import React from "react";

const DashboardCards: React.FC = () => {
  const cards = [
    { title: "Total Users", value: "1,234", gradient: "from-[#3F8CFF] to-[#1E1E2F]" },
    { title: "Total Workers", value: "567", gradient: "from-[#32CD32] to-[#1E1E2F]" },
    { title: "Pending Approvals", value: "89", gradient: "from-[#FFD700] to-[#1E1E2F]" },
    { title: "Active Subscriptions", value: "321", gradient: "from-[#800080] to-[#1E1E2F]" },
    { title: "Total Bookings", value: "1,045", gradient: "from-[#00FFFF] to-[#1E1E2F]" },
    { title: "Admin Earnings", value: "₹50K", gradient: "from-[#39FF14] to-[#1E1E2F]" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-5">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`bg-gradient-to-br ${card.gradient} p-5 rounded-xl transition-transform hover:translate-y-[-5px] hover:shadow-[0_0_15px_#3F8CFF]`}
        >
          <div className="text-lg">{card.title}</div>
          <div className="text-3xl font-bold">{card.value}</div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;