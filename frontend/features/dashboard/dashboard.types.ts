import type { Task } from "@/features/tasks/tasks.model";
import type { TimeLog } from "@/features/timeLogs/timeLogs.model";

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
  activeTimeLogs: TimeLog[];
}