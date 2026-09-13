import type { NextFunction, Response } from "express";
import type { CustomRequest } from "../../types/express.js";
import { createTaskService, deleteTaskService, generateTaskSuggestions, getTaskService, getTasksService, startTimeService, stopTimeService, updateTaskService } from "./task.service.js";
import type { SuggestionQueryInput, PaginationInput } from "./task.validation.js";

/** Returns all tasks owned by the authenticated user. */
export async function getTasksController(req: CustomRequest, res: Response, next: NextFunction) {
  try {
    const query = req.valQuery as PaginationInput;
    const data = await getTasksService(req.userId as string, query.page, query.limit);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

/** Returns one owned task. */
export async function getTaskController(req: CustomRequest, res: Response, next: NextFunction) {
  try {
    const data = await getTaskService(req.params.id as string, req.userId as string);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

/** Creates a task for the authenticated user. */
export async function createTaskController(req: CustomRequest, res: Response, next: NextFunction) {
  try {
    const data = await createTaskService(req.userId as string, req.body);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
}

/** Updates one owned task. */
export async function updateTaskController(req: CustomRequest, res: Response, next: NextFunction) {
  try {
    const data = await updateTaskService(req.params.id as string, req.userId as string, req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

/** Deletes one owned task. */
export async function deleteTaskController(req: CustomRequest, res: Response, next: NextFunction) {
  try {
    await deleteTaskService(req.params.id as string, req.userId as string);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

/** Get AI Generated Task Suggestion */
export async function getTaskSuggestionController(req: CustomRequest, res: Response, next: NextFunction) {
  try {
    const query = req.valQuery as SuggestionQueryInput;
    const data = await generateTaskSuggestions(query.user_input);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

/** Starts tracking the task identified by the route parameter. */
export async function startTaskController(req: CustomRequest, res: Response, next: NextFunction) {
  try {
    const data = await startTimeService(req.userId as string, req.params.id as string);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
}

/** Stops the active time log identified by the route parameter. */
export async function stopTaskController(req: CustomRequest, res: Response, next: NextFunction) {
  try {
    const data = await stopTimeService(req.userId as string, req.params.id as string);
    res.json(data);
  } catch (error) {
    next(error);
  }
}