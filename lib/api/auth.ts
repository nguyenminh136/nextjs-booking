// Authentication API functions
// These functions call the Nest.js backend API

import { apiClient } from './client';
import {
  SignUpRequest,
  SignUpResponse,
  LoginRequest,
  LoginResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  MeResponse,
  LogoutResponse,
} from './types';

/**
 * Register a new user
 */
export async function signUp(data: SignUpRequest): Promise<SignUpResponse> {
  const response = await apiClient.post<SignUpResponse>('/auth/register', {
    email: data.email,
    password: data.password,
    confirmPassword: data.confirmPassword,
    role: data.role,
    firstName: data.firstName,
    lastName: data.lastName,
  });

  // Store token
  if (response.accessToken) {
    apiClient.setToken(response.accessToken);
  }

  return response;
}

/**
 * Login user
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/auth/login', {
    email: data.email,
    password: data.password,
  });

  // Store token
  if (response.accessToken) {
    apiClient.setToken(response.accessToken);
  }

  return response;
}

/**
 * Request password reset
 */
export async function forgotPassword(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
  return apiClient.post<ForgotPasswordResponse>('/auth/forgot-password', {
    email: data.email,
  });
}

/**
 * Reset password with token
 */
export async function resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
  return apiClient.post<ResetPasswordResponse>('/auth/reset-password', {
    token: data.token,
    password: data.password,
    confirmPassword: data.confirmPassword,
  });
}

/**
 * Refresh access token
 */
export async function refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
  const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh', {
    refreshToken,
  });

  // Store new token
  if (response.accessToken) {
    apiClient.setToken(response.accessToken);
  }

  return response;
}

/**
 * Get current user
 */
export async function getMe(): Promise<MeResponse> {
  return apiClient.get<MeResponse>('/auth/me');
}

/**
 * Logout user
 */
export async function logout(): Promise<LogoutResponse> {
  apiClient.clearToken();
  return apiClient.post<LogoutResponse>('/auth/logout', {});
}

/**
 * Verify email with token
 */
export async function verifyEmail(token: string): Promise<{ message: string }> {
  return apiClient.post<{ message: string }>('/auth/verify-email', { token });
}

/**
 * Resend verification email
 */
export async function resendVerificationEmail(email: string): Promise<{ message: string }> {
  return apiClient.post<{ message: string }>('/auth/resend-verification', { email });
}
