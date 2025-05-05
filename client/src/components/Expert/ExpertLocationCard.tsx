import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setExpertLocation } from "@/Slice/locationSlice";
import opencage from "opencage-api-client";
import { fetchLocationFromCoordinates } from "@/Utils/locationUtils";
import { MdLocationOn } from "react-icons/md";
import { locationAdd } from "@/services/Expert/expert.profile.service";
import { toast } from "react-toastify";
import { RootState } from "@/store";

const API_KEY = "173c9408b3a6422b810bccbc0d6f9d5c";

const ExpertLocationCard = ({ expertData }) => {
  const dispatch = useDispatch();
const {expertLocation}=useSelector((state:RootState)=>state.location)
  const [isEditing, setIsEditing] = useState(false);
  const [location, setLocation] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [manualLocation, setManualLocation] = useState<string>("");

  useEffect(() => {
    if (expertLocation?.lat && expertLocation?.lng && expertLocation?.address) {
      // If location already exists in Redux
      setLatitude(expertLocation.lat);
      setLongitude(expertLocation.lng);
      setLocation(expertLocation.address);
    } else if (
      expertData?.location?.coordinates?.length === 2 &&
      expertData?.location?.coordinates[0] !== undefined &&
      expertData?.location?.coordinates[1] !== undefined
    ) {
      const lat = expertData.location.coordinates[1];
      const lng = expertData.location.coordinates[0];
      setLatitude(lat);
      setLongitude(lng);
      setLoading(true);
  
      fetchLocationFromCoordinates(lat, lng)
        .then((loc) => setLocation(loc))
        .catch((e) => console.error("Fetch location failed:", e))
        .finally(() => setLoading(false));
    }
  }, [expertData, expertLocation]);

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
              await saveLocation(formattedAddress, latitude, longitude);
            }
          } catch (error) {
            console.error("Geocoding error:", error);
            toast.error("Failed to fetch location.");
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast.error("Failed to fetch location.");
          setLoading(false);
        }
      );
    } else {
      toast.error("Geolocation not supported.");
      setLoading(false);
    }
  };

  const handleManualSubmit = async () => {
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
        await saveLocation(result.formatted, result.geometry.lat, result.geometry.lng);
      } else {
        toast.error("Location not found.");
      }
    } catch (error) {
      console.error("Manual geocode error:", error);
      toast.error("Error while fetching location.");
    }
  };

  const saveLocation = async (address: string, lat: number, lng: number) => {
    try {
      const response = await locationAdd({ lat, lng });
      if (response.success) {
        dispatch(setExpertLocation({ lat, lng, address }));
        setIsEditing(false);
        toast.success(response.message);
      } else{
        toast.error(response.message || "Failed to save location")
      }
    } catch (error) {
      console.error("Error saving location:", error);
      toast.error("Failed to save location.");
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-100 rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
      <div className="flex items-center mb-4">
        <MdLocationOn className="text-2xl text-blue-600 mr-2" />
        <h3 className="text-xl font-semibold text-gray-800">Location</h3>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-4">
          <svg className="animate-spin h-5 w-5 mr-3 text-blue-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-500">Fetching location...</p>
        </div>
      ) : isEditing ? (
        <div className="mt-4 bg-white p-4 rounded-lg shadow-md border border-gray-300">
          <input
            type="text"
            placeholder="Enter location"
            className="border p-3 rounded-md w-full text-gray-800 focus:ring-blue-500 focus:border-blue-500"
            value={manualLocation}
            onChange={(e) => setManualLocation(e.target.value)}
          />
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={handleManualSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300"
            >
              Save
            </button>
            <button
              onClick={fetchCurrentLocation}
              className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition duration-300"
            >
              Use Current
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : location ? (
        <div className="flex items-center justify-between mt-4">
          <p className="text-gray-700 flex items-center gap-2">
            <MdLocationOn className="text-blue-500" />
            {location.split(",").slice(0, 2).join(",")}
          </p>
          <button
            className="px-4 py-2 text-sm bg-yellow-100 text-yellow-800 rounded-full hover:bg-yellow-200 transition duration-200"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
        </div>
      ) : (
        <div className="mt-4 text-center">
          <p className="text-gray-500 mb-3">Location not available</p>
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300"
            onClick={() => setIsEditing(true)}
          >
            Add Location
          </button>
        </div>
      )}

      {/* Info box */}
      <div className="flex items-start bg-blue-50 text-blue-800 px-4 py-3 rounded-lg mt-6 text-sm gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Your profile is visible to users within a 25 km radius of your location.</span>
      </div>
    </div>
  );
};

export default ExpertLocationCard;