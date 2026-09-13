import api from "@/lib/api";
import type { CreateTaskInput, GetTasksResponse, PaginationQueryInput, Task, TaskSuggestion, TimeLog, UpdateTaskInput } from "./tasks.model";

/** Reads the authenticated user's tasks in backend order. */
export async function getTasksAPI(pageQuery: PaginationQueryInput): Promise<GetTasksResponse> {
  const response = await api.get<GetTasksResponse>(`tasks?page=${pageQuery.page}&limit=${pageQuery.limit}`);
  return response.data;
}

/** Get one task by Id, with all time logs. */
export async function getSingleTaskAPI(id: string): Promise<Task> {
  const response = await api.get<Task>(`tasks/${id}`);
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

/** TimeLog Specific APIs */

/** Retrieves completed and active sessions for the current user. */
export async function getTaskLogsAPI(taskId: string): Promise<TimeLog[]> {
  const response = await api.get<TimeLog[]>(`tasks/${taskId}/logs`);
  return response.data;
}

/** Starts a server-owned timer for a task. */
export async function startTaskTimerAPI(taskId: string): Promise<TimeLog> {
  const response = await api.post<TimeLog>(`tasks/${taskId}/start`);
  return response.data;
}

/** Stops one active session and returns the fields changed by the server. */
export async function stopTaskTimerAPI(taskId: string): Promise<Pick<TimeLog, "id" | "endedAt">> {
  const response = await api.post<Pick<TimeLog, "id" | "endedAt">>(`tasks/${taskId}/stop`);
  return response.data;
}