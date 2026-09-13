"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useDashboardViewModel } from "../dashboard.viewmodel";
import type { Task } from "@/features/tasks/tasks.model";
import type { TimeLog } from "@/features/timeLogs/timeLogs.model";

function formatDuration(seconds: number) {
  if (seconds <= 0) return "0m";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return hours ? `${hours}h ${minutes}m` : `${minutes}m`;
}

function formatDay(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString(undefined, { weekday: "short" });
}

function taskAge(task: Task, now: number) {
  const age = Math.floor((now - new Date(task.updatedAt).getTime()) / 86_400_000);
  return age > 0 ? `${age}d waiting` : "Updated today";
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="border border-[#d9ddd4] bg-[#fffefa] p-6">
      <p className="text-sm text-[#6d7973]">{label}</p>
      <p className="my-5 font-serif text-5xl font-normal tracking-tighter text-[#476257]">{value}</p>
      <p className="text-xs font-bold text-[#df7455]">{detail}</p>
    </div>
  );
}

function WeeklyChart({ weeklySummary }: { weeklySummary: { date: string; totalTasks: number; totalTimeTracked: number; completedTasks: number }[] }) {
  const maxSeconds = Math.max(...weeklySummary.map((day) => day.totalTimeTracked), 1);

  return (
    <div className="border border-[#d9ddd4] bg-[#fffefa] p-6 sm:p-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#df7455]">Last week</p>
          <h2 className="mt-2 font-serif text-3xl font-normal">Your rhythm at a glance.</h2>
        </div>
        <p className="hidden text-right text-sm text-[#6d7973] sm:block">Focus time by day</p>
      </div>
      {weeklySummary.length ? (
        <div className="mt-8 grid h-56 grid-cols-7 items-end gap-2 sm:gap-4">
          {weeklySummary.map((day) => {
            const height = Math.max((day.totalTimeTracked / maxSeconds) * 100, day.totalTimeTracked ? 8 : 2);
            return (
              <div className="flex h-full flex-col items-center justify-end gap-2" key={day.date}>
                <span className="text-[10px] font-bold text-[#6d7973] sm:text-xs">{formatDuration(day.totalTimeTracked)}</span>
                <div className="flex h-36 w-full items-end rounded-t-sm bg-[#eef1e9]">
                  <div className="w-full rounded-t-sm bg-[#df7455]" style={{ height: `${height}%` }} title={`${day.totalTasks} tasks`} />
                </div>
                <span className="text-[10px] font-bold text-[#6d7973] sm:text-xs">{formatDay(day.date)}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="mt-10 text-sm text-[#6d7973]">Your weekly chart will appear after your first focus session.</p>
      )}
    </div>
  );
}

function ReminderList({ tasks, activeLogs }: { tasks: Task[]; activeLogs: TimeLog[] }) {
  const [now] = useState(() => Date.now());
  const reminders = tasks.slice(0, 2);

  return (
    <div className="border border-[#d9ddd4] bg-[#fffefa] p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#df7455]">Needs attention</p>
          <h2 className="mt-2 font-serif text-3xl font-normal">Keep the loop closed.</h2>
        </div>
        <span className="rounded-full bg-[#fff0eb] px-3 py-1 text-xs font-bold text-[#a54e39]">{tasks.length + activeLogs.length}</span>
      </div>

      <div className="mt-6 grid gap-3">
        {activeLogs.slice(0, 2).map((log) => (
          <div className="border-l-2 border-[#df7455] bg-[#fff5f1] px-4 py-3" key={log.id}>
            <p className="text-sm font-bold">Timer still running</p>
            <p className="mt-1 text-xs text-[#6d7973]">{log.task?.title ?? "A task"} · started {new Date(log.startedAt).toLocaleString()}</p>
          </div>
        ))}

        {reminders.map((task) => (
          <div className="flex items-center justify-between gap-3 border-b border-[#d9ddd4] pb-3" key={task.id}>
            <div className="min-w-0"><p className="truncate text-sm font-bold">{task.title}</p><p className="mt-1 text-xs text-[#6d7973]">{taskAge(task, now)}</p></div>
            <span className="shrink-0 text-xs font-bold text-[#a54e39]">Open</span>
          </div>
        ))}

        {!activeLogs.length && !reminders.length && <p className="text-sm text-[#6d7973]">Nothing stale is asking for your attention.</p>}
      </div>

      <Link className="mt-6 inline-block text-sm font-bold text-[#476257] underline underline-offset-4" href="/tasks">Review tasks</Link>
    </div>
  );
}

export default function DashboardView() {
  const { data, weeklySummary, outstanding, error, loading, loadDashboard } = useDashboardViewModel();

  useEffect(() => { void loadDashboard(); }, [loadDashboard]);

  const totalTasks = (data?.completedTasks ?? 0) + (data?.notCompletedTasks ?? 0);
  const completion = totalTasks ? Math.round(((data?.completedTasks ?? 0) / totalTasks) * 100) : 0;
  const outstandingTasks = outstanding?.notCompletedTasks ?? [];
  const activeTimeLogs = outstanding?.activeTimeLogs ?? [];

  return (
    <main className="mx-auto max-w-310 px-5 py-10 sm:px-8 sm:py-16">
      <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="mb-5 text-xs font-extrabold uppercase tracking-[.16em] text-[#df7455]">{data?.date ?? "Today"}</p>
          <h1 className="font-serif text-5xl font-normal tracking-tighter sm:text-7xl">A day with direction.</h1>

          <p className="mt-5 max-w-120 text-lg leading-relaxed text-[#6d7973]">
            Your productivity is not a race. Here is the shape of your effort today.
          </p>
        </div>

        <Link className="w-fit rounded-full bg-[#476257] px-5 py-3 text-sm font-bold text-white" href="/tasks">
          Open tasks <span className="ml-2 text-[#df7455]">↗</span>
        </Link>
      </div>

      {error && <p className="mb-5 border-l-2 border-[#df7455] bg-[#fff0eb] p-3 text-sm text-[#a54e39]" role="alert">{error}</p>}

      {loading && !data ? <p className="text-sm text-[#6d7973]">Loading your productivity...</p> : <>
        <section className="grid gap-3 md:grid-cols-3">
          <Metric label="Focused today" value={formatDuration(data?.totalTimeTracked ?? 0)} detail="Tracked across today's sessions" />
          <Metric label="Tasks completed" value={String(data?.completedTasks ?? 0)} detail={`${completion}% of today&apos;s tasks`} />
          <Metric label="Tasks worked on" value={String(data?.totalTasks ?? 0)} detail="Active productivity signal" />
        </section>

        <section className="mt-8 grid gap-3 lg:grid-cols-[1.2fr_.8fr]">
          <div className="border border-[#d9ddd4] bg-[#476257] p-6 text-white sm:p-8">
            <h2 className="font-serif text-3xl font-normal">Today&apos;s progress</h2>

            <div className="mt-10 h-3 bg-[#718d79]">
              <div className="h-full bg-[#df7455]" style={{ width: `${completion}%` }} />
            </div>

            <div className="mt-4 flex justify-between text-sm text-[#c7d3c4]">
              <span>{data?.completedTasks ?? 0} completed</span>
              <span>{data?.notCompletedTasks ?? 0} still open</span>
            </div>
          </div>

          <ReminderList tasks={outstandingTasks} activeLogs={activeTimeLogs} />
        </section>

        <section className="mt-8">
          <WeeklyChart weeklySummary={weeklySummary} />
        </section>

        <section className="mt-8 grid gap-3 lg:grid-cols-[1.15fr_.85fr]">
          <div className="border border-[#d9ddd4] bg-[#fffefa] p-6 sm:p-8">
            <p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#df7455]">Today&apos;s signal</p>
            <h2 className="mt-2 font-serif text-3xl font-normal">Momentum, made visible.</h2>
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-[#d9ddd4] pt-5">
              <div><p className="text-2xl font-bold text-[#476257]">{data?.totalTasks ?? 0}</p><p className="mt-1 text-xs text-[#6d7973]">worked on</p></div>
              <div><p className="text-2xl font-bold text-[#476257]">{data?.completedTasks ?? 0}</p><p className="mt-1 text-xs text-[#6d7973]">completed</p></div>
              <div><p className="text-2xl font-bold text-[#476257]">{activeTimeLogs.length}</p><p className="mt-1 text-xs text-[#6d7973]">active timers</p></div>
            </div>
          </div>

          <div className="border border-[#d9ddd4] bg-[#fffefa] p-6 sm:p-8">
            <p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#df7455]">Keep exploring</p>
            <h2 className="mt-2 font-serif text-3xl font-normal">See the details behind the day.</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#6d7973]">Review every focus session and use the pattern to plan your next clear step.</p>
            <Link className="mt-6 inline-block text-sm font-bold text-[#476257] underline underline-offset-4" href="/time-logs">Review time logs</Link>
          </div>
        </section>
      </>}
    </main>
  );
}
