import { AuthError } from "../../config/errors.js";
import { findTask, findTasks, insertTask, removeTask, updateTask } from "./task.dao.js";
import type { CreateTaskInput, UpdateTaskInput } from "./task.validation.js";

/** Lists the current user's tasks. */
export function getTasksService(userId: string) {
  return findTasks(userId);
}

/** Gets one task or returns a not-found error. */
export async function getTaskService(id: string, userId: string) {
  const task = await findTask(id, userId);
  if (!task) throw new AuthError("Task not found", 404);
  return task;
}

/** Creates a task for the current user. */
export function createTaskService(userId: string, data: CreateTaskInput) {
  return insertTask(userId, data);
}

/** Updates a task and returns the updated record. */
export async function updateTaskService(id: string, userId: string, data: UpdateTaskInput) {
  const result = await updateTask(id, userId, data);
  if (!result) throw new AuthError("Task not found", 404);
  return getTaskService(id, userId);
}

/** Deletes a task owned by the current user. */
export async function deleteTaskService(id: string, userId: string) {
  const result = await removeTask(id, userId);
  if (!result) throw new AuthError("Task not found", 404);
}
