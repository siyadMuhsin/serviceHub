import { adminAPI } from "config/axiosConfig";

export const getDashboardStats = async () => {
    
      const response = await adminAPI.get('/dashboard/stats');
      return response.data;
   
  };
  
  export const getLatestUsers = async () => {
   
      const response = await adminAPI.get('/users/latest');
      return response.data;
 
  };
  
  export const getLatestExperts = async () => {
  
      const response = await adminAPI.get('/experts/latest');
      return response.data;
    
  };
  