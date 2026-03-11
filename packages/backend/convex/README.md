# Aqoon AI - Convex Backend Architecture

This directory (`packages/backend/convex`) contains the complete backend logic, RESTful equivalents, real-time database schema, and serverless functions for the Aqoon AI platform. 

It is powered by [Convex](https://convex.dev/), providing end-to-end type safety with the frontend.

---

## 🗄️ Database Schema & Configuration

### `schema.ts`
The single source of truth for our database tables and indexes. All 18 tables are defined here with strict validation using Convex `v` (validators).
- **Core Tables:** `users`, `courses`, `lessons`, `enrollments`.
- **Learning Mechanics:** `lessonProgress`, `quizzes`, `quizAttempts`, `certificates`.
- **Social & Comms:** `messages`, `forumPosts`, `forumReplies`, `reviews`, `notifications`.
- **Indexes:** Heavily indexed (e.g., `by_user`, `by_course`, `by_tutor`) to ensure query performance remains $O(1)$ regardless of table size.

### `seed.ts`
Contains scripts used to populate an empty database with sample users (Student, Tutor, Admin), mock courses complete with lessons, and initial fake activity for local testing. Run via `npx convex run seed:run`.

### `auth.ts` & `auth.config.ts`
Configuration for **Better Auth**. Integrates the `@better-auth/convex-adapter` so that authentication state is seamlessly managed within Convex. Handles Email/Password rules and Google OAuth setup.

---

## ⚡ Serverless API Functions Review

All files export Queries (`query`), Mutations (`mutation`), or Actions (`action`) that are called directly to the frontend.

### 👤 Identity & Access Management
- **`users.ts`**: Handles profile updates, role migrations (`updateRole` for Admins), and public profile retrieval. It also enforces cascade deletions if an account is terminated.
- **`helpers.ts`**: Crucial security utilities! Exports wrappers like `requireAuth`, `requireTutor`, and `requireAdmin`. Most mutations wrap `ctx` with these to guarantee the invoker has correct permissions.

### 🎓 Content Delivery (Courses & Lessons)
- **`courses.ts`**: Handles drafting, publishing, and listing courses. The `get` query dynamically alters what data is sent depending on if the user is a guest, student, or the owning tutor.
- **`lessons.ts`**: Handles creating/updating modules. Includes `reorder` mutations for drag-and-drop course builders.
- **`resources.ts`**: Manages downloadable attachments linked to courses.

### 📈 Learning & Engagement
- **`enrollments.ts`**: Secures payload for joining courses. Ensures students have access rights.
- **`progress.ts`**: Aggregates `lessonProgress` data, calculating completion percentages globally per course.
- **`quizzes.ts`**: Validates user answers server-side, preventing clients from faking a 100% score. Records `quizAttempts` history.
- **`certificates.ts`**: Once progress reaches 100%, generates verification codes and issues final certificates.

### 💬 Communication & Community
- **`messagesApi.ts`**: Direct Messaging system. **Strict Role Checks:** Enforces that Students can only message enrolled Tutors, and Tutors can only message enrolled Students/Admins. Extracts conversation lists and unread counts.
- **`forum.ts`**: Manages threaded discussions linked dynamically to a specific `courseId`.
- **`notifications.ts`**: Centralized system for pinging users on enrollment, message reception, or course updates.

### 🤖 AI Integration (Actions)
- **`ai.ts`**: Unlike queries/mutations, Actions can call third-party APIs. This file securely fetches `google/gemini-3-flash-preview` via OpenRouter to:
  1. Generate personalized `Study Plans` based on student surveys.
  2. Run dynamic `Skill Assessments`.

### 📊 Dashboards & Operations
- **`dashboard.ts`**: Complex aggregation queries that tally total revenue, active students, and overall system health for the Student, Tutor, and Admin portals respectively.
- **`auditLogs.ts`**: A read-only (except by system) ledger tracking sensitive operations like Role changes and course unpublishing for compliance.
- **`payments.ts`**: Handles webhook events from payment gateways to confirm transactions and trigger automatic enrollment in Premium courses.

---

## 🛡️ Security Principles & Best Practices

1. **Never Trust the Client:** Always re-fetch the user context using `requireAuth(ctx)` within the mutation/query. Never accept `userId` as an argument if doing an operation on behalf of the current user.
2. **Deterministic Queries:** Convex queries must be deterministic. Avoid `Math.random()` or `Date.now()` outside of specific contexts. If you need a timestamp, pass it as an argument or let the frontend calculate it locally if visual only.
3. **Use Indexes:** Always append `.withIndex(...)` when querying arrays larger than a few hundred documents to avoid full table scans.
4. **Third-party APIs = Actions:** If you need to hit Stripe, OpenRouter, or an email service, you *must* use `action()`, not `mutation()`. Actions can then call `internalMutation()` to update the database once the external fetch completes.
