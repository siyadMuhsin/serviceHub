import React, { useEffect, useState } from "react";
import { MdLocationOn, MdEdit } from "react-icons/md";
import opencage from "opencage-api-client";
import { toast } from "react-toastify";

const API_KEY = "173c9408b3a6422b810bccbc0d6f9d5c"; // Replace with your actual API key

const LocationFetcher = ({ user, updateUserLocation }) => {
  const [location, setLocation] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [locationInput, setLocationInput] = useState("");

  // Fetch location details when component mounts or user changes
  useEffect(() => {
    if (user?.location?.lat && user?.location?.lng) {
      fetchLocationDetails(user.location.lat, user.location.lng);
    }
  }, [user]);

  // Fetch location details from coordinates
  const fetchLocationDetails = async (lat, lng) => {
    try {
      const response = await opencage.geocode({
        key: API_KEY,
        q: `${lat},${lng}`
      });

      if (response.results.length > 0) {
        const cityOrTown = response.results[0].components.city || 
                           response.results[0].components.town || 
                           response.results[0].components.village || 
                           "Unknown Location";
        setLocation(cityOrTown);
      }
    } catch (error) {
      toast.error("Failed to fetch location details");
    }
  };

  // Manually search for location
  const handleLocationSearch = async () => {
    if (!locationInput.trim()) return;

    try {
      const response = await opencage.geocode({
        key: API_KEY,
        q: locationInput
      });

      if (response.results.length > 0) {
        const result = response.results[0];
        const cityOrTown = result.components.city || 
                           result.components.town || 
                           result.components.village || 
                           "Unknown Location";
        
        // Update location in backend and local state
        updateUserLocation({
          location: cityOrTown,
          latitude: result.geometry.lat,
          longitude: result.geometry.lng
        });

        setLocation(cityOrTown);
        setIsEditing(false);
        toast.success("Location updated successfully");
      } else {
        toast.error("Location not found");
      }
    } catch (error) {
      toast.error("Failed to search location");
    }
  };

  // Get current GPS location
  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            const response = await opencage.geocode({
              key: API_KEY,
              q: `${latitude},${longitude}`
            });

            if (response.results.length > 0) {
              const cityOrTown = response.results[0].components.city || 
                                 response.results[0].components.town || 
                                 response.results[0].components.village || 
                                 "Unknown Location";
              
              updateUserLocation({
                location: cityOrTown,
                latitude,
                longitude
              });

              setLocation(cityOrTown);
              setIsEditing(false);
              toast.success("Location updated successfully");
            }
          } catch (error) {
            toast.error("Failed to fetch location details");
          }
        },
        (error) => {
          toast.error("Unable to retrieve your location");
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };

  // Location display when not editing
  if (!isEditing) {
    return location ? (
      <div 
        className="flex items-center gap-2 text-gray-700 cursor-pointer hover:text-blue-600"
        onClick={() => setIsEditing(true)}
      >
        <MdLocationOn className="text-blue-500 text-xl" />
        <span className="text-sm font-medium">{location}</span>
        <MdEdit className="text-gray-500 text-sm" />
      </div>
    ) : (
      <button 
        className="text-blue-500 hover:underline flex items-center gap-1"
        onClick={() => setIsEditing(true)}
      >
        <MdLocationOn /> Add Location
      </button>
    );
  }

  // Location editing view
  return (
    <div className="flex flex-col gap-2 bg-white p-3 rounded-lg shadow-md">
      <input
        type="text"
        placeholder="Enter your location"
        value={locationInput}
        onChange={(e) => setLocationInput(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <div className="flex gap-2">
        <button 
          onClick={handleLocationSearch}
          className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
        >
          Save Location
        </button>
        <button 
          onClick={getCurrentLocation}
          className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
        >
          Use Current Location
        </button>
        <button 
          onClick={() => setIsEditing(false)}
          className="bg-gray-200 text-gray-700 px-3 py-2 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default LocationFetcher;