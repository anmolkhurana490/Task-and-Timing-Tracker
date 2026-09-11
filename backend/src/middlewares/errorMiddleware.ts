import express, { type ErrorRequestHandler } from "express";
import { AuthError, ValidationError } from "../config/errors";
import type { NextFunction, Request, Response } from "express";

const errorHandler: ErrorRequestHandler = (error, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof AuthError) {
    res.status(error.statusCode).json({ error: error.message });
    return;
  }
  if (error instanceof ValidationError) {
    res.status(400).json({ error: error.message, data: error.details });
    return;
  }

  console.error("Unexpected error:", error);
  res.status(500).json({ error: "Internal server error" });
};

export { errorHandler };