import type { RequestHandler } from "express";

/** Forwards rejected controller promises to Express error middleware. */
export function asyncHandler(handler: RequestHandler): RequestHandler {
  return (request, response, next) => Promise.resolve(handler(request, response, next)).catch(next);
}