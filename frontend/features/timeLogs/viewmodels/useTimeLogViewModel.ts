"use client";

import { useCallback } from "react";
import { useState } from "react";
import { useAppStore } from "../../../shared/stores/useAppStore";
import { getTimeLogsAPI, startTimeAPI, stopTimeAPI } from "../repository";

export function useTimeLogViewModel() {
  const logs = useAppStore((state) => state.logs);
  const activeLogId = useAppStore((state) => state.activeLogId);
  const setLogs = useAppStore((state) => state.setLogs);
  const addLog = useAppStore((state) => state.addLog);
  const updateLog = useAppStore((state) => state.updateLog);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadLogs = useCallback(async () => {
    setLoading(true);
    try { setLogs(await getTimeLogsAPI()); }
    catch { setError("Unable to load time logs."); }
    finally { setLoading(false); }
  }, [setError, setLoading, setLogs]);

  async function startTimer(taskId: string) {
    try { addLog(await startTimeAPI({ taskId })); }
    catch { setError("Unable to start timer."); }
  }

  async function stopTimer(id: string) {
    try { updateLog(await stopTimeAPI(id)); }
    catch { setError("Unable to stop timer."); }
  }

  return { logs, activeLogId, loading, error, loadLogs, startTimer, stopTimer };
}