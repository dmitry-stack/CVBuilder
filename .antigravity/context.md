# CV Builder — Frontend Context & Architecture

> This document maintains the living architectural context, technical decisions, implementation state, and roadmap for the CV Builder frontend application.

---

## 1. Project Overview & Specifications

* **Application**: CV Builder (Enterprise CV & Resume Management Platform)
* **Design Spec**: Innowise CV Builder Figma Layouts (Desktop & Tablet responsive, Light/Dark themes)
* **Backend API**: GraphQL API running at `http://localhost:3001/api/graphql` (PostgreSQL + Docker + Cloudinary + Browserless + SMTP)
* **Requirements Source**: [.antigravity/instructions.md](./instructions.md)

---

## 2. Technical Stack

| Layer | Technology | Details / Notes |
| :--- | :--- | :--- |
| **Framework** | Next.js 16.3.5 | App Router with `proxy.ts` (Next.js 16 request interceptor) |
| **UI Library** | React 19.2.8 | Functional components, hooks, React Server Components (RSC) |
| **Data Layer** | GraphQL + Apollo Client | `@apollo/experimental-nextjs-app-support` for Next.js App Router |
| **GraphQL Codegen**| `@graphql-codegen/cli` | Client-preset generating typed document nodes (`src/graphql/__generated__/`) |
| **Forms & Validation** | React Hook Form + Zod | `@hookform/resolvers/zod` with colocated Zod schemas |
| **Styling** | Tailwind CSS v4 | `@tailwindcss/postcss`, `tw-animate-css`, OKLCH theme variables in `globals.css` |
| **Component Primitives** | `@base-ui/react` | Headless, accessible primitives (Base UI button) |
| **Testing** | Vitest + RTL | `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, JSDOM environment |
| **Cookies / Storage** | `js-cookie` | Client-side cookie management for `access_token` and `refresh_token` |

---

## 3. Architecture & Codebase Structure

The project follows a **Feature-Driven Architecture** colocating business logic, validation, API documents, and tests by domain:

```text
cv-frontend/
├── codegen.ts                  # GraphQL Codegen config pointing to ../cv-backend/**/*.graphql
├── components.json             # Shadcn / Base UI component config
├── next.config.ts              # Next.js configuration
├── package.json                # Scripts & dependencies
├── vitest.config.mts           # Vitest test runner configuration
├── vitest.setup.ts             # Testing Library setup & cleanup hooks
└── src/
    ├── proxy.ts                # Next.js 16 network-level proxy (auth guard & route redirects)
    ├── app/                    # Next.js App Router
    │   ├── (auth)/             # Public Auth route group
    │   │   ├── signin/page.tsx # /signin route
    │   │   └── signup/page.tsx # /signup route
    │   ├── (app)/              # Authenticated App shell route group
    │   │   ├── layout.tsx      # App shell layout with <Navbar /> (Sidebar)
    │   │   └── users/page.tsx  # /users protected route
    │   ├── api/                # Next.js Route Handlers (auth session & refresh)
    │   ├── fonts.ts            # Font definitions
    │   ├── globals.css         # Tailwind v4 imports, @theme inline, and color tokens
    │   ├── layout.tsx          # Root HTML layout & ApolloProviderWrapper
    │   └── page.tsx            # Root dynamic redirect
    ├── components/
    │   ├── layout/             # Layout components (Navbar.tsx / Sidebar)
    │   └── ui/                 # Reusable design system primitives (button.tsx, input.tsx)
    ├── features/               # Feature domain modules
    │   ├── auth/
    │   │   ├── actions/        # login.action.ts, signup.action.ts
    │   │   ├── api/            # auth.graphql (mutations: Login, Signup, UpdateToken)
    │   │   ├── schemas/        # auth.schema.ts (loginSchema, signupSchema) & tests
    │   │   └── ui/             # SigninForm, SignupForm, LogoutButton & test suites
    │   └── users/
    ├── graphql/
    │   └── __generated__/      # Generated GraphQL documents and TypeScript types
    └── lib/
        ├── apollo-provider.tsx # Apollo client setup & HttpLink/AuthLink
        ├── auth-storage.ts     # Cookie-based access & refresh token helper
        └── utils.ts            # Class merging utility (cn)
