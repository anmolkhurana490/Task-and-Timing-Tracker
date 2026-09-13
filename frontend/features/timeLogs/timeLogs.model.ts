/** Time-log entity returned by the tracking API. */
export interface TimeLog {
  id: string;
  taskId: string;
  startedAt: string;
  endedAt: string | null;
  task?: { id: string; title: string };
}

/** Payload required to start tracking a task. */
export interface StartTimeInput {
  taskId: string;
}