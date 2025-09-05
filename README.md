# Modern Cloud Desktop Environment (EyeOS-inspired)

## Vision
A web-based desktop operating system that runs entirely in the browser, offering a familiar multi-window experience, productivity apps, and cloud-backed storage. Compared to the original EyeOS (2005-2014), this project aims to be:

* **More modern** – Built with React, TypeScript, Web Components, and Tailwind CSS.
* **More powerful** – Leveraging WebAssembly, Service Workers, and IndexedDB for offline support and performance.
* **Easier to extend** – Clear plug-in API so third-party apps can be dropped in without touching core code.

## Core Features (MVP)
1. Multi-window desktop with drag, resize, minimize, maximize.
2. File manager with virtual filesystem synced to the backend.
3. Text editor application.
4. User authentication (JWT) and per-user storage.
5. REST/GraphQL backend with PostgreSQL (via Prisma ORM).
6. Progressive Web App (PWA) – installable, offline-capable.

## Technology Stack
| Layer          | Tech                                                   |
| -------------- | ------------------------------------------------------- |
| **Frontend**   | Vite + React + TypeScript, Zustand (state), Tailwind CSS, DaisyUI (components) |
| **Backend**    | Node.js + Express + TypeScript, Prisma ORM, PostgreSQL  |
| **Realtime**   | WebSocket (socket.io) for live collaboration            |
| **Auth**       | JSON Web Tokens (JWT) + bcrypt                          |
| **Hosting**    | Docker containers, deployed on Fly.io / Render / VPS    |

## Repository Structure
```
/                – root
├── apps/
│   ├── frontend/   – React SPA (desktop)
│   └── backend/    – Express REST/GraphQL API
├── packages/
│   ├── ui/         – shared UI components
│   └── types/      – shared TypeScript types
├── prisma/         – DB schema & migrations
└── docs/           – architecture docs & specs
```
A **monorepo** (managed by pnpm workspaces) keeps shared code in sync.

## Roadmap
- [x] Choose technology stack
- [ ] Set up repository structure (in progress)
- [ ] Scaffold frontend (React/Vite)
- [ ] Scaffold backend (Express)
- [ ] Window manager core (drag/resize)
- [ ] File manager MVP
- [ ] Text editor MVP
- [ ] Authentication & sessions
- [ ] Integration tests & CI
- [ ] Deployment guide

## Contributing
1. Clone repo and install deps:
   ```bash
   pnpm install
   ```
2. Start dev servers:
   ```bash
   pnpm --filter frontend dev
   pnpm --filter backend dev
   ```
3. Follow conventional commits and open a PR.

## License
MIT