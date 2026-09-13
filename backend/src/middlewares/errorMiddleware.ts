import { type ErrorRequestHandler } from "express";
import { AppError } from "../utils/errors.js";
import type { NextFunction, Response } from "express";
import type { CustomRequest } from "../types/express.js";

const errorHandler: ErrorRequestHandler = (error, _req: CustomRequest, res: Response, _next: NextFunction) => {
  if (error instanceof AppError) {
    // App API Error (due to Client side) - 4xx
    res.status(error.statusCode).json({ error: error.message, data: error.details });
    return;
  }

  // Some Internal Server Error (Not App Error) - 5xx
  console.error("Unexpected error:", error);
  res.status(500).json({ error: "Internal server error" });
};

export { errorHandler };