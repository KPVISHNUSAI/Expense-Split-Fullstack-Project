// src/redux/slices/dashboardSlice.js

import { createSlice } from '@reduxjs/toolkit';
import { 
    fetchDashboardData, 
    fetchRecentActivity 
} from '../actions/dashboardActions';

const initialState = {
    profile: null,
    groups: [],
    pendingSettlements: [],
    stats: {
        totalGroups: 0,
        totalExpenses: 0,
        totalSettlements: 0
    },
    balances: {
        totalOwed: 0,
        totalOwe: 0,
        netBalance: 0
    },
    recentActivity: [],
    loading: false,
    activityLoading: false,
    error: null,
    lastUpdated: null
};

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        clearDashboard: (state) => {
            return initialState;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Dashboard Data
            .addCase(fetchDashboardData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDashboardData.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload.profile;
                state.groups = action.payload.groups;
                state.pendingSettlements = action.payload.pendingSettlements;
                state.stats = action.payload.stats;
                state.balances = action.payload.balances;
                state.lastUpdated = new Date().toISOString();
            })
            .addCase(fetchDashboardData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch Recent Activity
            .addCase(fetchRecentActivity.pending, (state) => {
                state.activityLoading = true;
            })
            .addCase(fetchRecentActivity.fulfilled, (state, action) => {
                state.activityLoading = false;
                state.recentActivity = action.payload;
            })
            .addCase(fetchRecentActivity.rejected, (state, action) => {
                state.activityLoading = false;
                state.error = action.payload;
            });
    }
});

// Selectors
export const selectDashboardData = (state) => ({
    profile: state.dashboard.profile,
    stats: state.dashboard.stats,
    balances: state.dashboard.balances
});

export const selectDashboardGroups = (state) => state.dashboard.groups;
export const selectPendingSettlements = (state) => state.dashboard.pendingSettlements;
export const selectRecentActivity = (state) => state.dashboard.recentActivity;
export const selectDashboardLoading = (state) => state.dashboard.loading;
export const selectActivityLoading = (state) => state.dashboard.activityLoading;
export const selectDashboardError = (state) => state.dashboard.error;
export const selectLastUpdated = (state) => state.dashboard.lastUpdated;

export const { clearDashboard, clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;