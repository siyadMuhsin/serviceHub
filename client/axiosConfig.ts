import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { store } from "./src/store";
import { logout } from "./src/Slice/authSlice";
import { adminLogout } from "./src/Slice/adminAuthSlice";

// Define the API response structure
interface ApiResponse {
  success: boolean;
  [key: string]: any;
}

// Create an Axios instance for user API
const userAPI: AxiosInstance = axios.create({
  baseURL: "http://localhost:3000/", // Replace with your backend API URL
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

userAPI.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      try {
        console.log("Refreshing token...");
        const response = await userAPI.post<ApiResponse>("refresh");
        if (!response.data.success) {
          store.dispatch(logout());
          return;
        }
        if(error.config){
          return userAPI.request(error.config);
        }
        
      } catch (refreshError) {
        console.error("Session expired, logging out...");
        store.dispatch(logout());
      }
    }
    return Promise.reject(error);
  }
);

// Create an Axios instance for admin API
const adminAPI: AxiosInstance = axios.create({
  baseURL: "http://localhost:3000/admin/",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

adminAPI.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      try {
        console.log("Refreshing token...");
        const response = await adminAPI.post<ApiResponse>("refresh");
        if (!response.data.success) {
          store.dispatch(adminLogout());
          return;
        }

        if (error.config) {
          return adminAPI.request(error.config); // Retry request only if config exists
        }
       
      } catch (refreshError) {
        console.error("Session expired, logging out...");
        store.dispatch(adminLogout());
      }
    }
    return Promise.reject(error);
  }
);

export { userAPI, adminAPI };

