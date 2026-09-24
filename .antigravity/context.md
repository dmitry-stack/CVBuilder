# CV Builder — Frontend Context & Architecture

> This document maintains the living architectural context, technical decisions, implementation state, and roadmap for the CV Builder frontend application.

---

## 1. Project Overview & Specifications

* **Application**: CV Builder (Enterprise CV & Resume Management Platform)
* **Design Spec**: Innowise CV Builder Figma Layouts (Desktop & Tablet responsive, Light/Dark themes)
* **Backend API**: GraphQL API running at `http://localhost:3001/api/graphql` (PostgreSQL + Docker + Cloudinary + Browserless + SMTP)
* **Requirements Source**: [.antigravity/instructions.md](./instructions.md)
* **Role & Permission Model**:
  * **Single Role (User Only)**: The application does **not** feature an Admin role. All authenticated accounts are standard **User** accounts.
  * **Ownership-Based Access Control**: All data modification (updating profile, uploading avatar, modifying CVs, skills, and languages) is strictly restricted to the resource owner (`isOwnProfile = currentUserId === resourceOwnerId`).
  * **Read-Only Peer View**: When viewing another user's profile (`/users/[id]`), all inputs and dropdowns are rendered in read-only/disabled states, and edit/save/cancel buttons as well as photo upload controls are hidden.

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
  - `UsersTable.test.tsx`: 9 component tests (Employees breadcrumb, search input, sortable headers, mock employee data rows, avatar initial fallback, search filter, empty state, column sorting, loading skeleton rows).
  - `UsersTableSkeleton.test.tsx`: 4 unit tests (shell header, disabled search input, column headers, customizable row count).
  - `AuthTabs.test.tsx`: 3 component tests (tab rendering, active tab indicator for /signin and /signup).
  - Vitest suite passes 100% (55/55 tests passing across 10 test suites).
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
- [x] **Unified Common Layout Header (`<Header />`):**
  - Integrated a single application shell `<Header />` in `src/app/(app)/layout.tsx` with `HeaderProvider` context.
  - Automatically renders top-level route titles (`Employees`, `Skills`, `Languages`, `CVs`, `Settings`).
  - Automatically switches to exact Figma breadcrumbs for user subroutes (`Employees > [red user icon] {Name} > Profile / Skills / Languages / CVs`).
  - Removed redundant per-page local header banners from `UsersTable.tsx` and `UsersTableSkeleton.tsx`.
  - Colocated unit tests in `Header.test.tsx` (6 tests). All 74 tests passing.
- [x] **Figma Toast Notifications System:**
  - Implemented exact Figma toast design specifications in `src/components/ui/toast.tsx` and `src/app/globals.css`:
    - 4 variants: Success (`#66BB6A`, border `#335D35`, text `#335D35`), Error (`#C63031`, border `#631818`, text `#F5F5F7`), Warning (`#FFB800`, border `#7F5C00`, text `#7F5C00`), Info (`#29B6F6`, border `#145B7B`, text `#145B7B`).
    - Exact dimensions: width 280px, min-height 80px, border-radius 12px, container frame 328px.
    - Typography: Title (Roboto 16px font-weight 500, line-height 24px, tracking 0.15px), Description (Roboto 12px font-weight 400, line-height 20px, tracking 0.15px).
    - Top-right close button (24px button with 12px vector `X` icon).
    - Mounted `<AppToastContainer />` in root `src/app/layout.tsx`.
    - Created typed `notify` helper (`notify.success`, `notify.error`, `notify.warning`, `notify.info`).
    - Colocated unit test suite `toast.test.tsx` (6 tests). All 80 project tests passing.
- [x] **User Profile Page & Live GraphQL Integration (`/users/[id]`):**
  - Integrated live GraphQL queries and mutations:
    - `query User($userId: ID!)`: fetches live user, profile, department, and position data.
    - `query Departments`: dynamically populates department dropdown options from the backend.
    - `query Positions`: dynamically populates position dropdown options from the backend.
    - `mutation UpdateProfile`: updates employee first and last names.
    - `mutation UpdateUser`: updates department, position, and role assignments.
  - Built dedicated reusable `ProfileSkeleton` (`src/features/users/ui/ProfileSkeleton.tsx`) matching exact Figma avatar and 2x2 grid layout dimensions with label and input placeholders to prevent layout shift.
  - Added Next.js App Router streaming skeleton in `src/app/(app)/users/[id]/loading.tsx`.
  - Added breadcrumb user name skeleton in `<Header />` (`data-slot="header-user-skeleton"`) so the common header shows a clean pulse placeholder during profile loading rather than hardcoding names.
  - Colocated unit and component test suites: `profile.schema.test.ts` (5 tests), `ProfileTabs.test.tsx` (2 tests), `ProfileForm.test.tsx` (7 tests), `ProfileSkeleton.test.tsx` (2 tests), `Header.test.tsx` (7 tests). All 88 project tests passing.