```

---

## 4. Current Implementation Status

### Completed
- [x] **Authentication UI & Forms with Server Actions & Exact Figma Alignment:**
  - Migrated `SigninForm` and `SignupForm` to execute dedicated Server Actions (`loginAction` and `signupAction`).
  - Forms use React `useTransition` for non-blocking pending states, keeping instant client-side Zod validation while delegating token handling and cookie storage directly to the server.
  - Pixel-perfect visual alignment with Figma inspect specifications:
    - Dedicated `AuthTabs` navigation with 150px wide tabs, 56px header height, and 150px red active underline (`#C63031`).
    - 560px max width form container centered on canvas with 121px top offset.
    - Typography: 34px/42px headings (`Welcome back`, `Sign up now`), 16px/24px subtitles (`#2E2E2E`).
    - 48px input fields with `#AEAEAE` borders, 16px Roboto text, `#C4C4C6` placeholder, and 40px rounded password toggle icons.
    - 220px pill primary buttons (`rounded-[40px]`, `#C63031`, 14px uppercase tracking 0.4px) with drop shadow `shadow-[0px_3px_1px_-2px_rgba(0,0,0,0.2),0px_2px_2px_rgba(0,0,0,0.14),0px_1px_5px_rgba(0,0,0,0.12)]`.
    - 220px secondary links (`FORGOT PASSWORD` and `I HAVE AN ACCOUNT`).
- [x] **Automated Testing:**
  - `auth.actions.test.ts`: 9 unit tests (server-side validation, httpOnly cookie setting, error translation, logoutAction, refreshAction).
  - `auth.schema.test.ts`: 7 unit tests for validation rules (email format, password length, confirmation match).
  - `input.test.tsx`: 6 unit tests (rendering, user typing, disabled state, ref forwarding, custom class merging, aria-invalid).
  - `LogoutButton.test.tsx`: 2 component tests (rendering, logout and Apollo cache clear flow).
  - `LoginForm.test.tsx`: 4 component tests (rendering, validation errors, server action submission, error display).
  - `SignupForm.test.tsx`: 5 component tests (rendering, validation, password mismatch, server action submission, error display).
  - `Navbar.test.tsx`: 6 component tests (brand logo, 4 nav links, active route highlight, user profile pill, logout flow, responsive drawer toggle).
  - `UsersTable.test.tsx`: 8 component tests (Employees breadcrumb, search input, sortable headers, mock employee data rows, avatar initial fallback, search filter, empty state, column sorting).
  - `AuthTabs.test.tsx`: 3 component tests (tab rendering, active tab indicator for /signin and /signup).
  - Vitest suite passes 100% (50/50 tests passing across 9 test suites).
- [x] **Employees / Users Directory (`/users`):**
  - Implemented GraphQL query `src/features/users/api/users.graphql` (`query Users($params: SearchPaginationInput)`).
  - Executed `graphql-codegen` generating `UsersDocument` and typed response models.
  - Built `src/features/users/ui/UsersTable.tsx` implementing exact Figma specifications:
    - Top breadcrumb: 56px height, `#F5F5F7` background, "Employees" title.
    - Search input: 40px height, `rounded-[40px]`, `border-[#AEAEAE]`, 24px search icon at left: 12px, placeholder "Search".
    - Table header: 58px height, 14px font-medium headers for First Name, Last Name, Email, Department (with chevron icon), Position.
    - Table body rows: 73px height each, 40px avatar (`#AEAEAE` with 20px uppercase initial or user photo), 14px regular font, 40px circle action button at right.
    - Interactive client-side & server-side search filtering and column sorting.
    - Loading skeletons and clean empty state.
