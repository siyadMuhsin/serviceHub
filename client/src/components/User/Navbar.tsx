import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../Slice/authSlice";
import { LogoutUser } from "../../services/User/AuthServices";
import ConfirmModal from "../../Utils/Confirmation";
import { FiSearch } from "react-icons/fi";
import { FaRegUser, FaBars } from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdEmail, MdLocationOn } from "react-icons/md";
import { BsChatDots } from "react-icons/bs";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { isAuthenticated } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const response = await LogoutUser();
    dispatch(logout());
    setShowLogoutModal(false);
    navigate("/login");
  };

  const onCancel = () => {
    setShowLogoutModal(false);
  };

  return (
    <header className="w-full">
      {/* Top Bar */}
      <div className="bg-blue-900 text-white text-sm px-6 py-2 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <MdLocationOn className="text-yellow-400" />
            123 Street, New York
          </span>
          <span className="flex items-center gap-1">
            <MdEmail className="text-yellow-400" />
            Email@Example.com
          </span>
        </div>
        <nav className="hidden md:flex gap-4">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Use</a>
          <a href="#" className="hover:underline">Sales and Refunds</a>
        </nav>
      </div>

      {/* Main Navbar */}
      <div className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2 text-lg font-bold text-indigo-600">
          <Link to="/" className="flex items-center gap-2">
            <img src="logo.png" alt="Logo" className="w-8 h-8" />
            Service Hub
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="hidden md:flex gap-6 text-gray-700">
          <Link to="/categories" className="hover:text-blue-500">
            Categories
          </Link>
        </nav>

        {/* Search Bar & Icons */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-2.5 text-gray-500" />
            <input
              type="text"
              placeholder="Search for ‘AC service’"
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none"
            />
          </div>

          {/* Notification Icon */}
          {isAuthenticated && (
            <div className="relative">
              <IoMdNotificationsOutline className="text-2xl cursor-pointer hover:text-blue-500" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5">
                3
              </span>
            </div>
          )}

          {/* Message Icon */}
          {isAuthenticated && (
            <div className="relative">
              <BsChatDots className="text-2xl cursor-pointer hover:text-blue-500" />
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full px-1.5">
                5
              </span>
            </div>
          )}

          {/* User Dropdown */}
          {isAuthenticated ? (
            <div className="relative">
              <FaRegUser
                className="text-xl cursor-pointer hover:text-blue-500"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg z-10">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/saved-services"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Saved Services
                  </Link>
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="text-gray-700 hover:text-blue-500">
              Login
            </Link>
          )}

          {/* Mobile Menu */}
          <FaBars
            className="text-2xl cursor-pointer md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          />
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="bg-white shadow-md md:hidden">
          <Link
            to="/categories"
            className="block py-2 px-6 hover:bg-gray-100"
            onClick={() => setMenuOpen(false)}
          >
            Categories
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="block py-2 px-6 hover:bg-gray-100"
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </Link>
              <Link
                to="/saved-services"
                className="block py-2 px-6 hover:bg-gray-100"
                onClick={() => setMenuOpen(false)}
              >
                Saved Services
              </Link>
              <button
                onClick={() => {
                  setShowLogoutModal(true);
                  setMenuOpen(false);
                }}
                className="block w-full text-left py-2 px-6 hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="block py-2 px-6 hover:bg-gray-100"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutModal}
        message="Are you sure you want to log out?"
        onConfirm={handleLogout}
        onCancel={onCancel}
      />
    </header>
  );
};

export default Navbar;
