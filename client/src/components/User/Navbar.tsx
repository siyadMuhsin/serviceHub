import React, { useEffect, useState } from "react";
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

import { changeRole } from "../../Slice/authSlice";
import { toast } from "react-toastify";
import CreateExpertModal from "./modals/CreateExpertModal";
import Loading from "../Loading";
import { ExpertData} from "@/Interfaces/interfaces";
import Logo from "./Logo";
import LocationFetcher from "../Location/GeoLocation";

import { fetchLocationFromCoordinates } from "@/Utils/locationUtils";
import { number } from "yup";
import { setUserLocation } from "@/Slice/locationSlice";

const Navbar: React.FC = () => {
  // const { categories, services } = useSelector((state: any) => state.categoryService);
  const { user, isAuthenticated } = useSelector((state: any) => state.auth);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

const [userr,setUser]=useState()
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [locationData, setLocationData] = useState<string | null>(null);
const {userLocation}=useSelector((state:any)=>state.location)
  useEffect(() => {
    const fn=async()=>{
      if (user?.location?.coordinates[1] && user?.location?.coordinates[0]) {
      
      const address= await fetchLocationFromCoordinates(user.location.coordinates[1], user.location.coordinates[0])
      setLocationData(address)
     
        dispatch(setUserLocation({lat:user.location.coordinates[1],lng:user.location.coordinates[0],address:address}))

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
        <div className="flex items-center justify-between">
  <Link to="/" className="flex items-center gap-2">
    <div className="w-12 h-12">
      <Logo />
    </div>
    <span className="text-lg font-bold text-indigo-600 whitespace-nowrap">
      Service Hub
    </span>
  </Link>
</div>

        {/* Menu Items */}
        <nav className="hidden md:flex gap-6 text-gray-700">
          <div>
          <Link to="/categories" className="hover:text-blue-500">
            Categories
          </Link>

          </div>
          {user ? (
  <div className="flex items-center">
    {}
    {user && userLocation.address?(
      <p>{userLocation.address.split(',')[0]+userLocation.address.split(',')[1]}</p>
    ):(
    <LocationFetcher user={user} updateUserLocation={updateUserLocation} />
  )}
  </div>
) : null}
        </nav>

       
        <div className="flex items-center gap-4">
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

     
    </header>
  );
};

export default Navbar;