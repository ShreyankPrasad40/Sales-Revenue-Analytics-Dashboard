import { configureStore } from '@reduxjs/toolkit';
import salesReducer from './salesSlice';

export const store = configureStore({
    reducer: {
        sales: salesReducer,
    },
});
