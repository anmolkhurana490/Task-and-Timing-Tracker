import { AuthError } from "../../config/errors.js";
import { findActiveTimeLog, findActiveTimeLogs, findOwnedTask, findTimeLog, findTimeLogs, insertTimeLog, stopTimeLog } from "./time.dao.js";
import type { StartTimeInput } from "./time.validation.js";

/** Returns the current user's time logs. */
export function getTimeLogsService(userId: string) {
  return findTimeLogs(userId);
}

/** Starts a timer when the task has no active timer. */
export async function startTimeService(userId: string, data: StartTimeInput) {
  const ownedTask = await findOwnedTask(data.taskId, userId);
  if (!ownedTask) throw new AuthError("Task not found", 404);

  const timeLog = await findActiveTimeLog(data.taskId);
  if (timeLog) throw new AuthError("Task is already being tracked", 409);

  return insertTimeLog(userId, data);
}

/** Stops an active timer and stores elapsed seconds. */
export async function stopTimeService(userId: string, id: string) {
  const currentLog = await findTimeLog(id, userId);
  if (!currentLog || currentLog.endedAt) throw new AuthError("Active time log not found", 404);

  const endedAt = new Date();
  const duration = Math.max(0, Math.floor((endedAt.getTime() - currentLog.startedAt.getTime()) / 1000));

  const log = await stopTimeLog(id, userId, endedAt, duration);
  if (!log) throw new AuthError("Active time log not found", 404);

  return { id, endedAt, duration };
}

/** Gets active timer logs of tasks */
export async function getActiveLogsService(userId: string) {
  const timeLog = await findActiveTimeLogs(userId);
  return timeLog;
}
