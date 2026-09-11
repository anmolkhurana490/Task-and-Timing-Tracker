"use client";

import { useCallback } from "react";
import { useState } from "react";
import { createTaskAPI, deleteTaskAPI, getTasksAPI, updateTaskAPI } from "../repository";
import { useAppStore } from "../../../shared/stores/useAppStore";
import type { CreateTaskInput, TaskStatus } from "../types";

export function useTaskViewModel() {
  const tasks = useAppStore((state) => state.tasks);
  const setTasks = useAppStore((state) => state.setTasks);
  const addTask = useAppStore((state) => state.addTask);
  const replaceTask = useAppStore((state) => state.replaceTask);
  const removeTask = useAppStore((state) => state.removeTask);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try { setTasks(await getTasksAPI()); }
    catch { setError("Unable to load tasks."); }
    finally { setLoading(false); }
  }, [setError, setLoading, setTasks]);

  async function createTask(input: CreateTaskInput) {
    try { addTask(await createTaskAPI(input)); }
    catch { setError("Unable to create task."); }
  }

  async function updateStatus(id: string, status: TaskStatus) {
    try { replaceTask(await updateTaskAPI(id, { status })); }
    catch { setError("Unable to update task."); }
  }

  async function deleteTask(id: string) {
    try { await deleteTaskAPI(id); removeTask(id); }
    catch { setError("Unable to delete task."); }
  }

  return { tasks, loading, error, loadTasks, createTask, updateStatus, deleteTask };
}