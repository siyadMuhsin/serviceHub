import axios from "axios";

// Create an Axios instance with a base URL and default headers
const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/", // Replace with your backend API URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor (optional)
// axiosInstance.interceptors.request.use(
//   (config) => {
//     // You can modify the request config here (e.g., add authentication tokens)
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// Add response interceptor (optional)
// axiosInstance.interceptors.response.use(
//   (response) => {
//     // Handle successful responses
//     return response;
//   },
//   (error) => {
//     // Handle errors globally
//     if (error.response) {
//       // The request was made, but the server responded with an error status
//       console.error("Response Error:", error.response.data);
//     } else if (error.request) {
//       // The request was made, but no response was received
//       console.error("Request Error:", error.request);
//     } else {
//       // Something happened in setting up the request
//       console.error("Error:", error.message);
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;