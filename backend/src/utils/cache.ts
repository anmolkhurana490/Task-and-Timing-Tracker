import redis from "../lib/redis.js";

/** Stores a JSON value in Redis for the given number of seconds. */
export async function setCache(key: string, value: unknown, expirySeconds: number) {
  try {
    await redis.set(key, JSON.stringify(value), "EX", expirySeconds);
  }
  catch (e) {
    console.warn("Error setting key-value:", e);
  }
}

/** Reads and parses a JSON value from Redis. */
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const value = await redis.get(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch (error) {
    console.warn("Error getting cache value:", error);
    return null;
  }
}

/** Deletes a value from Redis. */
export async function delCache(key: string): Promise<void> {
  try {
    await redis.del(key);
  }
  catch (e) {
    console.warn("Error deleting key-value:", e);
  }
}