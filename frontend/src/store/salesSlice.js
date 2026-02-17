import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api/sales';


export const fetchStats = createAsyncThunk('sales/fetchStats', async (filters) => {
    const response = await axios.get(`${API_URL}/stats`, { params: filters });
    return response.data;
});

export const fetchTrends = createAsyncThunk('sales/fetchTrends', async ({ period, ...filters }) => {
    const response = await axios.get(`${API_URL}/trends`, { params: { period, ...filters } });
    return response.data;
});


export const fetchProductDistribution = createAsyncThunk('sales/fetchProductDistribution', async (filters = {}) => {
    const response = await axios.get(`${API_URL}/distribution`, { params: { type: 'product', ...filters } });
    return response.data;
});


export const fetchRegionDistribution = createAsyncThunk('sales/fetchRegionDistribution', async (filters = {}) => {
    const response = await axios.get(`${API_URL}/distribution`, { params: { type: 'region', ...filters } });
    return response.data;
});

export const uploadData = createAsyncThunk('sales/upload', async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    await axios.post(`${API_URL}/upload`, formData);
    return true;
});

const salesSlice = createSlice({
    name: 'sales',
    initialState: {
        stats: {},
        trends: [],
        productData: [],
        regionData: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder

            .addCase(fetchStats.pending, (state) => { state.loading = true; })
            .addCase(fetchStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload;
            })
            .addCase(fetchStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            .addCase(fetchTrends.fulfilled, (state, action) => {
                state.trends = action.payload;
            })

            .addCase(fetchProductDistribution.fulfilled, (state, action) => {
                state.productData = action.payload;
            })

            .addCase(fetchRegionDistribution.fulfilled, (state, action) => {
                state.regionData = action.payload;
            })

            .addCase(uploadData.pending, (state) => { state.loading = true; })
            .addCase(uploadData.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(uploadData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default salesSlice.reducer;
