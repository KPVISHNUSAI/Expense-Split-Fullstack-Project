// src/redux/slices/groupSlice.js

import { createSlice } from '@reduxjs/toolkit';
import {
    createGroup,
    getGroupDetails,
    updateGroup,
    deleteGroup,
    getAllGroups,
    addGroupMember,
    removeGroupMember
} from '../actions/groupActions';

const initialState = {
    groups: [],
    currentGroup: null,
    loading: false,
    error: null
};

const groupSlice = createSlice({
    name: 'groups',
    initialState,
    reducers: {
        clearCurrentGroup: (state) => {
            state.currentGroup = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Create Group
            .addCase(createGroup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createGroup.fulfilled, (state, action) => {
                state.loading = false;
                state.groups.push(action.payload);
            })
            .addCase(createGroup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get Group Details
            .addCase(getGroupDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getGroupDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.currentGroup = action.payload;
            })
            .addCase(getGroupDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update Group
            .addCase(updateGroup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateGroup.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.groups.findIndex(group => group.id === action.payload.id);
                if (index !== -1) {
                    state.groups[index] = action.payload;
                }
                if (state.currentGroup?.id === action.payload.id) {
                    state.currentGroup = action.payload;
                }
            })
            .addCase(updateGroup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete Group
            .addCase(deleteGroup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteGroup.fulfilled, (state, action) => {
                state.loading = false;
                state.groups = state.groups.filter(group => group.id !== action.payload);
                if (state.currentGroup?.id === action.payload) {
                    state.currentGroup = null;
                }
            })
            .addCase(deleteGroup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get All Groups
            .addCase(getAllGroups.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllGroups.fulfilled, (state, action) => {
                state.loading = false;
                state.groups = action.payload;
            })
            .addCase(getAllGroups.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Add Group Member
            .addCase(addGroupMember.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addGroupMember.fulfilled, (state, action) => {
                state.loading = false;
                if (state.currentGroup?.id === action.payload.id) {
                    state.currentGroup = action.payload;
                }
                const index = state.groups.findIndex(group => group.id === action.payload.id);
                if (index !== -1) {
                    state.groups[index] = action.payload;
                }
            })
            .addCase(addGroupMember.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Remove Group Member
            .addCase(removeGroupMember.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeGroupMember.fulfilled, (state, action) => {
                state.loading = false;
                if (state.currentGroup?.id === action.payload.groupId) {
                    state.currentGroup.users = state.currentGroup.users.filter(
                        user => user.id !== action.payload.userId
                    );
                }
                const groupIndex = state.groups.findIndex(group => group.id === action.payload.groupId);
                if (groupIndex !== -1) {
                    state.groups[groupIndex].users = state.groups[groupIndex].users.filter(
                        user => user.id !== action.payload.userId
                    );
                }
            })
            .addCase(removeGroupMember.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearCurrentGroup, clearError } = groupSlice.actions;
export default groupSlice.reducer;