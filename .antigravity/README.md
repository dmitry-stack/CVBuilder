# Antigravity Directory (`.antigravity/`)

This directory serves as the **Shared Project Brain and Configuration Layer** for Google Antigravity and AI coding assistants working on the CV Builder project.

---

## What is in this directory?

1. [**`rules.md`**](./rules.md) — **Engineering Constitution & Guidelines**:
   - Monorepo structure conventions (`cv-frontend`, `cv-backend`).
   - Feature-driven architecture rules.
   - GraphQL Codegen and Apollo Client standards.
   - React 19 & Next.js 16 best practices.
   - Quality verification gates (typecheck, tests, linter, build).

2. [**`context.md`**](./context.md) — **Living Architecture & Implementation State**:
   - Current technical stack and architectural decisions.
   - Feature completion checklist.
   - Pending roadmap items and priorities.
   - Known architectural notes.

3. [**`instructions.md`**](./instructions.md) — **Product Requirements & Specifications**:
   - Figma design references and layout requirements.
   - Backend API contracts and role-based permissions (User vs Admin).
   - Core domain feature requirements (CVs, Skills, Languages, Employees).

---

## How to use this with your team

1. **Keep it in Version Control (Git)**:
   - This directory is committed to Git so all teammates and their AI agents share the exact same project awareness, architecture standards, and progress history.
2. **Automatic Context Ingestion**:
   - When using Google Antigravity (IDE or CLI), the agent automatically discovers the `.antigravity/` directory, rules, and living context.
3. **Updating the Brain**:
   - Whenever you complete a feature, implement a new route, or make an architectural decision, update the status checklist in [`context.md`](./context.md).
   - If team conventions change (e.g. adding a new testing tool or lint rule), update [`rules.md`](./rules.md).
