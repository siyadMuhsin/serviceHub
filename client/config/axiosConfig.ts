import axios, { AxiosInstance } from "axios";

import {attachInterceptors} from './axiosInterceptor'
import { logout } from "../src/Slice/authSlice";
import { adminLogout } from "../src/Slice/adminAuthSlice";

export const baseUrl = import.meta.env.VITE_SERVER_API;

const userAPI: AxiosInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

const adminAPI: AxiosInstance = axios.create({
  baseURL: `${baseUrl}/admin/`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

const expertAPI: AxiosInstance = axios.create({
  baseURL: `${baseUrl}/expert/`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Attach the shared interceptor
attachInterceptors(userAPI, "/auth/refresh", logout);
attachInterceptors(adminAPI, "/refresh", adminLogout);
attachInterceptors(expertAPI, "/auth/refresh", logout);

export { userAPI, adminAPI, expertAPI };
