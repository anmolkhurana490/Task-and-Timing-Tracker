"use client";

import { useCallback } from "react";
import { useState } from "react";
import { getDashboardAPI } from "../repository";
import { useAppStore } from "../../../shared/stores/useAppStore";

export function useDashboardViewModel() {
  const data = useAppStore((state) => state.dashboard);
  const setData = useAppStore((state) => state.setDashboard);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try { setData(await getDashboardAPI()); }
    catch { setError("Unable to load dashboard."); }
    finally { setLoading(false); }
  }, [setData, setError, setLoading]);

  return { data, loading, error, loadDashboard };
}