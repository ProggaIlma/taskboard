import type {
  ApiError,
  ApiSuccess,
  CreateTaskInput,
  Task,
  TaskListParams,
  TaskListResponse,
  UpdateTaskInput,
} from "@/types/task";

class ApiRequestError extends Error {
  fieldErrors?: Record<string, string>;
  status: number;

  constructor(message: string, status: number, fieldErrors?: Record<string, string>) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  const body = (await res.json()) as ApiSuccess<T> | ApiError;
  if (!res.ok || !body.success) {
    const err = body as ApiError;
    throw new ApiRequestError(err.error ?? "Request failed.", res.status, err.fieldErrors);
  }
  return body.data;
}

export const api = {
  async listTasks(params: TaskListParams = {}): Promise<TaskListResponse> {
    const qs = new URLSearchParams();
    if (params.search) qs.set("search", params.search);
    if (params.status && params.status !== "ALL") qs.set("status", params.status);
    if (params.page) qs.set("page", String(params.page));
    if (params.limit) qs.set("limit", String(params.limit));

    const res = await fetch(`/api/tasks?${qs.toString()}`, { cache: "no-store" });
    return handleResponse<TaskListResponse>(res);
  },

  async createTask(input: CreateTaskInput): Promise<Task> {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    return handleResponse<Task>(res);
  },

  async updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    return handleResponse<Task>(res);
  },

  async deleteTask(id: string): Promise<{ id: string }> {
    const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    return handleResponse<{ id: string }>(res);
  },

  async getTask(id: string): Promise<Task> {
    const res = await fetch(`/api/tasks/${id}`, { cache: "no-store" });
    return handleResponse<Task>(res);
  },
};

export { ApiRequestError };
