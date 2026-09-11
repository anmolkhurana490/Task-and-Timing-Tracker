"use client";

import { useEffect, useState } from "react";
import { useTaskViewModel } from "../viewmodels/useTaskViewModel";
import type { TaskStatus } from "../types";
import { useTimeLogViewModel } from "../../timeLogs/viewmodels/useTimeLogViewModel";

const statusLabels: Record<TaskStatus, string> = {
  PENDING: "Pending",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
};
const statusStyles: Record<TaskStatus, string> = { PENDING: "border-[#d9ddd4] bg-[#f5f4ee] text-[#6d7973]", IN_PROGRESS: "border-[#e7b8a7] bg-[#fff0eb] text-[#a54e39]", COMPLETED: "border-[#b5c9b9] bg-[#e9f1e8] text-[#476257]" };

export default function TasksView() {
  const { tasks, error, loading, loadTasks, createTask, updateStatus } = useTaskViewModel();
  const { activeLogId, startTimer, stopTimer, loadLogs } = useTimeLogViewModel();
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState<"All" | TaskStatus>("All");

  useEffect(() => { void loadTasks(); void loadLogs(); }, [loadTasks, loadLogs]);

  function addTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newTask.trim()) return;
    void createTask({ title: newTask.trim() });
    setNewTask("");
  }

  const visibleTasks = filter === "All" ? tasks : tasks.filter((task) => task.status === filter);

  return (
    <main className="mx-auto max-w-310 px-5 py-10 sm:px-8 sm:py-16">
      <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="mb-5 text-xs font-extrabold uppercase tracking-[.16em] text-[#df7455]">Your workspace</p><h1 className="font-serif text-5xl font-normal tracking-tighter sm:text-7xl">Tasks, without the fog.</h1><p className="mt-5 max-w-120 text-lg leading-relaxed text-[#6d7973]">Capture the next clear step, then give it your attention.</p></div><div className="text-left md:text-right"><p className="text-4xl font-light text-[#476257]">{tasks.filter((task) => task.status === "COMPLETED").length}<span className="text-lg text-[#6d7973]"> / {tasks.length}</span></p><p className="text-sm text-[#6d7973]">completed today</p></div></div>
      <form onSubmit={addTask} className="mb-8 flex flex-col gap-3 border border-[#d9ddd4] bg-[#fffefa] p-4 sm:flex-row"><input value={newTask} onChange={(event) => setNewTask(event.target.value)} className="min-w-0 flex-1 border-0 bg-transparent px-2 py-3 text-base outline-none" placeholder="What needs your attention?" aria-label="New task" /><button className="rounded-full bg-[#476257] px-5 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5" type="submit">Add task <span className="ml-2 text-[#df7455]">↗</span></button></form>
      <div className="mb-5 flex flex-wrap gap-2" aria-label="Task filters">{(["All", "PENDING", "IN_PROGRESS", "COMPLETED"] as const).map((option) => <button key={option} onClick={() => setFilter(option)} className={`rounded-full border px-4 py-2 text-xs font-bold ${filter === option ? "border-[#476257] bg-[#476257] text-white" : "border-[#d9ddd4] text-[#6d7973]"}`} type="button">{option === "All" ? option : statusLabels[option]}</button>)}</div>
      {error && <p className="mb-4 border-l-2 border-[#df7455] bg-[#fff0eb] p-3 text-sm text-[#a54e39]" role="alert">{error}</p>}
      {loading ? <p className="text-sm text-[#6d7973]">Loading tasks...</p> : <div className="grid gap-3">{visibleTasks.map((task) => <article key={task.id} className="border border-[#d9ddd4] bg-[#fffefa] p-5 sm:p-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><div className="mb-2 flex flex-wrap items-center gap-2"><h2 className="font-serif text-2xl font-normal tracking-tight">{task.title}</h2><span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${statusStyles[task.status]}`}>{statusLabels[task.status]}</span></div><p className="max-w-2xl text-sm leading-relaxed text-[#6d7973]">{task.description}</p></div><button onClick={() => activeLogId === task.id ? void stopTimer(activeLogId) : void startTimer(task.id)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold ${activeLogId === task.id ? "bg-[#df7455] text-white" : "border border-[#476257] text-[#476257]"}`} type="button">{activeLogId === task.id ? "Stop timer" : "Start timer"}</button></div><div className="mt-5 flex flex-col gap-3 border-t border-[#d9ddd4] pt-4 text-xs text-[#6d7973] sm:flex-row sm:items-center sm:justify-between"><span>Created {new Date(task.createdAt).toLocaleDateString()}</span><select value={task.status} onChange={(event) => void updateStatus(task.id, event.target.value as TaskStatus)} className="w-fit border border-[#d9ddd4] bg-transparent px-2 py-1.5 text-xs" aria-label={`Status for ${task.title}`}><option value="PENDING">Pending</option><option value="IN_PROGRESS">In progress</option><option value="COMPLETED">Completed</option></select></div></article>)}</div>}
    </main>
  );
}
