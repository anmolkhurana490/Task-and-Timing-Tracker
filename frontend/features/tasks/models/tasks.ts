export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
}

export interface TaskSuggestion {
  title: string;
  description: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
}