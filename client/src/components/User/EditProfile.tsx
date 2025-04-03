import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Save, Edit3, MapPin } from "lucide-react";
import { MdLocationOn } from "react-icons/md";
import opencage from "opencage-api-client";
import { uploadProfileImage } from "@/services/User/profile.service";

interface LocationData {
  lat: number;
  lng: number;
  address?: string;
}

interface UserProfile {
  profile_image?: string;
  name?: string;
  email?: string;
  phone?: string;
  location?: LocationData;
}

interface EditProfileProps {
  user: UserProfile;
  locationData?: string;
  onCancel: () => void;
  onUpdateProfile: (updatedProfile: Omit<UserProfile, 'profile_image'> & { location: Omit<LocationData, 'address'> }) => Promise<void>;
  onUploadImage: (file: File) => Promise<string>;
}
const API_KEY='173c9408b3a6422b810bccbc0d6f9d5c'
const EditProfile: React.FC<EditProfileProps> = ({
  user,
  onCancel,
  locationData,
  onUpdateProfile,
  onUploadImage,
}) => {
  const [editedProfile, setEditedProfile] = useState<UserProfile>({
    profile_image: user.profile_image || "",
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    location: user.location || { lat: 0, lng: 0, address: "" },
  });

  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [newLocation, setNewLocation] = useState("");
  const [loading, setLoading] = useState({
    location: false,
    image: false,
    profile: false,
  });

  useEffect(() => {
    setEditedProfile((prev) => ({
      ...prev,
      location: {
        address: locationData || user.location?.address || "",
        lat: user.location?.lat || 0,
        lng: user.location?.lng || 0,
      },
    }));
  }, [locationData, user.location]);

  const fetchLocationCoordinates = async () => {
    if (!newLocation.trim()) return;

    try {
      const response = await opencage.geocode({ 
        key: API_KEY, 
        q: newLocation 
      });

      if (response.results.length > 0) {
        const result = response.results[0];
        setEditedProfile((prev) => ({
          ...prev,
          location: {
            address: result.formatted,
            lat: result.geometry.lat,
            lng: result.geometry.lng,
          },
        }));
        setIsEditingLocation(false);
      } else {
        alert("Location not found. Try again.");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      alert("Failed to fetch location.");
    }
  };

  const fetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(prev => ({ ...prev, location: true }));
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await opencage.geocode({
            key: API_KEY,
            q: `${latitude},${longitude}`,
          });

          if (response.results.length > 0) {
            const formattedAddress = response.results[0].formatted;
            setEditedProfile((prev) => ({
              ...prev,
              location: {
                address: formattedAddress,
                lat: latitude,
                lng: longitude,
              },
            }));
          }
        } catch (error) {
          console.error("Geocoding error:", error);
          alert("Failed to fetch location.");
        } finally {
          setLoading(prev => ({ ...prev, location: false }));
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Failed to fetch current location.");
        setLoading(prev => ({ ...prev, location: false }));
      }
    );
  };


 

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      alert("File size exceeds 2MB limit");
      return;
    }

    try {
      setLoading(prev => ({ ...prev, image: true }));
      const formData = new FormData();
    formData.append('image', file);
    
    //   const imageUrl = await onUploadImage(file);
    
      const response = await uploadProfileImage(formData) ;
      setEditedProfile(prev => ({
        ...prev,
        profile_image: response.imageUrl
      }));
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Failed to upload image");
    } finally {
      setLoading(prev => ({ ...prev, image: false }));
    }
  };

  const handleProfileUpdate = async () => {
    try {
      setLoading(prev => ({ ...prev, profile: true }));
      
      // Prepare profile data without the image and location address
      const { profile_image, location, ...profileData } = editedProfile;
      const profileToUpdate = {
        ...profileData,
        location: {
          lat: location?.lat || 0,
          lng: location?.lng || 0,
        }
      };
      
      await onUpdateProfile(profileToUpdate);
    } catch (error) {
      console.error("Profile update failed:", error);
      alert("Failed to update profile");
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div>
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center">
              <Avatar className="h-20 w-20 mr-6">
                <AvatarImage
                  src={editedProfile.profile_image || "/default-avatar.png"}
                  alt="Profile"
                />
                <AvatarFallback>
                  {editedProfile.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <label
                  htmlFor="profileImageUpload"
                  className={`text-sm font-medium cursor-pointer text-primary ${
                    loading.image ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading.image ? 'Uploading...' : 'Change Photo'}
                </label>
                <input
                  id="profileImageUpload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={loading.image}
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onCancel} disabled={loading.profile}>
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
              <Button onClick={handleProfileUpdate} disabled={loading.profile}>
                {loading.profile ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Full Name</label>
              <Input
                value={editedProfile.name}
                onChange={(e) =>
                  setEditedProfile((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                disabled={loading.profile}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Email</label>
              <Input
                value={editedProfile.email}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Phone</label>
              <Input
                value={editedProfile.phone}
                onChange={(e) =>
                  setEditedProfile((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
                }
                type="tel"
                disabled={loading.profile}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Location</label>
              {isEditingLocation ? (
                <div className="flex flex-col gap-2">
                  <Input
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="Enter new location"
                    disabled={loading.location}
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={fetchLocationCoordinates}
                      disabled={loading.location}
                    >
                      {loading.location ? "Searching..." : "Save"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditingLocation(false)}
                      disabled={loading.location}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between border p-2 rounded">
                  <div className="flex items-center">
                    <MdLocationOn className="text-blue-500 mr-2" />
                    <span className="text-sm">
                      {editedProfile.location?.address || "No location set"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingLocation(true)}
                      disabled={loading.location || loading.profile}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={fetchCurrentLocation}
                      disabled={loading.location || loading.profile}
                    >
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EditProfile;