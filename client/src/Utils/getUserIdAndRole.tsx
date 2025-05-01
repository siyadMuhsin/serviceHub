import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
interface DecodedToken {
  role: "user" | "expert";
  userId?: string;
  expertId?: string;
}
export const getUserIdAndRole = () => {
  const token = Cookies.get("accessToken");
  console.log("accessToken frontend",token);
  
  if (!token) return null;

  const decoded = jwtDecode<DecodedToken>(token);
console.log("token decode",decoded);

  return {
    id: decoded.role === "user" ? decoded.userId : decoded.expertId,
    role: decoded.role
  };
};
