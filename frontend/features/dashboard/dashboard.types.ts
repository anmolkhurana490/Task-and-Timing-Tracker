import type { Task } from "@/features/tasks/tasks.model";
import type { TimeLog } from "@/features/timeLogs/timeLogs.model";

export interface DailyDashboardData {
  date: string;
  totalTasks: number;
  totalTimeTracked: number;
  completedTasks: number;
  notCompletedTasks: number;
}

export interface OutstandingData {
  notCompletedTasks: Task[];
  activeTimeLogs: TimeLog[];
}