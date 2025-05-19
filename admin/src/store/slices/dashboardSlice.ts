import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { DashboardStats } from '../../types';
import { mockDashboardStats } from '../../mockData';
import apiClient from '../../api/apiClient';

interface DashboardState {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
}

export const fetchDashboardStats =  createAsyncThunk(
  'dashboard/fetchStats', async (_, { rejectWithValue }) => {
    try{
      const response = await apiClient.get('/admin/dashboard');
      return response.data;

    }catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch dashboard stats');
    }
  }
);

const initialState: DashboardState = {
  stats: mockDashboardStats,
  isLoading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setStats: (state, action: PayloadAction<DashboardStats>) => {
      state.stats = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.stats = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setStats, setLoading, setError } = dashboardSlice.actions;
export default dashboardSlice.reducer;