// src/redux/actions/dashboardActions.js

import { createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';
import groupService from '../../services/groupService';
import expenseService from '../../services/expenseService';
import settlementService from '../../services/settlementService';
import { toast } from 'react-toastify';

export const fetchDashboardData = createAsyncThunk(
    'dashboard/fetchData',
    async (_, { rejectWithValue }) => {
        try {
            // Fetch user profile
            const userResponse = await authService.getCurrentUser();
            
            // Fetch user's groups
            const groupsResponse = await groupService.getAllGroups();
            const groups = groupsResponse.data;

            // Fetch data for each group
            const groupsData = await Promise.all(
                groups.map(async (group) => {
                    const [expenses, settlements] = await Promise.all([
                        expenseService.getGroupExpenses(group.id),
                        settlementService.getGroupSettlements(group.id)
                    ]);
                    return {
                        ...group,
                        expenses: expenses.data,
                        settlements: settlements.data
                    };
                })
            );

            // Fetch pending settlements
            const pendingSettlements = await settlementService.getPendingSettlements();

            // Calculate totals and balances
            let totalOwed = 0;
            let totalOwe = 0;
            let totalExpenses = 0;

            groupsData.forEach(group => {
                group.expenses.forEach(expense => {
                    totalExpenses += expense.amount;
                    if (expense.paid_by === userResponse.data.id) {
                        totalOwed += expense.amount;
                        expense.splits.forEach(split => {
                            if (split.user_id !== userResponse.data.id) {
                                totalOwed -= split.amount;
                            }
                        });
                    } else {
                        expense.splits.forEach(split => {
                            if (split.user_id === userResponse.data.id) {
                                totalOwe += split.amount;
                            }
                        });
                    }
                });
            });

            return {
                profile: userResponse.data,
                groups: groupsData,
                pendingSettlements: pendingSettlements.data,
                stats: {
                    totalGroups: groupsData.length,
                    totalExpenses: totalExpenses,
                    totalSettlements: groupsData.reduce(
                        (acc, group) => acc + group.settlements.length, 
                        0
                    )
                },
                balances: {
                    totalOwed,
                    totalOwe,
                    netBalance: totalOwed - totalOwe
                }
            };
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to fetch dashboard data');
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch dashboard data');
        }
    }
);

export const refreshDashboardData = createAsyncThunk(
    'dashboard/refreshData',
    async (_, { dispatch }) => {
        await dispatch(fetchDashboardData());
    }
);

export const fetchRecentActivity = createAsyncThunk(
    'dashboard/fetchRecentActivity',
    async (_, { rejectWithValue }) => {
        try {
            // Fetch recent expenses and settlements
            const [expenses, settlements] = await Promise.all([
                expenseService.getRecentExpenses(),
                settlementService.getRecentSettlements()
            ]);

            // Combine and sort by date
            const activities = [
                ...expenses.data.map(expense => ({
                    ...expense,
                    type: 'expense',
                    date: new Date(expense.created_at)
                })),
                ...settlements.data.map(settlement => ({
                    ...settlement,
                    type: 'settlement',
                    date: new Date(settlement.created_at)
                }))
            ].sort((a, b) => b.date - a.date);

            return activities.slice(0, 10); // Return only 10 most recent activities
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to fetch recent activity');
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch recent activity');
        }
    }
);