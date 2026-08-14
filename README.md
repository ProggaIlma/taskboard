# TaskBoard

A simplified Trello/Todo-style task manager. Built with Next.js (App Router), TypeScript, Tailwind CSS, and Zustand — persisted to a local JSON file, no external database required.

## Features
- Task list with status/priority badges and due dates, grid layout, responsive down to mobile
- Create / Edit (shared form component, client + server validation)
- Delete with confirmation dialog
- Search by title (debounced, case-insensitive) + filter by status, combinable
- Backend + frontend pagination
- Loading skeletons and distinct empty states ("no tasks yet" vs "no results for this filter")
- Dark mode toggle (persisted to `localStorage`, respects system preference on first visit, no flash on load)
- Unit tests for the validation logic (`npm test`)

## Stack
Next.js 14 (App Router) · TypeScript (strict) · Tailwind CSS · Zustand · Vitest

## Getting started
```bash
npm install
npm run dev
```
Visit `http://localhost:3000`. No `.env` or database setup needed — `data/tasks.json` is the store, seeded with 4 sample tasks on first run.

## Scripts
```bash
npm run dev      # local dev server
npm run build    # production build
npm run start    # run the production build
npm run lint     # eslint
npm test         # vitest — validation logic unit tests
```

## Project structure
```
src/
  app/
    api/tasks/          # REST-style API routes (GET/POST, GET/PUT/DELETE by id)
    tasks/new/           # Create task page
    tasks/[id]/edit/     # Edit task page
    page.tsx              # Task list (home)
  components/
    ui/                  # Generic building blocks (Button, Input, Select, Modal, Badge...)
    task/                # Task-specific (TaskCard, TaskForm, Pagination, TaskFilters)
  lib/
    storage.ts           # JSON file read/write with a write queue
    validation.ts         # Shared create/update validation
    api.ts                 # fetch wrapper for /api/tasks
    utils.ts, useDebounce.ts
  store/
    taskStore.ts          # Zustand store: tasks, filters, pagination, CRUD actions
  types/
    task.ts               # Shared Task / API payload types
data/
  tasks.json              # The data store itself
```





