# TaskBoard

A simplified Trello/Todo-style task manager. Next.js App Router + TypeScript + Tailwind + Zustand, with a local JSON file as the data store (no external DB).

## Phase 1 — what's in this drop
- Next.js 14 App Router scaffold, TypeScript strict mode, `@/*` path alias
- Tailwind config with status/priority color tokens, dark mode via `class` strategy
- `src/types/task.ts` — shared `Task`, API payload, and list-response types
- `src/lib/storage.ts` — JSON file read/write layer with a write queue to avoid race conditions between concurrent API calls
- `data/tasks.json` — seed data (4 sample tasks) that also acts as the live store

## Setup
1. `npm install`
2. `npm run dev`
3. Visit `http://localhost:3000`

No `.env` or database setup needed — `data/tasks.json` is created/read directly by the API routes.

## Next: Phase 2
API routes (`GET/POST /api/tasks`, `GET/PUT/DELETE /api/tasks/[id]`) with search, status filter, and pagination support.
