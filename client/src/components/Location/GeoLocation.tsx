import { useEffect, useState } from "react";
import opencage from "opencage-api-client";
import { addLocation } from "@/services/User/user.service";
import { fetchLocationFromCoordinates } from "../../Utils/locationUtils";
import { MdLocationOn } from "react-icons/md";

const API_KEY = "173c9408b3a6422b810bccbc0d6f9d5c"; // Replace with your real API key

const LocationFetcher = ({ user, updateUserLocation }: { user: any; updateUserLocation: (location: any) => void }) => {
  const [location, setLocation] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [manualLocation, setManualLocation] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  // Add a state for blinking effect
  const [isBlinking, setIsBlinking] = useState<boolean>(true);

  useEffect(() => {
    // Blinking effect for the "Add Location" button
    if (!user?.location?.lat && !user?.location?.lng) {
      const blinkInterval = setInterval(() => {
        setIsBlinking(prev => !prev);
      }, 800);
      
      return () => clearInterval(blinkInterval);
    }
  }, [user]);

  useEffect(() => {
    if (user?.location?.lat && user?.location?.lng) {
      setLoading(true)
      fetchLocationFromCoordinates(user.location.lat, user.location.lng).then((loc) => {
        setLocation(loc);
        setLatitude(user.location.lat);
        setLongitude(user.location.lng);
      });
    }
    setLoading(false)
  }, [user]);

  // Fetch GPS location
  const fetchCurrentLocation = async () => {
    setLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);

          try {
            const response = await opencage.geocode({
              key: API_KEY,
              q: `${latitude},${longitude}`,
            });

            if (response.results.length > 0) {
              const formattedAddress = response.results[0].formatted;
              setLocation(formattedAddress);
              saveLocation(formattedAddress, latitude, longitude);
            }
          } catch (error) {
            console.error("Geocoding error:", error);
            setLocation(null);
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Failed to fetch location. Please enter manually.");
          setLoading(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setLoading(false);
    }
  };

  // Handle manual location submission
  const handleManualLocationSubmit = async () => {
    if (!manualLocation.trim()) return;

    try {
      const response = await opencage.geocode({
        key: API_KEY,
        q: manualLocation,
      });

      if (response.results.length > 0) {
        const result = response.results[0];
        setLocation(result.formatted);
        setLatitude(result.geometry.lat);
        setLongitude(result.geometry.lng);
        saveLocation(result.formatted, result.geometry.lat, result.geometry.lng);
      } else {
        alert("Location not found. Try again.");
      }
    } catch (error) {
      console.error("Manual geocoding error:", error);
      alert("Failed to fetch location.");
    }
  };

  // Save location to backend
  const saveLocation = async (newLocation: string, lat: number, lng: number) => {
    try {
      await addLocation(newLocation, lat, lng);
      updateUserLocation({ location: newLocation, latitude: lat, longitude: lng });
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving location:", error);
      alert("Failed to save location.");
    }
  };

  if (loading) {
    return <p className="font-semibold text-gray-500">Fetching location...</p>;
  }

  if (!location && !isEditing) {
    return (
      <button 
        className={`flex items-center gap-1 text-blue-500 hover:text-blue-700 font-semibold ${isBlinking ? 'animate-pulse' : ''}`} 
        onClick={() => setIsEditing(true)}
      >
        <MdLocationOn className="text-lg" />
        <span>Add Location</span>
      </button>
    );
  }

  if (isEditing) {
    return (
      <div className="mt-2 bg-white p-3 rounded-lg shadow-md border border-gray-300">
        <input
          type="text"
          placeholder="Enter location"
          className="border p-2 rounded w-full text-black"
          value={manualLocation}
          onChange={(e) => setManualLocation(e.target.value)}
        />
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleManualLocationSubmit}
            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition"
          >
            Save
          </button>
          <button
            onClick={fetchCurrentLocation}
            className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600 transition"
          >
            Use Current
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <p className="flex items-center gap-1 font-semibold text-gray-700">
        <MdLocationOn className="text-blue-500" />
        {location?.split(",").slice(0, 2).join(",")}
      </p>
    </div>
  );
};

export default LocationFetcher;