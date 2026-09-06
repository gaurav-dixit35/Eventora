# Eventora

Eventora is a full-stack event discovery and ticketing platform. The repository is an npm-workspaces monorepo because pnpm is not installed in the current environment.

## Prerequisites

- Node.js 22+
- npm 10+
- Docker Desktop (PostgreSQL and Redis)

## Local development

1. Copy `.env.example` to `.env` and replace placeholders as services are configured.
2. Start infrastructure: `docker compose up -d`.
3. Install packages: `npm install`.
4. Start the web and API apps: `npm run dev`.

The web app runs at `http://localhost:3000`. The API runs at `http://localhost:4000`, with health at `/health` and Swagger at `/docs`.

## Checks

Run `npm run lint`, `npm run typecheck`, and `npm run build` before opening a pull request.

## Repository layout

- `apps/web`: Next.js App Router frontend
- `apps/api`: NestJS REST API
- `packages/config`: shared TypeScript configuration
- `prisma`: Prisma schema and migrations (introduced in Phase 1)
- `docker`: local development container support
