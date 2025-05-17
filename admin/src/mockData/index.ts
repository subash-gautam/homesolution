import { User, Provider,Document,ProviderService, Category, Service, Booking, Message, DashboardStats } from '../types';

export const mockAdmin: User = {
    id: "1",
    name: "Admin",
    email: "admin@gmail.com",
    role: "admin",
    createdAt: "2023-12-01T08:15:00Z"
  };

export const mockUser: User = {
    id: "2",
    name: "John Doe",
    email: "john@example.com",
    role: "user",
    createdAt: "2024-01-15T10:30:00Z"
  };

export const mockProviderUser: User = {
    id: "3",
    name: "Provider User",
    email: "provider@example.com",
    role: "provider",
    createdAt: "2024-02-10T14:20:00Z"
  };

  export const mockCategory: Category = {
    id: 1,
    name: "Home Cleaning",
    image: "/images/cleaning.jpg",
    services: []
  };

  export const mockService: Service = {
    id: 1,
    categoryId: 1,
    name: "Deep Cleaning",
    description: "Thorough cleaning of your entire home",
    minimumCharge: 1000,
    avgRatePerHr: 500,
    service_image: "/images/deep-cleaning.jpg",
    bookings: [],
    providers: [],
    category: mockCategory
  };
  
  export const mockDocument: Document = {
    id: 1,
    providerId: 3,
    name: "Business License",
    comment: "Verified license",
    status: "verified",
    uploadedAt: new Date('2024-01-20'),
    lastReview: new Date('2024-01-25'),
    provider: {} as Provider // Circular reference handled below
  };
  
  export const mockProvider: Provider = {
    id: 1,
    name: "CleanPro Services",
    phone: "+1234567890",
    email: "cleanpro@example.com",
    password: "hashedpassword123",
    ratePerHr: 600,
    address: "123 Main St",
    city: "Metropolis",
    lat: 34.0522,
    lon: -118.2437,
    profile: "/profiles/cleanpro.jpg",
    bio: "Professional cleaning services with 10 years experience",
    verificationStatus: "verified",
    documentId: 1,
    services: [],
    message: [],
    bookings: [],
    document: mockDocument,
    isFirstTime: false
  };
  
  // Update circular references
  mockDocument.provider = mockProvider;
  mockCategory.services = [mockService];
  
  export const mockProviderService: ProviderService = {
    providerId: 1,
    serviceId: 1,
    provider: mockProvider,
    service: mockService
  };
  
  // Update provider's services
  mockProvider.services = [mockProviderService];
  mockService.providers = [mockProviderService];
  

export const mockBookings: Booking[] = [
  {
      id: 1,
      userId: 1,
      providerId: 1,
      serviceId: 2,
      bookingStatus: 'completed',
      scheduledDate: new Date('2024-03-10T10:00:00Z'),
      amount: 2500,
      paymentStatus: 'paid',
      bookedAt: new Date(),
      address: '',
      city: '',
      lat: 0,
      lon: 0,
      rating: 0,
      user: {} as User, // Type assertion or provide actual User object
      provider: {} as Provider,
      service: {} as Service
  },
  {
    id: 1,
    userId: 1,
    providerId: 1,
    serviceId: 2,
    scheduledDate: new Date('2024-03-10T10:00:00'),
    bookedAt: new Date('2024-03-05T14:30:00'),
    bookingStatus: "completed",
    paymentStatus: "paid",
    address: "456 Oak Ave",
    city: "Metropolis",
    lat: 34.0622,
    lon: -118.2537,
    amount: 2500,
    rating: 4.5,
    user: mockUser,
    provider: mockProvider,
    service: mockService
  },
  {
    id: 3,
    userId: 3,
    providerId: 1,
    serviceId: 1,
    bookingStatus: 'pending',
    scheduledDate: new Date('2024-03-12T09:00:00Z'),
    amount: 2000,
    paymentStatus: 'pending',
    bookedAt: new Date(),
      address: '',
      city: '',
      lat: 0,
      lon: 0,
      rating: 0,
      user: {} as User, // Type assertion or provide actual User object
      provider: {} as Provider,
      service: {} as Service
  },
  {
    id: 4,
    userId: 4,
    providerId: 2,
    serviceId: 1,
    bookingStatus: 'confirmed',
    scheduledDate: new Date('2024-03-13T11:00:00Z'),
    amount: 4000,
    paymentStatus: 'pending',
    bookedAt: new Date(),
      address: '',
      city: '',
      lat: 0,
      lon: 0,
      rating: 0,
      user: {} as User, // Type assertion or provide actual User object
      provider: {} as Provider,
      service: {} as Service
  },
];

// Update provider's bookings
mockProvider.bookings = [mockBookings[0], mockBookings[1], mockBookings[2]];
mockService.bookings = [mockBookings[2], mockBookings[3]];  

export const mockMessage: Message = {
  id: 1,
  userId: 1,
  providerId: 1,
  message: "Hello, I'd like to book your service",
  sender: "user",
  SentAt: new Date('2024-03-04T09:15:00'),
  user: mockUser,
  provider: mockProvider
};

// Update provider's messages
mockProvider.message = [mockMessage];


export const mockUsers: User[] = [mockUser, mockAdmin, mockProviderUser];
export const mockProviders: Provider[] = [mockProvider];
export const mockServices: Service[] = [mockService];
export const mockCategories: Category[] = [mockCategory];


export const mockDashboardStats: DashboardStats = {
  totalUsers: 50,
  totalProviders:15,
  totalBookings: 30,
  totalRevenue: 18000,
  recentBookings: mockBookings,
  pendingVerifications: 12,
};