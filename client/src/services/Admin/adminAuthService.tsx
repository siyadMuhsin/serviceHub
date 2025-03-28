import {adminAPI} from '../../../config/axiosConfig'

export const adminLoginService = async (email: string, password: string) => {
    try {
      const response = await adminAPI.post("/login", { email, password });
      return response.data;
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Login failed" };
    }
  };
  
  export const adminLogoutService = async () => {
    try {
     const response= await adminAPI.post("/logout");
      return response.data;
    } catch (error) {
      return { success: false, message: "Logout failed" };
    }
  };
  export const adminAuthCheck=async()=>{
    try {
     const response= await adminAPI.get('/')
     console.log(response)
     return response.data
    } catch (error) {
      console.log(error)      
    }
  }