import { prisma } from "../../lib/prisma.js";

/** Defines the user fields needed by authentication without exposing the hash. */
export type AuthUser = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
};

/** Finds an account by its normalized email address. */
export function findUserByEmail(email: string): Promise<AuthUser | null> {
  return prisma.user.findUnique({ where: { email } });
}

/** Creates an account from an already-hashed password. */
export function createUser(data: {
  email: string;
  name: string;
  passwordHash: string;
}): Promise<AuthUser> {
  return prisma.user.create({ data });
}

/** Finds the public profile for an authenticated user. */
export function findUserById(id: string) {
  return prisma.user.findUnique({ where: { id }, select: { id: true, email: true, name: true } });
}