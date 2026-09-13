/** Minimal authenticated user shape shared by auth and application state. */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
}