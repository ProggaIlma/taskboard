import { create } from "zustand";
import { api, ApiRequestError } from "@/lib/api";
import type { CreateTaskInput, Task, TaskStatus, UpdateTaskInput } from "@/types/task";

const PAGE_SIZE = 6;

interface TaskStoreState {
  tasks: Task[];
  isLoading: boolean;
  isMutating: boolean;
  error: string | null;

  search: string;
  statusFilter: TaskStatus | "ALL";
  page: number;
  limit: number;
  total: number;
  totalPages: number;

  // Actions
  fetchTasks: () => Promise<void>;
  setSearch: (value: string) => void;
  setStatusFilter: (status: TaskStatus | "ALL") => void;
  setPage: (page: number) => void;
  createTask: (input: CreateTaskInput) => Promise<Task>;
  updateTask: (id: string, input: UpdateTaskInput) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskStoreState>((set, get) => ({
  tasks: [],
  isLoading: false,
  isMutating: false,
  error: null,

  search: "",
  statusFilter: "ALL",
  page: 1,
  limit: PAGE_SIZE,
  total: 0,
  totalPages: 1,

  fetchTasks: async () => {
    const { search, statusFilter, page, limit } = get();
    set({ isLoading: true, error: null });
    try {
      const result = await api.listTasks({ search, status: statusFilter, page, limit });
      set({
        tasks: result.data,
        total: result.meta.total,
        totalPages: result.meta.totalPages,
        page: result.meta.page,
        isLoading: false,
      });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof ApiRequestError ? err.message : "Failed to load tasks.",
      });
    }
  },

  // Search/filter changes reset to page 1, then refetch.
  setSearch: (value) => {
    set({ search: value, page: 1 });
    get().fetchTasks();
  },

  setStatusFilter: (status) => {
    set({ statusFilter: status, page: 1 });
    get().fetchTasks();
  },

  setPage: (page) => {
    set({ page });
    get().fetchTasks();
  },

  createTask: async (input) => {
    set({ isMutating: true, error: null });
    try {
      const task = await api.createTask(input);
      set({ isMutating: false });
      await get().fetchTasks();
      return task;
    } catch (err) {
      set({ isMutating: false });
      throw err;
    }
  },

  updateTask: async (id, input) => {
    set({ isMutating: true, error: null });
    try {
      const task = await api.updateTask(id, input);
      set({ isMutating: false });
      await get().fetchTasks();
      return task;
    } catch (err) {
      set({ isMutating: false });
      throw err;
    }
  },

  deleteTask: async (id) => {
    set({ isMutating: true, error: null });
    try {
      await api.deleteTask(id);
      set({ isMutating: false });
      // If we just deleted the last item on a page beyond page 1, step back a page.
      const { tasks, page } = get();
      if (tasks.length === 1 && page > 1) {
        set({ page: page - 1 });
      }
      await get().fetchTasks();
    } catch (err) {
      set({ isMutating: false });
      throw err;
    }
  },
}));
