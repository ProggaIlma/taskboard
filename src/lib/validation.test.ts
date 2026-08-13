import { describe, expect, it } from "vitest";
import { validateTaskInput } from "./validation";

describe("validateTaskInput", () => {
  it("rejects a missing title on create", () => {
    const result = validateTaskInput({}, true);
    expect(result.valid).toBe(false);
    expect(result.fieldErrors.title).toBeDefined();
  });

  it("rejects a title under 3 characters", () => {
    const result = validateTaskInput({ title: "ab" }, true);
    expect(result.valid).toBe(false);
    expect(result.fieldErrors.title).toBeDefined();
  });

  it("accepts a valid minimal payload on create", () => {
    const result = validateTaskInput({ title: "Write tests" }, true);
    expect(result.valid).toBe(true);
    expect(result.fieldErrors).toEqual({});
  });

  it("rejects an invalid status enum value", () => {
    const result = validateTaskInput({ title: "Valid title", status: "NOT_A_STATUS" }, true);
    expect(result.valid).toBe(false);
    expect(result.fieldErrors.status).toBeDefined();
  });

  it("rejects an invalid priority enum value", () => {
    const result = validateTaskInput({ title: "Valid title", priority: "URGENT" }, true);
    expect(result.valid).toBe(false);
    expect(result.fieldErrors.priority).toBeDefined();
  });

  it("rejects an unparseable due date", () => {
    const result = validateTaskInput({ title: "Valid title", dueDate: "not-a-date" }, true);
    expect(result.valid).toBe(false);
    expect(result.fieldErrors.dueDate).toBeDefined();
  });

  it("allows a null due date", () => {
    const result = validateTaskInput({ title: "Valid title", dueDate: null }, true);
    expect(result.valid).toBe(true);
  });

  it("on update, does not require a title if omitted", () => {
    const result = validateTaskInput({ status: "DONE" }, false);
    expect(result.valid).toBe(true);
  });

  it("on update, still validates title if one is provided", () => {
    const result = validateTaskInput({ title: "x" }, false);
    expect(result.valid).toBe(false);
    expect(result.fieldErrors.title).toBeDefined();
  });
});
