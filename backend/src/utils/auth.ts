import bcrypt from "bcryptjs";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { AuthError } from "../config/errors.js";
import { ACCESS_TOKEN_EXPIRES_IN, SALT_ROUNDS } from "../constants/auth.js";

/** Reads the required signing secret from the process environment. */
const jwt_secret = process.env["JWT_SECRET"] ?? "jwt-secret";

/** Creates a short-lived JWT containing only the user's identity claims. */
export function signAuthToken(userId: string, email: string) {
  return jwt.sign({ sub: userId, email }, jwt_secret, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
}

/** Verifies a JWT and returns its typed identity claims. */
export function verifyAuthToken(token: string): JwtPayload | null {
  try {
    const payload = jwt.verify(token, jwt_secret);
    if (typeof payload === "string" || typeof payload.sub !== "string") return null;
    return payload;
  } catch {
    return null;
  }
}

/** Hashes a raw password before it is sent to the DAO. */
export function hashPassword(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/** Compares a raw password with its stored one-way hash. */
export function comparePassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}