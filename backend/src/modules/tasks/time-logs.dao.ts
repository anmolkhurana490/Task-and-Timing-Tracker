import type { Prisma } from "../../../generated/prisma/browser.js";
import { TaskStatus } from "../../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";

/** Lists time logs owned by a user. */
export function findTimeLogs(userId: string) {
  return prisma.timeLog.findMany({ where: { userId }, include: { task: true }, orderBy: { startedAt: "desc" } });
}

/** Lists active time logs owned by a user. */
export function findActiveTimeLogs(userId: string) {
  return prisma.timeLog.findMany({ where: { userId, endedAt: null }, orderBy: { startedAt: "desc" } });
}

/** Finds an active timer for a task. */
export function findActiveTimeLog(taskId: string) {
  return prisma.timeLog.findFirst({ where: { taskId, endedAt: null } });
}

/** Finds an active timer for a task. */
export function findUserActiveTimeLog(taskId: string, userId: string) {
  return prisma.timeLog.findFirst({ where: { taskId, userId, endedAt: null } });
}

/** Confirms that a task belongs to the user starting the timer. */
export function findOwnedTask(taskId: string, userId: string) {
  return prisma.task.findFirst({ where: { id: taskId, userId }, select: { id: true } });
}

/** Finds one owned time log before calculating its final duration. */
export function findTimeLog(id: string, userId: string) {
  return prisma.timeLog.findFirst({ where: { id, userId } });
}

/** Creates a timer only for a task owned by the same user. */
export function insertTimeLog(userId: string, taskId: string) {
  return prisma.timeLog.create({ data: { taskId, userId } });
}

/** Stops a time log. */
export function stopTimeLog(id: string, endedAt: Date) {
  return prisma.timeLog.update({ where: { id, endedAt: null }, data: { endedAt } });
}

/** Task with Logs Type for Dashboard Purpose */
export type DashboardTask = Prisma.TaskGetPayload<{
  include: { timeLogs: true };
}>;

/** Returns owned tasks with logs for the dashboard from start to end date. */
export function findDashboardData(userId: string, start: Date, end: Date) {
  const overlappingLogs = {
    startedAt: { lt: end },
    OR: [
      { endedAt: null },
      { endedAt: { gt: start } },
    ],
  };

  return prisma.task.findMany({
    where: {
      userId,
      timeLogs: { some: overlappingLogs }
    },

    include: {
      timeLogs: {
        where: overlappingLogs
      }
    }
  });
}

/** Returns unfinished tasks and active logs. */
export function findOutstandingDashboardData(userId: string) {
  return Promise.all([
    prisma.task.findMany({
      where: { userId, status: { not: TaskStatus.COMPLETED } },
      orderBy: { updatedAt: "desc" }
    }),

    prisma.task.findMany({
      where: { userId, timeLogs: { some: { endedAt: null } } },
      include: { timeLogs: { where: { endedAt: null } } },
      orderBy: { createdAt: "asc" },
    }),
  ]);
}
