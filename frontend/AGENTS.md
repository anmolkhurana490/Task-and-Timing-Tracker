<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Frontend Agent Guide

## Purpose

Tempo is a Next.js task and time tracking app. Keep the interface calm, practical, and responsive. Prefer focused changes over broad refactors.

## Coding Style

- Keep solutions simple and readable. Prefer a few direct files and functions over abstract layers, factories, generic helpers, or complex patterns.
- Match the existing style: straightforward TypeScript, async functions with `try/catch/finally`, small React views, and clear names.
- Add a new folder or abstraction only when the current code genuinely becomes harder to maintain without it.
- Avoid refactoring working code just to make it more "enterprise" or theoretically reusable.
- Keep comments and docstrings short; explain only non-obvious decisions or boundaries.
- Keep changes focused on the request and do not rewrite unrelated files.

## Commands

Run from `frontend/`:

```powershell
npm run dev       # local development
npm run lint      # ESLint
npm run build     # production/type validation
npm start         # serve a production build
```

The backend must be running on `http://localhost:5000` for auth requests. Next rewrites `/api/backend/*` to `/api/v1/*`; call the rewrite from browser code rather than hard-coding the backend URL.

## Architecture

- `features/auth/views/`: client-facing login and signup views.
- `features/auth/viewmodels/`: client-side workflow state, submission, errors, and navigation.
- `shared/stores/useAppStore.ts`: the only shared Zustand store. Keep global data here, such as the current user, tasks, time logs, and dashboard data.
- `features/auth/validation/`: Zod schemas for client-side form validation.
- `features/auth/repository.ts`: typed auth API calls only; no UI state or JSX.
- `features/auth/models/` and `features/auth/types/`: domain and API request/response types.
- `app/*/page.tsx`: thin route views that compose feature views.
- `app/components/layout/`: shared navbar and footer.
- `features/dashboard/`: productivity API, store, view-model, and overview view.
- `features/timeLogs/`: time-log API, store, view-model, and history view.

Task, dashboard, and time-log screens use the protected backend APIs. Do not reintroduce demo data or invent endpoints; update the matching feature repository and types when the backend contract changes.

Use the existing lightweight MVVM split: pages/views render UI, view-models coordinate actions and state, and the repository communicates with the backend. Keep this split practical; do not add more layers around it.

## Auth Contract

The backend base path is `/api/v1`. Current endpoints are:

- `POST /auth/login`: `{ email, password }`
- `POST /auth/register`: `{ email, name, password }`

Successful responses contain `{ token, user: { id, email, name } }`; failures contain `{ error }`. Passwords are 8-72 characters. The current frontend stores the returned token and user in `localStorage` under `tempo_token` and `tempo_user`. Preserve these keys until auth storage is deliberately migrated.

When changing auth, update the model, service, view-model, and form together. Keep error messages user-facing and never display or log passwords or tokens.

## Conventions

- Use TypeScript and explicit types for API boundaries, but do not over-type simple local values.
- Validate login and signup input with the feature Zod schemas before calling the view-model.
- Use the auth Zustand store for submission/error state; do not duplicate that state in each view.
- Do not create a separate store per feature. View-models own `loading` and `error` with local React state; the shared store holds data reused across views.
- Keep server components free of browser APIs; add `"use client"` only where interaction or browser state requires it.
- Use Next `Link` for internal navigation.
- Use Tailwind utility classes in component markup for styling, layout, responsive behavior, and states. Keep `app/globals.css` limited to the Tailwind import; do not add feature selectors there.
- Preserve the existing sage, cream, coral visual direction and mobile layout behavior.
- Avoid adding dependencies unless the existing stack cannot solve the requirement; prefer the installed libraries and native React/Next.js APIs.
- Do not edit generated files or the generated Next.js guidance block.

## Before Finishing

1. Run `npm run lint` from `frontend/`.
2. Run `npm run build` for route, type, and client/server boundary changes.
3. If the API contract or architecture changes, update this guide and the backend guide together.
