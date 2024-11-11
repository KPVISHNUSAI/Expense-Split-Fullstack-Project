// src/services/dashboardService.js

import api from './api';

const dashboardService = {
    // Get user profile data
    getUserProfile: async () => {
        const response = await api.get('/users/me');
        return response.data;
    },

    // Get user's groups
    getUserGroups: async () => {
        const response = await api.get('/groups');
        return response.data;
    },

    // Get expenses for a specific group
    getGroupExpenses: async (groupId) => {
        const response = await api.get(`/groups/${groupId}/expenses`);
        return response.data;
    },

    // Get settlements for a specific group
    getGroupSettlements: async (groupId) => {
        const response = await api.get(`/groups/${groupId}/settlements`);
        return response.data;
    },

    // Get pending settlements
    getPendingSettlements: async () => {
        const response = await api.get('/settlements/pending');
        return response.data;
    }
};

export default dashboardService;