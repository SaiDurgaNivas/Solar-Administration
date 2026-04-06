import axios from "axios";

// 🌐 Create Axios instance
const API = axios.create({
  baseURL: "http://localhost:5000/api", // change to your backend URL
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