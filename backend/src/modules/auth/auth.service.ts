import { createUser, findUserByEmail, findUserById, type AuthUser } from "./auth.dao.js";
import { AuthError } from "../../config/errors.js";
import { comparePassword, hashPassword, signAuthToken } from "../../utils/auth.js";
import { type LoginInput, type RegisterInput } from "./auth.validation.js";
import { setCache, delCache } from "../../utils/cache.js";
import { AUTH_REDIS_EXPIRY_SECONDS, generateSessionCacheKey } from "../../constants/auth.js";

/** Creates the public account response and JWT without exposing password data. */
function selectUserFields(user: AuthUser) {
  return { id: user.id, email: user.email, name: user.name };
}

/** Registers a new user after hashing and validating the password. */
export async function registerService(data: RegisterInput) {
  const email = data.email.toLowerCase();
  if (await findUserByEmail(email)) throw new AuthError("Email is already registered", 409);

  const passwordHash = await hashPassword(data.password);
  const user = await createUser({ email, name: data.name, passwordHash });

  return { token: signAuthToken(user.id, user.email), user: selectUserFields(user) };
}

/** Verifies credentials and returns a fresh signed JWT. */
export async function loginService(data: LoginInput) {
  const user = await findUserByEmail(data.email.toLowerCase());
  if (!user) throw new AuthError("Invalid email or password", 401);

  const passwordMatches = await comparePassword(data.password, user.passwordHash);
  if (!passwordMatches) throw new AuthError("Invalid email or password", 401);

  const sessionKey = generateSessionCacheKey(user.id);
  await setCache(sessionKey, selectUserFields(user), AUTH_REDIS_EXPIRY_SECONDS);

  return { token: signAuthToken(user.id, user.email), user: selectUserFields(user) };
}

/** Logout */
export async function logoutService(userId: string) {
  const sessionKey = generateSessionCacheKey(userId);
  await delCache(sessionKey);
}

/** Returns the authenticated user's public profile. */
export async function getMeService(userId: string) {
  const user = await findUserById(userId);
  if (!user) throw new AuthError("User not found", 404);
  return user;
}