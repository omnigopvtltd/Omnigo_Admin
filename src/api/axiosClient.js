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
// baseURL: import.meta.env.VITE_API_URL || "https://omnigo-app-backend-production.up.railway.app/api",

console.log(import.meta.env.VITE_API_URL);


axiosClient.interceptors.request.use((config) => {
  // const token = localStorage.getItem("auth_token");
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhN2I1NzRlNWNmNGM1YTZiYmExYTk4MiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc4Njc5NDE1OCwiZXhwIjoxNzg3Mzk4OTU4fQ.TUXU5t6lStYtwnSKAzEEM7iCcbD6eTgYgAu8whuzyp4";
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
