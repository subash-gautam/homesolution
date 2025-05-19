export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'provider' | 'user';
  createdAt: string;
}

export interface Provider { 
  id: number;
  name: string;
  phone: string;
  email: string;
  password: string;
  ratePerHr: number;
  address: string;
  city: string;
  lat: number;
  lon: number;
  profile: string;
  bio: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  documentId: number;
  services: ProviderService[];
  message: Message[];
  bookings: Booking[];
  document: Document;
  isFirstTime: boolean;
}

export interface Document {
  id: number;
  providerId: number;
  name: string;
  comment: string;
  status: 'pending' | 'verified' | 'rejected';
  uploadedAt: Date;
  lastReview: Date;
  provider: Provider;
}

export interface Service {
  id: number;
  categoryId: number;
  name: string;
  description: string;
  minimumCharge: number; 
  avgRatePerHr: number;
  service_image: string;
  bookings: Booking[];
  providers: ProviderService[];
  category: Category;
}

export interface Category {
  id: number;
  name: string;
  image: string;
  services?: Service[];
}

export interface ProviderService {
  providerId: number;
  serviceId: number;
  provider: Provider;
  service: Service;
}

export interface Booking {
  id: number;
  userId: number;
  providerId: number;
  serviceId: number;
  scheduledDate: Date;
  bookedAt: Date;
  bookingStatus: 'pending' | 'confirmed' | 'completed' | 'rejected' | 'cancelled';
  paymentStatus: string;
  address: string;
  city: string;
  lat: number;
  lon: number;
  amount: number;
  rating: number;
  user: User;
  provider: Provider;
  service: Service;
}

export interface Message {
  id: number;
  userId: number;
  providerId: number;
  message: string;
  sender: 'user' | 'provider';
  SentAt: Date;
  user: User;
  provider: Provider;
}

export interface DashboardStats {
  totalUsers: number;
  totalProviders: number;
  totalBookings: number;
  totalRevenue: number;
  recentBookings: Booking[];
  pendingVerifications: number;
}