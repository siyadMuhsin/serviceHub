// services/authService.ts
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
    throw new Error(error.response?.data?.message || "An error occurred during registration");
  }
};

export const verifyOtp = async (otp: string,email:string) => {
  try {
    const response = await API.post(`/verify-otp`, { otp ,email});
    return response.data;
  } catch (error: any) {
    console.log(error)
    throw new Error(error.response?.data?.message || "An error occurred during OTP verification");
  }
};
export const resendOtp = async (email:string) => {
    try{
        const response= await API.post('/resent-otp',{email})
        return response.data
        
    }catch(error:any){
        console.log(error)
        throw new Error(error.response?.data?.message || "An error occurred during OTP verification");
    }
}