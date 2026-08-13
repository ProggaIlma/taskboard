import fs from "fs/promises";
import path from "path";
import type { Task } from "@/types/task";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "tasks.json");

// Simple in-process write queue so concurrent API calls don't race
// each other writing the same file (fine for a single Node process,
// which is all this local-JSON approach is meant to support).
let writeQueue: Promise<unknown> = Promise.resolve();

async function ensureDataFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "[]", "utf-8");
  }
}

export async function readTasks(): Promise<Task[]> {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  try {
    return JSON.parse(raw) as Task[];
  } catch {
    // Corrupt or empty file — fail safe to an empty board rather than crashing.
    return [];
  }
}

async function writeTasks(tasks: Task[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2), "utf-8");
}

// Serializes all writes through a single promise chain.
function queueWrite<T>(fn: (tasks: Task[]) => Promise<T> | T): Promise<T> {
  const run = writeQueue.then(async () => {
    const tasks = await readTasks();
    const result = await fn(tasks);
    return result;
  });
  writeQueue = run.catch(() => undefined);
  return run;
}

export async function saveTasks(mutate: (tasks: Task[]) => Task[]): Promise<Task[]> {
  return queueWrite(async (tasks) => {
    const next = mutate(tasks);
    await writeTasks(next);
    return next;
  });
}
