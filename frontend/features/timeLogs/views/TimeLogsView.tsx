"use client";

import { useEffect } from "react";
import { useTimeLogViewModel } from "../timeLogs.viewmodel";

/** Formats seconds for the history summary and individual log rows. */
function formatDuration(seconds: number | null) {
  if (!seconds) return "Active";
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
}

/** Calculates live elapsed time for active logs and persisted elapsed time for completed logs. */
function computeDuration(start: string, end: string | null) {
  const startDate = new Date(start).getTime();
  const endDate = new Date(end ?? Date.now()).getTime();
  return Math.max(0, Math.floor((endDate - startDate) / 1000));
}

export default function TimeLogsView() {
  const { logs, error, loading, loadLogs } = useTimeLogViewModel();

  // History is fetched when the view mounts; active rows use the same timestamps for live display.
  useEffect(() => {
    void loadLogs();
  }, [loadLogs]);

  // Total time is derived from the current log collection rather than stored separately.
  const totalSeconds = logs.reduce((total, log) => total + computeDuration(log.startedAt, log.endedAt), 0);

  return (
    <main className="mx-auto max-w-310 px-5 py-10 sm:px-8 sm:py-16">
      <div className="mb-10">
        <p className="mb-5 text-xs font-extrabold uppercase tracking-[.16em] text-[#df7455]">
          History and transparency
        </p>
        <h1 className="font-serif text-5xl font-normal tracking-tighter sm:text-7xl">
          Where your time went.
        </h1>
        <p className="mt-5 max-w-120 text-lg leading-relaxed text-[#6d7973]">
          A clear record of every focus session, so estimates become better over
          time.
        </p>
      </div>
      {error && (
        <p
          className="mb-5 border-l-2 border-[#df7455] bg-[#fff0eb] p-3 text-sm text-[#a54e39]"
          role="alert"
        >
          {error}
        </p>
      )}
      <div className="mb-5 flex flex-col justify-between gap-4 border border-[#d9ddd4] bg-[#476257] p-6 text-white sm:flex-row sm:items-end sm:p-8">
        <div>
          <p className="text-sm text-[#c7d3c4]">Total tracked</p>
          <p className="mt-2 font-serif text-5xl">
            {formatDuration(totalSeconds)}
          </p>
        </div>
        <p className="text-sm text-[#c7d3c4]">{logs.length} sessions</p>
      </div>
      {loading ? (
        <p className="text-sm text-[#6d7973]">Loading time logs...</p>
      ) : (
        <div className="overflow-x-auto border border-[#d9ddd4] bg-[#fffefa]">
          <div className="grid min-w-150 grid-cols-[1.4fr_1fr_.6fr_.8fr] border-b border-[#d9ddd4] px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#6d7973]">
            <span>Task</span>
            <span>Started</span>
            <span>Duration</span>
            <span>Status</span>
          </div>
          {logs.map((log) => (
            <div
              key={log.id}
              className="grid min-w-150 grid-cols-[1.4fr_1fr_.6fr_.8fr] items-center border-b border-[#d9ddd4] px-5 py-5 text-sm last:border-0"
            >
              <span className="font-bold">{log.task?.title || "Unknown Task"}</span>
              <span className="text-[#6d7973]">
                {new Date(log.startedAt).toLocaleString()}
              </span>
              <span className="font-serif text-lg text-[#476257]">
                {formatDuration(computeDuration(log.startedAt, log.endedAt))}
              </span>
              <span className="text-[#6d7973]">
                {log.endedAt ? "Completed" : "Active"}
              </span>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
