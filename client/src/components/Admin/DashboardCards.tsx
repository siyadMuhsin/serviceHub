import React, { useState, useEffect } from 'react';
import { 
  FiUsers, 
  FiTool, 
  FiDollarSign, 
  FiAlertCircle,

} from 'react-icons/fi';
import { 
  getDashboardStats, 
  getLatestUsers, 
  getLatestExperts,
} from '@/services/Admin/dashboard.service';

const DashboardCards: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalExperts: 0,
    adminEarnings:0

  });
  
  const [latestUsers, setLatestUsers] = useState([]);
  const [latestExperts, setLatestExperts] = useState([]);
  const [loading, setLoading] = useState({
    mainStats: true,
    users: true,
    experts: true,
  });
  const [error, setError] = useState({
    mainStats: null,
    users: null,
    experts: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, usersData, expertsData] = await Promise.all([
          getDashboardStats(),
          getLatestUsers(),
          getLatestExperts(),
        ]);

        setStats({
          totalUsers: statsData.data.totalUsers || 0,
          totalExperts: statsData.data.totalExperts || 0,
          adminEarnings: statsData.data.adminEarnings || 0
        });

        
        setLatestUsers(usersData || []);
        setLatestExperts(expertsData || []);
        
        setLoading({
          mainStats: false,
          users: false,
          experts: false,
        });
      } catch (err) {
        setError({
          mainStats: err.message || 'Failed to load stats',
          users: err.message || 'Failed to load latest users',
          experts: err.message || 'Failed to load latest experts',
        });
        setLoading({
          mainStats: false,
          users: false,
          experts: false,
        });
      }
    };

    fetchData();
  }, []);

  const cards = [
    { 
      title: "Total Users", 
      value: stats.totalUsers.toLocaleString(), 
      icon: <FiUsers className="text-2xl" />,
      gradient: "from-[#3F8CFF] to-[#1E1E2F]",
      loading: loading.mainStats,
      error: error.mainStats
    },
    { 
      title: "Total Experts", 
      value: stats.totalExperts.toLocaleString(), 
      icon: <FiTool className="text-2xl" />,
      gradient: "from-[#32CD32] to-[#1E1E2F]",
      loading: loading.mainStats,
      error: error.mainStats
    },
    { 
      title: "Admin Earnings", 
      value: `₹${stats.adminEarnings.toLocaleString()}`, 
      icon: <FiDollarSign className="text-2xl" />,
      gradient: "from-[#FFD700] to-[#1E1E2F]",
      loading: loading.mainStats,
      error: error.mainStats
    }
  ];

  if (loading.mainStats && loading.users && loading.experts) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3F8CFF]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((card, index) => (
          <StatCard 
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            gradient={card.gradient}
            loading={card.loading}
            error={card.error}
          />
        ))}
      </div>

      {/* Latest Users and Experts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-8">
        <DataSection
          title="Latest Users"
          icon={<FiUsers className="mr-2" />}
          data={latestUsers}
          loading={loading.users}
          error={error.users}
          renderItem={(user) => (
            <>
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-sm opacity-70">{user.email}</div>
              </div>
              <div className="text-sm opacity-60">
                {new Date(user.createdAt).toLocaleDateString()}
              </div>
            </>
          )}
          viewAllLink="/admin/users"
        />

        <DataSection
          title="Latest Experts"
          icon={<FiTool className="mr-2" />}
          data={latestExperts}
          loading={loading.experts}
          error={error.experts}
          renderItem={(expert) => (
            <>
              <div>
                <div className="font-medium">{expert.userId.name}</div>
                <div className="text-sm opacity-70">{expert.serviceId.name}</div>
              </div>
              <div className="flex items-center">
                <span className="text-yellow-400 mr-1">★</span>
                <span>{expert.rating?.toFixed(1)}</span>
              </div>
            </>
          )}
          viewAllLink="/admin/experts"
        />
      </div>
    </div>
  );
};

// Reusable StatCard component
const StatCard = ({ title, value, icon, gradient, loading, error }) => (
  <div className={`bg-gradient-to-br ${gradient} p-5 rounded-xl transition-all hover:translate-y-[-5px] hover:shadow-lg min-h-[120px] flex flex-col justify-between`}>
    {loading ? (
      <div className="animate-pulse">
        <div className="h-6 w-3/4 bg-white/20 rounded mb-4"></div>
        <div className="h-8 w-1/2 bg-white/20 rounded"></div>
      </div>
    ) : error ? (
      <div className="flex items-center text-red-300">
        <FiAlertCircle className="mr-2" />
        <span>Failed to load</span>
      </div>
    ) : (
      <>
        <div className="flex justify-between items-start">
          <div>
            <div className="text-lg opacity-80">{title}</div>
            <div className="text-3xl font-bold mt-2">{value}</div>
          </div>
          <div className="p-2 bg-white/10 rounded-lg">
            {icon}
          </div>
        </div>
      </>
    )}
  </div>
);

// Reusable DataSection component
const DataSection = ({ title, icon, data, loading, error, renderItem, viewAllLink }) => (
  <div className="bg-[#2A2A3C] p-5 rounded-xl">
    <h3 className="text-xl font-semibold mb-4 flex items-center">
      {icon} {title}
    </h3>
    
    {loading ? (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse p-3 rounded-lg bg-[#1E1E2F]/50 h-16"></div>
        ))}
      </div>
    ) : error ? (
      <div className="flex items-center justify-center text-red-300 py-8">
        <FiAlertCircle className="mr-2" />
        <span>Failed to load data</span>
      </div>
    ) : data.length === 0 ? (
      <div className="text-center py-8 text-gray-400">No data available</div>
    ) : (
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3 hover:bg-[#3F8CFF]/10 rounded-lg transition-colors">
            {renderItem(item)}
          </div>
        ))}
      </div>
    )}
    
    <a href={viewAllLink} className="mt-4 text-[#3F8CFF] hover:underline text-sm inline-block">
      View All →
    </a>
  </div>
);

export default DashboardCards;