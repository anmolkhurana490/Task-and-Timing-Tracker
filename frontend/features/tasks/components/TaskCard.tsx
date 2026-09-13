import { useTimeLogViewModel } from "@/features/timeLogs/timeLogs.viewmodel";
import { Task, TaskStatus } from "../tasks.model";
import { TimeLog } from "@/features/timeLogs/timeLogs.model";

interface TaskCardProps {
  task: Task;
  activeLog?: TimeLog;
}

export const statusLabels: Record<TaskStatus, string> = {
  PENDING: "Pending",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
};

const statusStyles: Record<TaskStatus, string> = {
  PENDING: "border-[#d9ddd4] bg-[#f5f4ee] text-[#6d7973]",
  IN_PROGRESS: "border-[#e7b8a7] bg-[#fff0eb] text-[#a54e39]",
  COMPLETED: "border-[#b5c9b9] bg-[#e9f1e8] text-[#476257]",
};

/** Presentational task summary with the timer action delegated to the time-log view-model. */
const TaskCard = ({ task, activeLog }: TaskCardProps) => {
  const { startTimer, stopTimer } = useTimeLogViewModel();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <h2 className="font-serif text-2xl font-normal tracking-tight">{task.title}</h2>
          <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${statusStyles[task.status]}`}>{statusLabels[task.status]}</span>
        </div>
        <p className="max-w-2xl text-sm leading-relaxed text-[#6d7973]">{task.description}</p>
      </div>
      <button
        onClick={() => activeLog ? stopTimer(activeLog.id) : startTimer(task.id)}
        className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold ${activeLog ? "bg-[#df7455] text-white" : "border border-[#476257] text-[#476257]"}`}
        type="button"
      >
        {activeLog ? "Stop timer" : "Start timer"}
      </button>
    </div>
  );
}

export default TaskCard;