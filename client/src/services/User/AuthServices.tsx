// services/authService.ts
import axios from "axios";
import {userAPI} from "../../../config/axiosConfig";
import { ConnectingAirportsOutlined } from "@mui/icons-material";

export const registerUser = async (formData: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  try {
    const response = await userAPI.post(`/auth/register`, formData);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "An error occurred during registration"
    );
  }
};

export const verifyOtp = async (otp: string, email: string) => {
  try {
    const response = await userAPI.post(`/auth/verify-otp`, { otp, email });
    return response.data;
  } catch (error: any) {
    console.log(error);
    throw new Error(
      error.response?.data?.message ||
        "An error occurred during OTP verification"
    );
  }
};
export const resendOtp = async (email: string) => {
  try {
    const response = await userAPI.post("/auth/resent-otp", { email });
    return response.data;
  } catch (error: any) {
    console.log(error);
    throw new Error(
      error.response?.data?.message ||
        "An error occurred during OTP verification"
    );
  }
};
export const loginUser = async (email: string, password: string) => {
 
  try {
    const response = await userAPI.post("/auth/login", { email, password });
  console.log(response)
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
};
export const LogoutUser = async () => {
  try {
    const response = await userAPI.post("/auth/logout");
    return response.data
  
  } catch (err: any) {
    return {message:err.response.data}
  }
};


export const googleSignIn = async (googleData: any) => {
  try {
    // Make the API request
    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${googleData.access_token}`,
      {
        headers: {
          Authorization: `Bearer ${googleData.access_token}`,
          Accept: "application/json",
        },
      }
    );
    if(response.status===200){
    const saveData=  await userAPI.post('/auth/google-signin',{data:response.data})
    return saveData.data;
    }
    
  } catch (err: any) {
   
    console.log(err);
    console.error("Google Sign-In Error:", err.response?.data || err.message);
    return err.response.data;
  }
};


export const forgetPassword=async(email:string)=>{
  try {
    const response= await userAPI.post('/auth/forgot-password',{email})
    return response
  } catch (error) {
    return error.response
    
  }
  

}
export const resetPassword=async(token:string|undefined , newPassword:string)=>{
  try {
    const response= await userAPI.post('/auth/reset-password',{token,newPassword})
    return response
  } catch (error) {
   console.log(error)
   throw new Error (error.response.data.message)
  }

}

export const get_userData=async()=>{
  try {
    const response= await userAPI.get('/auth/me')
    return response.data
  } catch (error) {
    return {success:false,error:error.response.data}
    
  }
}