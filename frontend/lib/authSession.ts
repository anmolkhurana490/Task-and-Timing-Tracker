import { getSession } from "next-auth/react";
import type { AuthUser } from "@/features/auth/auth.model";

export interface NextAuthUser extends Partial<AuthUser> {
  accessToken?: string;
  user?: Pick<AuthUser, "id" | "email" | "name"> & {
    accessToken?: string;
  };
}

export type User = NextAuthUser;

/** Reads the backend JWT exposed on the NextAuth session. */
export async function getAuthToken(): Promise<string | null> {
  try {
    const session = await getSession();
    const sessionUser = session?.user as NextAuthUser | undefined;

    const token = sessionUser?.accessToken || sessionUser?.user?.accessToken;
    return token || null;
  } catch {
    return null;
  }
}

/** Returns the normalized application user from either supported session shape. */
export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const session = await getSession();
    const sessionUser = session?.user as NextAuthUser | undefined;
    const user = sessionUser?.user || sessionUser;

    if (!user?.id || !user.email || !user.name) return null;
    return { id: user.id, email: user.email, name: user.name };
  } catch {
    return null;
  }
}