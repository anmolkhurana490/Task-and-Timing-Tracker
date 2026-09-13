import type { RequestHandler } from "express";
import { AuthError } from "../config/errors.js";
import { verifyAuthToken } from "../utils/auth.js";
import { getCache } from "../services/cacheService.js";
import { generateSessionCacheKey } from "../constants/auth.js";
import type { NextFunction, Request, Response } from "express";
import type { CustomRequest } from "../types/express.js";

/** Adds the authenticated user's id to the request from a bearer token or cookie. */
export const authMiddleware: RequestHandler = async (req: CustomRequest, _res: Response, next: NextFunction) => {
  const authorization = req.header("Authorization");
  const bearerToken = authorization?.startsWith("Bearer ") ? authorization.slice(7) : undefined;

  if (!bearerToken) {
    next(new AuthError("Authentication required", 401));
    return;
  }

  try {
    const payload = verifyAuthToken(bearerToken);
    if (!payload) throw new AuthError("Invalid or expired token", 401);

    // verify session cache in Redis
    const sessionKey = generateSessionCacheKey(payload.sub as string);
    const userSession = await getCache(sessionKey);
    if (!userSession) throw new AuthError("Session expired", 401);

    req.userId = payload.sub as string;
    next();
  } catch (error) {
    next(error);
  }
};