import type { NextFunction, Response } from "express";
import type { CustomRequest } from "../../types/express.js";
import { getDashboardService, getOutstandingService, getWeeklySummaryService } from "./dashboard.service.js";

/** Returns the authenticated user's daily productivity summary. */
export async function getDashboardController(req: CustomRequest, res: Response, next: NextFunction) {
  try {
    const data = await getDashboardService(req.userId as string);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

/** Returns the previous calendar week's productivity summary. */
export async function getWeeklySummaryController(req: CustomRequest, res: Response, next: NextFunction) {
  try {
    res.json(await getWeeklySummaryService(req.userId as string));
  } catch (error) {
    next(error);
  }
}

/** Returns unfinished tasks and older active time logs. */
export async function getOutstandingController(req: CustomRequest, res: Response, next: NextFunction) {
  try {
    res.json(await getOutstandingService(req.userId as string));
  } catch (error) {
    next(error);
  }
}
