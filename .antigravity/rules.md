# CV Builder — Project Rules & Guidelines

These rules define the engineering standards, architecture patterns, and constraints for all AI agents and developers working on the CV Builder project.

---

## 1. Monorepo Architecture Overview

The repository consists of two primary packages:
* **`cv-frontend/`**: Next.js 16 (App Router), React 19, Apollo Client (GraphQL), Tailwind CSS v4, Base UI primitives, Vitest, React Testing Library.
* **`cv-backend/`**: NestJS 11, Apollo Server (GraphQL), TypeORM, PostgreSQL (Docker), Passport JWT, Puppeteer (PDF export).

---

## 2. Frontend Development Standards (`cv-frontend`)

### 2.1 Feature-Driven Architecture
Code must be organized by feature domain under `src/features/<feature_name>/`:
```text
src/features/<feature>/
├── actions/       # Server actions (e.g. login.action.ts)
├── api/           # GraphQL queries and mutations (<feature>.graphql)
├── schemas/       # Zod validation schemas (<feature>.schema.ts) & tests
└── ui/            # Feature-specific React components & test suites
```
* **Shared UI**: Place reusable design system primitives in `src/components/ui/` (e.g. `input.tsx`, `button.tsx`).
* **Layouts**: Place navigation and shell components in `src/components/layout/` (e.g. `Navbar.tsx`).
* **Utilities**: Place shared pure helpers in `src/lib/`.

### 2.2 GraphQL Operations & Codegen
* **No inline string queries**: Never define raw `gql` strings inside React components or actions.
* Always declare operations in `src/features/<feature>/api/<feature>.graphql`.
* Generate typed document nodes by running `npm run codegen` in `cv-frontend`.
* Import and use the generated typed documents from `@/graphql/__generated__/graphql`.

### 2.3 Forms & Validation
* Always use **React Hook Form** combined with **Zod** (`@hookform/resolvers/zod`).
* Define validation schemas in `<feature>/schemas/<name>.schema.ts` and export the inferred type (`z.infer<typeof schema>`).
* Always write colocated unit tests for validation schemas in `<feature>/schemas/<name>.schema.test.ts`.
* For authentication and server mutations, prefer Next.js Server Actions with non-blocking transitions (`useTransition`).

### 2.4 Navigation & React 19 Patterns
* **Client Navigation**: Strictly use `useRouter().push()` from `next/navigation` for client-side routing, or `redirect()` in Server Actions. Never use `window.location.href` for internal routes.
* **React 19 Ref Purity**: Never read or mutate `ref.current` during render bodies. Read or synchronize refs inside `useEffect` or within event callbacks.
* **Route Groups**: Maintain clean separation between public routes `(auth)` and authenticated application views `(app)`.

### 2.5 Styling & Design System
* Use **Tailwind CSS v4** with semantic color tokens (e.g. `text-primary`, `bg-background`, `border-border`, `text-muted-foreground`).
* Avoid hardcoded hex colors in components whenever semantic tokens or Tailwind theme classes can be used.
* Adhere strictly to the Figma design specs (desktop and tablet responsive layouts, light and dark theme support).

### 2.6 Asset Imports & Static Types
* Any static assets (SVG, images) imported in TypeScript must have proper typings (e.g. `src/types/svg.d.ts`) compatible with `next/image` (`StaticImageData`).
* Never rely solely on transient `.gitignore` files like `next-env.d.ts` for build-critical types.

---

## 3. Backend Development Standards (`cv-backend`)

* Maintain NestJS modular separation (`*.module.ts`, `*.resolver.ts`, `*.service.ts`, `*.entity.ts`).
* Use TypeORM entities with proper relationships and migrations.
* Update GraphQL schema definitions using `pnpm run schema` when modifying entities or resolver contracts.
* Keep Docker environments reproducible via `docker/docker-compose.yml`.

---

## 4. Quality & Verification Gates

Before submitting changes or completing a task, always verify:
1. **TypeScript Typecheck**:
   - Frontend: `npm run typecheck` (or `npx tsc --noEmit`) in `cv-frontend` must pass with 0 errors.
   - Backend: `pnpm run typecheck` in `cv-backend` must pass with 0 errors.
2. **Automated Tests**:
   - Run `npm run test` in `cv-frontend` — all Vitest unit and component tests must pass.
3. **Linter**:
   - Run `npm run lint` — must pass without errors.
4. **Build**:
   - Run `npm run build` — Next.js production build must compile successfully.

---

## 5. Living Documentation & Context Synchronization

* Keep [`.antigravity/context.md`](./context.md) up to date when completing architectural milestones, creating new routes, or changing dependencies.
* Refer to [`.antigravity/instructions.md`](./instructions.md) for official feature requirements, role permissions, and API contract specifications.
* Use **Conventional Commits** for git commits (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`).
* Never commit secrets, `.env` files, or build artifacts.
