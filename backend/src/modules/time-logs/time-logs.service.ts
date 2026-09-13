import { ConflictError, NotFoundError } from "../../utils/errors.js";
import { findActiveTimeLog, findActiveTimeLogs, findOwnedTask, findTimeLog, findTimeLogs, insertTimeLog, stopTimeLog } from "./time-logs.dao.js";
import type { StartTimeInput } from "./time-logs.validation.js";

/** Returns the current user's time logs. */
export function getTimeLogsService(userId: string) {
  return findTimeLogs(userId);
}

/** Starts a timer when the task has no active timer. */
export async function startTimeService(userId: string, data: StartTimeInput) {
  const ownedTask = await findOwnedTask(data.taskId, userId);
  if (!ownedTask) throw new NotFoundError("Task not found");

  const timeLog = await findActiveTimeLog(data.taskId);
  if (timeLog) throw new ConflictError("Task is already being tracked");

  return insertTimeLog(userId, data);
}

/** Stops an active timer and stores elapsed seconds. */
export async function stopTimeService(userId: string, id: string) {
  const currentLog = await findTimeLog(id, userId);
  if (!currentLog || currentLog.endedAt) throw new NotFoundError("Active time log not found");

  const endedAt = new Date();

  const log = await stopTimeLog(id, userId, endedAt);
  if (!log) throw new NotFoundError("Active time log not found");

  return { id, endedAt };
}

/** Gets active timer logs of tasks */
export async function getActiveLogsService(userId: string) {
  const timeLog = await findActiveTimeLogs(userId);
  return timeLog;
}
