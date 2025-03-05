import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess, logout } from "../Slice/authSlice";
import {userAPI} from "../../axiosConfig";

const useAuthCheck = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await userAPI.get("/me", { withCredentials: true });

        if (response.data.success) {
          
          dispatch(loginSuccess(response.data));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        console.log(error);
        dispatch(logout());
      } finally {
        setLoading(false); 
      }
    };

    fetchCurrentUser();
  }, [dispatch]);

  return loading; 
};

export default useAuthCheck;
