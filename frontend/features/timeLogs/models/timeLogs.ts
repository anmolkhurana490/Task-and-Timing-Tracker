export interface TimeLog {
  id: string;
  taskId: string;
  startedAt: string;
  endedAt: string | null;
  task?: { id: string; title: string };
}

export interface StartTimeInput {
  taskId: string;
}