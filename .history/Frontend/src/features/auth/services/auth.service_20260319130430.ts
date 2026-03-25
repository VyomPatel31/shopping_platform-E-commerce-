import axiosInstance from "../../../api/axiosInstance";
import type { 
  LoginRequest, 
  SignupRequest, 
  OTPVerificationRequest, 
  AuthResponse 
} from "../../../types/api.types";

export const authService = {
  async signup(data: SignupRequest): Promise<AuthResponse> {
    const response = await axiosInstance.post('/auth/signup', data);
    return response.data;
  },

  async verifyOtp(data: OTPVerificationRequest): Promise<AuthResponse> {
    const response = await axiosInstance.post('/auth/verify-otp', data);
    return response.data;
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await axiosInstance.post('/auth/login', data);
    return response.data;
  },

  async logout(): Promise<AuthResponse> {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
  },

  async forgotPassword(email: string): Promise<AuthResponse> {
    const response = await axiosInstance.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(data: { token: string; password: string }): Promise<AuthResponse> {
    const response = await axiosInstance.post('/auth/reset-password', data);
    return response.data;
  },

  async resendVerification(email: string): Promise<AuthResponse> {
    const response = await axiosInstance.post('/auth/resend-verification', { email });
    return response.data;
  }
};
