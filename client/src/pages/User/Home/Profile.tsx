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
  Menu,
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
  existingExpert,
  switchExpert,
} from "../../../services/User/ExpertAccount";
import { ExpertData, IUser } from "@/Interfaces/interfaces";
import Loading from "@/components/Loading";
import { get_userData } from "@/services/User/AuthServices";
import EditProfile from "@/components/User/EditProfile";
import { fetchLocationFromCoordinates } from "@/Utils/locationUtils";
import { updateUserProfile } from "@/services/User/profile.service";
import { setUserLocation } from "@/Slice/locationSlice";
import ChangePassword from "@/components/User/ChangePassword";
import { ConfirmationModal } from "@/components/ConfirmModal";
import SavedServices from "@/components/User/SavedServices";
import { Role } from "@/types";
import { RootState } from "@/store";

type ProfileViewType = "overview" | "edit" | "password" | "saved" |string;

export const ProfilePage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state:RootState) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [currentView, setCurrentView] = useState<ProfileViewType>("overview");
  const [isSwitchAccount,setIsSwitchAccount]=useState<boolean>(false)
  const [locationData, setLocationData] = useState<string>("");
  const [existingExpertData, setExpertData] = useState({
    accountName: "",
    dob: "",
    gender: "",
    contact: "",
    service: { _id: "", name: "" },
    category: { _id: "", name: "" },
    experience: "",
    certificate: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const response = await get_userData();
        if (response.success) {
          console.log(response.user);
          setUser(response.user);

          if (
            response.user?.location?.coordinates[1] &&
            response.user?.location?.coordinates[0]
          ) {
            await fetchLocationFromCoordinates(
              response.user.location.coordinates[1],
              response.user.location.coordinates[0]
            ).then(setLocationData);
          }
        } else {
          toast.error(response.message);
        }
      } catch (error) {
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
      formData.append("accountName", expertData.accountName);
      formData.append("dob", expertData.dob.toISOString());
      formData.append("gender", expertData.gender);
      formData.append("contact", expertData.contact);
      formData.append("experience", expertData.experience.toString());
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
    } catch (error) {
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
        dispatch(changeRole(Role.EXPERT));
        toast.success("Switched to Expert Account successfully");
        navigate("/expert");
      } else {
        toast.error(response.message || "Failed to switch to expert account");
      }
    } catch (error) {
      console.error("Error in handleSwitchAccount:", error);
      toast.error(
        error.message || "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async (updateProfileData) => {
    if (!updateProfileData) return;
    try {
      console.log(updateProfileData);
      setIsLoading(true);
      delete updateProfileData.email;
      const response = await updateUserProfile(updateProfileData);
      console.log("egvs");
      if (response.success) {
        console.log(updateProfileData);

        if (updateProfileData.location) {
          if (
            updateProfileData.location.lat !== 0 &&
            updateProfileData.location.lng !== 0
          ) {
            const locationData = await fetchLocationFromCoordinates(
              updateProfileData.location.lat,
              updateProfileData.location.lng
            );
            setLocationData(locationData);
            dispatch(
              setUserLocation({
                ...updateProfileData.location,
                address: locationData,
              })
            );
          }
        }

        setUser((prev) => ({
          ...prev,
          ...updateProfileData,
        }));
        console.log(user);
        // setCurrentView('overview');
        toast.success("Profile updated successfully");
      } else {
        toast.error(response.message);
      }
      // toast.success("Profile updated successfully (demo)");
      // setCurrentView('overview');
    } catch (error) {
      console.log(error);
      toast.error(error?.message || "Profile update failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSidebarClick = (view: ProfileViewType) => {
    setCurrentView(view);
  };

  const reApplyToExpert = async () => {
    try {
      const existingExpertData = await existingExpert();
      const data = existingExpertData.expert;
      setExpertData({
        accountName: data.accountName,
        dob: data.dob,
        gender: data.gender,
        contact: data.contact,
        service: { _id: data.serviceId._id, name: data.serviceId.name },
        category: { _id: data.categoryId._id, name: data.categoryId.name },
        experience: data.experience,
        certificate: data.certificateUrl,
      });

      setIsModalOpen(true);
    } catch (error) {
      console.log(error);
    }
  };
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) return <Loading />;
  if (!user)
    return (
      <div className="flex items-center justify-center h-screen">
        User not found
      </div>
    );

    return (
      <div className="flex flex-col md:flex-row h-screen">
        {/* Mobile Header */}
        <div className="flex items-center justify-between bg-white p-4 md:hidden border-b">
          <h1 className="text-lg font-semibold">
            {currentView === "overview" && "Profile Overview"}
            {currentView === "edit" && "Edit Profile"}
            {currentView === "password" && "Change Password"}
            {currentView === "saved" && "Saved Services"}
          </h1>
          <div className="flex items-center gap-2">
          
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
  
        {/* Sidebar */}
        {(sidebarOpen || typeof window === "undefined" || window.innerWidth >= 768) && (
          <div className="w-full md:w-64 bg-blue-50 border-b md:border-b-0 md:border-r border-blue-100 md:rounded-r-lg">
            <div className="flex flex-col items-center py-8">
              <div className="relative">
                <Avatar className="h-24 w-24 mb-2 border-2 border-blue-200">
                  <AvatarImage src={user.profile_image} alt="Profile" />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {user.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
              </div>
              <h2 className="mt-4 text-xl font-semibold text-blue-800">{user.name}</h2>
              <p className="text-blue-500">{user.role}</p>
            </div>
  
            <nav className="mt-6 px-2 pb-6">
              {["overview", "edit", "password", "saved"].map((view) => {
                const icons = {
                  overview: <User className="mr-2 h-4 w-4" />,
                  edit: <Edit className="mr-2 h-4 w-4" />,
                  password: <Lock className="mr-2 h-4 w-4" />,
                  saved: <Heart className="mr-2 h-4 w-4" />,
                };
                const labels = {
                  overview: "Profile Overview",
                  edit: "Edit Profile",
                  password: "Change Password",
                  saved: "Saved Services",
                };
                return (
                  <Button
                    key={view}
                    variant={currentView === view ? "default" : "ghost"}
                    className={`w-full justify-start pl-4 mb-1 rounded-lg ${
                      currentView === view
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "text-blue-700 hover:bg-blue-100"
                    }`}
                    onClick={() => {
                      handleSidebarClick(view);
                      setSidebarOpen(false); // close sidebar on mobile
                    }}
                  >
                    {icons[view]}
                    {labels[view]}
                  </Button>
                );
              })}
  
              {/* Expert Account Status Buttons */}
              {isAuthenticated && user && (
                <>
                  {user.role === "user" && (
                    <>
                      {!user.expertStatus || user.expertStatus === "default" ? (
                        <Button
                          variant="outline"
                          onClick={() => setIsModalOpen(true)}
                          className="w-full justify-start pl-4 mb-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
                        >
                          <Briefcase className="mr-2 h-4 w-4" />
                          Become Expert Account
                        </Button>
                      ) : null}
  
                      {user.expertStatus === "pending" && (
                        <div className="px-4 py-2 text-sm bg-blue-100 rounded-lg border border-blue-200 mb-2">
                          <p className="text-blue-600">Request Pending Approval</p>
                        </div>
                      )}
  
                      {user.expertStatus === "rejected" && (
                        <div className="px-4 py-2">
                          <div className="flex items-start gap-3 p-3 bg-red-100 border-l-4 border-red-500 rounded-md shadow-sm mb-2">
                            <svg className="w-5 h-5 text-red-600 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v2m0 4h.01m-.01-12a9 9 0 110 18 9 9 0 010-18z"
                              />
                            </svg>
                            <p className="text-sm text-red-700">
                              Your request was rejected. {user.rejectReason || ""}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            onClick={reApplyToExpert}
                            className="w-full justify-start pl-2 mb-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
                          >
                            <Briefcase className="h-4 w-4" />
                            Re-apply for Expert
                          </Button>
                        </div>
                      )}
  
                      {user.expertStatus === "approved" && (
                        <Button
                          variant="ghost"
                          onClick={() => setIsSwitchAccount(true)}
                          className="w-full justify-start pl-4 mb-1 rounded-lg text-blue-600 hover:bg-blue-100"
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
                      onClick={() => setIsSwitchAccount(true)}
                      className="w-full justify-start pl-4 mb-1 rounded-lg text-blue-600 hover:bg-blue-100"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Switch to Expert Account
                    </Button>
                  )}
                </>
              )}
            </nav>
          </div>
        )}
  
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto bg-gray-100">
          {/* Desktop Header */}
          <header className="px-6 py-4 bg-white border-b hidden md:flex justify-between items-center">
            <h1 className="text-2xl font-bold">
              {currentView === "overview" && "Profile Overview"}
              {currentView === "edit" && "Edit Profile"}
              {currentView === "password" && "Change Password"}
              {currentView === "saved" && "Saved Services"}
            </h1>
            
          </header>
  
          <div className="p-4 md:p-6">
            {currentView === "overview" && (
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row items-start justify-between">
                    <div className="flex items-start">
                      <Avatar className="h-20 w-20 mr-6">
                        <AvatarImage src={user.profile_image || "/api/placeholder/150/150"} alt="Profile" />
                        <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-3">{user.name}</h2>
                        <div className="space-y-2 text-gray-600">
                          <p>{user.email}</p>
                          <p>{user.phone}</p>
                          <p>{locationData}</p>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" onClick={() => setCurrentView("edit")}>
                      <Edit className="mr-2 h-4 w-4" /> Edit Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
  
            {currentView === "edit" && (
              <EditProfile
                user={user}
                updateUser={setUser}
                onCancel={() => setCurrentView("overview")}
                locationData={locationData}
                onUpdateProfile={handleProfileUpdate}
              />
            )}
  
            {currentView === "password" && <ChangePassword setCurrentView={setCurrentView} />}
  
            {currentView === "saved" && <SavedServices />}
          </div>
        </div>
  
        {/* Modals */}
        <CreateExpertModal
          isOpen={isModalOpen}
          existingData={existingExpertData}
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateExpert}
        />
        <ConfirmationModal
          isOpen={isSwitchAccount}
          onClose={() => setIsSwitchAccount(false)}
          onConfirm={handleSwitchAccount}
          title="Switching To Expert"
          description="Are you sure you want to switch account?"
        />
      </div>
    );
};

export default ProfilePage;
