import { SchemaType, type Schema } from "@google/generative-ai";
import { AuthError } from "../../config/errors.js";
import { generateAIResponse } from "../../utils/genAI.js";
import { findTask, findTasks, insertTask, removeTask, updateTask } from "./task.dao.js";
import { type CreateTaskInput, type UpdateTaskInput, TaskSuggestionSchema, type TaskSuggestionResponse } from "./task.validation.js";

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