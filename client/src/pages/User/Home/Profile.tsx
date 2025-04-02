// ProfilePage.tsx
import React, { useEffect, useState } from "react";
import {
  Bell,
  User,
  Lock,
  Heart,
  Briefcase,
  Edit,
  Save,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { get_userData, changeUserPassword } from "@/services/User/AuthServices";

type ProfileViewType = 'overview' | 'edit' | 'password' | 'saved';

export const ProfilePage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: any) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [currentView, setCurrentView] = useState<ProfileViewType>('overview');
  const [editedProfile, setEditedProfile] = useState<Partial<IUser>>({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  console.log('home page')

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const response = await get_userData();

        if (response.success) {
          console.log(response.user)
          setUser(response.user);
          setEditedProfile({
            name: response.user.name,
            email: response.user.email,
            phone: response.user.phone,
            // location: response.user.location,
            profile_imaga: response.user.profile_imaga
          });
        } else {
          toast.error(response.message);
        }
      } catch (error: any) {
        toast.error(error.message || "User data fetching error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleCreateExpert = async (expertData: ExpertData) => {
    setIsLoading(true);
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
          ...prev!,
          expertStatus: "pending",
        }));
        setIsModalOpen(false);
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      console.error("Error uploading expert:", error);
      toast.error(error.message || "Error creating expert account");
    } finally {
      setIsLoading(false);
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
      } else {
        toast.error(response.message || "Failed to switch to expert account");
      }
    } catch (error: any) {
      console.error("Error in handleSwitchAccount:", error);
      toast.error(error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    if (!editedProfile) return;

    try {
      setIsLoading(true);
      // const response = await updateUserProfile(editedProfile);
      // if (response.success) {
      //   setUser(response.user);
      //   setCurrentView('overview');
      //   toast.success("Profile updated successfully");
      // } else {
      //   toast.error(response.message);
      // }
      toast.success("Profile updated successfully (demo)");
      setCurrentView('overview');
    } catch (error: any) {
      toast.error(error?.message || "Profile update failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      setIsLoading(true);
      // const response = await changeUserPassword({
      //   currentPassword: passwordData.currentPassword,
      //   newPassword: passwordData.newPassword
      // });
      // if (response.success) {
      //   setCurrentView('overview');
      //   toast.success("Password changed successfully");
      //   setPasswordData({
      //     currentPassword: '',
      //     newPassword: '',
      //     confirmPassword: ''
      // });
      // } else {
      //   toast.error(response.message);
      // }
      toast.success("Password changed successfully (demo)");
      setCurrentView('overview');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      toast.error(error?.message || "Password change failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSidebarClick = (view: ProfileViewType) => {
    setCurrentView(view);
  };

  if (loading) return <Loading />;
  if (!user) return <div className="flex items-center justify-center h-screen">User not found</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r">
        <div className="flex flex-col items-center py-8">
          <div className="relative">
            <Avatar className="h-24 w-24 mb-2">
              <AvatarImage src={user.profile_imaga} alt="Profile" />
              <AvatarFallback>{user.name?.[0] || 'U'}</AvatarFallback>
            </Avatar>
          </div>
          <h2 className="mt-4 text-xl font-semibold">{user.name}</h2>
          <p className="text-gray-500">{user.role}</p>
        </div>

        <nav className="mt-6">
          <Button
            variant={currentView === 'overview' ? 'default' : 'ghost'}
            className="w-full justify-start pl-4 mb-1"
            onClick={() => handleSidebarClick('overview')}
          >
            <User className="mr-2 h-4 w-4" />
            Profile Overview
          </Button>
          <Button
            variant={currentView === 'edit' ? 'default' : 'ghost'}
            className="w-full justify-start pl-4 mb-1"
            onClick={() => handleSidebarClick('edit')}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
          <Button
            variant={currentView === 'password' ? 'default' : 'ghost'}
            className="w-full justify-start pl-4 mb-1"
            onClick={() => handleSidebarClick('password')}
          >
            <Lock className="mr-2 h-4 w-4" />
            Change Password
          </Button>
          <Button
            variant={currentView === 'saved' ? 'default' : 'ghost'}
            className="w-full justify-start pl-4 mb-1"
            onClick={() => handleSidebarClick('saved')}
          >
            <Heart className="mr-2 h-4 w-4" />
            Saved Services
          </Button>

          {isAuthenticated && user && (
            <>
              {user.role === "user" && (
                <>
                  {(!user.expertStatus || user.expertStatus === "default") && (
                    <Button
                      variant="outline"
                      onClick={() => setIsModalOpen(true)}
                      className="w-full justify-start pl-4 mb-1 bg-black text-white hover:bg-gray-800"
                    >
                      <Briefcase className="mr-2 h-4 w-4" />
                      Become Expert Account
                    </Button>
                  )}

                  {user.expertStatus === "pending" && (
                    <div className="px-4 py-2 text-sm">
                      <p className="text-yellow-600">Request Pending Approval</p>
                    </div>
                  )}

                  {user.expertStatus === "rejected" && (
                    <div className="px-4 py-2">
                      <p className="text-red-500 text-sm mb-2">
                        Your request was rejected. You can re-apply.
                      </p>
                      <Button 
                        variant="outline"
                        onClick={() => setIsModalOpen(true)}
                        className="w-full justify-start pl-2 mb-1 bg-black text-white hover:bg-gray-800"
                      >
                        <Briefcase className="h-4 w-4" />
                        Re-apply for Expert
                      </Button>
                    </div>
                  )}

                  {user.expertStatus === "approved" && (
                    <Button
                      variant="ghost"
                      onClick={handleSwitchAccount}
                      className="w-full justify-start pl-4 mb-1 text-green-600 hover:bg-green-50"
                    >
                      <Briefcase className="mr-2 h-4 w-4" />
                      Switch to Expert Account
                    </Button>
                  )}
                </>
              )}

              {user.role === "expert" && (
                <Button
                  variant="ghost"
                  onClick={handleSwitchAccount}
                  className="w-full justify-start pl-4 mb-1"
                >
                  <User className="mr-2 h-4 w-4" />
                  Switch to User Account
                </Button>
              )}
            </>
          )}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <header className="px-6 py-4 bg-white border-b flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            {currentView === 'overview' && "Profile Overview"}
            {currentView === 'edit' && "Edit Profile"}
            {currentView === 'password' && "Change Password"}
            {currentView === 'saved' && "Saved Services"}
          </h1>
          <div className="flex items-center">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <div className="p-6">
          {/* Profile Overview */}
          {currentView === 'overview' && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <Avatar className="h-20 w-20 mr-6">
                      <AvatarImage 
                        src={user.profile_imaga || "/api/placeholder/150/150"} 
                        alt="Profile" 
                      />
                      <AvatarFallback>{user.name?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-3">{user.name}</h2>
                      <div className="space-y-2 text-gray-600">
                        <p>{user.email}</p>
                        <p>{user.phone}</p>
                        {/* <p>{user.location}</p> */}
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentView('edit')}
                  >
                    <Edit className="mr-2 h-4 w-4" /> Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Edit Profile */}
          {currentView === 'edit' && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div>
                  <div className="flex items-start justify-between mb-6">
                    <Avatar className="h-20 w-20 mr-6">
                      <AvatarImage 
                        src={user.profile_imaga || "/api/placeholder/150/150"} 
                        alt="Profile" 
                      />
                      <AvatarFallback>{user.name?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setCurrentView('overview')}
                      >
                        <X className="mr-2 h-4 w-4" /> Cancel
                      </Button>
                      <Button onClick={handleProfileUpdate}>
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2">Full Name</label>
                      <Input 
                        value={editedProfile.name || ''} 
                        onChange={(e) => setEditedProfile(prev => ({
                          ...prev, 
                          name: e.target.value
                        }))}
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Email</label>
                      <Input 
                        value={editedProfile.email || ''} 
                        onChange={(e) => setEditedProfile(prev => ({
                          ...prev, 
                          email: e.target.value
                        }))}
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Phone</label>
                      <Input 
                        value={editedProfile.phone || ''} 
                        onChange={(e) => setEditedProfile(prev => ({
                          ...prev, 
                          phone: e.target.value
                        }))}
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Location</label>
                      {/* <Input 
                        value={editedProfile.location || ''} 
                        onChange={(e) => setEditedProfile(prev => ({
                          ...prev, 
                          location: e.target.value
                        }))}
                      /> */}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Change Password */}
          {currentView === 'password' && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2">Current Password</label>
                    <Input 
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({
                        ...prev, 
                        currentPassword: e.target.value
                      }))}
                    />
                  </div>
                  <div>
                    <label className="block mb-2">New Password</label>
                    <Input 
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({
                        ...prev, 
                        newPassword: e.target.value
                      }))}
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Confirm New Password</label>
                    <Input 
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({
                        ...prev, 
                        confirmPassword: e.target.value
                      }))}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentView('overview')}
                    >
                      <X className="mr-2 h-4 w-4" /> Cancel
                    </Button>
                    <Button onClick={handlePasswordChange}>
                      <Save className="mr-2 h-4 w-4" /> Change Password
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Saved Services */}
          {currentView === 'saved' && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div>
                  <h3 className="text-lg font-semibold">Saved Services</h3>
                  <div className="mt-4">
                    <p className="text-gray-500">No saved services yet.</p>
                    {/* You can add your saved services list here */}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Create Expert Modal */}
      <CreateExpertModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateExpert}
      />
    </div>
  );
};

export default ProfilePage;