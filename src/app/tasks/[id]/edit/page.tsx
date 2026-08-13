"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { TaskForm, taskToFormValues, type TaskFormValues } from "@/components/task/TaskForm";
import { useTaskStore } from "@/store/taskStore";
import { api, ApiRequestError } from "@/lib/api";
import type { Task } from "@/types/task";

export default function EditTaskPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const updateTask = useTaskStore((s) => s.updateTask);

  const [task, setTask] = useState<Task | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .getTask(params.id)
      .then((t) => {
        if (!cancelled) setTask(t);
      })
      .catch((err) => {
        if (!cancelled) {
          setLoadError(err instanceof ApiRequestError ? err.message : "Task not found.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  const handleSubmit = async (values: TaskFormValues) => {
    await updateTask(params.id, {
      title: values.title.trim(),
      description: values.description.trim() || null,
      status: values.status,
      priority: values.priority,
      dueDate: values.dueDate || null,
    });
    router.push("/");
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-lg px-4 py-10">
        <div className="h-8 w-40 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
        <div className="mt-6 h-64 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
      </main>
    );
  }

  if (loadError || !task) {
    return (
      <main className="mx-auto max-w-lg px-4 py-10">
        <p className="text-sm text-red-600 dark:text-red-400">{loadError ?? "Task not found."}</p>
        <button className="mt-4 text-sm text-blue-600 underline" onClick={() => router.push("/")}>
          Back to task list
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold">Edit Task</h1>
      <TaskForm
        initialValues={taskToFormValues(task)}
        submitLabel="Save Changes"
        onSubmit={handleSubmit}
        onCancel={() => router.push("/")}
      />
    </main>
  );
}
