import api from './api';

const authService = {
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        console.log("Response from login:", response);  // Log the entire response to inspect its structure
        const { token, user } = response.data;
    
        if (token) {
            localStorage.setItem('token', token);
        }
    
        return { token, user };
    },
    
    

    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        const { token, user } = response.data;
        
        if (token) {
            localStorage.setItem('token', token);
        }
        
        return { token, user };
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
