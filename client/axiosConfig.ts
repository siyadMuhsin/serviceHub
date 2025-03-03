import axios from "axios";
import {store} from './src/store'
import {logout} from './src/Slice/authSlice'
import { adminLogout } from "./src/Slice/adminAuthSlice";

// Create an Axios instance with a base URL and default headers
const userAPI  = axios.create({
  baseURL: "http://localhost:3000/", // Replace with your backend API URL
  withCredentials:true,
  headers: {
    "Content-Type": "application/json",
  },
});

userAPI.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        console.log("Refreshing token...");
       const response= await userAPI.post("refresh");
       if(!response.data.success){
        store.dispatch(logout())
        return
       }
        return userAPI.request(error.config); // Retry the failed request
      } catch (refreshError) {
        console.error("Session expired, logging out...");
        store.dispatch(logout())
      }
    }
    return Promise.reject(error);
  }
);


const adminAPI = axios.create({
  baseURL: "http://localhost:3000/admin/",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});
adminAPI.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        console.log("Refreshing token...");
       const response= await adminAPI.post("refresh");
       if(!response.data.success){
        store.dispatch(adminLogout())
        return
       }
        return adminAPI.request(error.config); // Retry the failed request
      } catch (refreshError) {
        console.error("Session expired, logging out...");
        store.dispatch(logout())
      }
    }
    return Promise.reject(error);
  }
);




export default userAPI;