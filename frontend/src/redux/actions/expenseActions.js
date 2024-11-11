// src/redux/actions/expenseActions.js

import { createAsyncThunk } from '@reduxjs/toolkit';
import expenseService from '../../services/expenseService';
import { toast } from 'react-toastify';

export const createExpense = createAsyncThunk(
    'expenses/create',
    async (expenseData, { rejectWithValue }) => {
        try {
            const response = await expenseService.createExpense(expenseData);
            toast.success('Expense created successfully');
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to create expense');
            return rejectWithValue(error.response?.data?.error || 'Failed to create expense');
        }
    }
);

export const getExpenseDetails = createAsyncThunk(
    'expenses/getDetails',
    async (expenseId, { rejectWithValue }) => {
        try {
            const response = await expenseService.getExpense(expenseId);
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to fetch expense details');
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch expense details');
        }
    }
);

export const updateExpense = createAsyncThunk(
    'expenses/update',
    async ({ expenseId, expenseData }, { rejectWithValue }) => {
        try {
            const response = await expenseService.updateExpense(expenseId, expenseData);
            toast.success('Expense updated successfully');
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to update expense');
            return rejectWithValue(error.response?.data?.error || 'Failed to update expense');
        }
    }
);

export const deleteExpense = createAsyncThunk(
    'expenses/delete',
    async (expenseId, { rejectWithValue }) => {
        try {
            await expenseService.deleteExpense(expenseId);
            toast.success('Expense deleted successfully');
            return expenseId;
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to delete expense');
            return rejectWithValue(error.response?.data?.error || 'Failed to delete expense');
        }
    }
);

export const getGroupExpenses = createAsyncThunk(
    'expenses/getGroupExpenses',
    async (groupId, { rejectWithValue }) => {
        try {
            const response = await expenseService.getGroupExpenses(groupId);
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to fetch group expenses');
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch group expenses');
        }
    }
);