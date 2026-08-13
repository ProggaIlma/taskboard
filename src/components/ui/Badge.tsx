import { cn } from "@/lib/utils";
import type { TaskPriority, TaskStatus } from "@/types/task";

const STATUS_STYLES: Record<TaskStatus, string> = {
  TODO: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  IN_PROGRESS: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  DONE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
};

const STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

const PRIORITY_STYLES: Record<TaskPriority, string> = {
  LOW: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  MEDIUM: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  HIGH: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

const baseBadge =
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";

export function StatusBadge({ status }: { status: TaskStatus }) {
  return <span className={cn(baseBadge, STATUS_STYLES[status])}>{STATUS_LABELS[status]}</span>;
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return <span className={cn(baseBadge, PRIORITY_STYLES[priority])}>{PRIORITY_LABELS[priority]}</span>;
}
