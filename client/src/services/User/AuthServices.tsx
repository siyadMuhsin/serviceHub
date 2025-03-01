// services/authService.ts
import axios from "axios";
import API from "../../../axiosConfig";

export const registerUser = async (formData: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  try {
    const response = await API.post(`/register`, formData);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "An error occurred during registration"
    );
  }
};

export const verifyOtp = async (otp: string, email: string) => {
  try {
    const response = await API.post(`/verify-otp`, { otp, email });
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
    const response = await API.post("/resent-otp", { email });
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
  console.log(email, password);
  try {
    const response = await API.post("/login", { email, password });
  
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const LogoutUser = async () => {
  try {
    const response = await API.post("/logout");
  
  } catch (err: any) {}
};


export const googleSignIn = async (googleData: any) => {
  try {
    console.log("Start Google Sign-In", googleData);

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
    const saveData=  await API.post('/google-signin',{data:response.data})
    return saveData.data;
    }
    
  } catch (err: any) {
    console.log(err);
    console.error("Google Sign-In Error:", err.response?.data || err.message);
  }
};


export const forgetPassword=async(email:string)=>{
    const response= await API.post('/forgot-password',{email})
    return response

}
export const resetPassword=async(token:string|undefined , newPassword:string)=>{
  const response= await API.post('/reset-password',{token,newPassword})
return response
}
