import api from "@/lib/api";
import type { StartTimeInput, TimeLog } from "./timeLogs.model";

/** Retrieves completed and active sessions for the current user. */
export async function getTimeLogsAPI(): Promise<TimeLog[]> {
  const response = await api.get<TimeLog[]>("time-logs");
  return response.data;
}

/** Starts a server-owned timer for a task. */
export async function startTimeAPI(input: StartTimeInput): Promise<TimeLog> {
  const response = await api.post<TimeLog>("time-logs/start", input);
  return response.data;
}

/** Stops one active session and returns the fields changed by the server. */
export async function stopTimeAPI(id: string): Promise<Pick<TimeLog, "id" | "endedAt">> {
  const response = await api.post<Pick<TimeLog, "id" | "endedAt">>(`time-logs/${id}/stop`);
  return response.data;
}

/** Retrieves active sessions separately for screens that need live timer state. */
export async function getActiveLogsAPI(): Promise<TimeLog[]> {
  const response = await api.get<TimeLog[]>(`time-logs/active`);
  return response.data;
}