import type { NextFunction, Request, Response } from "express";
import { getDashboardService } from "./dashboard.service.js";

/** Returns the authenticated user's daily productivity summary. */
export async function getDashboardController(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await getDashboardService(req.userId as string);
    res.json(data);
  } catch (error) {
    next(error);
  }
}
