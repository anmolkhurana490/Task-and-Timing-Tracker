import type { Task, TimeLog } from "@/features/tasks/tasks.model";

/** Daily aggregate returned by the dashboard and weekly-summary endpoints. */
export interface DailyDashboardData {
  date: string;
  totalTasks: number;
  totalTimeTracked: number;
  completedTasks: number;
  notCompletedTasks: number;
}

/** Work items that need attention outside today's summary. */
export interface OutstandingData {
  notCompletedTasks: Task[];
  activeLogTasks: Task[];
}