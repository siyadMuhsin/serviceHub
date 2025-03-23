// ProfilePage.tsx
import React, { useEffect, useState } from "react";
import {
  Bell,
  Eye,
  Home,
 User,
  Lock,
  Heart,
  Briefcase,
  UserCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { AuthState, changeRole, updateUser } from "@/Slice/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CreateExpertModal from "@/components/User/modals/CreateExpertModal";

import {
  createExpertAccount,
  switchExpert,
} from "../../../services/User/ExpertAccount";
import { ExpertData, IUser } from "@/Interfaces/interfaces";
import Loading from "@/components/Loading";
import { get_userData } from "@/services/User/AuthServices";
export const ProfilePage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(
    (state: any) => state.auth 
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [user,setUser]= useState<IUser>()

  useEffect(()=>{
    const fetchUser=async()=>{
try {
  const response=await get_userData()
 
  if(response.success){
    setUser(response.user)
  }else{
    toast.error(response.message)
  }
} catch (error) {
  toast.error(error.message || "User data fetching error")
}
    }
fetchUser()
  },[])
console.log(isAuthenticated,user)
  const handleCreateExpert = async (expertData: ExpertData) => {
    setIsLoading(true); // Show loading when request starts
    console.log(expertData);
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

      if (response?.success) {
        
setUser((prev) => ({
  ...prev, 
  expertStatus:"pending", 
}));
  setIsModalOpen(false);
        toast.success(response.message);
      }else{
        toast.error(response.message)
      }
    } catch (error) {
      console.error("Error uploading expert:", error);
    } finally {
      setIsLoading(false); // Hide loading when request is completed
    }
  };

  const handleSwitchAccount = async () => {
    try {
      setIsLoading(true);
      const response = await switchExpert();
      if (response?.success) {
        dispatch(changeRole("expert"));
        toast.success("Switched to Expert Account successfully");
        navigate("/expert");
      }else{
        toast.error(response.message || "Failed to switch to expert account")
      }
    } catch (error) {
        console.error("Error in handleSwitchAccount:", error);
        toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r">
        <div className="flex flex-col items-center py-8">
          <div className="relative">
            <Avatar className="h-24 w-24 mb-2">
              <AvatarImage src="/api/placeholder/150/150" alt="Profile" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Button
              variant="outline"
              size="sm"
              className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0"
            >
              <UserCircle className="h-4 w-4" />
            </Button>
          </div>
          <h2 className="mt-4 text-xl font-semibold">John Doe</h2>
          <p className="text-gray-500">Client</p>
        </div>

        <nav className="mt-6">
          <Button
            variant="ghost"
            className="w-full justify-start pl-4 mb-1 bg-blue-50 text-blue-600"
          >
            <User className="mr-2 h-4 w-4" />
            Profile Overview
          </Button>
          <Button variant="ghost" className="w-full justify-start pl-4 mb-1">
            <User className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
          <Button variant="ghost" className="w-full justify-start pl-4 mb-1">
            <Lock className="mr-2 h-4 w-4" />
            Change Password
          </Button>
          <Button variant="ghost" className="w-full justify-start pl-4 mb-1">
            <Heart className="mr-2 h-4 w-4" />
            Saved Services
          </Button>
          {isAuthenticated && user ? (
            user.role === "user" ? (
              user.expertStatus === "default" ? (
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(true)}
                  className="w-full justify-start pl-4 mb-1 bg-black text-white"
                >
                  <Briefcase className="mr-2 h-4 w-4" />
                  Become Expert Account
                </Button>
              ) : user.expertStatus === "pending" ? (
                <span className="text-yellow-500 text-sm">
                  Request Pending Approval...
                </span>
              ) : (
                <span className="text-red-500 text-sm">
                  Request is rejected...
                </span>
              )
            ) : user.role === "expert" ? (
              <Button
                variant="ghost"
                onClick={handleSwitchAccount}
                className="w-full justify-start pl-4 mb-1"
              >
                <Briefcase className="mr-2 h-4 w-4" />
                Switch to Expert Account
              </Button>
            ) : null
          ) : null}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <header className="px-6 py-4 bg-white border-b flex justify-between items-center">
          <h1 className="text-2xl font-bold">Profile Overview</h1>
          <div className="flex items-center">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button
              variant="default"
              className="ml-4 bg-blue-500 hover:bg-blue-600"
            >
              Edit Profile
            </Button>
          </div>
        </header>

        <div className="p-6">
          {/* Profile Overview Card */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-start">
                <Avatar className="h-20 w-20 mr-6">
                  <AvatarImage src="/api/placeholder/150/150" alt="Profile" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-3">John Doe</h2>
                  <div className="space-y-2 text-gray-600">
                    <p>john.doe@example.com</p>
                    <p>+1 (555) 123-4567</p>
                    <p>New York, USA</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">
                    Profile Completion
                  </span>
                  <span className="text-sm font-medium text-green-500">
                    Complete
                  </span>
                </div>
                <Progress value={80} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Edit Profile Card */}

            {/* Change Password Card */}
          </div>
        </div>
      </div>
      {/* Create Expert Modal */}
      <CreateExpertModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateExpert}
      />

      {loading&& <Loading/>}
    </div>
  );
};

export default ProfilePage;
