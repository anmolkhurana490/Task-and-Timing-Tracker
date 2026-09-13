import type { NextFunction, Response } from "express";
import type { CustomRequest } from "../types/express.js";
import type { RequestHandler } from "express";
import { ValidationError } from "../utils/errors.js";
import type { z } from "zod";

/** Validates a request body, query or param and replaces it with the parsed, normalized value. */
export function validate(schema: z.ZodType, source: "body" | "query" | "params" = "body"): RequestHandler {
  return (req: CustomRequest, _res: Response, next: NextFunction) => {
    try {
      if (source === "query") req["valQuery"] = schema.parse(req[source]);
      else req[source] = schema.parse(req[source]);
      next();
    }
    catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        const parsedError = JSON.parse(error.message);
        next(new ValidationError("Validation Error", parsedError));
        return;
      }

      next(error);
    }
  };
}