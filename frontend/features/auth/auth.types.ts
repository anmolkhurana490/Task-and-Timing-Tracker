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

/** Credentials sent to both login and registration endpoints. */
export type LoginRequest = {
  email: string;
  password: string;
};

/** Registration extends login credentials with the user's display name. */
export type RegisterRequest = LoginRequest & {
  name: string;
};