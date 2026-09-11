import type { AuthUser } from "@/features/auth/models/auth";

// Keep the backend user and JWT available through NextAuth's typed session.
declare module "next-auth" {
  interface User extends AuthUser {
    accessToken?: string;
  }

  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: import("next-auth").User;
  }
}