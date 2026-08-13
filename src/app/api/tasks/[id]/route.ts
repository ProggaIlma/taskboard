import { NextRequest, NextResponse } from "next/server";
import { readTasks, saveTasks } from "@/lib/storage";
import { validateTaskInput } from "@/lib/validation";
import type { ApiError, ApiSuccess, Task, UpdateTaskInput } from "@/types/task";

interface RouteParams {
  params: { id: string };
}

/**
 * GET /api/tasks/[id]
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const tasks = await readTasks();
  const task = tasks.find((t) => t.id === params.id);

  if (!task) {
    const err: ApiError = { success: false, error: `Task ${params.id} not found.` };
    return NextResponse.json(err, { status: 404 });
  }

  const ok: ApiSuccess<Task> = { success: true, data: task };
  return NextResponse.json(ok, { status: 200 });
}

/**
 * PUT /api/tasks/[id]
 * Partial update — only fields present in the body are changed.
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  let body: UpdateTaskInput;
  try {
    body = await request.json();
  } catch {
    const err: ApiError = { success: false, error: "Request body must be valid JSON." };
    return NextResponse.json(err, { status: 400 });
  }

  const { valid, fieldErrors } = validateTaskInput(body, false);
  if (!valid) {
    const err: ApiError = { success: false, error: "Validation failed.", fieldErrors };
    return NextResponse.json(err, { status: 422 });
  }

  const existing = (await readTasks()).find((t) => t.id === params.id);
  if (!existing) {
    const err: ApiError = { success: false, error: `Task ${params.id} not found.` };
    return NextResponse.json(err, { status: 404 });
  }

  let updated: Task = existing;
  try {
    await saveTasks((tasks) =>
      tasks.map((t) => {
        if (t.id !== params.id) return t;
        updated = {
          ...t,
          ...(body.title !== undefined ? { title: body.title.trim() } : {}),
          ...(body.description !== undefined ? { description: body.description?.trim() || null } : {}),
          ...(body.status !== undefined ? { status: body.status } : {}),
          ...(body.priority !== undefined ? { priority: body.priority } : {}),
          ...(body.dueDate !== undefined ? { dueDate: body.dueDate } : {}),
          updatedAt: new Date().toISOString(),
        };
        return updated;
      })
    );
  } catch {
    const err: ApiError = { success: false, error: "Failed to update task. Please try again." };
    return NextResponse.json(err, { status: 500 });
  }

  const ok: ApiSuccess<Task> = { success: true, data: updated };
  return NextResponse.json(ok, { status: 200 });
}

/**
 * DELETE /api/tasks/[id]
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const tasks = await readTasks();
  const exists = tasks.some((t) => t.id === params.id);

  if (!exists) {
    const err: ApiError = { success: false, error: `Task ${params.id} not found.` };
    return NextResponse.json(err, { status: 404 });
  }

  try {
    await saveTasks((current) => current.filter((t) => t.id !== params.id));
  } catch {
    const err: ApiError = { success: false, error: "Failed to delete task. Please try again." };
    return NextResponse.json(err, { status: 500 });
  }

  const ok: ApiSuccess<{ id: string }> = { success: true, data: { id: params.id } };
  return NextResponse.json(ok, { status: 200 });
}
