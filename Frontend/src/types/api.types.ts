// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'user' | 'admin';
}

export interface OTPVerificationRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  email: string;
  forgotToken: string;
  newPassword: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: User & {
    accessToken?: string;
    refreshToken?: string;
  };
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// Product Types
export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  brand?: string;
  stock: number;
  images: string[];
  rating: number;
  numReviews: number;
  isFeatured: boolean;
  isTrending: boolean;
  createdAt: string;
  updatedAt: string;
}

// Cart Types
export interface CartItem {
  _id: string;
  productId: string;
  quantity: number;
  price: number;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  total: number;
  createdAt: string;
  updatedAt: string;
}

// Order Types
export interface Order {
  _id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  deliveryAddress: Address;
  createdAt: string;
  updatedAt: string;
}

// Address Types
export interface Address {
  _id?: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  label?: string;
  isDefault?: boolean;
}

// Review Types
export interface Review {
  _id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}
