import { create } from "zustand";
import type { AuthUser } from "../../features/auth/models/auth";
import type { Task } from "../../features/tasks/models/tasks";
import { TimeLog } from "../../features/timeLogs/models/timeLogs";
import type { DailyDashboardData, OutstandingData } from "../../features/dashboard/types";

interface AppState {
  user: AuthUser | null;
  tasks: Task[];
  logs: TimeLog[];
  dashboard: DailyDashboardData | null;
  weeklySummary: DailyDashboardData[];
  outstanding: OutstandingData | null;

  setUser: (user: AuthUser | null) => void;
  setDashboard: (dashboard: DailyDashboardData) => void;
  setWeeklySummary: (weeklySummary: DailyDashboardData[]) => void;
  setOutstanding: (outstanding: OutstandingData) => void;

  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  replaceTask: (task: Task) => void;
  removeTask: (id: string) => void;

  setLogs: (logs: TimeLog[]) => void;
  addLog: (log: TimeLog) => void;
  updateLog: (log: Pick<TimeLog, "id" | "endedAt">) => void;
}

/** Shared application data. Request status and errors stay inside view-models. */
export const useAppStore = create<AppState>((set) => ({
  user: null,
  tasks: [],
  logs: [],
  dashboard: null,
  weeklySummary: [],
  outstanding: null,

  setUser: (user) => set({ user }),
  setDashboard: (dashboard) => set({ dashboard }),
  setWeeklySummary: (weeklySummary) => set({ weeklySummary }),
  setOutstanding: (outstanding) => set({ outstanding }),

  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
  replaceTask: (task) => set((state) => ({ tasks: state.tasks.map((item) => item.id === task.id ? task : item) })),
  removeTask: (id) => set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) })),

  setLogs: (logs) => set({ logs }),
  addLog: (log) => set((state) => ({ logs: [log, ...state.logs], activeLogId: log.id })),

  updateLog: (log) => set((state) => ({
    logs: state.logs.map((item) => item.id === log.id ? { ...item, ...log } : item),
  }))
}));