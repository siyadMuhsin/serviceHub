import React, { useState } from "react";
import { ChevronRight, ChevronLeft, LogOut, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { LogoutUser } from "@/services/User/AuthServices";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { changeRole, logout } from "@/Slice/authSlice";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { switchUser } from "@/services/User/ExpertAccount";

const ExpertSidebar: React.FC<{ onToggle: (expanded: boolean) => void }> = ({ onToggle }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSwitchModal, setShowSwitchModal] = useState(false); // Added for Switch Account Confirmation
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const menuItems = [
    { icon: "📊", text: "Dashboard", path: "/expert/" },
    { icon: "📋", text: "Service Requests", path: "/expert/service-requests" },
    { icon: "💬", text: "Messages", path: "/expert/messages" },
    { icon: "⭐", text: "Reviews & Ratings", path: "/expert/reviews" },
    { icon: "👤", text: "My Profile", path: "/expert/profile" },
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

  const handleSwitchAccount = async() => {
    try {
      const response=await switchUser()
      if(response.success){
        dispatch(changeRole("user"))
        navigate('/')
      }else{
        toast.error(response.message)
      }
    } catch (error) {
      console.error(error)
      
    }
    dispatch(changeRole("user"));
    navigate("/user/dashboard");
    setShowSwitchModal(false);
  };

  return (
    <>
      <aside
        className={`fixed left-0 h-full bg-[#1a4a33] text-white pt-5 transition-all duration-300 ${
          isExpanded ? "w-64" : "w-16"
        }`}
      >
        {/* Sidebar Toggle Button */}
        <Button
          variant="ghost"
          className="absolute right-0 top-2 text-white p-1"
          onClick={() => {
            setIsExpanded(!isExpanded);
            onToggle(!isExpanded);
          }}
        >
          {isExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </Button>

        {/* Menu Items */}
        <ul className="mt-8 space-y-2">
          {menuItems.map((item, index) => (
            <li
              key={index}
              onClick={() => navigate(item.path)}
              className={`flex items-center px-4 py-3 cursor-pointer transition-all rounded-md ${
                location.pathname === item.path
                  ? "bg-[#3F8CFF] bg-opacity-30"
                  : "hover:bg-[#3F8CFF] hover:bg-opacity-20"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {isExpanded && <span className="ml-3">{item.text}</span>}
            </li>
          ))}
        </ul>

        {/* Bottom Section */}
        <div className="absolute bottom-4 w-full px-4">
          <Separator className="mb-3 bg-gray-500" />

          {/* Switch to User Account */}
          <Button
            variant="outline"
            className="w-full flex justify-start gap-2 text-black"
            onClick={() => setShowSwitchModal(true)} // Open Switch Confirmation
          >
            <User size={18} />
            {isExpanded && "Switch to User Account"}
          </Button>

          {/* Logout Button */}
          <Button
            variant="destructive"
            className="w-full mt-2 flex justify-start gap-2"
            onClick={() => setShowLogoutModal(true)} // Open Logout Confirmation
          >
            <LogOut size={18} />
            {isExpanded && "Logout"}
          </Button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
        <DialogContent>
          <DialogHeader className="text-lg font-bold">Confirm Logout</DialogHeader>
          <p>Are you sure you want to log out?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLogoutModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout} disabled={isLoading}>
              {isLoading ? "Logging out..." : "Logout"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Switch Account Confirmation Modal */}
      <Dialog open={showSwitchModal} onOpenChange={setShowSwitchModal}>
        <DialogContent>
          <DialogHeader className="text-lg font-bold">Switch Account</DialogHeader>
          <p>Are you sure you want to switch to your User Account?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSwitchModal(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleSwitchAccount}>
              Switch Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExpertSidebar;
