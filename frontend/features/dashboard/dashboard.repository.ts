import api from "@/lib/api";
import type { DailyDashboardData, OutstandingData } from "./dashboard.types";

export async function getDashboardAPI(): Promise<DailyDashboardData> {
  const response = await api.get<DailyDashboardData>("dashboard");
  return response.data;
}

export async function getWeeklySummaryAPI(): Promise<DailyDashboardData[]> {
  const response = await api.get<DailyDashboardData[]>("dashboard/weekly");
  return response.data;
}

export async function getOutstandingAPI(): Promise<OutstandingData> {
  const response = await api.get<OutstandingData>("dashboard/outstanding");
  return response.data;
}