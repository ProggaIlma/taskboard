import { TASK_PRIORITIES, TASK_STATUSES, type TaskPriority, type TaskStatus } from "@/types/task";

export interface ValidationResult {
  valid: boolean;
  fieldErrors: Record<string, string>;
}

interface ValidatableInput {
  title?: unknown;
  description?: unknown;
  status?: unknown;
  priority?: unknown;
  dueDate?: unknown;
}

/**
 * Validates a create/update payload. `requireTitle` is true for create
 * (title is mandatory) and false for update (title only validated if present).
 */
export function validateTaskInput(input: ValidatableInput, requireTitle: boolean): ValidationResult {
  const fieldErrors: Record<string, string> = {};

  if (requireTitle || input.title !== undefined) {
    if (typeof input.title !== "string" || input.title.trim().length < 3) {
      fieldErrors.title = "Title is required and must be at least 3 characters.";
    }
  }

  if (input.description !== undefined && input.description !== null && typeof input.description !== "string") {
    fieldErrors.description = "Description must be a string.";
  }

  if (input.status !== undefined && !TASK_STATUSES.includes(input.status as TaskStatus)) {
    fieldErrors.status = `Status must be one of: ${TASK_STATUSES.join(", ")}.`;
  }

  if (input.priority !== undefined && !TASK_PRIORITIES.includes(input.priority as TaskPriority)) {
    fieldErrors.priority = `Priority must be one of: ${TASK_PRIORITIES.join(", ")}.`;
  }

  if (input.dueDate !== undefined && input.dueDate !== null) {
    const parsed = new Date(input.dueDate as string);
    if (Number.isNaN(parsed.getTime())) {
      fieldErrors.dueDate = "Due date must be a valid date.";
    }
  }

  return { valid: Object.keys(fieldErrors).length === 0, fieldErrors };
}
