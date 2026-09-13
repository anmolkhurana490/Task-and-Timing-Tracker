import type { TimeLog } from "../tasks.model";

interface TaskTimeLogsProps {
  logs: TimeLog[];
  now: number;
}

export function getTimeLogDuration(log: TimeLog, now: number): number {
  const endTime = log.endedAt ? new Date(log.endedAt).getTime() : now;
  return Math.max(0, Math.floor((endTime - new Date(log.startedAt).getTime()) / 1000));
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${remainingSeconds}s`;
  return `${remainingSeconds}s`;
}

export default function TaskTimeLogs({ logs, now }: TaskTimeLogsProps) {
  const totalSeconds = logs.reduce(
    (total, log) => total + getTimeLogDuration(log, now),
    0,
  );

  return (
    <details className="mt-5 border-t border-[#d9ddd4] pt-4">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold text-[#476257]">
        <span>Time logs ({logs.length})</span>
        <span className="text-xs font-normal text-[#6d7973]">
          {formatDuration(totalSeconds)} total
        </span>
      </summary>

      <div className="mt-3 max-h-52 space-y-2 overflow-y-auto pr-1">
        {logs.length === 0 ? (
          <p className="py-2 text-xs text-[#6d7973]">No time logged yet.</p>
        ) : (
          logs.map((log) => {
            const active = log.endedAt === null;
            const duration = getTimeLogDuration(log, now);

            return (
              <div
                className="flex items-center justify-between gap-4 border border-[#e8ebe4] bg-[#fafaf6] px-3 py-2.5 text-xs"
                key={log.id}
              >
                <div className="min-w-0">
                  <p className="font-bold text-[#26302d]">
                    {new Date(log.startedAt).toLocaleString()}
                  </p>
                  <p className={active ? "mt-1 font-bold text-[#df7455]" : "mt-1 text-[#6d7973]"}>
                    {active ? "Active now" : "Completed"}
                  </p>
                </div>
                <span className="shrink-0 font-serif text-base text-[#476257]">
                  {formatDuration(duration)}
                </span>
              </div>
            );
          })
        )}
      </div>
    </details>
  );
}
