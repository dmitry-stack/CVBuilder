# Project Guidelines & Context

This project uses `.antigravity/` for project configuration, behavioral rules, and architecture state.

## Core Rules & Architecture
* **Rules**: See [.antigravity/rules.md](file:///.antigravity/rules.md) for frontend/backend coding conventions, quality gates, and testing policies.
* **Context**: See [.antigravity/context.md](file:///.antigravity/context.md) for living architecture state, implementation status, and module roadmap.
* **Requirements**: See [.antigravity/instructions.md](file:///.antigravity/instructions.md) for product specs and Figma layout requirements.

## Quick Summary
1. **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Apollo GraphQL, Vitest.
   - Code must be feature-driven (`src/features/<feature>/`).
   - All GraphQL queries must use typed document nodes generated via `npm run codegen`.
   - All form validation must use Zod with colocated tests.
2. **Backend**: NestJS 11, Apollo Server, TypeORM, PostgreSQL.
3. **Verification**: Always verify `npm run typecheck`, `npm run test`, `npm run lint`, and `npm run build` pass before completing tasks.
