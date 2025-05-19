import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import dashboardReducer from './slices/dashboardSlice';
import categoryReducer from './slices/categorySlice';
import serviceReducer from './slices/serviceSlice';
import providerReducer from './slices/providerSlice'
import userReducer from './slices/userSlice';
import bookingReducer from './slices/bookingSlice';
import { useDispatch } from 'react-redux';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    categories: categoryReducer,
    services: serviceReducer,
    providers: providerReducer,
    users: userReducer,
    bookings: bookingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        ignoredPaths: ['dashboard.stats.recentBookings']
      }
    })//Redux expects all state values to be serializable(i.e. string values), but you're storing Date objects in your state. // to ignore warnings
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// for a custom `useAppDispatch` hook for TypeScript compatibility
export const useAppDispatch = () => useDispatch<AppDispatch>();