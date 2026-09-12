"use client";

import { useCallback } from "react";
import { useState } from "react";
import { useAppStore } from "../../../shared/stores/useAppStore";
import { getTimeLogsAPI, startTimeAPI, stopTimeAPI } from "../repository";

export function useTimeLogViewModel() {
  const { logs, setLogs, addLog, updateLog } = useAppStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadLogs = useCallback(async () => {
    setLoading(true);
    try {
      const logsData = await getTimeLogsAPI()
      setLogs(logsData);
    }
    catch {
      setError("Unable to load time logs.");
    }
    finally {
      setLoading(false);
    }
  }, [setError, setLoading, setLogs]);

  async function startTimer(taskId: string) {
    try {
      const logData = await startTimeAPI({ taskId });
      addLog(logData);
    }
    catch {
      setError("Unable to start timer.");
    }
  }

  async function stopTimer(id: string) {
    try {
      const logData = await stopTimeAPI(id);
      updateLog(logData);
    }
    catch {
      setError("Unable to stop timer.");
    }
  }

  return { logs, loading, error, loadLogs, startTimer, stopTimer };
}