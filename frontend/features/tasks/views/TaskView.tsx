"use client";

import { useEffect, useState } from "react";
import { useTaskViewModel } from "../tasks.viewmodel";
import type { PaginationQueryInput, Task, TaskStatus } from "../tasks.model";
import TaskCard, { statusLabels } from "../components/TaskCard";
import Pagination from "../components/Pagination";
import { useSearchParams } from "next/navigation";

export default function TasksView() {
  const { tasks, pagination, error, loading, suggesting, suggestions, loadTasks, createTask, suggestTasks, clearSuggestions, updateStatus, updateTask, deleteTask } = useTaskViewModel();

  const searchParams = useSearchParams();
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState<"All" | TaskStatus>("All");

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Initial task and log loads keep task cards and timer controls in sync.
  useEffect(() => {
    const paramsObj = Object.fromEntries(searchParams.entries());
    const pageQuery = {
      page: Number(paramsObj.page) || 1,
      limit: Number(paramsObj.limit) || 10
    }
    loadTasks(pageQuery);
  }, [loadTasks, searchParams]);

  // Direct task creation clears the suggestion context because the input has been consumed.
  function addTask(event: React.SubmitEvent) {
    event.preventDefault();
    if (!newTask.trim()) return;
    void createTask({ title: newTask.trim() });
    setNewTask("");
    clearSuggestions();
  }

  // A selected suggestion is already a complete create payload.
  async function chooseSuggestion(title: string, description: string) {
    const created = await createTask({ title, description });
    if (created) clearSuggestions();
  }

  // Filtering is derived from the shared task collection and does not require another request.
  const visibleTasks = filter === "All" ? tasks : tasks.filter((task) => task.status === filter);

  // Editing state is kept local because it represents an unfinished form, not persisted task data.
  function startEditing(task: Task) {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  }

  // Close the editor only after the server confirms the update.
  async function saveTask(taskId: string) {
    if (!editTitle.trim()) return;
    const saved = await updateTask(taskId, {
      title: editTitle.trim(),
      description: editDescription.trim(),
    });
    if (saved) setEditingTaskId(null);
  }

  return (
    <main className="mx-auto max-w-310 px-5 py-10 sm:px-8 sm:py-16">
      <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="mb-5 text-xs font-extrabold uppercase tracking-[.16em] text-[#df7455]">
            Your workspace
          </p>
          <h1 className="font-serif text-5xl font-normal tracking-tighter sm:text-7xl">
            Tasks, without the fog.
          </h1>
          <p className="mt-5 max-w-120 text-lg leading-relaxed text-[#6d7973]">
            Capture the next clear step, then give it your attention.
          </p>
        </div>
        <div className="text-left md:text-right">
          <p className="text-4xl font-light text-[#476257]">
            {tasks.filter((task) => task.status === "COMPLETED").length}
            <span className="text-lg text-[#6d7973]"> / {tasks.length}</span>
          </p>
          <p className="text-sm text-[#6d7973]">completed today</p>
        </div>
      </div>

      <form
        onSubmit={addTask}
        className="mb-8 flex flex-col gap-3 border border-[#d9ddd4] bg-[#fffefa] p-4 sm:flex-row"
      >
        <input
          value={newTask}
          onChange={(event) => setNewTask(event.target.value)}
          className="min-w-0 flex-1 border-0 bg-transparent px-2 py-3 text-base outline-none"
          placeholder="What needs your attention?"
          aria-label="New task"
        />
        <button
          className="rounded-full bg-[#476257] px-5 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
          type="submit"
        >
          Add task <span className="ml-2 text-[#df7455]">↗</span>
        </button>
        <button
          className="rounded-full border border-[#476257] px-5 py-3 text-sm font-bold text-[#476257] disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          disabled={suggesting || newTask.trim().length < 10}
          onClick={() => void suggestTasks(newTask)}
        >
          {suggesting ? "Thinking..." : "Suggest tasks"}
        </button>
      </form>

      {suggestions.length > 0 && (
        <section className="relative z-10 -mt-6 mb-8 border border-[#d9ddd4] bg-[#fffefa] p-4 shadow-[0_14px_35px_rgba(71,98,87,0.08)]" aria-label="Suggested tasks">
          <div className="mb-3 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#df7455]">Suggestions</p>
              <p className="mt-1 text-sm text-[#6d7973]">Choose one to add it to your task list.</p>
            </div>
            <button className="text-xs font-bold text-[#6d7973] underline underline-offset-4" type="button" onClick={clearSuggestions}>Dismiss</button>
          </div>
          <div className="grid gap-2">
            {suggestions.map((suggestion) => (
              <button
                className="w-full border border-[#d9ddd4] p-4 text-left transition-colors hover:border-[#476257] hover:bg-[#f5f7f1]"
                key={`${suggestion.title}-${suggestion.description}`}
                type="button"
                onClick={() => void chooseSuggestion(suggestion.title, suggestion.description)}
              >
                <span className="block text-sm font-bold text-[#26302d]">{suggestion.title}</span>
                <span className="mt-1 block text-xs leading-relaxed text-[#6d7973]">{suggestion.description}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      <div className="mb-5 flex flex-wrap gap-2" aria-label="Task filters">
        {(["All", "PENDING", "IN_PROGRESS", "COMPLETED"] as const).map(
          (option) => (
            <button
              key={option}
              onClick={() => setFilter(option)}
              className={`rounded-full border px-4 py-2 text-xs font-bold ${filter === option ? "border-[#476257] bg-[#476257] text-white" : "border-[#d9ddd4] text-[#6d7973]"}`}
              type="button"
            >
              {option === "All" ? option : statusLabels[option]}
            </button>
          ),
        )}
      </div>
      {error && (
        <p
          className="mb-4 border-l-2 border-[#df7455] bg-[#fff0eb] p-3 text-sm text-[#a54e39]"
          role="alert"
        >
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-[#6d7973]">Loading tasks...</p>
      ) : (
        <div className="grid gap-3">
          {visibleTasks.map((task) => (
            <article
              key={task.id}
              className="border border-[#d9ddd4] bg-[#fffefa] p-5 sm:p-6"
            >
              {editingTaskId === task.id ? (
                <div className="grid gap-3">
                  <input value={editTitle} onChange={(event) => setEditTitle(event.target.value)} className="border border-[#d9ddd4] bg-transparent px-3 py-2 text-lg outline-none focus:border-[#476257]" aria-label="Edit task name" />

                  <textarea value={editDescription} onChange={(event) => setEditDescription(event.target.value)} className="min-h-24 resize-y border border-[#d9ddd4] bg-transparent px-3 py-2 text-sm outline-none focus:border-[#476257]" aria-label="Edit task description" />

                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => void saveTask(task.id)} className="rounded-full bg-[#476257] px-4 py-2 text-xs font-bold text-white" type="button">Save</button>
                    <button onClick={() => setEditingTaskId(null)} className="rounded-full border border-[#d9ddd4] px-4 py-2 text-xs font-bold text-[#6d7973]" type="button">Cancel</button>
                  </div>
                </div>
              ) : (
                <TaskCard task={task} />
              )}

              <div className="mt-5 flex flex-col gap-3 border-t border-[#d9ddd4] pt-4 text-xs text-[#6d7973] sm:flex-row sm:items-center sm:justify-between">
                <span>Created {new Date(task.createdAt).toLocaleDateString()}</span>

                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={task.status}
                    onChange={(event) => void updateStatus(task.id, event.target.value as TaskStatus)}
                    className="w-fit border border-[#d9ddd4] bg-transparent px-2 py-1.5 text-xs"
                    aria-label={`Status for ${task.title}`}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>

                  <button onClick={() => startEditing(task)} className="font-bold text-[#476257] underline underline-offset-4" type="button">Edit</button>

                  <button onClick={() => void deleteTask(task.id)} className="font-bold text-[#a54e39] underline underline-offset-4" type="button">Delete</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {pagination && pagination.totalPages > 1 && <Pagination values={pagination} />}
    </main>
  );
}