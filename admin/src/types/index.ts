export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'moderator' | 'support';
  createdAt: string;
}

export interface ServiceProvider {
  id: string;
  name: string;
  email: string;
  phone: string;
  services: string[];
  verificationStatus: 'pending' | 'verified' | 'rejected';
  rating: number;
  totalBookings: number;
}

export interface Booking {
  id: string;
  customerId: string;
  providerId: string;
  serviceId: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  scheduledDate: string;
  amount: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
}

export interface DashboardStats {
  totalUsers: number;
  totalProviders: number;
  totalBookings: number;
  totalRevenue: number;
  recentBookings: Booking[];
  pendingVerifications: number;
}