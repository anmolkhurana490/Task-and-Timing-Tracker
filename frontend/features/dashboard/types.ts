import type { Task } from "../tasks/models/tasks";
import type { TimeLog } from "../timeLogs/models/timeLogs";

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