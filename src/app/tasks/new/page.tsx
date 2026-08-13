"use client";

import { useRouter } from "next/navigation";
import { TaskForm, type TaskFormValues } from "@/components/task/TaskForm";
import { useTaskStore } from "@/store/taskStore";

export default function NewTaskPage() {
  const router = useRouter();
  const createTask = useTaskStore((s) => s.createTask);

  const handleSubmit = async (values: TaskFormValues) => {
    await createTask({
      title: values.title.trim(),
      description: values.description.trim() || null,
      status: values.status,
      priority: values.priority,
      dueDate: values.dueDate || null,
    });
    router.push("/");
  };

  return (
    <main className="mx-auto max-w-lg px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold">New Task</h1>
      <TaskForm submitLabel="Create Task" onSubmit={handleSubmit} onCancel={() => router.push("/")} />
    </main>
  );
}
