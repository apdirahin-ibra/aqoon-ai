# Aqoon AI - Web Application Architecture

This directory (`apps/web`) contains the core Next.js 15 frontend application. It is structured to follow modern App Router conventions, ensuring strict separation of concerns, scalability, and high performance.

---

## 🏗️ Folder Structure Review

The application logic primarily resides within the `src/` directory.

### `src/app/` (Routing & Pages)

We utilize Next.js App Router entirely, grouped by domain using `(folderName)` to keep URLs clean while enforcing distinct layout and authentication boundaries.

- **`(marketing)/` and `(public)/`**: Contains publicly accessible pages such as the landing page, terms of service, and public course catalog. These pages heavily leverage Server Components for SEO.
- **`admin/`**: The Admin portal. Protected by role-based routing checks. Includes dashboards, user management, and course approval workflows.
- **`student/`**: The Student portal. Protected for enrolled users. Contains the learning dashboard, course player (`learn/[courseId]/[lessonId]`), quizzes, study plans, and skill assessments.
- **`tutor/`**: The Tutor portal. Contains analytics, course creation/editing, and student management features.
- **`api/`**: Next.js Route Handlers. Currently used primarily for `better-auth` integration (e.g., `/api/auth/[...all]`).
- **`auth/`**: Custom sign-in, sign-up, and password recovery pages extending the Better-Auth UI.
- **`courses/`, `dashboard/`**: Specific domain routes extending from the application core.
- **`layout.tsx` & `globals.css`**: The absolute root of the App Router. Wraps the app in the `Providers` component (Convex, Theme) and injects the global stylesheet containing our CSS variables (Tailwind v4 theme).
- **`not-found.tsx`**: Custom 404 error page.

### `src/components/` (UI & Feature Components)

Components are rigorously categorized. We avoid placing business logic here unless it's strictly UI-related state.

- **`ui/`**: Base UI primitives populated by `shadcn/ui` (e.g., Button, Card, Dialog, Input). **Do not modify these unless making global design system changes.**
- **`layout/`**: Structural components used across pages (Headers, Footers, Page Wrappers).
- **`courses/`**: Components specific to rendering course and lesson data (Course Cards, Video Players, Lesson Lists).
- **`forum/` & `profile/`**: Components isolated to their specific domains (Forum threads, Profile edit forms).
- **`landing/`**: Highly stylized components specifically built for the `(public)` landing page (Hero sections, Feature Grids).
- **`providers.tsx`**: The global context provider wrapper (initializes Convex React Client and Next Themes).
- **`*sidebar.tsx`**: We have dedicated sidebars for each role (`admin-sidebar.tsx`, `student-sidebar.tsx`, `tutor-sidebar.tsx`) to ensure isolated, minimal-bundle navigation logic per persona.

### `src/lib/` (Utilities & Configuration)

- **`utils.ts`**: Contains our `cn()` utility wrapper (using `clsx` and `tailwind-merge`) for safe dynamic Tailwind class application.
- **`auth.ts`**: Instantiates and exports the Better Auth React client hooks (`authClient`) to be used in UI components (e.g., `useSession()`).

---

## 🔒 Authentication & Route Protection

The web app relies on a multi-layered security approach:

1.  **Middleware (`src/middleware.ts` if root, or handled via App Router Layouts):** Ensures unauthenticated users cannot view `/student`, `/tutor`, or `/admin` routes.
2.  **Client-Side Guards:** Components use `authClient.useSession()` to read the user role and gracefully show loaders or fallback UI while verifying access.
3.  **Layout Boundaries:** Each protected folder (`admin`, `student`, `tutor`) has its own `layout.tsx` which can independently redirect unauthorized access attempts back to `/auth/sign-in`.

---

## 🔌 Data Fetching Patterns

We use the Convex real-time database, meaning almost all data logic is handled via `useQuery` and `useMutation` hooks provided by `convex/react`.

### Best Practices:

1.  **Prefer Server Components for Public Pages:** The landing page and public course catalog should fetch data on the server to optimize SEO and initial load.
2.  **Use `useQuery` for Live Data:** In the `/student` and `/tutor` dashboards, use Convex's `useQuery` to ensure charts, progress bars, and messaging remain real-time without manual polling.
3.  **Handle Loading States:** Always account for `useQuery` returning `undefined` before data arrives. Render skeletons (from `components/ui/skeleton`) during this phase to avoid layout shift.

---

## 💅 Styling Overview

We are using **Tailwind CSS v4**.

-   **Semantic Variables:** Avoid hardcoding colors like `bg-blue-500`. Use our semantic CSS variables defined in `globals.css` (e.g., `bg-primary`, `text-muted-foreground`) to ensure seamless Light/Dark mode transitions.
-   **Class Merging:** If a component accepts a `className` prop, ALWAYS pass it through the `cn()` utility to prevent overriding conflicts.
