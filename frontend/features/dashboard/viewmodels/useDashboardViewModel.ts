"use client";

import { useCallback } from "react";
import { useState } from "react";
import { getDashboardAPI, getOutstandingAPI, getWeeklySummaryAPI } from "../repository";
import { useAppStore } from "../../../shared/stores/useAppStore";

export function useDashboardViewModel() {
  const {
    dashboard,
    setDashboard,
    weeklySummary,
    setWeeklySummary,
    outstanding,
    setOutstanding,
  } = useAppStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);

    setError("");

    const [dailyResult, weeklyResult, outstandingResult] = await Promise.allSettled([
      getDashboardAPI(),
      getWeeklySummaryAPI(),
      getOutstandingAPI(),
    ]);

    if (dailyResult.status === "fulfilled") setDashboard(dailyResult.value);
    if (weeklyResult.status === "fulfilled") setWeeklySummary(weeklyResult.value);
    if (outstandingResult.status === "fulfilled") setOutstanding(outstandingResult.value);

    if ([dailyResult, weeklyResult, outstandingResult].some((result) => result.status === "rejected")) {
      setError("Some productivity data could not be loaded.");
    }

    setLoading(false);
  }, [setDashboard, setError, setLoading, setOutstanding, setWeeklySummary]);

  return { data: dashboard, weeklySummary, outstanding, loading, error, loadDashboard };
}