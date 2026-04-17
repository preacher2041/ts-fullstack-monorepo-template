# Architecture Overview

## What this project is

This is a batteries-included monorepo template for fullstack TypeScript applications. It is designed to be cloned, initialised with a one-time setup script (`pnpm run setup`), and then built upon. The template ships with a working user authentication flow and a set of shared packages so teams can start building features immediately without yak-shaving tooling.

The template is not an application in its own right — it is a starting point. As a result, several integration points exist but are deliberately left incomplete (the login form has no API call yet, the auth API file is empty, etc.).

## Major layers

```
┌─────────────────────────────────────────────┐
│              Browser (React 19)             │
│  TanStack Router · TanStack Query · Vite    │
├─────────────────────────────────────────────┤
│        Shared UI Package (@template/ui)     │
│  Radix UI · class-variance-authority · TanStack Form  │
├─────────────────────────────────────────────┤
│         Express 5 API (@template/api)       │
│  Routes → Controllers → Services → Prisma  │
├─────────────────────────────────────────────┤
│           PostgreSQL 17 (Docker)            │
└─────────────────────────────────────────────┘
```

### Frontend (`apps/web`)

A React 19 single-page application built with Vite. Routing is handled by TanStack Router using its file-based convention — each file under `src/routes/` becomes a route. TanStack Query is wired in as the data-fetching layer but is not yet used in any route (the template registers it in the router context so it is available immediately when you add queries). Forms are driven by TanStack Form, with Zod schemas providing validation.

### API (`apps/api`)

An Express 5 HTTP server following a strict layered architecture: routes parse the URL and delegate to controllers, controllers coordinate services and format responses, services contain all business logic and talk to the database exclusively via Prisma. Authentication is session-based, using HTTP-only cookies managed by `express-session`.

### Shared UI library (`packages/ui`)

A React component library exported as raw TypeScript source (not compiled). It provides primitive form fields (text, email, password, date, checkbox), a Button, and a form hook (`useAppForm`) built on TanStack Form. Components use Radix UI primitives for accessibility and `class-variance-authority` for variant-based styling.

### Design system (`apps/design-system`)

A Storybook 10 application that documents every component in `packages/ui`. It is the primary development and review environment for UI components.

### Shared config packages

`packages/eslint-config`, `packages/prettier-config`, `packages/tailwind-config`, `packages/typescript-config`, and `packages/vitest-config` publish shared tooling configuration consumed by all apps and packages via `workspace:*` references.

## How the layers fit together

The web app imports components from `@template/ui`, applies Tailwind styles from `@template/tailwind-config`, and makes HTTP requests to the Express API. The API owns the database exclusively — the frontend never touches Prisma or the database directly. Session state lives in a server-side session store (in-memory by default from `express-session`), with the session ID sent as an HTTP-only cookie.

The monorepo is managed by pnpm workspaces. All packages reference each other using the `workspace:*` protocol so pnpm symlinks them locally rather than publishing to a registry. Docker Compose orchestrates the development environment: `postgres`, `api-dev`, and `web-dev` are the three services you need day-to-day; `design-system-dev` and `prisma-studio` are optional.

## What is intentionally not yet wired up

The template leaves a number of things as exercises for the builder:

- The login form (`LoginForm.tsx`) is a stub — it renders a placeholder `<div>`.
- The auth API client (`features/Auth/api/authApi.ts`) is empty — no `fetch` calls exist yet.
- TanStack Query hooks have no queries defined; the `QueryClient` is configured and passed through the router context, ready to use.
- `swagger-jsdoc` and `swagger-ui-express` are installed as dependencies but are not mounted in the Express app.
- `jsonwebtoken` is installed but the auth strategy is session-based — JWT is not used.
