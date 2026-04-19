import axios from "axios";

const isLocal = window.location.hostname === 'localhost' || 
                 window.location.hostname === '127.0.0.1' || 
                 window.location.hostname.startsWith('192.168.') || 
                 window.location.hostname.startsWith('10.');

// Vercel lo localhost work avvadu. Replace with your deployed backend URL:
const PROD_API_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-backend-url.onrender.com/api';

const API_BASE_URL = isLocal
    ? `http://${window.location.hostname}:8000/api`
    : PROD_API_URL;

// 🌐 Create Axios instance
const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Attach token to every request
API.interceptors.request.use(
  (config) => {
    const user = JSON.parse(sessionStorage.getItem("user"));

    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 🚨 Handle response errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Example: Unauthorized
      if (error.response.status === 401) {
        console.error("Unauthorized! Please login again.");
        sessionStorage.removeItem("user");
        window.location.href = "/user-login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;