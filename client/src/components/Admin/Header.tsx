// components/Header/Header.tsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { adminLogout } from "../../Slice/adminAuthSlice";
import { adminLogoutService } from "../../services/Admin/adminAuthService";
import ConfirmModal from "../../Utils/Confirmation";


const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Logout Function
  const handleLogout = async () => {
    const response = await adminLogoutService();
    if (response.success) {
      dispatch(adminLogout()); // Clear Redux state
    
      navigate("/admin/login"); // Redirect to login
    } else {
      alert("Can't logout");
    }
  };

  return (
    <>
      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={isModalOpen}
        title="Logout Confirmation"
        message="Are you sure you want to logout?"
        onConfirm={() => {
          setIsModalOpen(false);
          handleLogout();
        }}
        onCancel={() => setIsModalOpen(false)}
      />

      {/* Header Component */}
      <header className="fixed top-0 left-0 w-full h-16 bg-[#1E1E2F] bg-opacity-50 backdrop-blur-md flex items-center justify-between px-5 z-100">
        <div className="text-2xl font-semibold cursor-pointer transition-transform hover:scale-110">
          Admin<span className="text-[#3F8CFF]">Dash</span>
        </div>
        <div className="flex-1 mx-5">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-3 py-2 rounded-full bg-[#2A2A3C] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3F8CFF]"
          />
        </div>
        <div className="flex items-center space-x-5">
          <div className="relative cursor-pointer">
            <span>🔔</span>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
              3
            </span>
          </div>
          <div className="cursor-pointer">
            <img
              src="https://via.placeholder.com/30"
              alt="User Avatar"
              className="rounded-full"
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)} // Open confirmation modal
            className="px-4 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
          >
            Logout
          </button>
        </div>
      </header>
    </>
  );
};

export default Header;
