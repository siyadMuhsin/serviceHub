import opencage from "opencage-api-client";
import { addLocation } from "@/services/User/user.service";

const API_KEY = '173c9408b3a6422b810bccbc0d6f9d5c'; // Replace with your API Key

// Fetch location name from latitude and longitude
export const fetchLocationFromCoordinates = async (lat: number, lng: number): Promise<string | null> => {
  try {
    const response = await opencage.geocode({
      key: API_KEY,
      q: `${lat},${lng}`,
    });

    if (response.results.length > 0) {
      return response.results[0].formatted;
    }
  } catch (error) {
    console.error("Error fetching location from coordinates:", error);
  }

  return null;
};

// Get user's current GPS location
export const fetchCurrentLocation = (): Promise<{ lat: number; lng: number } | null> => {
  return new Promise((resolve, reject) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Geolocation error:", error);
          reject(null);
        }
      );
    } else {
      reject(null);
    }
  });
};

// Save location to backend
export const saveLocation = async (location: string, lat: number, lng: number) => {
  try {
    await addLocation(location, lat, lng);
    console.log("Location saved successfully:", location);
  } catch (error) {
    console.error("Error saving location:", error);
  }
};
