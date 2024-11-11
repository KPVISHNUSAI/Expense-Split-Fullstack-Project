// src/redux/actions/settlementActions.js

import { createAsyncThunk } from '@reduxjs/toolkit';
import settlementService from '../../services/settlementService';
import { toast } from 'react-toastify';

export const createSettlement = createAsyncThunk(
    'settlements/create',
    async (settlementData, { rejectWithValue }) => {
        try {
            const response = await settlementService.createSettlement(settlementData);
            toast.success('Settlement created successfully');
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to create settlement');
            return rejectWithValue(error.response?.data?.error || 'Failed to create settlement');
        }
    }
);

export const getSettlementDetails = createAsyncThunk(
    'settlements/getDetails',
    async (settlementId, { rejectWithValue }) => {
        try {
            const response = await settlementService.getSettlement(settlementId);
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to fetch settlement details');
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch settlement details');
        }
    }
);

export const updateSettlementStatus = createAsyncThunk(
    'settlements/updateStatus',
    async ({ settlementId, status }, { rejectWithValue }) => {
        try {
            const response = await settlementService.updateSettlementStatus(settlementId, status);
            toast.success('Settlement status updated successfully');
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to update settlement status');
            return rejectWithValue(error.response?.data?.error || 'Failed to update settlement status');
        }
    }
);

export const getPendingSettlements = createAsyncThunk(
    'settlements/getPending',
    async (_, { rejectWithValue }) => {
        try {
            const response = await settlementService.getPendingSettlements();
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to fetch pending settlements');
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch pending settlements');
        }
    }
);

export const getGroupSettlements = createAsyncThunk(
    'settlements/getGroupSettlements',
    async (groupId, { rejectWithValue }) => {
        try {
            const response = await settlementService.getGroupSettlements(groupId);
            return {
                groupId,
                settlements: response.data
            };
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to fetch group settlements');
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch group settlements');
        }
    }
);