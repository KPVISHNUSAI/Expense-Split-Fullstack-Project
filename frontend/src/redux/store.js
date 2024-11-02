// src/redux/store.js

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import expenseReducer from './slices/expenseSlice';
import groupReducer from './slices/groupSlice';
import settlementReducer from './slices/settlementSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        expenses: expenseReducer,
        groups: groupReducer,
        settlements: settlementReducer
    }
});