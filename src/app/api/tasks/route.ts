import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { readTasks, saveTasks } from "@/lib/storage";
import { validateTaskInput } from "@/lib/validation";
import type {
  ApiError,
  ApiSuccess,
  CreateTaskInput,
  Task,
  TaskListResponse,
  TaskStatus,
} from "@/types/task";

const DEFAULT_LIMIT = 6;
const MAX_LIMIT = 50;

/**
 * GET /api/tasks?search=&status=&page=&limit=
 * Case-insensitive title search, status filter, and offset-based pagination —
 * all applied server-side so the frontend never has to fetch the full list.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const search = (searchParams.get("search") ?? "").trim().toLowerCase();
  const status = (searchParams.get("status") ?? "ALL") as TaskStatus | "ALL";
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, Number(searchParams.get("limit") ?? String(DEFAULT_LIMIT)) || DEFAULT_LIMIT)
  );

  const allTasks = await readTasks();

  let filtered = allTasks;
  if (search) {
    filtered = filtered.filter((t) => t.title.toLowerCase().includes(search));
  }
  if (status !== "ALL") {
    filtered = filtered.filter((t) => t.status === status);
  }

  // Most recently updated first
  filtered = [...filtered].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * limit;
  const pageItems = filtered.slice(start, start + limit);

  const body: ApiSuccess<TaskListResponse> = {
    success: true,
    data: {
      data: pageItems,
      meta: { total, page: safePage, limit, totalPages },
    },
  };

  return NextResponse.json(body, { status: 200 });
}

/**
 * POST /api/tasks
 * Creates a new task after validating the payload.
 */
export async function POST(request: NextRequest) {
  let body: CreateTaskInput;
  try {
    body = await request.json();
  } catch {
    const err: ApiError = { success: false, error: "Request body must be valid JSON." };
    return NextResponse.json(err, { status: 400 });
  }

  const { valid, fieldErrors } = validateTaskInput(body, true);
  if (!valid) {
    const err: ApiError = { success: false, error: "Validation failed.", fieldErrors };
    return NextResponse.json(err, { status: 422 });
  }

  const now = new Date().toISOString();
  const newTask: Task = {
    id: uuidv4(),
    title: body.title.trim(),
    description: body.description?.trim() || null,
    status: body.status ?? "TODO",
    priority: body.priority ?? "MEDIUM",
    dueDate: body.dueDate ?? null,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await saveTasks((tasks) => [...tasks, newTask]);
  } catch {
    const err: ApiError = { success: false, error: "Failed to save task. Please try again." };
    return NextResponse.json(err, { status: 500 });
  }

  const ok: ApiSuccess<Task> = { success: true, data: newTask };
  return NextResponse.json(ok, { status: 201 });
}
