// src/services/authService.js

import api from './api';

const authService = {
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.data.token) {
            localStorage.setItem('token', response.data.data.token);
        }
        return response.data;
    },

    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.data.token) {
            localStorage.setItem('token', response.data.data.token);
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
    },

    getCurrentUser: async () => {
        const response = await api.get('/users/me');
        return response.data;
    },

    updateProfile: async (userData) => {
        const response = await api.put('/users/me', userData);
        return response.data;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    getToken: () => {
        return localStorage.getItem('token');
    }
};

export default authService;