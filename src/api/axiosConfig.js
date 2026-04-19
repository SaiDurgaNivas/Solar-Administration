import axios from 'axios';

const isLocal = window.location.hostname === 'localhost' || 
                 window.location.hostname === '127.0.0.1' || 
                 window.location.hostname.startsWith('192.168.') || 
                 window.location.hostname.startsWith('10.');

// Vercel lo localhost work avvadu. Replace with your deployed backend URL:
const PROD_API_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-backend-url.onrender.com/api/';

const API_BASE_URL = isLocal
    ? `http://${window.location.hostname}:8000/api/`
    : PROD_API_URL;


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
