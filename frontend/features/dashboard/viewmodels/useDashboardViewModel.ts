"use client";

import { useCallback } from "react";
import { useState } from "react";
import { getDashboardAPI } from "../repository";
import { useAppStore } from "../../../shared/stores/useAppStore";

export function useDashboardViewModel() {
  const { dashboard, setDashboard } = useAppStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);

    try {
      const data = await getDashboardAPI();
      setDashboard(data);
    }
    catch {
      setError("Unable to load dashboard.");
    }
    finally {
      setLoading(false);
    }
  }, [setDashboard, setError, setLoading]);

  return { data: dashboard, loading, error, loadDashboard };
}