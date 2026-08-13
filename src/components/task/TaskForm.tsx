"use client";

import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ApiRequestError } from "@/lib/api";
import type { Task, TaskPriority, TaskStatus } from "@/types/task";

export interface TaskFormValues {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
}

interface TaskFormProps {
  initialValues?: Partial<TaskFormValues>;
  submitLabel: string;
  onSubmit: (values: TaskFormValues) => Promise<void>;
  onCancel: () => void;
}

const STATUS_OPTIONS = [
  { value: "TODO", label: "To Do" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "DONE", label: "Done" },
];

const PRIORITY_OPTIONS = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
];

const DEFAULTS: TaskFormValues = {
  title: "",
  description: "",
  status: "TODO",
  priority: "MEDIUM",
  dueDate: "",
};

function validate(values: TaskFormValues): Record<string, string> {
  const errors: Record<string, string> = {};
  if (values.title.trim().length < 3) {
    errors.title = "Title is required and must be at least 3 characters.";
  }
  if (values.dueDate && Number.isNaN(new Date(values.dueDate).getTime())) {
    errors.dueDate = "Enter a valid date.";
  }
  return errors;
}

export function TaskForm({ initialValues, submitLabel, onSubmit, onCancel }: TaskFormProps) {
  const [values, setValues] = useState<TaskFormValues>({ ...DEFAULTS, ...initialValues });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = <K extends keyof TaskFormValues>(key: K, value: TaskFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const clientErrors = validate(values);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      await onSubmit(values);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setSubmitError(err.message);
        if (err.fieldErrors) setErrors(err.fieldErrors);
      } else {
        setSubmitError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {submitError && (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
          {submitError}
        </div>
      )}

      <Input
        label="Title"
        placeholder="e.g. Write project README"
        value={values.title}
        error={errors.title}
        hint="Minimum 3 characters."
        onChange={(e) => handleChange("title", e.target.value)}
      />

      <Textarea
        label="Description"
        placeholder="Optional details…"
        value={values.description}
        error={errors.description}
        onChange={(e) => handleChange("description", e.target.value)}
      />

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Status"
          options={STATUS_OPTIONS}
          value={values.status}
          onChange={(e) => handleChange("status", e.target.value as TaskStatus)}
        />
        <Select
          label="Priority"
          options={PRIORITY_OPTIONS}
          value={values.priority}
          onChange={(e) => handleChange("priority", e.target.value as TaskPriority)}
        />
      </div>

      <Input
        label="Due Date"
        type="date"
        value={values.dueDate}
        error={errors.dueDate}
        onChange={(e) => handleChange("dueDate", e.target.value)}
      />

      <div className="mt-2 flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}

export function taskToFormValues(task: Task): TaskFormValues {
  return {
    title: task.title,
    description: task.description ?? "",
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate ?? "",
  };
}
