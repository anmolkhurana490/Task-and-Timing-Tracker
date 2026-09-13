import type { AuthUser } from "./auth.model";

/** Response types for authentication API endpoints */
export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface LogoutResponse {
  message: string;
}

export interface AuthApiError {
  error?: string;
  message?: string;
  data?: unknown;
}

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = LoginRequest & {
  name: string;
};