import api from "@/lib/api";
import type { DailyDashboardData, OutstandingData } from "./dashboard.types";

/** Loads today's aggregate productivity data. */
export async function getDashboardAPI(): Promise<DailyDashboardData> {
  const response = await api.get<DailyDashboardData>("dashboard");
  return response.data;
}

/** Loads one aggregate entry per day for the previous week. */
export async function getWeeklySummaryAPI(): Promise<DailyDashboardData[]> {
  const response = await api.get<DailyDashboardData[]>("dashboard/weekly");
  return response.data;
}

/** Loads unfinished tasks and timers carried over from before today. */
export async function getOutstandingAPI(): Promise<OutstandingData> {
  const response = await api.get<OutstandingData>("dashboard/outstanding");
  return response.data;
}