import type { RequestHandler } from "express";
import type { z } from "zod";
import type { NextFunction, Request, Response } from "express";
import { ValidationError } from "../config/errors";

/** Validates a request body, query or param and replaces it with the parsed, normalized value. */
export function validate(schema: z.ZodType, source: "body" | "query" | "params" = "body"): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (source === "query") req["valQuery"] = schema.parse(req[source]);
      else req[source] = schema.parse(req[source]);
      next();
    }
    catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        const parsedError = JSON.parse(error.message);
        next(new ValidationError("Validation Error", 400, parsedError));
        return;
      }

      next(error);
    }
  };
}