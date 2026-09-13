import { create } from "zustand";
import type { AuthUser } from "@/features/auth/auth.model";
import type { Task, TimeLog } from "@/features/tasks/tasks.model";
import type { DailyDashboardData, OutstandingData } from "@/features/dashboard/dashboard.types";

interface AppState {
  user: AuthUser | null;
  tasks: Task[];
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

  addTaskLog: (taskId: string, log: TimeLog) => void;
  stopTaskLog: (taskId: string, log: Pick<TimeLog, "id" | "endedAt">) => void;
}

/** Shared application data. Request status and errors stay inside view-models. */
export const useAppStore = create<AppState>((set) => ({
  user: null,
  tasks: [],
  logs: [],
  dashboard: null,
  weeklySummary: [],
  outstanding: null,

  // Auth and DashBoard updates
  setUser: (user) => set({ user }),
  setDashboard: (dashboard) => set({ dashboard }),
  setWeeklySummary: (weeklySummary) => set({ weeklySummary }),
  setOutstanding: (outstanding) => set({ outstanding }),

  // Task mutations update the canonical collection used by all task-facing views.
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
  replaceTask: (task) => set((state) => ({ tasks: state.tasks.map((item) => item.id === task.id ? task : item) })),
  removeTask: (id) => set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) })),

  addTaskLog: (taskId, log) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? {
            ...task,
            timeLogs: [log, ...task.timeLogs ?? []],
          }
          : task,
      ),
    })),

  stopTaskLog: (taskId, log) =>
    set((state) => ({
      tasks: state.tasks.map((task) => {
        if (task.id !== taskId || !task.timeLogs || task.timeLogs.length === 0) {
          return task;
        }

        return {
          ...task,
          timeLogs: task.timeLogs.map((taskLog, index) =>
            index === 0
              ? {
                ...taskLog,
                ...log
              }
              : taskLog,
          ),
        };
      }),
    })),
}));