import type { NextFunction, Request, Response } from "express";
import { createTaskService, deleteTaskService, getTaskService, getTasksService, updateTaskService } from "./task.service.js";

/** Returns all tasks owned by the authenticated user. */
export async function getTasksController(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await getTasksService(req.userId as string);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

/** Returns one owned task. */
export async function getTaskController(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await getTaskService(req.params.id as string, req.userId as string);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

/** Creates a task for the authenticated user. */
export async function createTaskController(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await createTaskService(req.userId as string, req.body);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
}

/** Updates one owned task. */
export async function updateTaskController(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await updateTaskService(req.params.id as string, req.userId as string, req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

/** Deletes one owned task. */
export async function deleteTaskController(req: Request, res: Response, next: NextFunction) {
  try {
    await deleteTaskService(req.params.id as string, req.userId as string);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
