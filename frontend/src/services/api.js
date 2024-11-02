// src/services/api.js

import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // Unauthorized - clear local storage and redirect to login
                    localStorage.clear();
                    window.location.href = '/login';
                    break;
                case 403:
                    toast.error('You do not have permission to perform this action');
                    break;
                case 404:
                    toast.error('Resource not found');
                    break;
                case 422:
                    // Validation errors
                    if (error.response.data.errors) {
                        Object.values(error.response.data.errors).forEach(err => 
                            toast.error(err.join(', '))
                        );
                    }
                    break;
                case 500:
                    toast.error('Internal server error. Please try again later.');
                    break;
                default:
                    toast.error(error.response.data.message || 'Something went wrong');
            }
        } else if (error.request) {
            toast.error('Network error. Please check your connection.');
        } else {
            toast.error('An error occurred. Please try again.');
        }
        return Promise.reject(error);
    }
);

export default api;