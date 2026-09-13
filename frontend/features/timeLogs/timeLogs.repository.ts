import api from "@/lib/api";
import type { StartTimeInput, TimeLog } from "./timeLogs.model";

export async function getTimeLogsAPI(): Promise<TimeLog[]> {
  const response = await api.get<TimeLog[]>("time-logs");
  return response.data;
}

export async function startTimeAPI(input: StartTimeInput): Promise<TimeLog> {
  const response = await api.post<TimeLog>("time-logs/start", input);
  return response.data;
}

export async function stopTimeAPI(id: string): Promise<Pick<TimeLog, "id" | "endedAt">> {
  const response = await api.post<Pick<TimeLog, "id" | "endedAt">>(`time-logs/${id}/stop`);
  return response.data;
}

export async function getActiveLogsAPI(): Promise<TimeLog[]> {
  const response = await api.get<TimeLog[]>(`time-logs/active`);
  return response.data;
}