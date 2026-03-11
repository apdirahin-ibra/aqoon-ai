<div align="center">
  <img src="./apps/web/public/favicon.ico" alt="Aqoon AI Logo" width="120" />
  <h1>Aqoon AI</h1>
  <p><strong>The Next-Generation AI-Powered Learning Management System</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=nextdotjs" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Convex-Backend-FF6B6B?style=for-the-badge" alt="Convex" />
  </p>
</div>

<br />

Aqoon AI is a premium, full-stack Learning Management System (LMS) designed to deliver an unparalleled educational experience. It seamlessly blends modern web technologies with advanced AI capabilities to provide personalized study plans, dynamic skill assessments, interactive course delivery, and real-time progress tracking.

Built with **Next.js 15**, **Convex**, and **Better Auth**, Aqoon AI represents the pinnacle of modern, scalable web application architecture.

---

## ✨ Key Features

Aqoon AI is built to serve three distinct user personas, each with a tailored, feature-rich experience.

### 🎓 For Students (The Learning Experience)
*   **AI-Generated Study Plans:** Get personalized, structured learning paths powered by Gemini via OpenRouter.
*   **Dynamic Skill Assessments:** AI-driven evaluations to pinpoint strengths and identify areas for improvement.
*   **Immersive Course Player:** Distraction-free learning environment with progress tracking, rich text formatting, and video support.
*   **Interactive Quizzes:** Automated grading with instant feedback to solidify learning.
*   **Course Roadmaps:** Visual timelines of curriculum progress.
*   **Community Forums:** Engage with peers and tutors in course-specific discussion threads.
*   **Direct Messaging:** Secure, role-restricted 1-on-1 communication with enrolled tutors.
*   **Resource Library & Certificates:** Downloadable materials and verifiable completion certificates.

### 👨‍🏫 For Tutors (The Teaching Experience)
*   **Comprehensive Dashboard:** Track total students, revenue, and course completion rates at a glance.
*   **Course & Lesson Builder:** Intuitive tools to create, organize, and publish premium educational content.
*   **Detailed Analytics:** Visualize earnings, student distribution, and engagement metrics.
*   **Student Engagement:** Directly message enrolled students to provide guidance and support.

### 🛡️ For Administrators (The Platform Operations)
*   **Platform Oversight:** Global statistics on user growth, revenue generation, and course engagement.
*   **User & Content Management:** Filter users, change roles, and moderate published courses.
*   **Audit Logging:** Complete tracking of sensitive platform activity for security and compliance.

---

## 🏗️ Architecture & Tech Stack

Aqoon AI utilizes a monorepo structure powered by Turborepo, ensuring strict separation of concerns between the frontend applications and the backend database/API layer.

### 🧩 System Layers

| Layer | Technologies Used | Description |
| :--- | :--- | :--- |
| **Frontend Web** | Next.js 15, React 19, Tailwind CSS v4, shadcn/ui | The primary web application leveraging React Server Components (RSC) and a modern, high-performance UI. |
| **Frontend Mobile**| React Native (Expo) | Cross-platform mobile application companion (located in `apps/native`). |
| **Backend API** | Convex | A fully managed, reactive backend providing a real-time database, serverless functions, and file storage. |
| **Authentication** | Better Auth | Robust authentication system supporting Email/Password, Google OAuth, and secure session management. |
| **AI Integration** | Vercel AI SDK v6, OpenRouter | Integration with `google/gemini-3-flash-preview` to power intelligent tutoring features. |
| **Infrastructure** | Turborepo, pnpm, Biome | Enterprise-grade tooling for compilation, linting, formatting, and workspace management. |

---

## 📂 Repository Structure

```text
aqoon-ai/
├── apps/
│   ├── web/              # Next.js 15 Web Application (The core frontend)
│   └── native/           # Expo React Native App
├── packages/
│   ├── backend/          # Convex schema, queries, mutations, auth config, AI actions
│   ├── config/           # Shared workspace configurations (TypeScript, Tailwind, Biome)
│   └── env/              # Type-safe environment variable validation using T3 Env & Zod
├── docs/                 # Detailed implementation guides and requirements
└── README.md             # This document
```

---

## 🚀 Getting Started

Follow these steps to set up the Aqoon AI development environment on your local machine.

### Prerequisites

Ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v20 or higher)
*   [pnpm](https://pnpm.io/) (v10 or higher) - *Our package manager of choice.*
*   A [Convex](https://convex.dev/) account for backend provisioning.

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-org/aqoon-ai.git
cd aqoon-ai
pnpm install
```

### 2. Configure the Convex Backend

Initialize and deploy the Convex backend development environment:

```bash
cd packages/backend
npx convex dev
```

*Follow the CLI prompts to log in and configure your project. Leave this terminal running.*

### 3. Environment Variables

Copy the `.env.example` files (if present) or create `.env.local` files in the required directories.

**In `apps/web/.env.local`:**
```env
NEXT_PUBLIC_CONVEX_URL=<your-convex-url>
NEXT_PUBLIC_CONVEX_SITE_URL=http://localhost:3001
BETTER_AUTH_SECRET=<generate-a-secure-random-string>
```

**In the Convex Dashboard (Settings → Environment Variables):**
```env
BETTER_AUTH_SECRET=<same-string-as-above>
SITE_URL=http://localhost:3001
OPENROUTER_API_KEY=<your-openrouter-key>
OPENROUTER_MODEL=google/gemini-3-flash-preview
# Optional: Provider Secrets for Social Login
GOOGLE_CLIENT_ID=<your-google-oauth-client-id>
GOOGLE_CLIENT_SECRET=<your-google-oauth-secret>
```

### 4. Seed the Database (Optional but Recommended)

Populate your local Convex database with sample users, courses, and lessons for testing:

```bash
# In an adjacent terminal
cd packages/backend
npx convex run seed:run
```

### 5. Launch the Web Application

Start the turborepo development server from the root directory:

```bash
# From the project root
pnpm run dev
```

*   **Web App:** `http://localhost:3001`
*   **Convex Dashboard:** [dashboard.convex.dev](https://dashboard.convex.dev)

---

## 📜 Development Guidelines

Aqoon AI adheres to strict code quality standards to maintain a highly scalable and robust codebase:

1.  **TypeScript Strict Mode:** All code must be strictly typed. Avoid `any`.
2.  **Server Components First:** Maximize the use of React Server Components in Next.js. Only use `'use client'` when interactivity, hooks (`useState`, `useEffect`), or Convex real-time subscriptions (`useQuery`) are explicitly required.
3.  **Tailwind CSS v4:** Utilize the modern features of Tailwind v4. Avoid custom CSS files unless absolute necessary; rely on utility classes and CSS variables defined in the central theme.
4.  **Formatting & Linting:** We use [Biome](https://biomejs.dev/) as our primary toolchain. Run `pnpm run check` to verify styles before committing.

## 📄 License

Proprietary Software. Internal use only by Aqoon AI contributors. All rights reserved.
