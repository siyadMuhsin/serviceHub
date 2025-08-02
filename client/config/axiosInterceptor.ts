import { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { store } from "../src/store";
import { AnyAction } from "@reduxjs/toolkit"
import { toast } from "react-toastify";

interface ApiResponse {
  success: boolean;
}

export const attachInterceptors = (
  api: AxiosInstance,
  refreshUrl: string,
  logoutAction: () => AnyAction
) => {
  api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      // Handle 401 Unauthorized
      if (error.response && error.response.status === 401) {
        try {
          console.log("Refreshing token...");
          const response = await api.post<ApiResponse>(refreshUrl);
          if (!response.data.success) {
            store.dispatch(logoutAction());
            return;
          }
          if (error.config) {
            return api.request(error.config);
          }
        } catch (refreshError) {
          console.error("Session expired, logging out...");
          store.dispatch(logoutAction());
        }
      }

      // Handle 429 Too Many Requests
      if (error.response && error.response.status === 429) {
        const retryAfter = error.response.headers["retry-after"];
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 15000;
        toast.warn(
          `Rate limit exceeded, retrying in ${waitTime / 1000} seconds...`
        );
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        if (error.config) {
          return api.request(error.config);
        }
      }

      return Promise.reject(error);
    }
  );
};