- [x] **Route Grouping & Navigation Shell:**
  - Standardized Next.js route groups: `(auth)` for public authentication and `(app)` for authenticated application modules.
  - Resolved nested HTML bug by establishing clean `AppLayout` in `src/app/(app)/layout.tsx` with sidebar padding (`md:pl-[200px]`).
  - Built accessible, responsive `Navbar` (Sidebar / Aside) in `src/components/layout/Navbar.tsx` based directly on Figma specs:
    - 200px fixed aside with rounded-r-full navigation items (`Employees`, `Skills`, `Languages`, `CVs`).
    - Active route highlighting (`bg-[#E2E2E4] text-[#2E2E2E]`) and smooth hover transitions.
    - Pinned bottom user profile pill with 40px red initial circle (`#C63031`) and integrated logout button.
    - Responsive mobile top header and slide-out navigation drawer.
- [x] **Root Route (`/`) & Landing:**
  - Added `src/app/page.tsx` server component with dynamic cookie inspection (`access_token` or `refresh_token`) to redirect authenticated users to `/users` and unauthenticated users to `/signin`.
- [x] **Authentication & Token Security (BFF Architecture):**
  - All token management is server-side with strict `HttpOnly; Secure; SameSite=Lax` cookies for both `access_token` and `refresh_token` (`src/lib/auth/graphql-auth.server.ts`).
  - Next.js Route Handler `POST /api/graphql` serves as a secure BFF proxy, reading `access_token` from cookies and attaching `Bearer ${token}` to upstream GraphQL calls.
  - Apollo Client in `src/lib/apollo-provider.tsx` connects to `/api/graphql` with `credentials: "same-origin"`.
  - Apollo Client `ErrorLink` catches `401 Unauthorized` / `UNAUTHENTICATED` errors, deduplicates concurrent requests, calls `refreshAction()`, and transparently retries queued operations.
  - Server Actions (`loginAction`, `signupAction`, `refreshAction`, `logoutAction`) use typed GraphQL documents (`LoginDocument`, `SignupDocument`, `UpdateTokenDocument`).
- [x] **Domain Separation:**
  - Relocated `LogoutButton` to `src/features/auth/ui/LogoutButton.tsx` and updated target to `/signin`.
- [x] **Font Configuration Cleanup:**
  - Cleaned up `src/app/layout.tsx` removing the redundant duplicate Roboto instantiations mapped to Geist CSS variables.
- [x] **Design System & Form Primitives:**
  - Implemented reusable, accessible `src/components/ui/input.tsx` using `@base-ui/react/input` with theme-aware styling, dark mode support, and focus/invalid states.
  - Refactored `SigninForm.tsx` and `SignupForm.tsx` to use the unified `Input` primitive.
- [x] **GraphQL Operation Consistency:**
  - Standardized `SigninForm.tsx` to use `LoginDocument` generated from `auth.graphql` (matching `SignupForm.tsx`), removing redundant inline `gql` strings.
- [x] **Route Protection:**
  - `src/proxy.ts` redirects unauthenticated traffic from `/users` to `/signin?callbackUrl=...`.
  - Redirects authenticated traffic from `/signin` and `/signup` to `/users`.
  - Redirects legacy `/login` path to `/signin`.
- [x] **GraphQL Codegen Setup:**
  - Configured to inspect `../cv-backend/**/*.graphql` and generate typed document nodes into `src/graphql/__generated__/`.

### In Progress / Pending Architectural Refinements
- [ ] **Theme Token Clean Up:**
  - Replace remaining hardcoded hex colors (`#C63031`) with Tailwind semantic theme variables (`--primary`).
- [ ] **Dependency Pruning:**
  - Remove unused packages (`next-auth`, `rxjs`, `next-themes`) from `package.json`.

---

## 5. Module & Page Roadmap (Aligned with Instructions)

