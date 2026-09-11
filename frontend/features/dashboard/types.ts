import type { Task } from "../tasks/types";
import type { TimeLog } from "../timeLogs/types";

export interface DashboardData {
  date: string;
  tasksWorkedOn: Task[];
  totalTimeTracked: number;
  completedTasks: Task[];
  pendingTasks: Task[];
  logs?: TimeLog[];
}