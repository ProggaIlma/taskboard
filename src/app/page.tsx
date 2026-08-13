export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold">TaskBoard</h1>
      <p className="mt-2 text-sm text-gray-500">
        API routes are live. Task list UI lands in Phase 4 — for now, try{" "}
        <code className="rounded bg-gray-200 px-1 py-0.5 dark:bg-gray-800">
          GET /api/tasks
        </code>{" "}
        directly.
      </p>
    </main>
  );
}
