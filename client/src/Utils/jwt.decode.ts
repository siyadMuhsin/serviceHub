import { jwtDecode } from "jwt-decode"; // Correct import
import Cookies from "js-cookie"; // To read cookies

export const getRoleFromToken = () => {
  try {
    const token = Cookies.get("accessToken"); // Get JWT token
    if (!token) return null;
    const decoded = jwtDecode<{ role: string }>(token); // Decode JWT token with TypeScript type
    console.log("Decoded Token:", decoded);
    return decoded?.role; // Assuming 'role' is inside the token payload
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
