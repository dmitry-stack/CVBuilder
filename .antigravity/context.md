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
    │   ├── users/
    │   ├── skills/
    │   ├── languages/
    │   └── cvs/
    │       ├── api/            # cvs.graphql, cv_projects.graphql, cv_skills.graphql
    │       ├── hooks/          # useCvProjects, useCvSkills, useCVProjectDialogForm
    │       ├── lib/            # cv-projects.utils, cv-skills.utils
    │       ├── schemas/        # cv.schema, cv-project.schema
    │       └── ui/             # CVTable, CVDialog, CVTabs, DeleteCVDialog
    │           ├── details/    # CVDetailsView, CVDetailsSkeleton
    │           ├── projects/   # CVProjectsView, CVProjectCard, CVProjectDialog, etc.
    │           └── skills/     # CVSkillsView, CVSkillCard, CVSkillsActions, etc.
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
    - Synchronized pagination (`Pagination.tsx`): resets page to 1 on search without polluting URL search parameters, safe fallback clamping for empty/filtered result sets.
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
      - Owner mode: Aligned to Figma `skillsOwner.png` reference with bottom `+ ADD SKILL` and `REMOVE SKILLS` buttons.
      - Selection Mode Deletion: Clicking `REMOVE SKILLS` enters selection mode allowing users to pick multiple skills via interactive checkboxes; clicking `DELETE (n)` sends batch deletion to backend; `CANCEL` or `Escape` key exits selection mode. Individual hover deletion replaced with selection mode.
      - Peer mode: Strictly read-only presentation matching Figma design.
    - Clean empty state with "Add Your First Skill" action when no skills are registered.
  - Built `SkillDialog` (`src/features/users/ui/SkillDialog.tsx`):
    - Accessible modal for adding, editing, and deleting user profile skills.
    - Autocompletes skill names from catalog and features live visual `SkillMasteryBar` preview during mastery level selection.
  - Built `SkillsSkeleton` (`src/features/users/ui/SkillsSkeleton.tsx`) and updated `loading.tsx` for zero-layout-shift streaming.
  - Declared typed GraphQL operations in `src/features/users/api/skills.graphql` (`ProfileSkills`, `SkillCategories`, `SkillsCatalog`, mutations for add/update/delete).
  - Colocated unit tests: `SkillMasteryBar.test.tsx` (7 tests), `skill.schema.test.ts` (5 tests), `UserSkillsView.test.tsx` (9 tests).
  - All 109 tests passing across 21 test suites; 0 TypeScript errors; 0 lint errors; production build succeeded.
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
      - Owner mode: Aligned to `skillsOwner.png` design system with bottom `+ ADD LANGUAGE` and `REMOVE LANGUAGES` action buttons.
      - Selection Mode Deletion: Clicking `REMOVE LANGUAGES` enters selection mode allowing users to pick multiple languages via interactive checkboxes; clicking `DELETE (n)` sends batch deletion to backend; `CANCEL` or `Escape` key exits selection mode.
      - Peer mode: Strictly read-only presentation.
    - Clean empty state with "Add Your First Language" action when no languages are recorded.
  - Built `LanguageDialog` (`src/features/languages/ui/LanguageDialog.tsx`):
    - Accessible modal for adding, editing, and deleting user profile languages.
    - Autocompletes language names from the global language catalog.
    - Features live visual `LanguageProficiencyBar` preview during CEFR level selection.
  - Built `LanguagesSkeleton` (`src/features/languages/ui/LanguagesSkeleton.tsx`) and updated `loading.tsx` for zero-layout-shift streaming.
  - Declared typed GraphQL operations in `src/features/languages/api/languages.graphql` (`ProfileLanguages`, `LanguagesCatalog`, mutations `addProfileLanguage`, `updateProfileLanguage`, `deleteProfileLanguage`).
  - Colocated unit tests: `LanguageProficiencyBar.test.tsx` (5 tests), `language.schema.test.ts` (4 tests), `UserLanguagesView.test.tsx` (9 tests).
  - All 153 tests passing across 28 test suites; 0 TypeScript errors; 0 lint errors; production build succeeded.
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
    - `CVTableSkeleton.test.tsx` (5 tests)
    - `DropDownButton.test.tsx` (1 test)
  - Built `CVTableSkeleton` (`src/features/cvs/ui/CVTableSkeleton.tsx`) matching exact table columns and layout, mounted in `cvs/loading.tsx` and `cvs/page.tsx`.
  - Implemented accessible deletion confirmation modals: `DeleteSkillDialog` (`src/features/skills/ui/DeleteSkillDialog.tsx`) and `DeleteLanguageDialog` (`src/features/languages/ui/DeleteLanguageDialog.tsx`) with single and batch item confirmation, replacing native `window.confirm`. Colocated tests in `DeleteSkillDialog.test.tsx` (6 tests) and `DeleteLanguageDialog.test.tsx` (6 tests).
  - Full suite passes 100% (176/176 tests passing across 32 test suites); 0 TypeScript errors; 0 lint errors/warnings; production build succeeded.
