import { useEffect, useState } from "react";
import Cookie from 'js-cookie'

import { useDispatch } from "react-redux";
import { changeRole, loginSuccess, logout } from "../Slice/authSlice";
import { userAPI, adminAPI } from "../../axiosConfig";
import { getRoleFromToken } from "@/Utils/jwt.decode";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useAuthCheck = () => {
  const dispatch = useDispatch();
const navigate= useNavigate()
  const [loading, setLoading] = useState(true);
  useEffect(() => {
   
    const fetchCurrentUser = async () => {
      try {
        // ✅ Fetch user info
        const response = await userAPI.get("/auth/me", { withCredentials: true });
       
       
        if (response.data.success) {
          
         
            let role= getRoleFromToken()
            if(role==="expert"){
              dispatch(changeRole("expert"))
            }
          
          
          dispatch(loginSuccess(response.data));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        console.error("Error in fetching user data:", error);
        
        if(error.response.status==403){
         
         toast.error(error.response.data.message)
          return
        }else{
         
          dispatch(logout());
        }
       
      } finally {
        setLoading(false); 
      }
    };

    fetchCurrentUser();
  }, [dispatch]);

  
  return loading
};

export default useAuthCheck;
