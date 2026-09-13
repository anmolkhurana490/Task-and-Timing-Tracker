// Auth Repository - API integrations for authentication
// Handles all HTTP requests related to authentication

import api from '@/lib/api';
import type {
  AuthResponse,
  LogoutResponse,
  LoginRequest,
  RegisterRequest,
} from "./auth.types";

/** Register new user */
export const registerUserAPI = async (userData: RegisterRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("auth/register", userData);
  return response.data;
};

/** Login user */
export const loginUserAPI = async (credentials: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("auth/login", credentials);
  return response.data;
};

/** Logout user */
export const logoutUserAPI = async (): Promise<LogoutResponse> => {
  const response = await api.post<LogoutResponse>("auth/logout");
  return response.data;
};

/** Get current user profile */
export const getCurrentUserAPI = async (): Promise<AuthResponse["user"]> => {
  const response = await api.get("auth/profile");
  return response.data;
};