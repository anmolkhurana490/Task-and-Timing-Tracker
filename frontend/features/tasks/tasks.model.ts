/** Values accepted by the backend task status enum. */
export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

/** Time-log entity returned by the tracking API. */
export interface TimeLog {
  id: string;
  taskId: string;
  startedAt: string;
  endedAt: string | null;
}

/** Task entity returned by the task API and stored globally. */
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
  timeLogs?: TimeLog[];
}

/** Payload for creating a task; the backend supplies defaults for omitted fields. */
export interface CreateTaskInput {
  title: string;
  description?: string;
}

/** AI-generated task content that can be converted into a CreateTaskInput. */
export interface TaskSuggestion {
  title: string;
  description: string;
}

/** Partial task payload used by status changes and inline editing. */
export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
}

/** Get Tasks API Response having task array and pagination data */
export interface GetTasksResponse {
  pagination: {
    limit: number;
    page: number;
    total: number;
    totakPages: number;
  };
  tasks: Task[];
}