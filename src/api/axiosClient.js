import axios from "axios";

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  // baseURL: import.meta.env.VITE_API_URL || "https://api.omnigoapp.com/api",
  timeout: 15000,
});
// baseURL: import.meta.env.VITE_API_URL || "https://omnigo-app-backend-production.up.railway.app/api",

console.log(import.meta.env.VITE_API_URL);


axiosClient.interceptors.request.use((config) => {
  // const token = localStorage.getItem("auth_token");
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhN2I1NzRlNWNmNGM1YTZiYmExYTk4MiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc5MDI1MzQyOSwiZXhwIjoxNzkwODU4MjI5fQ.s3zOhI6oI49pxT087xncjhv2MNzWNfExFQzvOSAeFm0";
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
