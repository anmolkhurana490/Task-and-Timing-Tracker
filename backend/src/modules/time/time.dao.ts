import { prisma } from "../../lib/prisma.js";
import type { StartTimeInput } from "./time.validation.js";

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

/** Confirms that a task belongs to the user starting the timer. */
export function findOwnedTask(taskId: string, userId: string) {
  return prisma.task.findFirst({ where: { id: taskId, userId }, select: { id: true } });
}

/** Finds one owned time log before calculating its final duration. */
export function findTimeLog(id: string, userId: string) {
  return prisma.timeLog.findFirst({ where: { id, userId } });
}

/** Creates a timer only for a task owned by the same user. */
export function insertTimeLog(userId: string, data: StartTimeInput) {
  return prisma.timeLog.create({ data: { taskId: data.taskId, userId } });
}

/** Stops a log only when it belongs to the user. */
export function stopTimeLog(id: string, userId: string, endedAt: Date, duration: number) {
  return prisma.timeLog.update({ where: { id, userId, endedAt: null }, data: { endedAt, duration } });
}

/** Returns today's owned tasks and logs for the dashboard. */
export function findTodayDashboardData(userId: string, start: Date, end: Date) {
  return Promise.all([
    prisma.task.findMany({ where: { userId }, include: { timeLogs: { where: { startedAt: { lt: end }, OR: [{ endedAt: null }, { endedAt: { gte: start } }] } } } }),
    prisma.timeLog.findMany({ where: { userId, startedAt: { lt: end }, OR: [{ endedAt: null }, { endedAt: { gte: start } }] } }),
  ]);
}
