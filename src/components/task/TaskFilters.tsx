"use client";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { TaskStatus } from "@/types/task";

interface TaskFiltersProps {
  search: string;
  status: TaskStatus | "ALL";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: TaskStatus | "ALL") => void;
}

const STATUS_OPTIONS = [
  { value: "ALL", label: "All statuses" },
  { value: "TODO", label: "To Do" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "DONE", label: "Done" },
];

export function TaskFilters({ search, status, onSearchChange, onStatusChange }: TaskFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1">
        <Input
          label="Search"
          placeholder="Search by title…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="sm:w-48">
        <Select
          label="Status"
          value={status}
          options={STATUS_OPTIONS}
          onChange={(e) => onStatusChange(e.target.value as TaskStatus | "ALL")}
        />
      </div>
    </div>
  );
}
