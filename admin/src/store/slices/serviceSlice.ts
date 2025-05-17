//src/store/slices/serviceSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Service } from '../../types';
import apiClient from '../../api/apiClient';

interface ServiceState {
  services: Service[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ServiceState = {
  services: [],
  isLoading: false,
  error: null,
};

// Fetch all services from the backend
export const fetchServices = createAsyncThunk('services/fetch', async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get('/services');
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch services');
  }
});

// Add a new service
export const addService = createAsyncThunk(
  'services/add',
  async (serviceData: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/services', serviceData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add service');
    }
  }
);

// Update an existing service
export const updateService = createAsyncThunk(
  'services/update',
  async (serviceData: Service, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/services/${serviceData.id}`, serviceData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update service');
    }
  }
);

// Delete a service
export const deleteService = createAsyncThunk(
  'services/delete',
  async (serviceId: number, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/services/${serviceId}`);
      return serviceId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete service');
    }
  }
);

const serviceSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.services = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(addService.fulfilled, (state, action) => {
        state.services.push(action.payload);
      })
      .addCase(updateService.fulfilled, (state, action) => {
        const index = state.services.findIndex((service) => service.id === action.payload.id);
        if (index !== -1) {
          state.services[index] = action.payload;
        }
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.services = state.services.filter((service) => service.id !== action.payload);
      });
  },
});

export default serviceSlice.reducer;