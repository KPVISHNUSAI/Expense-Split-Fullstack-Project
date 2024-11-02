// src/services/expenseService.js

import api from './api';

const expenseService = {
    createExpense: async (expenseData) => {
        const response = await api.post('/expenses', expenseData);
        return response.data;
    },

    getExpense: async (expenseId) => {
        const response = await api.get(`/expenses/${expenseId}`);
        return response.data;
    },

    updateExpense: async (expenseId, expenseData) => {
        const response = await api.put(`/expenses/${expenseId}`, expenseData);
        return response.data;
    },

    deleteExpense: async (expenseId) => {
        const response = await api.delete(`/expenses/${expenseId}`);
        return response.data;
    },

    getGroupExpenses: async (groupId) => {
        const response = await api.get(`/groups/${groupId}/expenses`);
        return response.data;
    },

    getUserExpenses: async () => {
        const response = await api.get('/expenses/user');
        return response.data;
    },

    calculateSplits: (amount, participants) => {
        const splitAmount = amount / participants.length;
        return participants.map(participant => ({
            user_id: participant,
            amount: parseFloat(splitAmount.toFixed(2))
        }));
    },

    getExpenseStats: async (groupId) => {
        const response = await api.get(`/groups/${groupId}/expenses/stats`);
        return response.data;
    },

    searchExpenses: async (query) => {
        const response = await api.get('/expenses/search', { params: { q: query } });
        return response.data;
    }
};

export default expenseService;