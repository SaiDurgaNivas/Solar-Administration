import axios from 'axios';

// The URL of our Django Backend API dynamically matching the host address
const API_BASE_URL = `http://${window.location.hostname}:8000/api/`;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercept requests to attach session token if we had one
api.interceptors.request.use(
    config => {
        const token = sessionStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

export default api;
