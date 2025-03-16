import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess, logout } from "../Slice/authSlice";
import { userAPI, adminAPI } from "../../axiosConfig";
import {
  setInitialCategories,
  setInitialServices,
} from "../Slice/categoryServiceSlice";
const useAuthCheck = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  useEffect(() => {
   
    const fetchCurrentUser = async () => {
      try {
        // ✅ Fetch user info
        const response = await userAPI.get("/auth/me", { withCredentials: true });
        if (response.data.success) {
        
          dispatch(loginSuccess(response.data));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        console.error("Error in fetching user data:", error);
        dispatch(logout());
      } finally {
        setLoading(false); 
      }
    };

    fetchCurrentUser();
  }, [dispatch]);

  
  return loading
};

export default useAuthCheck;
