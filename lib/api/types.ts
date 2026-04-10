// Type definitions for API requests and responses

export type UserRole = 'user' | 'studio_owner' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  is_email_verified: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

export interface SignUpRequest {
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
}

export interface SignUpResponse extends AuthResponse {
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse extends AuthResponse {
  message: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

export interface MeResponse {
  user: User;
}

export interface LogoutResponse {
  message: string;
}

export interface ErrorResponse {
  message: string;
  statusCode: number;
  error?: string;
  errors?: Record<string, string[]>;
}
