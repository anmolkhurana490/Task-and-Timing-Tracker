"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useDashboardViewModel } from "../viewmodels/useDashboardViewModel";

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

export default function DashboardView() {
  const { data, error, loading, loadDashboard } = useDashboardViewModel();

  useEffect(() => { void loadDashboard(); }, [loadDashboard]);

  const totalTasks = (data?.completedTasks.length ?? 0) + (data?.pendingTasks.length ?? 0);
  const completion = totalTasks ? Math.round(((data?.completedTasks.length ?? 0) / totalTasks) * 100) : 0;

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
          <div className="border border-[#d9ddd4] bg-[#fffefa] p-6">
            <p className="text-sm text-[#6d7973]">Focused today</p>
            <p className="my-5 font-serif text-5xl font-normal tracking-tighter text-[#476257]">
              {formatDuration(data?.totalTimeTracked ?? 0)}
            </p>
            <p className="text-xs font-bold text-[#df7455]">Tracked across today&apos;s sessions</p>
          </div>

          <div className="border border-[#d9ddd4] bg-[#fffefa] p-6">
            <p className="text-sm text-[#6d7973]">Tasks completed</p>
            <p className="my-5 font-serif text-5xl font-normal tracking-tighter text-[#476257]">
              {data?.completedTasks.length ?? 0}
            </p>
            <p className="text-xs font-bold text-[#df7455]">{completion}% of today&apos;s tasks</p>
          </div>

          <div className="border border-[#d9ddd4] bg-[#fffefa] p-6">
            <p className="text-sm text-[#6d7973]">Tasks worked on</p>
            <p className="my-5 font-serif text-5xl font-normal tracking-tighter text-[#476257]">
              {data?.tasksWorkedOn.length ?? 0}
            </p>
            <p className="text-xs font-bold text-[#df7455]">Active productivity signal</p>
          </div>
        </section>

        <section className="mt-8 grid gap-3 lg:grid-cols-[1.2fr_.8fr]">
          <div className="border border-[#d9ddd4] bg-[#476257] p-6 text-white sm:p-8">
            <h2 className="font-serif text-3xl font-normal">Today&apos;s progress</h2>

            <div className="mt-10 h-3 bg-[#718d79]">
              <div className="h-full bg-[#df7455]" style={{ width: `${completion}%` }} />
            </div>

            <div className="mt-4 flex justify-between text-sm text-[#c7d3c4]">
              <span>{data?.completedTasks.length ?? 0} completed</span>
              <span>{data?.pendingTasks.length ?? 0} still open</span>
            </div>
          </div>

          <div className="border border-[#d9ddd4] bg-[#fffefa] p-6 sm:p-8">
            <p className="mb-4 text-xs font-extrabold uppercase tracking-[.16em] text-[#df7455]">Next view</p>
            <h2 className="font-serif text-3xl font-normal">Keep the record clear.</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#6d7973]">Review each focus session and see where your time went.</p>

            <Link
              className="mt-8 inline-block text-sm font-bold text-[#476257] underline underline-offset-4"
              href="/time-logs">
              Review time logs
            </Link>
          </div>
        </section>
      </>}
    </main>
  );
}
