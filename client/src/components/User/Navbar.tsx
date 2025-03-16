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
import { createExpertAccount } from "../../services/User/createExpertAccount";
import { changeRole } from "../../Slice/authSlice";
import { toast } from "react-toastify";
import CreateExpertModal from "./modals/CreateExpertModal";
import Loading from "../Loading";
import { ExpertData} from "@/Interfaces/interfaces";


const Navbar: React.FC = () => {
  // const { categories, services } = useSelector((state: any) => state.categoryService);
  const { user, isAuthenticated } = useSelector((state: any) => state.auth);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const response = await LogoutUser();
    setShowLogoutModal(false);
    navigate("/login");
    dispatch(logout());
  };

  const onCancel = () => {
    setShowLogoutModal(false);
  };

  const handleCreateExpert = async (expertData: ExpertData) => {
    console.log('fds')
    setIsLoading(true); // Show loading when request starts
console.log(expertData)
    try {
      const formData = new FormData();
      formData.append("accountName", expertData.AccountName);
      formData.append("dob", expertData.dob);
      formData.append("gender", expertData.gender);
      formData.append("contact", expertData.contact);
      formData.append("experience", expertData.experience);
      formData.append("serviceId", expertData.service);
      formData.append("categoryId", expertData.category);

      if (expertData.certificate instanceof File) {
        formData.append("certificate", expertData.certificate);
      } else if (expertData.certificate && expertData.certificate[0]) {
        formData.append("certificate", expertData.certificate[0]);
      }

      const response = await createExpertAccount(formData);

      if (response.success) {
        dispatch(changeRole("expert"));
        setIsModalOpen(false);
        toast.success(response.message);
      }
    } catch (error) {
      console.error("Error uploading expert:", error);
    } finally {
      setIsLoading(false); // Hide loading when request is completed
    }
  };



  const handleSwitchAccount = async () => {
    // try {
    //   setIsLoading(true);
    //   const newRole= user.role==="user"?"expert":"user"
      
    //   const response = await switchAccount(newRole); // Assume this function makes the API call
    //   if (response.success) {
    //     dispatch(changeRole("expert"));
    //     toast.success("Switched to Expert Account successfully");
    //     navigate('/expert')
    //   }
    // } catch (error) {
    //   console.error("Error switching to expert account:", error);
    //   toast.error("Failed to switch to Expert Account");
    // } finally {
    //   setIsLoading(false);
    // }
  };
  return (
    <header className="w-full">
      {/* Top Bar */}
      <div className="bg-blue-900 text-white text-sm px-4 md:px-6 py-2 flex justify-between items-center">
        <div className="flex items-center gap-2 md:gap-4">
          <span className="flex items-center gap-1">
            <MdLocationOn className="text-yellow-400" />
            <span className="hidden sm:inline">123 Street, New York</span>
          </span>
          <span className="flex items-center gap-1">
            <MdEmail className="text-yellow-400" />
            <span className="hidden sm:inline">Email@Example.com</span>
          </span>
        </div>
        <nav className="hidden md:flex gap-4">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Use</a>
          <a href="#" className="hover:underline">Sales and Refunds</a>
        </nav>
      </div>

      {/* Main Navbar */}
      <div className="bg-white shadow-md px-4 md:px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2 text-lg font-bold text-indigo-600">
          <Link to="/" className="flex items-center gap-2">
            <img src="logo.png" alt="Logo" className="w-8 h-8" />
            <span className="hidden sm:inline">Service Hub</span>
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="hidden md:flex gap-6 text-gray-700">
          <Link to="/categories" className="hover:text-blue-500">
            Categories
          </Link>
        </nav>

        {/* Become Expert Button */}
        {isAuthenticated && user && user.role === "user" ? (
  user.expertStatus === "default" ? (
    <button
      onClick={() => setIsModalOpen(true)}
      className="px-4 py-2 bg-green-500 text-white rounded text-sm md:text-base"
    >
      Become Expert Account
    </button>
  ) : user.expertStatus === 'pending' ? (
    <span className="text-yellow-500 text-sm">Request Pending Approval...</span>
  ) : user.expertStatus === "approved" ? (
    <button
      onClick={handleSwitchAccount}
      className="py-2 text-blue-500 rounded text-sm md:text-base"
    >
      Switch to Expert Account
    </button>
  ) : (
    <span className="text-yellow-500 text-sm">Request is rejected...</span>
  )
) : null}
        {/* Search Bar & Icons */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative hidden sm:block">
            <FiSearch className="absolute left-3 top-2.5 text-gray-500" />
            <input
              type="text"
              placeholder="Search for ‘AC service’"
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none w-48 md:w-64"
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

          {/* Mobile Menu Toggle */}
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

      {/* Loading Indicator */}
      {isLoading && <Loading />}

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutModal}
        message="Are you sure you want to log out?"
        onConfirm={handleLogout}
        onCancel={onCancel}
      />

      {/* Create Expert Modal */}
      <CreateExpertModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateExpert}
       
      />
    </header>
  );
};

export default Navbar;