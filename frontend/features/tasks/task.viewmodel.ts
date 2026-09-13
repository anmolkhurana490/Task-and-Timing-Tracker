"use client";

import { useCallback } from "react";
import { useState } from "react";
import { createTaskAPI, deleteTaskAPI, generateTaskSuggestionsAPI, getTasksAPI, updateTaskAPI } from "./tasks.repository";
import { useAppStore } from "@/shared/stores/useAppStore";
import type { CreateTaskInput, TaskStatus, TaskSuggestion, UpdateTaskInput } from "./tasks.model";

export function useTaskViewModel() {
  const { tasks, setTasks, addTask, replaceTask, removeTask } = useAppStore();

  const [loading, setLoading] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<TaskSuggestion[]>([]);
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

  return {
    tasks,
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
  };
}