import { SchemaType, type Schema } from "@google/generative-ai";
import { ConflictError, NotFoundError } from "../../utils/errors.js";
import { generateAIResponse } from "../../utils/genAI.js";
import { findTask, findTasks, insertTask, removeTask, updateTask } from "./task.dao.js";
import { type CreateTaskInput, type UpdateTaskInput, TaskSuggestionSchema, type TaskSuggestionResponse } from "./task.validation.js";
import { findActiveTimeLog, findActiveTimeLogs, findOwnedTask, findTimeLog, findUserActiveTimeLog, insertTimeLog, stopTimeLog } from "./time-logs.dao.js";

/** Lists the current user's tasks with pagination metadata. */
export async function getTasksService(userId: string, page: number, limit: number) {
  const [tasks, total] = await findTasks(userId, page, limit);
  return {
    tasks,
    pagination: {
      page, limit, total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

/** Gets one task or returns a not-found error. */
export async function getTaskService(id: string, userId: string) {
  const task = await findTask(id, userId);
  if (!task) throw new NotFoundError("Task not found");
  return task;
}

/** Creates a task for the current user. */
export function createTaskService(userId: string, data: CreateTaskInput) {
  return insertTask(userId, data);
}

/** Updates a task and returns the updated record. */
export async function updateTaskService(id: string, userId: string, data: UpdateTaskInput) {
  const result = await updateTask(id, userId, data);
  if (!result) throw new NotFoundError("Task not found");
  return getTaskService(id, userId);
}

/** Deletes a task owned by the current user. */
export async function deleteTaskService(id: string, userId: string) {
  const result = await removeTask(id, userId);
  if (!result) throw new NotFoundError("Task not found");
}

/** Generates Task Suggestion for user input using GenAI */
export async function generateTaskSuggestions(userInput: string) {
  const instructions = `Generate 4-5 actionable task suggestions based on the user's input. Keep them relevant and concise. Do not invent unrelated details.`
  const prompt = `${instructions} \n User Input: ${userInput}`

  const taskListSchema: Schema = {
    type: SchemaType.ARRAY,
    description: "List of actionable task suggestions.",
    items: {
      type: SchemaType.OBJECT,
      properties: {
        title: {
          type: SchemaType.STRING,
          description: "Task title. Max 100 characters."
        },
        description: {
          type: SchemaType.STRING,
          description: "Task details. Max 300 characters."
        },
      },
      required: ["title", "description"],
    },
  };

  const suggestions = await generateAIResponse(prompt, taskListSchema);
  return TaskSuggestionSchema.parse(JSON.parse(suggestions));
}

/** Starts a timer when the task has no active timer. */
export async function startTimeService(userId: string, taskId: string) {
  const ownedTask = await findOwnedTask(taskId, userId);
  if (!ownedTask) throw new NotFoundError("Task not found");

  const timeLog = await findActiveTimeLog(taskId);
  if (timeLog) throw new ConflictError("Task is already being tracked");

  return insertTimeLog(userId, taskId);
}

/** Stops an active timer and stores elapsed seconds. */
export async function stopTimeService(userId: string, taskId: string) {
  const logData = await findUserActiveTimeLog(taskId, userId);
  if (!logData) throw new NotFoundError("Active time log not found");

  const endedAt = new Date();
  await stopTimeLog(logData.id, endedAt);

  return { id: logData.id, endedAt };
}