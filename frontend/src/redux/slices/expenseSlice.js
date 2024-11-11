// src/redux/slices/expenseSlice.js

import { createSlice } from '@reduxjs/toolkit';
import {
    createExpense,
    getExpenseDetails,
    updateExpense,
    deleteExpense,
    getGroupExpenses
} from '../actions/expenseActions';

const initialState = {
    expenses: [],
    currentExpense: null,
    loading: false,
    error: null
};

const expenseSlice = createSlice({
    name: 'expenses',
    initialState,
    reducers: {
        clearCurrentExpense: (state) => {
            state.currentExpense = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Create Expense
            .addCase(createExpense.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createExpense.fulfilled, (state, action) => {
                state.loading = false;
                state.expenses.push(action.payload);
            })
            .addCase(createExpense.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get Expense Details
            .addCase(getExpenseDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getExpenseDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.currentExpense = action.payload;
            })
            .addCase(getExpenseDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update Expense
            .addCase(updateExpense.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateExpense.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.expenses.findIndex(exp => exp.id === action.payload.id);
                if (index !== -1) {
                    state.expenses[index] = action.payload;
                }
                if (state.currentExpense?.id === action.payload.id) {
                    state.currentExpense = action.payload;
                }
            })
            .addCase(updateExpense.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete Expense
            .addCase(deleteExpense.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteExpense.fulfilled, (state, action) => {
                state.loading = false;
                state.expenses = state.expenses.filter(exp => exp.id !== action.payload);
                if (state.currentExpense?.id === action.payload) {
                    state.currentExpense = null;
                }
            })
            .addCase(deleteExpense.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get Group Expenses
            .addCase(getGroupExpenses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getGroupExpenses.fulfilled, (state, action) => {
                state.loading = false;
                state.expenses = action.payload;
            })
            .addCase(getGroupExpenses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearCurrentExpense, clearError } = expenseSlice.actions;
export default expenseSlice.reducer;