- [x] **User Skills Page & Mastery Progress System (`/users/[id]/skills`):**
  - Designed and implemented the User Skills page matching the Figma reference `.antigravity/assets/skills.png`.
  - Built `SkillMasteryBar` (`src/features/users/ui/SkillMasteryBar.tsx`):
    - 5-level visual indicator matching Figma colors and fill percentages:
      1. `Novice` (20% fill, Grey `#626262`)
      2. `Advanced` (40% fill, Blue `#29B6F6`)
      3. `Competent` (60% fill, Green `#66BB6A`)
      4. `Proficient` (80% fill, Yellow `#FFB800`)
      5. `Expert` (100% fill, CV Accent Red `#C63031`)
    - Accessible `role="progressbar"` with live preview.
  - Built `UserSkillsView` (`src/features/users/ui/UserSkillsView.tsx`):
    - Groups skills by category name in a responsive 3-column grid layout (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4`).
    - Synchronizes common header breadcrumb with user's full name via `<HeaderSync />`.
    - Enforces ownership gating (`isOwnProfile = currentUserId === userId`):
      - Owner mode: "+ Add Skill" action button and hover edit/delete actions for each skill.
      - Peer mode: Strictly read-only presentation matching Figma design.
    - Clean empty state with "Add Your First Skill" action when no skills are registered.
  - Built `SkillDialog` (`src/features/users/ui/SkillDialog.tsx`):
    - Accessible modal for adding, editing, and deleting user profile skills.
    - Autocompletes skill names from catalog and features live visual `SkillMasteryBar` preview during mastery level selection.
  - Built `SkillsSkeleton` (`src/features/users/ui/SkillsSkeleton.tsx`) and updated `loading.tsx` for zero-layout-shift streaming.
  - Declared typed GraphQL operations in `src/features/users/api/skills.graphql` (`ProfileSkills`, `SkillCategories`, `SkillsCatalog`, mutations for add/update/delete).
  - Colocated unit tests: `SkillMasteryBar.test.tsx` (7 tests), `skill.schema.test.ts` (5 tests), `UserSkillsView.test.tsx` (5 tests).
  - All 105 tests passing across 21 test suites; 0 TypeScript errors; 0 lint errors; production build succeeded.
- [x] **User Languages Page & CEFR Proficiency System (`/users/[id]/languages`):**
  - Designed and implemented the User Languages page matching the design system and skills page architecture.
  - Built `LanguageProficiencyBar` (`src/features/users/ui/LanguageProficiencyBar.tsx`):
    - 7-level CEFR + Native visual indicator mapped to the 5 Skills colors with tier-based progression:
      1. `A1` (15% fill, Grey `#626262`, Beginner)
      2. `A2` (30% fill, Grey `#626262`, Elementary)
      3. `B1` (45% fill, Blue `#29B6F6`, Intermediate)
      4. `B2` (60% fill, Green `#66BB6A`, Upper Intermediate)
      5. `C1` (75% fill, Yellow `#FFB800`, Advanced)
      6. `C2` (90% fill, CV Accent Red `#C63031`, Proficient / Mastery)
      7. `Native` (100% fill, CV Accent Red `#C63031`, Native / Bilingual)
    - Accessible `role="progressbar"` with live preview and description.
  - Built `UserLanguagesView` (`src/features/users/ui/UserLanguagesView.tsx`):
    - Renders languages in a responsive 3-column grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4`).
    - Synchronizes common header breadcrumbs with user's full name via `<HeaderSync />`.
    - Enforces single-role ownership gating (`isOwnProfile = currentUserId === userId`):
      - Owner mode: `+ Add Language` button and hover edit/delete actions for each language.
      - Peer mode: Strictly read-only presentation.
    - Clean empty state with "Add Your First Language" action when no languages are recorded.
  - Built `LanguageDialog` (`src/features/users/ui/LanguageDialog.tsx`):
    - Accessible modal for adding, editing, and deleting user profile languages.
    - Autocompletes language names from the global language catalog.
    - Features live visual `LanguageProficiencyBar` preview during CEFR level selection.
  - Built `LanguagesSkeleton` (`src/features/users/ui/LanguagesSkeleton.tsx`) and updated `loading.tsx` for zero-layout-shift streaming.
  - Declared typed GraphQL operations in `src/features/users/api/languages.graphql` (`ProfileLanguages`, `LanguagesCatalog`, mutations `addProfileLanguage`, `updateProfileLanguage`, `deleteProfileLanguage`).
  - Colocated unit tests: `LanguageProficiencyBar.test.tsx` (5 tests), `language.schema.test.ts` (4 tests), `UserLanguagesView.test.tsx` (5 tests).
  - All 119 tests passing across 24 test suites; 0 TypeScript errors; 0 lint errors; production build succeeded.
- [x] **CV Management & Dialogs (Create, Update, Delete & CV Table):**
  - Built feature-driven CV schema in `src/features/cvs/schemas/cv.schema.ts` (with compatibility re-export in `src/features/users/schemas/cv.schema.ts`) validating name, education, and description with Zod.
  - Declared typed GraphQL operations in `src/features/cvs/api/cvs.graphql` (`query Cvs`, `query Cv`, mutations `createCv`, `updateCv`, `deleteCv`) with generated typed document nodes.
  - Implemented accessible modal primitives:
    - `CVDialog` (`src/features/cvs/ui/CVDialog.tsx`): unified modal for Create and Update operations with accessible modal dialog semantics, keyboard escape and focus handling, reactive form resetting via keyed form remounting, validation error display with `AlertCircle`, and dark/light theme support.
    - `DeleteCVDialog` (`src/features/cvs/ui/DeleteCVDialog.tsx`): accessible confirmation modal (`role="alertdialog"`) with destructive action confirmation, loading state, and highlighted CV title.
    - Named wrappers `CreateCVDialog` and `UpdateCVDialog` for modularity.
  - Implemented interactive `CVTable` (`src/features/users/ui/CVTable.tsx`):
    - Table rendering with search filtering and column sorting for Name, Education, and Employee.
    - Create CV button hooked to `CVDialog` in create mode.
    - Row-level action menu with `DropdownMenuButton` (`/cvs/[id]` view link, Update modal trigger, Delete confirmation trigger).
    - Apollo mutation integration with cache refetch and Figma toast notifications (`notify.success`, `notify.error`).
  - Colocated comprehensive unit & component test suites:
    - `cv.schema.test.ts` (7 tests)
    - `CVDialog.test.tsx` (7 tests)
    - `DeleteCVDialog.test.tsx` (4 tests)
    - `CVTable.test.tsx` (6 tests)
    - `DropDownButton.test.tsx` (1 test)
  - Full suite passes 100% (145/145 tests passing across 28 test suites); 0 TypeScript errors; 0 lint errors/warnings; production build succeeded.
- [x] **Route Grouping & Navigation Shell:**
  - Standardized Next.js route groups: `(auth)` for public authentication and `(app)` for authenticated application modules.
  - Resolved nested HTML bug by establishing clean `AppLayout` in `src/app/(app)/layout.tsx` with sidebar padding (`md:pl-[200px]`).
  - Built accessible, responsive `Navbar` (Sidebar / Aside) in `src/components/layout/Navbar.tsx` based directly on Figma specs:
    - 200px fixed aside with rounded-r-full navigation items (`Employees`, `Skills`, `Languages`, `CVs`).
    - Active route highlighting (`bg-[#E2E2E4] text-[#2E2E2E]`) and smooth hover transitions.
    - Pinned bottom user profile pill integrated with `useCurrentUser`: displays live user name, avatar (or initial circle fallback), email, and dynamic menu linking directly to the user's personal profile (`/users/[id]`) and logout action.
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

> **Note**: The application has **no Admin role**. All authenticated features are accessible to the standard `User` role, with data modifications strictly gated by resource ownership (`currentUserId === resourceOwnerId`). Peer profiles are accessible in a read-only presentation.

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
| **Users** | Employees Directory (`/users`) | ✅ Implemented | User | Done |
| **Users** | User Profile (`/users/[id]`) | ✅ Implemented | User (Owner editable, peer read-only) | Done |
| **Users** | User Skills (`/users/[id]/skills`) | ✅ Implemented | User (Owner editable, peer read-only) | Done |
| **Users** | User Languages (`/users/[id]/languages`) | ✅ Implemented | User (Owner editable, peer read-only) | Done |
| **Users** | User CVs (`/users/[id]/cvs`) | ⏳ Not Started | User (Owner editable, peer read-only) | Medium |
| **Skills** | Skills Directory / Management (`/skills`) | ⏳ Not Started | User | Medium |
| **Languages** | Languages Directory / Management (`/languages`) | ⏳ Not Started | User | Medium |
| **CVs** | CV List (`/cvs`) | ✅ Implemented | User | Done |
| **CVs** | CV Details (`/cvs/[id]`) | ⏳ Not Started | User (Owner editable) | High |
| **CVs** | CV Skills (`/cvs/[id]/skills`) | ⏳ Not Started | User (Owner editable) | Medium |
| **CVs** | CV Projects (`/cvs/[id]/projects`) | ⏳ Not Started | User (Owner editable) | Medium |
| **CVs** | CV Preview (`/cvs/[id]/preview`) | ⏳ Not Started | User | High |
| **CVs** | PDF Export (`exportPdf`) | ⏳ Not Started | User | High |
| **Settings** | User & App Settings (`/settings`) | ⏳ Not Started | User | Low |

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
6. **Role & Ownership Enforcement:**
   - The application has **no Admin role**; all authenticated users have the standard `User` role.
   - Resource mutation is strictly governed by ownership checks (`isOwnProfile = currentUserId === targetUserId`).
   - Peer profiles are always read-only. Forms must disable editing and hide submission actions when the authenticated user is not the owner.
7. **Generated GraphQL Artifacts & Linting:**
   - Machine-generated artifacts under `src/graphql/__generated__/**` are excluded in `eslint.config.mjs` (`globalIgnores`) so that internal `@graphql-codegen` helper typings (`any`) do not produce lint failures.
