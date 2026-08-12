import axios from "axios";

/**
 * Central Axios instance.
 *
 * Point VITE_API_URL at the real backend when it's ready — every hook in
 * src/hooks already calls through the functions in src/api/*, so swapping
 * the mock implementations there for real `axiosClient` calls is the only
 * change needed to go live.
 */
export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 15000,
});

console.log(import.meta.env.VITE_API_URL);


axiosClient.interceptors.request.use((config) => {
  // const token = localStorage.getItem("auth_token");
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNTBmOTAzODNjYmY4M2JiYWMyYjVmMiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc4NjA4Nzc5MSwiZXhwIjoxNzg2NjkyNTkxfQ.9QWZoHICwnHE5XbMr4zlvEdTnVyVmLQd26rsv48ogoI";
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Placeholder for a real auth redirect once login exists.
      console.warn("Unauthorized request");
    }
    return Promise.reject(error);
  }
);
