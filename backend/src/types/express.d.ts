import type { Request } from "express";

/** Request shape after Auth / Validation Middleware */
export interface CustomRequest extends Request {
  userId?: string;
  valQuery?: any;
}