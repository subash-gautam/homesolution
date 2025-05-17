import { ServiceProvider, Booking, DashboardStats } from '../types';

export const mockServiceProviders: ServiceProvider[] = [
  {
    id: '1',
    name: 'Ram Electrician',
    email: 'ram@provider.com',
    phone: '+977-9841234567',
    services: ['electrical-repair', 'wiring'],
    verificationStatus: 'verified',
    rating: 4.8,
    totalBookings: 156,
  },
  {
    id: '2',
    name: 'Hari Plumber',
    email: 'hari@provider.com',
    phone: '+977-9851234567',
    services: ['plumbing', 'pipe-fitting'],
    verificationStatus: 'verified',
    rating: 4.6,
    totalBookings: 98,
  },
  {
    id: '3',
    name: 'Sita Cleaner',
    email: 'sita@provider.com',
    phone: '+977-9861234567',
    services: ['house-cleaning', 'deep-cleaning'],
    verificationStatus: 'pending',
    rating: 0,
    totalBookings: 0,
  },
];

export const mockBookings: Booking[] = [
  {
    id: 'B001',
    customerId: 'C1',
    providerId: '1',
    serviceId: 'S1',
    status: 'completed',
    scheduledDate: '2024-03-10T10:00:00Z',
    amount: 2500,
    paymentStatus: 'paid',
  },
  {
    id: 'B002',
    customerId: 'C2',
    providerId: '2',
    serviceId: 'S2',
    status: 'in-progress',
    scheduledDate: '2024-03-11T14:30:00Z',
    amount: 3500,
    paymentStatus: 'paid',
  },
  {
    id: 'B003',
    customerId: 'C3',
    providerId: '1',
    serviceId: 'S1',
    status: 'pending',
    scheduledDate: '2024-03-12T09:00:00Z',
    amount: 2000,
    paymentStatus: 'pending',
  },
  {
    id: 'B004',
    customerId: 'C4',
    providerId: '2',
    serviceId: 'S2',
    status: 'confirmed',
    scheduledDate: '2024-03-13T11:00:00Z',
    amount: 4000,
    paymentStatus: 'pending',
  },
];

export const mockDashboardStats: DashboardStats = {
  totalUsers: 50,
  totalProviders:15,
  totalBookings: 30,
  totalRevenue: 18000,
  recentBookings: mockBookings,
  pendingVerifications: 12,
};