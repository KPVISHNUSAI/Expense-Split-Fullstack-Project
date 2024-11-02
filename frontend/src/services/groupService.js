// src/services/groupService.js

import api from './api';

const groupService = {
    createGroup: async (groupData) => {
        const response = await api.post('/groups', groupData);
        return response.data;
    },

    getGroup: async (groupId) => {
        const response = await api.get(`/groups/${groupId}`);
        return response.data;
    },

    updateGroup: async (groupId, groupData) => {
        const response = await api.put(`/groups/${groupId}`, groupData);
        return response.data;
    },

    deleteGroup: async (groupId) => {
        const response = await api.delete(`/groups/${groupId}`);
        return response.data;
    },

    getAllGroups: async () => {
        const response = await api.get('/groups');
        return response.data;
    },

    addMember: async (groupId, userId) => {
        const response = await api.post(`/groups/${groupId}/users`, { user_id: userId });
        return response.data;
    },

    removeMember: async (groupId, userId) => {
        const response = await api.delete(`/groups/${groupId}/users/${userId}`);
        return response.data;
    },

    getGroupMembers: async (groupId) => {
        const response = await api.get(`/groups/${groupId}/users`);
        return response.data;
    },

    getGroupBalances: async (groupId) => {
        const response = await api.get(`/groups/${groupId}/balances`);
        return response.data;
    },

    generateSettlements: async (groupId) => {
        const response = await api.post(`/groups/${groupId}/settlements/generate`);
        return response.data;
    },

    getGroupActivity: async (groupId) => {
        const response = await api.get(`/groups/${groupId}/activity`);
        return response.data;
    },

    searchGroups: async (query) => {
        const response = await api.get('/groups/search', { params: { q: query } });
        return response.data;
    }
};

export default groupService;