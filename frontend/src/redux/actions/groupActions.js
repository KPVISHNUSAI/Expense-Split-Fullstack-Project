// src/redux/actions/groupActions.js

import { createAsyncThunk } from '@reduxjs/toolkit';
import groupService from '../../services/groupService';
import { toast } from 'react-toastify';

export const createGroup = createAsyncThunk(
    'groups/create',
    async (groupData, { rejectWithValue }) => {
        try {
            const response = await groupService.createGroup(groupData);
            toast.success('Group created successfully');
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to create group');
            return rejectWithValue(error.response?.data?.error || 'Failed to create group');
        }
    }
);

export const getGroupDetails = createAsyncThunk(
    'groups/getDetails',
    async (groupId, { rejectWithValue }) => {
        try {
            const response = await groupService.getGroup(groupId);
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to fetch group details');
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch group details');
        }
    }
);

export const updateGroup = createAsyncThunk(
    'groups/update',
    async ({ groupId, groupData }, { rejectWithValue }) => {
        try {
            const response = await groupService.updateGroup(groupId, groupData);
            toast.success('Group updated successfully');
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to update group');
            return rejectWithValue(error.response?.data?.error || 'Failed to update group');
        }
    }
);

export const deleteGroup = createAsyncThunk(
    'groups/delete',
    async (groupId, { rejectWithValue }) => {
        try {
            await groupService.deleteGroup(groupId);
            toast.success('Group deleted successfully');
            return groupId;
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to delete group');
            return rejectWithValue(error.response?.data?.error || 'Failed to delete group');
        }
    }
);

export const getAllGroups = createAsyncThunk(
    'groups/getAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await groupService.getAllGroups();
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to fetch groups');
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch groups');
        }
    }
);

export const addGroupMember = createAsyncThunk(
    'groups/addMember',
    async ({ groupId, userId }, { rejectWithValue }) => {
        try {
            const response = await groupService.addMember(groupId, userId);
            toast.success('Member added successfully');
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to add member');
            return rejectWithValue(error.response?.data?.error || 'Failed to add member');
        }
    }
);

export const removeGroupMember = createAsyncThunk(
    'groups/removeMember',
    async ({ groupId, userId }, { rejectWithValue }) => {
        try {
            await groupService.removeMember(groupId, userId);
            toast.success('Member removed successfully');
            return { groupId, userId };
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to remove member');
            return rejectWithValue(error.response?.data?.error || 'Failed to remove member');
        }
    }
);