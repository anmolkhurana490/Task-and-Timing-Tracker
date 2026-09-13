import api from "@/lib/api";
import type { CreateTaskInput, Task, TaskSuggestion, UpdateTaskInput } from "./tasks.model";

export async function getTasksAPI(): Promise<Task[]> {
  const response = await api.get<Task[]>("tasks");
  return response.data;
}

export async function createTaskAPI(input: CreateTaskInput): Promise<Task> {
  const response = await api.post<Task>("tasks", input);
  return response.data;
}

export async function updateTaskAPI(id: string, input: UpdateTaskInput): Promise<Task> {
  const response = await api.patch<Task>(`tasks/${id}`, input);
  return response.data;
}

export async function deleteTaskAPI(id: string): Promise<void> {
  await api.delete(`tasks/${id}`);
}

export async function generateTaskSuggestionsAPI(user_input: string): Promise<TaskSuggestion[]> {
  const queryString = new URLSearchParams({ user_input }).toString();
  const response = await api.get<TaskSuggestion[]>(`tasks/suggestions?${queryString}`);

  return response.data;
}