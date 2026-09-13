import api from "@/lib/api";
import type { CreateTaskInput, Task, TaskSuggestion, UpdateTaskInput } from "./tasks.model";

/** Reads the authenticated user's tasks in backend order. */
export async function getTasksAPI(): Promise<Task[]> {
  const response = await api.get<Task[]>("tasks");
  return response.data;
}

/** Creates one task and returns the persisted entity for immediate store insertion. */
export async function createTaskAPI(input: CreateTaskInput): Promise<Task> {
  const response = await api.post<Task>("tasks", input);
  return response.data;
}

/** Updates only the fields supplied by the task view. */
export async function updateTaskAPI(id: string, input: UpdateTaskInput): Promise<Task> {
  const response = await api.patch<Task>(`tasks/${id}`, input);
  return response.data;
}

/** Deletes a task; the backend owns cascade behavior for related records. */
export async function deleteTaskAPI(id: string): Promise<void> {
  await api.delete(`tasks/${id}`);
}

/** Requests AI suggestions and returns the list expected by the view-model. */
export async function generateTaskSuggestionsAPI(user_input: string): Promise<TaskSuggestion[]> {
  const queryString = new URLSearchParams({ user_input }).toString();
  const response = await api.get<TaskSuggestion[]>(`tasks/suggestions?${queryString}`);

  return response.data;
}