export const SALT_ROUNDS = 10; // for Password Hashing

// For User Profile
export const selectFields = { id: true, name: true, email: true };

export const ACCESS_TOKEN_EXPIRES_IN = '7d'; // 7 days
export const ACCESS_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export const AUTH_REDIS_EXPIRY_SECONDS = 7 * 24 * 60 * 60; // 7 days in seconds

export const generateSessionCacheKey = (userId: string) => `session:${userId}`;