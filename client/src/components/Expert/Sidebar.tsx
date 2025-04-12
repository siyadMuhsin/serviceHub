import React, { useState } from "react";
import { ChevronRight, ChevronLeft, LogOut, User, CalendarClock, Star, MessageCircle, ClipboardList, LayoutDashboard } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { LogoutUser } from "@/services/User/AuthServices";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { changeRole, logout } from "@/Slice/authSlice";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { switchUser } from "@/services/User/ExpertAccount";
import { motion, AnimatePresence } from "framer-motion";

const ExpertSidebar: React.FC<{ onToggle: (expanded: boolean) => void }> = ({ onToggle }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const menuItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, text: "Dashboard", path: "/expert/" },
    { icon: <ClipboardList className="w-5 h-5" />, text: "Service Requests", path: "/expert/service-requests" },
    { icon: <CalendarClock className="w-5 h-5" />, text: "Slot Management", path: "/expert/slot-management" },
    { icon: <MessageCircle className="w-5 h-5" />, text: "Messages", path: "/expert/messages" },
    { icon: <Star className="w-5 h-5" />, text: "Reviews & Ratings", path: "/expert/reviews" },
    { icon: <User className="w-5 h-5" />, text: "My Profile", path: "/expert/profile" },

  ];

  const handleLogout = async () => {
    try {
      setLoading(true);
      const response = await LogoutUser();
      if (response.success) {
        dispatch(logout());
        navigate("/login");
      } else {
        toast.error(response.message || "Cannot log out now!");
      }
    } catch (err) {
      console.error("Logout Error:", err);
      toast.error("Something went wrong! Try again.");
    } finally {
      setLoading(false);
      setShowLogoutModal(false);
    }
  };

  const handleSwitchAccount = async () => {
    try {
      const response = await switchUser();
      if (response.success) {
        dispatch(changeRole("user"));
        navigate('/');
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error(error);
    }
    setShowSwitchModal(false);
  };

  return (
    <>
      <motion.aside
        initial={{ width: 256 }}
        animate={{ width: isExpanded ? 256 : 80 }}
        transition={{ type: "spring", damping: 20 }}
        className={`fixed left-0 h-full bg-gradient-to-b from-[#1a4a33] to-[#0d2e20] text-white pt-5 rounded-r-2xl shadow-xl overflow-hidden z-50`}
      >
        {/* Sidebar Toggle Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute -right-0 top-6 bg-slate-400 rounded-full p-1 shadow-md cursor-pointer z-[10]"
          onClick={() => {
            setIsExpanded(!isExpanded);
            onToggle(!isExpanded);
          }}
        >
          {isExpanded ? (
            <ChevronLeft className="text-[#1a4a33]" size={18} />
          ) : (
            <ChevronRight className="text-[#1a4a33]" size={18} />
          )}
        </motion.div>

        {/* Logo/Brand */}
        <div className="px-6 mb-8">
          <motion.div 
            initial={{ opacity: 1 }}
            animate={{ opacity: isExpanded ? 1 : 0 }}
            className="text-xl font-bold whitespace-nowrap"
          >
            Expert Panel
          </motion.div>
        </div>

        {/* Menu Items */}
        <ul className="mt-8 space-y-1 px-3">
          {menuItems.map((item, index) => (
            <motion.li
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(item.path)}
              className={`flex items-center px-4 py-3 cursor-pointer transition-all rounded-xl ${
                location.pathname === item.path
                  ? "bg-white bg-opacity-20 backdrop-blur-sm"
                  : "hover:bg-white hover:bg-opacity-10"
              }`}
            >
              <span className="text-xl min-w-[24px]">{item.icon}</span>
              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ delay: 0.1 }}
                    className="ml-3 whitespace-nowrap"
                  >
                    {item.text}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.li>
          ))}
        </ul>

        {/* Bottom Section */}
        <div className="absolute bottom-0 w-full px-4 pb-4">
          <Separator className="my-3 bg-white bg-opacity-20" />

          {/* Switch to User Account */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mb-2"
          >
            <Button
              variant="ghost"
              className={`w-full flex justify-start gap-2 text-white hover:bg-white hover:bg-opacity-20 rounded-xl p-3 ${
                !isExpanded ? "justify-center" : ""
              }`}
              onClick={() => setShowSwitchModal(true)}
            >
              <User size={18} />
              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="whitespace-nowrap"
                  >
                    Switch to User
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>

          {/* Logout Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="ghost"
              className={`w-full flex justify-start gap-2 text-white hover:bg-red-500 hover:bg-opacity-80 rounded-xl p-3 ${
                !isExpanded ? "justify-center" : ""
              }`}
              onClick={() => setShowLogoutModal(true)}
            >
              <LogOut size={18} />
              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="whitespace-nowrap"
                  >
                    Logout
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </div>
      </motion.aside>

      {/* Logout Confirmation Modal */}
      <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
        <DialogContent className="rounded-2xl">
          <DialogHeader className="text-lg font-bold">Confirm Logout</DialogHeader>
          <p>Are you sure you want to log out?</p>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowLogoutModal(false)}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleLogout} 
              disabled={isLoading}
              className="rounded-lg"
            >
              {isLoading ? "Logging out..." : "Logout"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Switch Account Confirmation Modal */}
      <Dialog open={showSwitchModal} onOpenChange={setShowSwitchModal}>
        <DialogContent className="rounded-2xl">
          <DialogHeader className="text-lg font-bold">Switch Account</DialogHeader>
          <p>Are you sure you want to switch to your User Account?</p>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowSwitchModal(false)}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button 
              variant="default" 
              onClick={handleSwitchAccount}
              className="rounded-lg bg-[#1a4a33] hover:bg-[#0d2e20]"
            >
              Switch Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExpertSidebar;