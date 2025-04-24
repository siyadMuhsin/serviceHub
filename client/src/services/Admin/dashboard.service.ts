import { adminAPI } from "config/axiosConfig";

export const getDashboardStats = async () => {
    try {
      const response = await adminAPI.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  export const getLatestUsers = async () => {
    try {
      const response = await adminAPI.get('/users/latest');
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  export const getLatestExperts = async () => {
    try {
      const response = await adminAPI.get('/experts/latest');
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  