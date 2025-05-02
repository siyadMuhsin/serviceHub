import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../Slice/authSlice";
import { LogoutUser } from "../../services/User/AuthServices";
import ConfirmModal from "../../Utils/Confirmation";
import { FaRegUser, FaBars } from "react-icons/fa";
import { MdEmail, MdLocationOn } from "react-icons/md";
import { toast } from "react-toastify";
import Loading from "../Loading";
import Logo from "./Logo";
import LocationFetcher from "../Location/GeoLocation";
import { fetchLocationFromCoordinates } from "@/Utils/locationUtils";
import { resetLocations, setUserLocation } from "@/Slice/locationSlice";
const Navbar: React.FC = () => {
  const { user, isAuthenticated } = useSelector((state: any) => state.auth);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [userr, setUser] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [locationData, setLocationData] = useState<string | null>(null);
  const { userLocation } = useSelector((state: any) => state.location);

  useEffect(() => {
    const fn = async () => {
      if (user.location?.coordinates) {
        if (user?.location?.coordinates[1] && user?.location?.coordinates[0]) {
          const address = await fetchLocationFromCoordinates(user.location.coordinates[1], user.location.coordinates[0]);
          setLocationData(address);
          dispatch(setUserLocation({ lat: user.location.coordinates[1], lng: user.location.coordinates[0], address: address }));
        }
      }
    };
    fn();
  }, [user]);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const response = await LogoutUser();
      if (response.success) {
        navigate("/login");
        dispatch(logout());
        dispatch(resetLocations());
        setShowLogoutModal(false);
      } else {
        toast.error(response.message || "Cannot log out now!");
      }
    } catch (err) {
      console.error("Logout Error:", err);
      toast.error("Something went wrong! Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onCancel = () => {
    setShowLogoutModal(false);
  };

  const updateUserLocation = (newLocation: { location: string; latitude: number; longitude: number }) => {
    setUser({ ...user, ...newLocation });
    dispatch(setUserLocation({ lat: newLocation.latitude, lng: newLocation.longitude, address: newLocation.location }));
  };

  return (
    <header className="w-full sticky top-0 z-50">
      {/* Main Navbar */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 shadow-md px-4 md:px-6 py-4 flex justify-between items-center">
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-12 h-12">
              <Logo />
            </div>
            <span className="text-lg font-bold text-white whitespace-nowrap">
              Service Hub
            </span>
          </Link>

          {/* Mobile Menu Toggle */}
          <FaBars
            className="text-2xl cursor-pointer md:hidden ml-4 text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          />
        </div>

        {/* Menu Items - Center aligned on desktop */}
        <nav className="hidden md:flex gap-6 text-white items-center">
          <Link to="/categories" className="hover:text-teal-200 whitespace-nowrap transition-colors">
            Categories
          </Link>
          
          {user && (
            <div className="flex items-center">
              {user && userLocation.address ? (
                <p className="whitespace-nowrap">
                  {userLocation.address.split(',')[0]}, {userLocation.address.split(',')[1]}
                </p>
              ) : (
                <LocationFetcher user={user} updateUserLocation={updateUserLocation} />
              )}
            </div>
          )}
        </nav>

        {/* Right side icons */}
        <div className="hidden md:flex items-center gap-4">
          {/* User Dropdown */}
          {isAuthenticated ? (
            <div className="relative">
              <FaRegUser
                className="text-xl cursor-pointer hover:text-teal-200 text-white transition-colors"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-teal-100 rounded-lg shadow-lg z-10">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-blue-700 hover:bg-teal-50 transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/saved-services"
                    className="block px-4 py-2 text-blue-700 hover:bg-teal-50 transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Saved Services
                  </Link>
                  <Link
                    to={'/bookings'}
                    className="block px-4 py-2 text-blue-700 hover:bg-teal-50 transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Bookings
                  </Link>
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="block px-4 py-2 text-blue-700 hover:bg-teal-50 w-full text-left transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="text-white hover:text-teal-200 whitespace-nowrap transition-colors">
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="bg-blue-600 shadow-md md:hidden">
          <div className="px-4 py-2 border-b border-teal-500">
            {user && (
              <div className="flex items-center justify-between text-white">
                {userLocation.address ? (
                  <p className="text-sm">
                    {userLocation.address.split(',')[0]}, {userLocation.address.split(',')[1]}
                  </p>
                ) : (
                  <LocationFetcher user={user} updateUserLocation={updateUserLocation} />
                )}
              </div>
            )}
          </div>
          
          <Link
            to="/categories"
            className="block py-3 px-6 hover:bg-teal-500 border-b border-teal-500 text-white transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Categories
          </Link>
          
          {isAuthenticated && (
            <>
              <Link
                to="/profile"
                className="block py-3 px-6 hover:bg-teal-500 border-b border-teal-500 text-white transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </Link>
              <Link
                to="/saved-services"
                className="block py-3 px-6 hover:bg-teal-500 border-b border-teal-500 text-white transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Saved Services
              </Link>
              <Link 
                to={'/bookings'}
                className="block py-3 px-6 hover:bg-teal-500 border-b border-teal-500 text-white transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Bookings
              </Link>
            </>
          )}
          
          <div className="px-6 py-3">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setShowLogoutModal(true);
                  setMenuOpen(false);
                }}
                className="w-full py-2 px-4 bg-white text-red-600 rounded hover:bg-teal-50 transition-colors font-medium"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block w-full py-2 px-4 bg-white text-teal-600 text-center rounded hover:bg-teal-50 transition-colors font-medium"
              >
                Login
              </Link>
            )}
          </div>
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