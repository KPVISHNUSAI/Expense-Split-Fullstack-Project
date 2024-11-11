// src/services/settlementService.js

import api from './api';

const settlementService = {
    // Create a new settlement
    createSettlement: async (settlementData) => {
        const response = await api.post('/settlements', settlementData);
        return response;
    },

    // Get a specific settlement
    getSettlement: async (settlementId) => {
        const response = await api.get(`/settlements/${settlementId}`);
        return response;
    },

    // Update settlement status
    updateSettlementStatus: async (settlementId, status) => {
        const response = await api.put(`/settlements/${settlementId}/status`, { status });
        return response;
    },

    // Get pending settlements
    getPendingSettlements: async () => {
        const response = await api.get('/settlements/pending');
        return response;
    },

    // Get settlements for a specific group
    getGroupSettlements: async (groupId) => {
        const response = await api.get(`/groups/${groupId}/settlements`);
        return response;
    }
};

export default settlementService;