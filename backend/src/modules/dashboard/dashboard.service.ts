import { findTodayDashboardData } from "../time/time.dao.js";

/** Builds today's productivity summary from the user's tasks and logs. */
export async function getDashboardService(userId: string) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const [tasks, logs] = await findTodayDashboardData(userId, start, end);

  return {
    date: start.toISOString().slice(0, 10),
    tasksWorkedOn: tasks.filter((task) => task.timeLogs.length > 0),
    totalTimeTracked: logs.reduce((total, log) => total + (log.duration ?? 0), 0),
    completedTasks: tasks.filter((task) => task.status === "COMPLETED"),
    pendingTasks: tasks.filter((task) => task.status !== "COMPLETED"),
  };
}
