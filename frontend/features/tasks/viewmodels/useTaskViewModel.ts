"use client";

import { useCallback } from "react";
import { useState } from "react";
import { createTaskAPI, deleteTaskAPI, getTasksAPI, updateTaskAPI } from "../repository";
import { useAppStore } from "../../../shared/stores/useAppStore";
import type { CreateTaskInput, TaskStatus, UpdateTaskInput } from "../types";

export function useTaskViewModel() {
  const { tasks, setTasks, addTask, replaceTask, removeTask } = useAppStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const tasksData = await getTasksAPI();
      setTasks(tasksData);
    }
    catch {
      setError("Unable to load tasks.");
    }
    finally {
      setLoading(false);
    }
  }, [setError, setLoading, setTasks]);

  async function createTask(input: CreateTaskInput) {
    try {
      const taskData = await createTaskAPI(input);
      addTask(taskData);
    }
    catch {
      setError("Unable to create task.");
    }
  }

  async function updateStatus(id: string, status: TaskStatus) {
    try {
      const taskData = await updateTaskAPI(id, { status });
      replaceTask(taskData);
    }
    catch {
      setError("Unable to update task.");
    }
  }

  async function updateTask(id: string, input: UpdateTaskInput) {
    try {
      const taskData = await updateTaskAPI(id, input);
      replaceTask(taskData);
      return { success: true };
    }
    catch {
      setError("Unable to update task.");
      return { success: false };
    }
  }

  async function deleteTask(id: string) {
    try {
      await deleteTaskAPI(id);
      removeTask(id);
    }
    catch {
      setError("Unable to delete task.");
    }
  }

  return { tasks, loading, error, loadTasks, createTask, updateStatus, updateTask, deleteTask };
}