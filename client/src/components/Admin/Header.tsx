import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { adminLogout } from "../../Slice/adminAuthSlice";
import { adminLogoutService } from "../../services/Admin/adminAuth.service";
import ConfirmModal from "../../Utils/Confirmation";
import { FiLogOut, FiSearch, FiBell, FiUser, FiMenu } from "react-icons/fi";
import { motion } from "framer-motion";

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const handleLogout = async () => {
    const response = await adminLogoutService();
    if (response.success) {
      dispatch(adminLogout());
      navigate("/admin/login");
    } else {
      alert("Can't logout");
    }
  };

  return (
    <>
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

      <header className="fixed top-0 left-0 w-full h-16 bg-[#0d0d26] bg-opacity-90 backdrop-blur-md flex items-center justify-between px-6 z-50 border-b border-[#3F8CFF]/10 shadow-lg">
        {/* Left Section - Logo */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => navigate('/admin/dashboard')}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3F8CFF] to-[#2A2A3C] flex items-center justify-center">
            <span className="text-white font-bold text-sm">SH</span>
          </div>
          <span className="text-xl font-bold text-white">
            Service<span className="text-[#3F8CFF]">Hub</span>
          </span>
        </motion.div>
        <div className="flex items-center space-x-4">
          

          {/* User Profile */}
          <div className="relative">
            <button 
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center space-x-2 group"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3F8CFF] to-[#2A2A3C] flex items-center justify-center">
                <FiUser className="text-white text-sm" />
              </div>
              <span className="text-gray-300 group-hover:text-white hidden md:inline-block">Siyad</span>
            </button>

            {/* Profile Dropdown */}
            {showProfileDropdown && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-[#2A2A3C] rounded-lg shadow-xl py-1 z-50 border border-[#3F8CFF]/10"
              >
                <div className="border-t border-[#3F8CFF]/10 my-1"></div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center"
                >
                  <FiLogOut className="mr-2" /> Logout
                </button>
              </motion.div>
            )}
          </div>

          {/* Logout Button - Visible when dropdown is hidden */}
          {/* <button
            onClick={() => setIsModalOpen(true)}
            className="hidden md:flex items-center space-x-1 px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all border border-red-500/30 hover:border-red-500/50"
          >
            <FiLogOut className="text-sm" />
            <span>Logout</span>
          </button> */}
        </div>
      </header>
    </>
  );
};

export default Header;