- [x] **CV Skills Management & Mastery System (`/cvs/[id]/skills`):**
  - Designed and implemented the CV Skills page matching the exact visual design of `.antigravity/assets/cvSkills.png` and `skillsOwner.png` using a decoupled, modular architecture adhering to strict Single Responsibility Principle (all files < 175 lines, functions < 30 lines).
  - Built dedicated GraphQL operations in `src/features/cvs/api/cv_skills.graphql` (`query CvSkills`, mutations `addCvSkill`, `updateCvSkill`, `deleteCvSkill`).
  - Extracted business logic and category resolution into `src/features/cvs/lib/cv-skills.utils.ts` with colocated unit tests in `cv-skills.utils.test.ts` (5 tests).
  - Built `useCvSkills` custom hook (`src/features/cvs/hooks/useCvSkills.ts`) isolating Apollo queries, mutations, selection mode, and toast notifications from the presentation layer. Added seamless fallback to `cv.user.profile.skills` when `cv.skills` is empty, along with automatic background synchronization to persist profile skills to CV skills.
  - Built modular UI components aligned 1:1 with `cvSkills.png`:
    - `CVSkillsList.tsx`: Vertically stacked category sections with headers in `font-roboto text-base font-normal` and a responsive 3-column items grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4`).
    - `CVSkillCard.tsx`: Flat skill item row with `SkillMasteryBar` preceding skill name, hover pencil icon for editing, and selection checkbox in delete mode.
    - `SkillMasteryBar.tsx`: Calibrated pastel track colors for light mode (`#FFE082`, `#C8E6C9`, `#B3E5FC`, `#E0E0E0`, `#FFCDD2`) and 72px bar width (`w-18`).
    - `CVSkillsActions.tsx`: 3-column grid alignment where `+ ADD SKILL` aligns under column 2 and `REMOVE SKILLS` (with red trash icon) aligns under column 3; delete mode renders `CANCEL` under column 2 and `DELETE (n)` under column 3.
    - `CVSkillsEmptyState.tsx`: Clean dashed container with subtitle and pill button matching `UserSkillsView`.
    - `CVSkillsView.tsx`: Orchestrator managing `SkillDialog`, `DeleteSkillDialog`, `isDeleting`, and breadcrumbs via `HeaderSync`.
  - Enforced single-role ownership gating (`isOwner = currentUser.id === cv.user.id`): owners can add, edit, and batch-delete CV skills; peers receive a read-only view.
  - Colocated component tests in `src/features/cvs/ui/CVSkillsView.test.tsx` (8 tests).
- [x] **CV Details Management (`/cvs/[id]/details` & `/cvs/[id]`):**
  - Designed and implemented the CV Details page matching `.antigravity/assets/cvDetails.png`:
    - Synchronizes common header breadcrumbs via `<HeaderSync userName={cv.name} />` producing `CVs > Software Engineer With 5+ Years Of Experience (red) > Details`.
    - Supported CV breadcrumb route matching in `Header.tsx` (`/cvs/[id]/details`, `/cvs/[id]/skills`, etc.) with pulse skeleton.
    - Form layout: Clean vertical stack (`max-w-4xl`) with 12px grey labels (`Name`, `Education`, `Description` without asterisks).
    - Inputs: 48px height (`h-12`), 1px border (`#AEAEAE`), transparent background, 16px Roboto text.
    - Textarea: Min-height 160px with relaxed line height.
    - Action button: Single pill button **`UPDATE`** (`rounded-[40px]`, `min-w-[140px]`, `h-10`) aligned to bottom-right; rendered in soft grey (`#AEAEAE`) when clean/pristine and red (`bg-cv-accent`) when dirty; no Cancel button per design spec.
    - Peer mode: Disables all inputs in read-only mode and hides the update action button.
  - Built `CVDetailsSkeleton.tsx` matching exact 48px inputs, 160px textarea, and single pill button geometry for zero layout shift.
  - Built `CVDetailsView.tsx` with `useForm` + `cvFormSchema` (Zod), Apollo `CvDocument` query and `UpdateCvDocument` mutation, and `notify.success/error`.
  - Added redirect from `/cvs/[id]` to `/cvs/[id]/details` (`src/app/(app)/cvs/[id]/page.tsx`).
  - Colocated unit & component tests in `CVDetailsView.test.tsx` (6 tests) and `Header.test.tsx` (10 tests).
  - Full project test suite passing 100% (192/192 tests passing across 34 test suites); TypeScript typecheck passing (0 errors); ESLint passing (0 errors); Next.js production build passing.
