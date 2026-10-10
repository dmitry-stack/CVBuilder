# CV Builder — Frontend Application

The frontend client for the CV Builder platform, built with **Next.js 16 (App Router)**, **React 19**, **Apollo GraphQL Client**, **Tailwind CSS v4**, and **Base UI**.

---

## Features

- **Authentication & Security**: Email/password sign-in and registration, 6-digit email confirmation code verification, forgot/reset password flows, and automatic token refresh via Apollo Client request queuing.
- **Employee Directory**: Paginated, searchable listing of employees with profile links.
- **Profile Management**: Profile information editing, ownership-based access control, read-only peer views, and Cloudinary avatar uploads.
- **CV Management**: Full lifecycle management of CVs (creation, editing, details, projects, skills, preview, and PDF export).
- **Skills Catalog**: 5-tier mastery indicator (*No Expertise*, *Novice*, *Advanced*, *Competent*, *Expert*) with category grouping and single/batch deletion modes.
- **Languages**: CEFR-compliant language proficiency tracking (**A1** through **Native**) with visual progress bars.
- **Design System & UX**: Theme toggle (Light/Dark mode via `next-themes`), internationalization (English & Russian via `useTranslation`), offline banner detection, and unsupported mobile resolution protection.

---

## Tech Stack & Dependencies

- **Framework**: Next.js `16.3.5` (App Router, Server Components & Route Handlers)
- **UI Library**: React `19.2.8` & React DOM `19.2.8`
- **Data Fetching**: `@apollo/client` `^4.3.0` & `@apollo/experimental-nextjs-app-support` `^0.14.5`
- **Styling**: Tailwind CSS `v4` (`@tailwindcss/postcss`, `tw-animate-css`)
- **Component Primitives**: `@base-ui/react` `^1.8.0`
- **Forms & Validation**: `react-hook-form` `^7.88.0` with `@hookform/resolvers` and `zod` `^4.6.5`
- **Icons**: `lucide-react` `^1.46.0`
- **Testing**: `vitest` `^5.0.1`, `@testing-library/react` `^16.3.3`, `@testing-library/jest-dom` `^7.0.1`
- **Code Generation**: `@graphql-codegen/cli` `^7.4.1` with typed document nodes

---

## Getting Started

### 1. Prerequisites
- Node.js `>= 22.x`
- npm installed
- Backend GraphQL API running at `http://localhost:3001/api/graphql`

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create or edit `.env` in the `cv-frontend/` directory:
```env
AUTH_SECRET="691558a02592e6d7ea53d8fc6275e491"
VITE_GRAPHQL_URL="http://localhost:3001/api/graphql"
```

### 4. Generate GraphQL Types
Generate typed document nodes from GraphQL operation files:
```bash
npm run codegen
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Running Unit Tests & Quality Gates

### Running Tests
The project contains 400+ unit tests across components, hooks, utilities, actions, and validation schemas:

```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npx vitest

# Run a specific test file
npm run test -- src/shared/components/layout/Navbar.test.tsx

# Run tests with coverage
npx vitest run --coverage
```

### Quality Verification Gates
Always verify all gates pass before committing changes:
```bash
npm run typecheck    # TypeScript verification (tsc --noEmit)
npm run lint         # ESLint code check
npm run test         # Vitest unit tests suite
npm run build        # Production Next.js build
```
