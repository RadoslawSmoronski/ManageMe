🌐 [English](README.md) | 🇵🇱 [Polski](README-pl.md)

# ManageMe - Frontend

Kanban-style frontend application for team workflow management with Projects, Stories and Tasks.
Built with React, TypeScript and Vite.

---

## Table of contents

1. [Project overview](#project-overview)
2. [Technologies](#technologies)
3. [Features](#features)
4. [Current scope](#current-scope)
5. [Solution structure](#solution-structure)
6. [Configuration](#configuration)
7. [How to run locally](#how-to-run-locally)
8. [Available scripts](#available-scripts)
9. [Mock API](#mock-api)
10. [Project status](#project-status)

---

## Project overview

**ManageMe** is a frontend app focused on project execution flow in a Kanban format.

You can:

- create and manage projects,
- create and manage stories inside projects,
- create and manage tasks inside stories,
- move tasks between columns using drag & drop,
- assign tasks to users from mock data.

At this stage, data is mocked with `json-server` from `db.json`.

---

## Technologies

- React 19
- TypeScript 5
- Vite 7
- React Router 7
- Bootstrap 5 + React-Bootstrap + Bootstrap Icons
- `@hello-pangea/dnd`
- SweetAlert2
- `json-server`

---

## Features

- Projects CRUD.
- Stories CRUD.
- Tasks CRUD.
- Kanban board for tasks (`Planned`, `Doing`, `Completed`).
- Drag & drop task ordering.
- Theme mode: system / light / dark.

---

## Current scope

Currently implemented:

- `projects`
- `stories`
- `tasks`
- mock `users` data for assignment/context

Not implemented yet:

- real user accounts,
- authentication/authorization,
- backend API integration (currently mocked only).

Planned backend: a lightweight RESTful Minimal Web API built with .NET.

---

## Solution structure

Main folders:

- `src/components` - reusable UI and domain components.
- `src/pages` - route-level pages.
- `src/context` - state management with React Context.
- `src/services` - HTTP communication layer.
- `src/types` - TypeScript models.
- `src/config` - runtime config (API URL).
- `db.json` - mock database for `json-server`.

---

## Configuration

Environment variable:

```env
VITE_API_URL=http://localhost:3001
```

If not set, the app uses `http://localhost:3001` by default.

---

## How to run locally

1. Install dependencies:

```bash
npm install
```

2. Start mock API:

```bash
npm run server
```

3. Start frontend:

```bash
npm run dev
```

---

## Available scripts

- `npm run dev` - start Vite dev server.
- `npm run build` - build production bundle.
- `npm run preview` - preview production build.
- `npm run server` - run `json-server` on port `3001`.

---

## Mock API

The app currently relies on `json-server` with these collections:

- `users`
- `projects`
- `stories`
- `tasks`

Base URL:

```text
http://localhost:3001
```

---

## Project status

The project is in active development.

Current focus:

- improve UX and flow consistency,
- keep clean TypeScript models and contexts,
- prepare for future real backend integration.
