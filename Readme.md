# ⏱️ Task & Timing Tracker

A full-stack productivity app for managing tasks and tracking time spent on them in real time. Create tasks (with optional AI-generated suggestions), start/stop a timer per task, and get a daily summary of what you worked on — how much time you tracked, and what's done vs. still pending.

- **Live App:** https://task-timer-tracker-psi-rust-10.vercel.app
- **Backend API:** https://task-timer-tracker-backend-rho-89.vercel.app

---

## ✨ Features

- **Auth** — secure signup/login with hashed passwords and JWT-based sessions; logout properly invalidates the session server-side
- **Tasks** — create, edit, delete, and mark tasks as `Pending` / `In Progress` / `Completed`; describe a task in plain language and get AI-generated task suggestions (Gemini)
- **Time Tracking** — start/stop a timer on any task, with every session logged as a time entry
- **Dashboard** — a daily summary: tasks worked on, total time tracked, completed vs. pending counts, and a weekly overview
- Every user only ever sees and touches their own data — enforced at the database query level, not just the UI

---

## 🛠️ Tech Stack

| Layer      | Stack                                        |
| ---------- | -------------------------------------------- |
| Frontend   | Next.js, TypeScript, Zustand, Tailwind CSS   |
| Backend    | Node.js, Express, TypeScript, Zod, Redis     |
| Database   | PostgreSQL (via Neon), Prisma ORM            |
| AI         | Google Gemini API                            |
| Deployment | Vercel (frontend + backend), Neon (database) |

---

## 📸 Screenshots / Demo

[ADD_SCREENSHOTS_OR_DEMO_VIDEO_HERE]

---

## 🚀 Running Locally

### Backend

```bash
cd backend
npm install
cp .env.example .env      # fill in your DATABASE_URL, JWT secret, Gemini API key, etc.
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env      # point it at your backend URL
npm run dev
```

The app will be running on `localhost` — check each `.env.example` for the exact ports and required keys.

---

## 📁 Project Structure

```
.
├── backend/     # Express API — routes → controllers → services → DAOs
└── frontend/    # Next.js app — feature-based structure (models, repositories, viewmodels, views)
```

Each backend module (`auth`, `tasks`, `time-logs`, `dashboard`) follows the same layout, and each frontend feature mirrors it on the client side — keeping both sides easy to navigate the same way.
