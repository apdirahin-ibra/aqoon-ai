# Aqoon AI

**AI-Powered Skill Learning Platform**

Aqoon AI is a modern, full-stack learning management system (LMS) with AI-powered study plans, skill assessments, interactive courses, and real-time progress tracking — built with Next.js 16, Convex, and Better Auth.

---

## 🚀 Tech Stack

| Layer                 | Technology                                                              |
| --------------------- | ----------------------------------------------------------------------- |
| **Frontend (Web)**    | Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS 4, shadcn/ui |
| **Frontend (Mobile)** | React Native (Expo)                                                     |
| **Backend**           | Convex (Realtime Database, Server Functions, File Storage)              |
| **Authentication**    | Better Auth (with Convex adapter, email + Google OAuth)                 |
| **AI Integration**    | OpenRouter (`google/gemini-3-flash-preview`) via Vercel AI SDK v6       |
| **Env Validation**    | `@t3-oss/env-nextjs` + Zod                                              |
| **Tooling**           | Turborepo, pnpm, Biome, TypeScript                                      |

---

## 🌟 Features

### 🎓 Student Portal

- **Dashboard** — Real-time stats (enrolled courses, completed lessons, certificates, study hours)
- **My Courses** — Enrolled courses with progress tracking
- **Course Player** — Lesson content, lesson progress, next-lesson navigation
- **Quizzes** — Automated grading with score feedback
- **Study Plan** — AI-generated personalized study plans (OpenRouter + Gemini)
- **Skill Assessment** — AI-powered skill evaluation with strengths/weaknesses analysis
- **Course Roadmap** — Visual timeline of lessons grouped into modules with progress
- **Course Forum** — Discussion threads with replies per course
- **Resource Library** — Downloadable course materials grouped by type
- **Wishlist** — Save/unsave courses
- **Certificates** — View earned completion certificates
- **Notifications** — Real-time notifications with mark as read
- **Messages** — Direct messaging between users
- **Profile** — Edit profile, upload avatar via Convex file storage

### 👨‍🏫 Tutor Portal

- **Dashboard** — Stats (total students, courses, revenue, completion rates)
- **Course Management** — Create, edit, publish/unpublish courses
- **Lesson Editor** — Create/edit lessons with ordering
- **Analytics** — Earnings charts, student distribution, revenue breakdown
- **Profile** — Edit tutor profile with avatar upload

### 🛡️ Admin Portal

- **Dashboard** — Platform-wide stats (users, courses, revenue, enrollments)
- **User Management** — List, search, filter, and change user roles
- **Course Management** — Review, publish/unpublish, remove courses
- **Audit Log** — Track all platform activity with category filtering

### 🌐 Public Pages

- **Landing Page** — Hero, features, testimonials, FAQ
- **Course Catalog** — Browse/search all published courses
- **Course Detail** — Lessons, reviews, enrollment, tutor info
- **Leaderboard** — Top learners ranking

### 🔐 Auth & Security

- **Email + Password** sign-up/sign-in
- **Google OAuth** social login
- **Route Protection** — `proxy.ts` (Next.js 16) + server-side `isAuthenticated()`
- **Role-based access** — Convex helpers (`requireAuth`, `requireTutor`, `requireAdmin`)
- **Session management** — Cookie-based via Better Auth

---

## 📂 Project Structure

```
aqoon-ai/
├── apps/
│   ├── web/              # Next.js 16 Web Application
│   │   └── src/
│   │       ├── app/      # App Router pages (student, tutor, admin, public)
│   │       ├── components/ # UI components (shadcn/ui, sidebar, auth, etc.)
│   │       └── lib/      # Auth client, utils, server helpers
│   └── native/           # Expo React Native App
├── packages/
│   ├── backend/          # Convex schema, API functions, auth config, AI actions
│   │   └── convex/       # 27 function files (see Backend API below)
│   ├── config/           # Shared configs (Tailwind, TypeScript, Biome)
│   └── env/              # Type-safe env validation (@t3-oss/env + Zod)
└── docs/                 # Implementation documentation
```

---

## 🗄️ Backend API (Convex)

### Database Tables (18 total)

`users` · `courses` · `lessons` · `enrollments` · `lessonProgress` · `quizzes` · `quizAttempts` · `payments` · `reviews` · `wishlist` · `payouts` · `certificates` · `forumPosts` · `forumReplies` · `notifications` · `messages` · `resources` · `auditLogs`

### Function Files (27 total)

| File               | Purpose                                                                   |
| ------------------ | ------------------------------------------------------------------------- |
| `ai.ts`            | AI actions — `generateStudyPlan`, `assessSkills` (OpenRouter + AI SDK v6) |
| `auditLogs.ts`     | Admin audit trail — `list`, `log`                                         |
| `auth.ts`          | Better Auth config (email, Google OAuth, Expo)                            |
| `certificates.ts`  | Certificate queries                                                       |
| `courses.ts`       | CRUD, `listPublic`, `listByTutor`, publish/unpublish                      |
| `dashboard.ts`     | Stats queries — `studentStats`, `tutorStats`, `adminStats`                |
| `enrollments.ts`   | Enroll, `myEnrollments`, completion tracking                              |
| `files.ts`         | File storage — upload URLs, profile images, thumbnails                    |
| `forum.ts`         | Forum posts + replies per course                                          |
| `helpers.ts`       | Auth guards — `requireAuth`, `requireTutor`, `requireAdmin`               |
| `lessons.ts`       | CRUD, ordering, preview management                                        |
| `messagesApi.ts`   | Direct messaging — conversations, threads, send                           |
| `notifications.ts` | CRUD, mark read, mark all read                                            |
| `payments.ts`      | Payment records                                                           |
| `progress.ts`      | Lesson progress, course progress, roadmap data                            |
| `quizzes.ts`       | Quiz CRUD, submissions, scoring                                           |
| `resources.ts`     | Course resources (downloadable materials)                                 |
| `reviews.ts`       | Course reviews                                                            |
| `schema.ts`        | Full database schema (18 tables with indexes)                             |
| `seed.ts`          | Database seeding (users, courses, lessons, etc.)                          |
| `users.ts`         | User CRUD, role management, profile updates                               |
| `wishlist.ts`      | Wishlist toggle/list                                                      |

---

## 🛠️ Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+
- A [Convex](https://convex.dev) account

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Setup Convex Backend

```bash
cd packages/backend
npx convex dev
```

Follow the prompts to create/link your Convex project.

### 3. Set Environment Variables

**`apps/web/.env.local`:**

```env
NEXT_PUBLIC_CONVEX_URL=<your-convex-url>
NEXT_PUBLIC_CONVEX_SITE_URL=<your-convex-site-url>
BETTER_AUTH_SECRET=<your-secret>
```

**Convex Dashboard** (Settings → Environment Variables):

```
BETTER_AUTH_SECRET=<same-secret>
SITE_URL=http://localhost:3001
OPENROUTER_API_KEY=<your-openrouter-api-key>
OPENROUTER_MODEL=google/gemini-3-flash-preview
GOOGLE_CLIENT_ID=<optional-google-oauth-id>
GOOGLE_CLIENT_SECRET=<optional-google-oauth-secret>
```

### 4. Seed the Database (Optional)

```bash
cd packages/backend
npx convex run seed:run
```

### 5. Start Development Server

```bash
pnpm run dev
```

- Web: [http://localhost:3001](http://localhost:3001)
- Convex Dashboard: [dashboard.convex.dev](https://dashboard.convex.dev)

---

## 📜 License

Private Property of Aqoon AI.
