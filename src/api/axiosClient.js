import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";
const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ✅ Automatically attach Authorization header if a token exists
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
