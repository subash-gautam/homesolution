import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Booking } from '../../types';
import apiClient from '../../api/apiClient';
import { toast } from 'react-toastify';

interface BookingState {
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  bookings: [],
  isLoading: false,
  error: null,
};

export const fetchBookings = createAsyncThunk(
  'bookings/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await apiClient.get('/bookings').then((response) => response.data);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch bookings');
    }
  }
);

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.bookings = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
  },
});

export default bookingSlice.reducer;