import axios from 'axios';

const isLocal = window.location.hostname === 'localhost' || 
                 window.location.hostname === '127.0.0.1' || 
                 window.location.hostname.startsWith('192.168.') || 
                 window.location.hostname.startsWith('10.');

// Point directly to the Vercel backend using a relative route
const PROD_API_URL = import.meta.env.VITE_API_BASE_URL || '/api/';

// EXPO MODE: Hardcoded to Vercel production to ensure Customer and Agent stay in sync
const API_BASE_URL = 'https://solar-administration.vercel.app/api/';


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
