# CV Builder

A modern, enterprise-grade CV and Employee Management Platform designed to streamline resume creation, skills tracking, language proficiencies, and employee profile administration. Built with Next.js 16, React 19, Apollo GraphQL, NestJS, and PostgreSQL.

---

## Table of Contents

- [Overview](#overview)
- [Brief Functionality](#brief-functionality)
- [Tech Stack & Dependencies](#tech-stack--dependencies)
  - [Frontend (`cv-frontend`)](#frontend-cv-frontend)
  - [Backend (`cv-backend`)](#backend-cv-backend)
- [Project Structure](#project-structure)
- [Startup Instructions](#startup-instructions)
  - [Prerequisites](#prerequisites)
  - [1. Backend Setup](#1-backend-setup)
  - [2. Frontend Setup](#2-frontend-setup)
- [Running Unit Tests & Quality Gates](#running-unit-tests--quality-gates)
  - [Frontend Testing (`cv-frontend`)](#frontend-testing-cv-frontend)
  - [Quality Gates & Linting](#quality-gates--linting)
- [Environment Variables](#environment-variables)

---

## Overview

**CV Builder** simulates a production-grade enterprise workflow for managing technical resumes, language proficiencies, and developer skill sets. It features an ownership-based access control model, pixel-accurate responsive layouts adhering to Figma design specifications, full internationalization (i18n), and dark/light theme switching.

---

## Brief Functionality

### 1. Authentication & Security
- **Email/Password Authentication**: User registration and secure login via JWT tokens (`access_token` and `refresh_token` stored in HTTP-ready cookies).
- **Email Verification**: 6-digit confirmation code verification flow.
- **Password Recovery**: Forgot password request and reset password workflows with token validation.
- **Session Management**: Transparent Apollo Client 401 error queue interceptor with automatic token refresh.
- **Route Protection**: Next.js network-level proxy (`proxy.ts`) redirecting unauthenticated traffic to `/signin` and authenticated users away from auth pages.

### 2. Employees / Users Directory (`/users`)
- Browse all registered employees with avatar, full name, email, and position details.
- Real-time client-side search by name and email.
- Server-side and client-side pagination with customizable rows per page.
- Direct navigation to employee profiles, skills, languages, and CVs.

### 3. User Profile Management (`/users/[id]/profile`)
- View and edit user personal info: First Name, Last Name, and Email.
- Ownership-based access control: Only the profile owner can modify details; peer views render in read-only mode.
- Profile picture upload to Cloudinary with real-time preview and fallback initial avatars.

### 4. CV Management & Editor (`/cvs`)
- **CV Dashboard**: List all user-owned and company CVs with search, sorting, and pagination.
- **CV Creation & Mutation**: Create, update title/description, or delete CVs with modal confirmations.
- **CV Sections**:
  - **Details (`/cvs/[id]/details`)**: Core CV metadata and description editing.
  - **Projects (`/cvs/[id]/projects`)**: Project history with date pickers, responsibilities, roles, and tech stack tags.
  - **Skills (`/cvs/[id]/skills`)**: Add, categorize, adjust mastery levels, or batch remove skills from the CV.
  - **Preview (`/cvs/[id]/preview`)**: Live formatted resume preview matching PDF export standards.
  - **Export**: PDF generation and export capabilities.

### 5. Skills Management (`/skills` & `/users/[id]/skills`)
- Categorized skills catalog (e.g. Frontend, Backend, DevOps, Design, Database).
- 5-tier mastery visual indicator: *No Expertise*, *Novice*, *Advanced*, *Competent*, *Expert*.
- Single-item add/update/delete and batch deletion mode with multi-select checkboxes.

### 6. Languages Management (`/languages` & `/users/[id]/languages`)
- Standard CEFR proficiency mapping: **A1** (Beginner), **A2** (Elementary), **B1** (Intermediate), **B2** (Upper Intermediate), **C1** (Advanced), **C2** (Proficient), and **Native**.
- Add and delete language proficiencies with visual progress bars.

### 7. UX & System Safeguards
- **Theme Support**: Seamless Light and Dark mode switching powered by `next-themes`.
- **Internationalization (i18n)**: English and Russian language support with real-time switching.
- **Offline Guard**: Network detection banner when connectivity is lost.
- **Device Guard**: Graceful fallback UI for unsupported ultra-small screen resolutions.
- **Collapsible Sidebar**: Persistent collapsed/expanded sidebar state synchronized across SSR and client via cookies.

---

## Tech Stack & Dependencies

### Frontend (`cv-frontend`)

| Package / Tool | Version | Purpose |
| :--- | :--- | :--- |
| **Next.js** | `16.3.5` | React framework with App Router, Server Components & Route Handlers |
| **React** & **React DOM** | `19.2.8` | Core UI rendering library |
| **@apollo/client** | `^4.3.0` | GraphQL client for data querying, mutations, and caching |
| **@apollo/experimental-nextjs-app-support** | `^0.14.5` | Apollo Client integration for Next.js App Router |
| **Tailwind CSS** | `^4.0.0` | Utility-first CSS framework with semantic design tokens |
| **@base-ui/react** | `^1.8.0` | Accessible, headless UI component primitives |
| **React Hook Form** | `^7.88.0` | Performant form state management and submission |
| **Zod** | `^4.6.5` | TypeScript-first schema validation with static type inference |
| **@hookform/resolvers** | `^5.9.1` | Zod resolver integration for React Hook Form |
| **Lucide React** | `^1.46.0` | Icon system across sidebar, header, and action buttons |
| **next-themes** | `^0.4.6` | Theme management (light/dark mode toggle) |
| **react-toastify** | `^11.1.0` | Toast notifications for user feedback |
| **js-cookie** | `^3.0.8` | Client cookie management for auth & layout persistence |
| **@graphql-codegen/cli** | `^7.4.1` | Automatic TypeScript type generation from GraphQL schemas |
| **Vitest** | `^5.0.1` | Next-generation fast unit and integration test runner |
| **@testing-library/react** | `^16.3.3` | React component testing utilities |
| **@testing-library/jest-dom** | `^7.0.1` | Custom matchers for DOM node assertions |

### Backend (`cv-backend`)

| Package / Tool | Version | Purpose |
| :--- | :--- | :--- |
| **NestJS** | `^11.1.17` | Progressive Node.js framework for scalable server-side apps |
| **@nestjs/graphql** & **@apollo/server** | `^13.2.4` / `^5.4.0` | GraphQL Apollo Server implementation |
| **TypeORM** & **pg** | `^11.0.0` / `^8.7.3` | PostgreSQL Object-Relational Mapping (ORM) and driver |
| **PostgreSQL** | `16.1` (Docker) | Primary relational database |
| **Passport & JWT** | `^0.7.0` / `^11.0.2` | Authentication strategies and token handling |
| **Puppeteer** | `^24.39.1` | Headless Chrome browser automation for PDF exports |
| **Cloudinary** | `^2.9.0` | Cloud media storage for user avatar images |
| **Nodemailer** | `^8.0.3` | SMTP service for sending verification & reset emails |
| **class-validator** | `^0.14.1` | Decorator-based input validation |

---

## Project Structure

```text
CVBuilder/
├── README.md                      # Main project documentation (this file)
├── AGENTS.md                      # AI agent behavior rules and workflow guidelines
├── cv-backend/                    # NestJS GraphQL backend service
│   ├── docker/                    # Docker Compose & container configurations
│   │   ├── docker-compose.yml     # Postgres and backend container definition
│   │   ├── .env.cv_backend        # Backend environment variables template
│   │   └── .env.cv_postgres       # Postgres database credentials
│   ├── backups/                   # Database backup dump (backup.sql)
│   ├── src/                       # NestJS modules, entities, resolvers, services
│   └── package.json
└── cv-frontend/                   # Next.js 16 frontend application
    ├── src/
    │   ├── app/                   # App Router pages and layouts
    │   │   ├── (auth)/            # Sign-in, sign-up, reset-password routes
    │   │   ├── (app)/             # Authenticated shell routes (/users, /cvs, etc.)
    │   │   └── api/               # API route handlers & proxy
    │   ├── features/              # Feature-driven modules (auth, users, cvs, skills, languages)
    │   │   ├── <feature>/actions/ # Next.js Server Actions
    │   │   ├── <feature>/api/     # GraphQL queries & mutations
    │   │   ├── <feature>/schemas/ # Zod validation schemas & schema tests
    │   │   └── <feature>/ui/      # Feature components & component tests
    │   ├── shared/                # Cross-cutting components and helpers
    │   │   ├── components/layout/ # Navbar, Header, AppShell, SidebarContext
    │   │   ├── components/ui/     # Button, Input, DatePicker, Select, Dialogs
    │   │   └── lib/               # Apollo provider, auth helpers, utility functions
    │   ├── graphql/__generated__/ # Codegen-generated TypeScript GraphQL documents
    │   └── i18n/                  # Multi-language translation dictionaries & context
    ├── codegen.ts                 # GraphQL Codegen configuration
    ├── vitest.config.mts          # Vitest configuration
    └── package.json
```

---

## Startup Instructions

### Prerequisites

- **Node.js**: `v22.x` or higher
- **Package Managers**: `npm` (for frontend) and `pnpm` (for backend)
- **Docker Desktop**: Running locally for PostgreSQL and backend containers

---

### 1. Backend Setup

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd cv-backend
   ```

2. Configure Docker environment files in `cv-backend/docker/`:

   Create `docker/.env.cv_backend`:
   ```env
   PORT="3001"
   DATABASE_URL="postgres://user:pass@cv_postgres:5432/db"
   DATABASE_SSL=""
   JWT_SECRET="jwtsecret"
   JWT_SECRET_2="jwtrotationsecret"
   CLOUDINARY_URL=""
   CHROME_WS=""
   MAIL_FROM=""
   SMTP_URL=""
   ```

   Create `docker/.env.cv_postgres`:
   ```env
   POSTGRES_DB="db"
   POSTGRES_USER="user"
   POSTGRES_PASSWORD="pass"
   ```

3. Start PostgreSQL and the backend containers via Docker Compose:
   ```bash
   pnpm run image:up
   ```

4. *(Optional)* Restore the seed database with sample employees, skills, and CVs:
   ```bash
   pnpm run backup
   ```

5. Alternatively, run the NestJS server locally in watch mode:
   ```bash
   pnpm install
   pnpm run start
   ```

The GraphQL API endpoint will be live at:
```
http://localhost:3001/api/graphql
```

---

### 2. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd cv-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `cv-frontend/.env`:
   ```env
   AUTH_SECRET="691558a02592e6d7ea53d8fc6275e491"
   VITE_GRAPHQL_URL="http://localhost:3001/api/graphql"
   ```

4. Generate typed GraphQL operations from backend schemas:
   ```bash
   npm run codegen
   ```

5. Start the Next.js development server:
   ```bash
   npm run dev
   ```

6. Open your browser and access the application:
   ```
   http://localhost:3000
   ```

---

## Running Unit Tests & Quality Gates

### Frontend Testing (`cv-frontend`)

The frontend features comprehensive unit and integration test coverage across UI components, forms, validation schemas, and utilities using **Vitest** and **React Testing Library**.

1. **Run all unit tests**:
   ```bash
   cd cv-frontend
   npm run test
   ```

2. **Run tests in interactive watch mode**:
   ```bash
   npx vitest
   ```

3. **Run a specific test file**:
   ```bash
   npm run test -- src/shared/components/layout/Navbar.test.tsx
   ```

4. **Run tests with coverage report**:
   ```bash
   npx vitest run --coverage
   ```

### Quality Gates & Linting

Before submitting changes, ensure all code passes the project quality gates:

```bash
# 1. Typecheck TypeScript
npm run typecheck

# 2. Lint and verify code conventions
npm run lint

# 3. Execute all unit tests
npm run test

# 4. Production build verification
npm run build
```

---

## Environment Variables

### `cv-frontend/.env`
| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `AUTH_SECRET` | Secret key used for signing session auth tokens | `691558a02592e6d7ea53d8fc6275e491` |
| `VITE_GRAPHQL_URL` | URL to the GraphQL server endpoint | `http://localhost:3001/api/graphql` |

### `cv-backend/docker/.env.cv_backend`
| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `PORT` | Backend HTTP port | `3001` |
| `DATABASE_URL` | PostgreSQL connection string | `postgres://user:pass@cv_postgres:5432/db` |
| `JWT_SECRET` | Primary JWT token secret | `jwtsecret` |
| `JWT_SECRET_2` | Secondary JWT token rotation secret | `jwtrotationsecret` |
| `CLOUDINARY_URL` | Cloudinary storage configuration | `cloudinary://api_key:api_secret@cloud_name` |
| `SMTP_URL` | SMTP mailing service URL | `smtp://user:pass@smtp.example.com` |
