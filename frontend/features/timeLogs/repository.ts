import api from "@/lib/api";
import type { StartTimeInput, TimeLog } from "./types";

export async function getTimeLogsAPI(): Promise<TimeLog[]> {
  const response = await api.get<TimeLog[]>("time-logs");
  return response.data;
}

export async function startTimeAPI(input: StartTimeInput): Promise<TimeLog> {
  const response = await api.post<TimeLog>("time-logs/start", input);
  return response.data;
}

export async function stopTimeAPI(id: string): Promise<Pick<TimeLog, "id" | "endedAt" | "duration">> {
  const response = await api.post<Pick<TimeLog, "id" | "endedAt" | "duration">>(`time-logs/${id}/stop`);
  return response.data;
}