| Module | Page | Status | Access | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **Authentication** | Sign In (`/signin`) | ✅ Implemented | Public | Done |
| **Authentication** | Sign Up (`/signup`) | ✅ Implemented | Public | Done |
| **Authentication** | Forgot Password (`/forgot-password`) | ⏳ Not Started | Public | High |
| **Authentication** | Reset Password (`/reset-password`) | ⏳ Not Started | Public | High |
| **Authentication** | Email Verification (`/verify-email`) | ⏳ Not Started | Public | High |
| **System** | Root Page (`/`) / Landing | ✅ Implemented | Public | Done |
| **System** | Not Found (404) (`not-found.tsx`) | ⏳ Not Started | Public | Medium |
| **System** | No Internet Error | ⏳ Not Started | Public | Low |
| **System** | Unsupported Device | ⏳ Not Started | Public | Low |
| **Users** | Users List (`/users`) | ✅ Implemented | User, Admin | Done |
| **Users** | User Profile (`/users/[id]`) | ⏳ Not Started | User, Admin | High |
| **Users** | User Skills (`/users/[id]/skills`) | ⏳ Not Started | User, Admin | Medium |
| **Users** | User Languages (`/users/[id]/languages`) | ⏳ Not Started | User, Admin | Medium |
| **Users** | User CVs list (Admin view) | ⏳ Not Started | Admin | Medium |
| **Skills** | Skills (User View) | ⏳ Not Started | User | Medium |
| **Skills** | Skills Management (Admin) | ⏳ Not Started | Admin | Medium |
| **Languages** | Languages (User View) | ⏳ Not Started | User | Medium |
| **Languages** | Languages Management (Admin) | ⏳ Not Started | Admin | Medium |
| **CVs** | CV List (`/cvs`) | ⏳ Not Started | User, Admin | High |
| **CVs** | CV Details (`/cvs/[id]`) | ⏳ Not Started | User, Admin | High |
| **CVs** | CV Skills (`/cvs/[id]/skills`) | ⏳ Not Started | User, Admin | Medium |
| **CVs** | CV Projects (`/cvs/[id]/projects`) | ⏳ Not Started | User, Admin | Medium |
| **CVs** | CV Preview (`/cvs/[id]/preview`) | ⏳ Not Started | User, Admin | High |
| **CVs** | PDF Export (`exportPdf`) | ⏳ Not Started | User, Admin | High |
| **Admin** | Positions Management | ⏳ Not Started | Admin | Low |
| **Admin** | Departments Management | ⏳ Not Started | Admin | Low |
| **Admin** | Projects Management | ⏳ Not Started | Admin | Low |
| **Settings** | User & App Settings | ⏳ Not Started | User, Admin | Low |

---

## 6. Conventions & Guidelines for Development

1. **GraphQL Operations:**
   - Always declare queries and mutations in `<feature>/api/<feature>.graphql`.
   - Run `pnpm run codegen` after adding or updating queries.
   - Import the generated `*Document` from `@/graphql/__generated__/graphql`.
2. **Form Validation:**
   - Always define schemas in `<feature>/schemas/<name>.schema.ts` using Zod.
   - Infer types using `z.infer<typeof schema>`.
   - Colocate unit tests in `<name>.schema.test.ts`.
3. **UI Components:**
   - Keep shared headless primitives in `src/components/ui/`.
   - Keep feature-specific widgets in `src/features/<feature>/ui/`.
   - Use Tailwind semantic tokens (`text-primary`, `bg-background`, `border-border`) rather than hardcoded hex colors.
4. **Testing Policy:**
   - All forms must have tests verifying: (1) field rendering, (2) validation errors on invalid input, (3) successful submission mock, (4) backend error handling.
5. **React 19 Ref Purity & Client Navigation:**
   - Never read or mutate `ref.current` during component render bodies; synchronize refs inside `useEffect` and access them strictly inside event handlers or asynchronous callbacks.
   - Strictly avoid `window.location.href` for internal Next.js navigation; use `useRouter().push()` in Client Components or `redirect()` in Server Components/Actions.
