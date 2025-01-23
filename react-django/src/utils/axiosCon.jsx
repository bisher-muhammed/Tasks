import axios from "axios";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

const API_URL = "http://localhost:8000/api/accounts/";

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Function to check if the token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const { exp } = jwtDecode(token);
    return Date.now() >= exp * 1000;
  } catch (error) {
    return true;
  }
};

// Refresh token logic
const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await axios.post(`${API_URL}token/refresh/`, {
      refresh: refreshToken,
    });

    const newAccessToken = response.data.access;
    localStorage.setItem("token", newAccessToken);
    console.log("New access token from refresh:", newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error("Failed to refresh access token", error);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
    return null;
  }
};

// Request interceptor to check token expiration and refresh if needed
axiosInstance.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem("token");
    console.log("Token retrieved from localStorage:", token);  // Log token from localStorage

    if (!config.url.includes("login/") && !config.url.includes("register/")) {
      if (isTokenExpired(token)) {
        console.log("Token expired, refreshing...");  // Log if token is expired
        token = await refreshAccessToken();
      }
    }

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      console.log("Authorization header set:", config.headers);  // Log headers to confirm token is included
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (!error.config.url.includes("token/")) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    if (error.response.data) {
      console.log("error.response.data:", error.response.data);
      const message = error.response.data.title
        ? error.response.data.title[0]
        : "An error occurred.";
      toast.error(`Error: ${message}`);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