- [x] **CV Projects Management (`/cvs/[id]/projects`):**
  - Designed and implemented the CV Projects page matching the exact visual design of `.antigravity/assets/cvProjects.png`:
    - Reusable CV sub-navigation tabs (`CVTabs.tsx`) supporting `Details`, `Skills`, `Projects`, and `Preview`.
    - Pill search bar (`CVProjectsHeader.tsx`) with search icon and 40px rounded input for instant client-side filtering.
    - Prominent red `+ ADD PROJECT` pill button (`bg-cv-accent text-white rounded-[40px] shadow-md`) displayed conditionally for CV owners.
    - 4-column responsive list header (`CVProjectsList.tsx`): sortable columns with directional indicator arrows (`Name ↓`, `Domain`, `Start Date ↓`, `End Date ↓`).
    - Project cards (`CVProjectCard.tsx`):
      - 4-column metadata row matching the header grid.
      - 3-dots action menu (`MoreVertical` icon dropdown) with `Edit` and `Remove` options for CV owners.
      - Full-width project description text.
      - Pill badges for project responsibilities (`bg-[#E2E2E4] text-[#2E2E2E] rounded-full text-xs`).
    - Interactive dialogs & modals:
      - `CVProjectDialog.tsx`: Modal for adding or editing a project within the CV, matching `.antigravity/assets/projectCreateDialog.png`:
        - 2-column header row for `Name` (with `ChevronDown`) and `Domain` in `#E2E2E4` light grey containers.
        - 2-column date row for `Start Date` and `End Date` with calendar icons.
        - Full-width `Description` text display in `#E2E2E4` light grey container, automatically synchronizing with the active/selected company project catalog item.
        - Full-width `Environment` tags field (`CVProjectEnvironmentInput.tsx`) displaying interactive removable pill tags (`HTML5 ⓧ`, `CSS3 ⓧ`, `TypeScript ⓧ`, etc.), inline tag entry, and common technology dropdown suggestions.
        - Full-width `Roles` field (`CVProjectRoleInput.tsx`) supporting comma-separated inputs with common role dropdown suggestions (`Frontend Developer`, `AI Developer`, etc.).
        - Full-width `Responsibilities` input field (`Did something great, Did not break production`).
        - Right-aligned `CANCEL` outline pill button and `UPDATE`/`ADD` red pill button.
      - `DeleteCVProjectDialog.tsx`: Confirmation modal (`role="alertdialog"`) for unlinking a project from the CV.
      - `CVProjectsSkeleton.tsx`: Zero-layout-shift pulse skeleton matching header and card layout.
    - Decoupled, modular architecture strictly adhering to the < 200 lines anti-god-component policy:
      - `CVProjectDialog.tsx` (174 lines)
      - `CVProjectMetaFields.tsx` (137 lines)
      - `CVProjectEnvironmentInput.tsx` (166 lines)
      - `CVProjectRoleInput.tsx` (116 lines)
      - `useCVProjectDialogForm.ts` (116 lines)
      - Custom hook `useCvProjects.ts` managing Apollo queries (`CvProjectsDocument`, `AvailableProjectsDocument`), mutations (`AddCvProjectDocument`, `UpdateCvProjectDocument`, `RemoveCvProjectDocument`), sorting, filtering, and modal states.
      - Schema validation in `cv-project.schema.ts` (Zod) verifying dates (`end_date >= start_date`), project selection, description, environment, and string lists.
      - Date formatting and sorting utilities in `cv-projects.utils.ts`.
    - Single-role ownership gating (`isOwner = currentUserId === cv.user?.id`): peer users receive a read-only list with hidden action menus and add buttons.
    - Colocated unit and component test suites:
      - `cv-project.schema.test.ts` (5 tests)
      - `cv-projects.utils.test.ts` (5 tests)
      - `CVProjectDialog.test.tsx` (5 tests)
      - `CVProjectsView.test.tsx` (8 tests)
  - Full suite passes 100% (215/215 tests passing across 38 test suites); 0 TypeScript errors; 0 ESLint errors; production build succeeded.
