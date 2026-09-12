import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { validate } from "../../middlewares/validate.js";
import { createTaskController, deleteTaskController, getTaskController, getTasksController, getTaskSuggestionController, updateTaskController } from "./task.controller.js";
import { createTaskSchema, suggestionQuerySchema, taskIdSchema, updateTaskSchema } from "./task.validation.js";

/** Registers protected task CRUD routes. */
export const taskRouter = Router();

taskRouter.use(authMiddleware);

taskRouter.get("/", getTasksController);
taskRouter.get("/suggestions", validate(suggestionQuerySchema, "query"), getTaskSuggestionController);

taskRouter.get("/:id", validate(taskIdSchema, "params"), getTaskController);
taskRouter.post("/", validate(createTaskSchema), createTaskController);

taskRouter.patch(
  "/:id",
  validate(taskIdSchema, "params"),
  validate(updateTaskSchema),
  updateTaskController
);

taskRouter.delete("/:id", validate(taskIdSchema, "params"), deleteTaskController);