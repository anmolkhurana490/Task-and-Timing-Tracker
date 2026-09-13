import { TaskStatus } from "../../../generated/prisma/enums.js";
import { findDashboardData, findOutstandingDashboardData, type DashboardTask } from "../tasks/time-logs.dao.js";

function computeDayTaskData(tasks: DashboardTask[], start: Date, end: Date) {
  let totalTasks = 0, totalTimeTracked = 0;
  let completedTasks = 0, notCompletedTasks = 0;

  for (const taskData of tasks) {
    let taskTimeTracked = 0;

    for (const log of taskData.timeLogs) {
      const sessionStart = Math.max(log.startedAt.getTime(), start.getTime());
      const sessionEnd = Math.min(log.endedAt?.getTime() ?? Date.now(), end.getTime());
      if (sessionEnd <= sessionStart) continue;

      taskTimeTracked += Math.floor((sessionEnd - sessionStart) / 1000);
    }

    if (taskTimeTracked > 0) {
      totalTasks++;
      totalTimeTracked += taskTimeTracked;
      if (taskData.status === TaskStatus.COMPLETED) completedTasks++;
      else notCompletedTasks++;
    }
  }

  return {
    date: start.toISOString().slice(0, 10),
    totalTasks, totalTimeTracked, completedTasks, notCompletedTasks
  };
}

/** Builds today's productivity summary from the user's tasks and logs. */
export async function getDashboardService(userId: string) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const tasks = await findDashboardData(userId, start, end);
  return computeDayTaskData(tasks, start, end);
}

/** Calculates the previous Monday-to-Sunday productivity summary. */
export async function getWeeklySummaryService(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysSinceMonday = (today.getDay() + 6) % 7; // Monday=0 ... Sunday=6

  const currentWeekStart = new Date(today);
  currentWeekStart.setDate(today.getDate() - daysSinceMonday);

  const lastWeekStart = new Date(currentWeekStart);
  lastWeekStart.setDate(currentWeekStart.getDate() - 7);

  const weeklyTasks = await findDashboardData(userId, lastWeekStart, currentWeekStart);

  // Create one entry for every day, including days with no activity.
  const weekData = Array.from({ length: 7 }, (_, dayIndex) => {
    const date = new Date(lastWeekStart);
    date.setDate(lastWeekStart.getDate() + dayIndex);
    date.setHours(0, 0, 0, 0);

    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    return computeDayTaskData(weeklyTasks, date, nextDate);
  });

  return weekData;
}

/** Returns unfinished tasks and active timers left running from earlier dates. */
export async function getOutstandingService(userId: string) {
  const [notCompletedTasks, activeLogTasks] = await findOutstandingDashboardData(userId);
  return { notCompletedTasks, activeLogTasks };
}