- [x] **Password Reset & Email Verification Flows (`/forgot-password`, `/reset-password`, `/verify-email`):**
  - Built full password reset and email OTP verification user journeys matching Figma designs (`forgotPassword.png`, `reset.png`, `emailVerification.png`):
    - `ForgotPasswordForm.tsx` & `/forgot-password`: single email input, `RESET PASSWORD` red pill button, and `CANCEL` link back to `/signin`.
    - `ResetPasswordForm.tsx` & `/reset-password`: extracts `token` from URL query parameter, `New password` and `Confirm password` fields with visibility toggles, `SUBMIT` red pill button, and `GO TO SIGN IN` link.
    - `EmailVerificationForm.tsx` & `/verify-email`: 6-digit OTP code inputs with automatic focus advancement, paste handler, `CONFIRM` red pill button, `LATER` link, and resend verification code action.
    - Integrated sign-up verification flow: `signupAction` forwards `origin` to trigger backend verification email generation, logs in user, and `SignupForm.tsx` smoothly navigates to `/verify-email?email=...`.
    - Dedicated Server Actions with BFF error translation: `forgotPasswordAction`, `resetPasswordAction`, `verifyEmailAction`, and `sendVerificationAction`.
    - Colocated unit and component tests:
      - `auth.actions.test.ts` (23 tests)
      - `ForgotPasswordForm.test.tsx` (4 tests)
      - `ResetPasswordForm.test.tsx` (6 tests)
      - `EmailVerificationForm.test.tsx` (5 tests)
      - `SignupForm.test.tsx` (5 tests)
    - Full test suite passing 100% (303/303 tests across 53 test suites); TypeScript typecheck passing (0 errors); ESLint passing (0 errors); Next.js production build passing.
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
- [x] **Figma Border Geometry Alignment (Dialogs & Form Inputs):**
  - Re-aligned all dialog windows to exact Figma specifications with rectangular frame geometry (removed `rounded-lg` and `rounded-sm` from dialog wrappers and close buttons across all 10 dialogs).
  - Standardized all form text inputs, textareas, date inputs, and select fields across dialogs and profile/CV detail forms to sharp rectangular borders (removed `rounded-xs` and `rounded-[4px]`).
  - Synchronized input placeholder skeletons (`CVDetailsSkeleton`, `ProfileSkeleton`) to sharp geometry to prevent layout shift.
- [x] **CV Preview Page & PDF Export System (`/cvs/[id]/preview`):**
  - Pixel-perfect visual alignment with reference image `.antigravity/assets/cvPreview.png`.
  - Defined GraphQL queries & mutations in `src/features/cvs/api/cv_preview.graphql` (`query CvPreview($cvId: ID!)`, `mutation ExportPdf($pdf: ExportPdfInput!)`), and generated typed document nodes.
  - Implemented domain & metric derivation utilities in `src/features/cvs/lib/cv-preview.utils.ts`:
    - `extractUniqueDomains`: extracts non-duplicate project domains across CV projects.
    - `calculateSkillMetrics`: derives skill experience duration in years and last-used calendar year based on project environment occurrences.
    - `formatPreviewPeriod`: formats project date ranges as `MM.YYYY – Till now` / `MM.YYYY – MM.YYYY`.
    - `formatResponsibilities`: parses project responsibilities into clean bullet points.
    - `base64ToBlob` & `downloadBlob`: handles base64 decoded PDF Blob generation and client download trigger.
  - Built custom hook `useCvPreview` (`src/features/cvs/hooks/useCvPreview.ts`) orchestrating preview queries, skill categorization, domain derivation, and PDF export with graceful fallback to `window.print()`.
  - Built modular UI components under `src/features/cvs/ui/preview/` adhering to strict file size (< 200 lines) and function size (< 30 lines) constraints:
    - `CVPreviewHeader.tsx`: Employee name, uppercase position subtitle, and pill outline `EXPORT PDF` button with loading state.
    - `CVPreviewSummary.tsx`: 2-column layout with vertical coral/red border (`border-[#E57373]`). Left: Education, Language proficiency, Domains. Right: CV Title, Description, Grouped skills list.
    - `CVPreviewProjects.tsx`: Left: uppercase red project name (`text-cv-accent`) and description. Right: Project roles, period, bulleted responsibilities, environment with vertical coral divider.
    - `CVPreviewSkills.tsx`: "Professional skills" table with coral divider line, red category names, and calculated experience metrics.
    - `CVPreviewSkeleton.tsx`: Zero-layout-shift pulse skeleton for preview page.
    - `CVPreview.tsx`: Container orchestrator integrating sections, `HeaderSync` breadcrumbs, error/empty handling, and printable card container (`#cv-preview-content`).
  - Colocated Vitest test suites:
    - `cv-preview.utils.test.ts`: 12 unit tests verifying month-year formatting, periods, domains, skill metrics, responsibilities parsing, and blob decoding.
    - `CVPreviewSkeleton.test.tsx`: 2 tests checking accessible loading states.
    - `CVPreview.test.tsx`: 6 component tests covering loading, error, not found, full preview rendering, and PDF export button interactions.
  - Verification: all 44 test suites (248 tests) pass, TypeScript passes 100%, ESLint passes with 0 warnings/errors, and Next.js Turbopack build succeeds with route `/cvs/[id]/preview` compiled.

