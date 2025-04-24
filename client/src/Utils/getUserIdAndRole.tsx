import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
interface DecodedToken {
  role: "user" | "expert";
  userId?: string;
  expertId?: string;
}
export const getUserIdAndRole = () => {
  const token = Cookies.get("accessToken");
  if (!token) return null;

  const decoded = jwtDecode<DecodedToken>(token);

  return {
    id: decoded.role === "user" ? decoded.userId : decoded.expertId,
    role: decoded.role
  };
};
