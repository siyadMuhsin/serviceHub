import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FiUser, FiCalendar, FiLogOut, FiChevronDown } from 'react-icons/fi';
import { logout } from "../../Slice/authSlice";
import { LogoutUser } from "../../services/User/AuthServices";
import ConfirmModal from "../../Utils/Confirmation";
import { FaRegUser} from "react-icons/fa";
import {  MdLocationOn } from "react-icons/md";
import { toast } from "react-toastify";
import Loading from "../Loading";
import Logo from "./Logo";
import { fetchLocationFromCoordinates } from "@/Utils/locationUtils";
import { number } from "yup";
import { resetLocations, setUserLocation } from "@/Slice/locationSlice";

const Navbar: React.FC = () => {
  // const { categories, services } = useSelector((state: any) => state.categoryService);
  const { user, isAuthenticated } = useSelector((state: any) => state.auth);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

const [userr,setUser]=useState()
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [locationData, setLocationData] = useState<string | null>(null);
const {userLocation}=useSelector((state:any)=>state.location)
  useEffect(() => {
    const fn=async()=>{
      if(user.location?.coordinates){
        if (user?.location?.coordinates[1] && user?.location?.coordinates[0]) {
          const address= await fetchLocationFromCoordinates(user.location.coordinates[1], user.location.coordinates[0])
          setLocationData(address)
            dispatch(setUserLocation({lat:user.location.coordinates[1],lng:user.location.coordinates[0],address:address}))
          }
      }
     
    }
   fn()
  }, [user]);
  const handleLogout = async () => {
    try{
      setIsLoading(true)
      const response = await LogoutUser();
      if(response.success){
        navigate("/login")
        dispatch(logout());
        dispatch(resetLocations())
        setShowLogoutModal(false)
      }else{
        toast.error(response.message || "Cannot log out now!")
      }
    }catch(err){
      console.error("Logout Error:", err);
      toast.error("Something went wrong! Try again.");
    }finally{
      setIsLoading(false)
    }
  };

  const onCancel = () => {
    setShowLogoutModal(false);
  };


  const updateUserLocation = (newLocation: { location: string; latitude: number; longitude: number }) => {
    setUser({ ...user, ...newLocation });
    dispatch(setUserLocation({lat:newLocation.latitude,lng:newLocation.longitude,address:newLocation.location}))
  };
  
  return (
    <header className="w-full bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
    {/* Main Navbar */}
    <div className="px-4 md:px-8 py-3 flex justify-between items-center">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1">
          <Logo />
        </div>
        <span className="text-xl font-bold text-white whitespace-nowrap">
          ServiceHub
        </span>
      </Link>
  
      {/* Menu Items */}
      <nav className="hidden md:flex gap-8 items-center text-white">
        <Link 
          to="/categories" 
          className="hover:text-blue-200 transition-colors duration-200 font-medium"
        >
          Categories
        </Link>
        
        {user && userLocation.address && (
          <div className="flex items-center gap-1 bg-blue-700 px-3 py-1 rounded-full">
            <MdLocationOn className="text-yellow-300" />
            <span className="text-sm">
              {userLocation.address.split(',')[0]}
            </span>
          </div>
        )}
      </nav>
  
      {/* User Actions */}
      <div className="flex items-center gap-5">
        {isAuthenticated ? (
          <div className="relative">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1 focus:outline-none"
            >
              <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <FaRegUser className="text-lg" />
              </div>
              <FiChevronDown className={`text-white transition-transform duration-200 ${dropdownOpen ? 'transform rotate-180' : ''}`} />
            </button>
            
            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-xl z-50 border border-gray-100 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 bg-blue-50">
                  <p className="text-sm text-gray-600">Welcome back</p>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.name || 'User'}
                  </p>
                </div>
                
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                  onClick={() => setDropdownOpen(false)}
                >
                  <FiUser className="mr-3 text-blue-600" />
                  Profile
                </Link>
                
                <Link
                  to="/bookings"
                  className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                  onClick={() => setDropdownOpen(false)}
                >
                  <FiCalendar className="mr-3 text-blue-600" />
                  Bookings
                </Link>
                
                <div className="border-t border-gray-100">
                  <button
                    onClick={() => {
                      setShowLogoutModal(true);
                      setDropdownOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                  >
                    <FiLogOut className="mr-3 text-blue-600" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link 
            to="/login" 
            className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-50 transition-colors shadow-sm"
          >
            Login
          </Link>
        )}
  
        
      
      </div>
    </div>

  
    {/* Loading Indicator */}
    {isLoading && <Loading />}
  
    {/* Logout Confirmation Modal */}
    <ConfirmModal
      isOpen={showLogoutModal}
      message="Are you sure you want to log out?"
      onConfirm={handleLogout}
      onCancel={onCancel}
    />
  </header>
  )
};

export default Navbar;