"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTaskStore } from "@/store/taskStore";
import { useDebounce } from "@/lib/useDebounce";
import { TaskCard } from "@/components/task/TaskCard";
import { TaskFilters } from "@/components/task/TaskFilters";
import { Pagination } from "@/components/task/Pagination";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { Task } from "@/types/task";

export default function HomePage() {
  const router = useRouter();
  const {
    tasks,
    isLoading,
    isMutating,
    error,
    search,
    statusFilter,
    page,
    total,
    totalPages,
    fetchTasks,
    setSearch,
    setStatusFilter,
    setPage,
    deleteTask,
  } = useTaskStore();

  // Local input state, debounced before it hits the store/API
  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, 350);

  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (debouncedSearch !== search) {
      setSearch(debouncedSearch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    await deleteTask(taskToDelete.id);
    setTaskToDelete(null);
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">TaskBoard</h1>
          <p className="text-sm text-gray-500">Manage your tasks in one place.</p>
        </div>
        <Link href="/tasks/new">
          <Button>+ New Task</Button>
        </Link>
      </div>

      <TaskFilters
        search={searchInput}
        status={statusFilter}
        onSearchChange={setSearchInput}
        onStatusChange={setStatusFilter}
      />

      <div className="mt-6">
        {error && (
          <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800"
              />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 py-16 text-center dark:border-gray-700">
            <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
              {search || statusFilter !== "ALL" ? "No matching tasks" : "No tasks yet"}
            </p>
            <p className="mt-1 text-sm text-gray-400">
              {search || statusFilter !== "ALL"
                ? "Try a different search or filter."
                : "Create your first task to get started."}
            </p>
            {!search && statusFilter === "ALL" && (
              <Link href="/tasks/new" className="mt-4">
                <Button>+ New Task</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={(t) => router.push(`/tasks/${t.id}/edit`)}
                onDelete={setTaskToDelete}
              />
            ))}
          </div>
        )}

        {!isLoading && tasks.length > 0 && (
          <Pagination page={page} totalPages={totalPages} total={total} onPageChange={setPage} />
        )}
      </div>

      <ConfirmDialog
        open={!!taskToDelete}
        title="Delete task"
        message={
          taskToDelete
            ? `Are you sure you want to delete "${taskToDelete.title}"? This can't be undone.`
            : ""
        }
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setTaskToDelete(null)}
        isLoading={isMutating}
      />
    </main>
  );
}
