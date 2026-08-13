import { Card } from "@/components/ui/Card";
import { StatusBadge, PriorityBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { Task } from "@/types/task";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

function formatDueDate(dueDate: string | null): string {
  if (!dueDate) return "No due date";
  const date = new Date(dueDate);
  if (Number.isNaN(date.getTime())) return "No due date";
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium leading-snug">{task.title}</h3>
      </div>

      {task.description && (
        <p className="line-clamp-2 text-sm text-gray-500 dark:text-gray-400">{task.description}</p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={task.status} />
        <PriorityBadge priority={task.priority} />
      </div>

      <p className="text-xs text-gray-400">Due: {formatDueDate(task.dueDate)}</p>

      <div className="mt-1 flex gap-2">
        <Button variant="secondary" className="flex-1" onClick={() => onEdit(task)}>
          Edit
        </Button>
        <Button variant="danger" className="flex-1" onClick={() => onDelete(task)}>
          Delete
        </Button>
      </div>
    </Card>
  );
}
