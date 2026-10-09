import axios from "axios";

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  // baseURL: import.meta.env.VITE_API_URL || "https://api.omnigoapp.com/api",
  timeout: 15000,
});
// baseURL: import.meta.env.VITE_API_URL || "https://omnigo-app-backend-production.up.railway.app/api",

console.log(import.meta.env.VITE_API_URL);


axiosClient.interceptors.request.use((config) => {
  // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhN2I1NzRlNWNmNGM1YTZiYmExYTk4MiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc5MDkzNjQxNiwiZXhwIjoxNzkxNTQxMjE2fQ.li9RZxlJIOlXkFihpOhyu72djTcegGkAxS7x3dXzAEQ";
 const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized request");
    }
    return Promise.reject(error);
  }
);

// 2. Response Interceptor: Token Expire Check (401 Error Handling)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expire ho gaya ya invalid hai -> Clear LocalStorage & Redirect
      localStorage.removeItem("adminToken");
      // localStorage.removeItem("adminData");
      
      // if (typeof window !== "undefined") {
      //   window.location.href = "/login";
      // }
    }
    return Promise.reject(error);
  }
);
