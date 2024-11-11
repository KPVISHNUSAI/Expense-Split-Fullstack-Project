// src/redux/slices/settlementSlice.js

import { createSlice } from '@reduxjs/toolkit';
import {
    createSettlement,
    getSettlementDetails,
    updateSettlementStatus,
    getPendingSettlements,
    getGroupSettlements
} from '../actions/settlementActions';

const initialState = {
    settlements: [],
    currentSettlement: null,
    pendingSettlements: [],
    groupSettlements: {}, // Indexed by groupId
    loading: false,
    error: null
};

const settlementSlice = createSlice({
    name: 'settlements',
    initialState,
    reducers: {
        clearCurrentSettlement: (state) => {
            state.currentSettlement = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Create Settlement
            .addCase(createSettlement.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createSettlement.fulfilled, (state, action) => {
                state.loading = false;
                state.settlements.push(action.payload);
                if (action.payload.status === 'PENDING') {
                    state.pendingSettlements.push(action.payload);
                }
                const groupId = action.payload.group_id;
                if (state.groupSettlements[groupId]) {
                    state.groupSettlements[groupId].push(action.payload);
                }
            })
            .addCase(createSettlement.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get Settlement Details
            .addCase(getSettlementDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSettlementDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.currentSettlement = action.payload;
            })
            .addCase(getSettlementDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update Settlement Status
            .addCase(updateSettlementStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateSettlementStatus.fulfilled, (state, action) => {
                state.loading = false;
                // Update in all relevant arrays
                const updateSettlement = (settlement) => {
                    if (settlement.id === action.payload.id) {
                        return action.payload;
                    }
                    return settlement;
                };

                state.settlements = state.settlements.map(updateSettlement);

                // Remove from pending if status changed from pending
                if (action.payload.status !== 'PENDING') {
                    state.pendingSettlements = state.pendingSettlements.filter(
                        s => s.id !== action.payload.id
                    );
                }

                // Update in group settlements
                const groupId = action.payload.group_id;
                if (state.groupSettlements[groupId]) {
                    state.groupSettlements[groupId] = state.groupSettlements[groupId].map(updateSettlement);
                }

                if (state.currentSettlement?.id === action.payload.id) {
                    state.currentSettlement = action.payload;
                }
            })
            .addCase(updateSettlementStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get Pending Settlements
            .addCase(getPendingSettlements.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPendingSettlements.fulfilled, (state, action) => {
                state.loading = false;
                state.pendingSettlements = action.payload;
            })
            .addCase(getPendingSettlements.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get Group Settlements
            .addCase(getGroupSettlements.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getGroupSettlements.fulfilled, (state, action) => {
                state.loading = false;
                state.groupSettlements[action.payload.groupId] = action.payload.settlements;
            })
            .addCase(getGroupSettlements.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearCurrentSettlement, clearError } = settlementSlice.actions;

// Selectors
export const selectAllSettlements = (state) => state.settlements.settlements;
export const selectPendingSettlements = (state) => state.settlements.pendingSettlements;
export const selectGroupSettlements = (groupId) => (state) => 
    state.settlements.groupSettlements[groupId] || [];
export const selectCurrentSettlement = (state) => state.settlements.currentSettlement;
export const selectSettlementLoading = (state) => state.settlements.loading;
export const selectSettlementError = (state) => state.settlements.error;

export default settlementSlice.reducer;