### Avatar Upload, Backend Persistence & Navbar Integration (Complete)
- **Feature**:
  - Bound the file picker to both the "Upload avatar image" button/text and circular avatar in `ProfileAvatar.tsx`.
  - Added `uploadAvatar` and `deleteAvatar` operations in `src/features/profile/api/profile.graphql` and generated typed documents via `npm run codegen`.
  - Created modular `src/features/profile/lib/avatar.utils.ts` for file validation (<= 0.5MB, allowed formats JPEG/PNG/GIF/SVG) and base64 conversion.
  - Implemented `src/features/profile/hooks/useAvatarUpload.ts` managing GraphQL mutations, optimistic/direct Apollo cache updates (`MeDocument`, `UserDocument`, `UsersDocument`), and toast notifications.
  - Connected `NavUserProfile.tsx`, `Navbar.tsx`, and `NavMobileHeader.tsx` to render the user's uploaded avatar image across desktop and mobile layouts.
  - Verification: 58 test files (352 tests) passing, 0 TypeScript errors, 0 ESLint warnings, production build compiled cleanly.

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
| **Authentication** | Forgot Password (`/forgot-password`) | ✅ Implemented | Public | Done |
| **Authentication** | Reset Password (`/reset-password`, `/forgot-password`) | ✅ Implemented | Public | Done |
| **Authentication** | Email Verification (`/verify-email`) | ✅ Implemented | User / Public | Done |
| **System** | Root Page (`/`) / Landing | ✅ Implemented | Public | Done |
| **System** | Not Found (404) (`not-found.tsx`) | ✅ Implemented | Public | Done |
| **System** | No Internet Error | ✅ Implemented | Public | Done |
| **System** | Unsupported Device | ✅ Implemented | Public | Done |
| **Users** | Employees Directory (`/users`) | ✅ Implemented | User | Done |
| **Users** | User Profile (`/users/[id]`) | ✅ Implemented | User (Owner editable, peer read-only) | Done |
| **Users** | User Skills (`/users/[id]/skills`) | ✅ Implemented | User (Owner editable, peer read-only) | Done |
| **Users** | User Languages (`/users/[id]/languages`) | ✅ Implemented | User (Owner editable, peer read-only) | Done |
| **Users** | User CVs (`/users/[id]/cvs`) | ⏳ Not Started | User (Owner editable, peer read-only) | Medium |
| **Skills** | Skills Directory / Management (`/skills`) | ✅ Implemented | User | Done |
| **Languages** | Languages Directory / Management (`/languages`) | ✅ Implemented | User | Done |
| **CVs** | CV List (`/cvs`) | ✅ Implemented | User | Done |
| **CVs** | CV Details (`/cvs/[id]`) | ✅ Implemented | User (Owner editable, peer read-only) | Done |
| **CVs** | CV Skills (`/cvs/[id]/skills`) | ✅ Implemented | User (Owner editable, peer read-only) | Done |
| **CVs** | CV Projects (`/cvs/[id]/projects`) | ✅ Implemented | User (Owner editable, peer read-only) | Done |
| **CVs** | CV Preview (`/cvs/[id]/preview`) | ✅ Implemented | User | Done |
| **CVs** | PDF Export (`exportPdf`) | ✅ Implemented | User | Done |
| **Settings** | User & App Settings (`/settings`) | ✅ Implemented | User | Done |

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
