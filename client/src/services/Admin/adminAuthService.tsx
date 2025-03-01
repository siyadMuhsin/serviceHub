import API from '../../../axiosConfig'

export const adminLoginService = async (email: string, password: string) => {
    try {
      const response = await API.post("/admin/login", { email, password });
      return response.data;
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Login failed" };
    }
  };
  
  export const adminLogout = async () => {
    try {
      await API.get("/admin/logout");
      return { success: true };
    } catch (error) {
      return { success: false, message: "Logout failed" };
    }
  };