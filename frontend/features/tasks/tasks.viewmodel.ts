"use client";

import { useCallback } from "react";
import { useState } from "react";
import { createTaskAPI, deleteTaskAPI, generateTaskSuggestionsAPI, getTasksAPI, startTaskTimerAPI, stopTaskTimerAPI, updateTaskAPI } from "./tasks.repository";
import { useAppStore } from "@/shared/stores/useAppStore";
import type { CreateTaskInput, PaginationQueryInput, PaginationValues, TaskStatus, TaskSuggestion, UpdateTaskInput } from "./tasks.model";

export function useTaskViewModel() {
  const { tasks, setTasks, addTask, replaceTask, removeTask, addTaskLog, stopTaskLog } = useAppStore();

  const [pagination, setPagination] = useState<PaginationValues | null>(null);
  const [loading, setLoading] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<TaskSuggestion[]>([]);
  const [error, setError] = useState("");

  // Loading state here covers task-list retrieval; mutation errors remain local to this view-model.
  const loadTasks = useCallback(async (pageQuery: PaginationQueryInput) => {
    setLoading(true);
    try {
      const tasksData = await getTasksAPI(pageQuery);
      setTasks(tasksData.tasks);
      setPagination(tasksData.pagination);
    }
    catch {
      setError("Unable to load tasks.");
    }
    finally {
      setLoading(false);
    }
  }, [setError, setLoading, setTasks]);

  async function createTask(input: CreateTaskInput) {
    setError("");
    try {
      const taskData = await createTaskAPI(input);
      addTask(taskData);
      return true;
    }
    catch {
      setError("Unable to create task.");
      return false;
    }
  }

  async function suggestTasks(input: string) {
    // The API requires enough context to produce useful suggestions.
    if (input.trim().length < 10) {
      setError("Describe what you need to do in at least 10 characters.");
      return;
    }

    setError("");
    setSuggesting(true);
    try {
      const result = await generateTaskSuggestionsAPI(input.trim());
      setSuggestions(result);
    }
    catch {
      setError("Unable to generate task suggestions.");
      setSuggestions([]);
    }
    finally {
      setSuggesting(false);
    }
  }

  function clearSuggestions() {
    setSuggestions([]);
  }

  // Status changes reuse the task update endpoint so the store receives the server's canonical entity.
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

  async function startTimer(taskId: string) {
    try {
      const logData = await startTaskTimerAPI(taskId);
      addTaskLog(taskId, logData);
    } catch {
      setError("Unable to start timer.");
    }
  }

  async function stopTimer(taskId: string) {
    try {
      const logData = await stopTaskTimerAPI(taskId);
      stopTaskLog(taskId, logData);
    } catch {
      setError("Unable to stop timer.");
    }
  }

  return {
    tasks,
    pagination, setPagination,
    loading,
    suggesting,
    suggestions,
    error,
    loadTasks,
    createTask,
    suggestTasks,
    clearSuggestions,
    updateStatus,
    updateTask,
    deleteTask,
    startTimer, stopTimer
  };
}