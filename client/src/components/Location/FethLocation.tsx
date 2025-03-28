import opencage from "opencage-api-client";

const API_KEY = '173c9408b3a6422b810bccbc0d6f9d5c'; // Replace with your API Key

export const fetchLocationFromCoordinates = async (lat: number, lng: number) => {
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
