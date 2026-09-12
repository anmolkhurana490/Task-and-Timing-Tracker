import type { NextFunction, Request, Response } from "express";
import { getActiveLogsService, getTimeLogsService, startTimeService, stopTimeService } from "./time.service.js";

/** Lists the authenticated user's time logs. */
export async function getTimeLogsController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await getTimeLogsService(req.userId as string);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

/** Starts tracking a task. */
export async function startTimeController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await startTimeService(req.userId as string, req.body);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
}

/** Stops a user's active time log. */
export async function stopTimeController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await stopTimeService(req.userId as string, req.params.id as string);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

/** Gets active logs of user's tasks. */
export async function getActiveLogsController(req: Request, res: Response, next: NextFunction) {
  try {
    const activeLog = await getActiveLogsService(req.userId as string);
    res.json(activeLog);
  } catch (error) {
    next(error);
  }
}
