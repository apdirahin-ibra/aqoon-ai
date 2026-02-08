# Aqoon AI

**AI-Assisted Skill Learning Hub**

Aqoon AI is a modern, scalable learning management system (LMS) built to provide personalized education through AI-driven tutoring, interactive courses, and real-time progress tracking.

This repository is a monorepo containing the web application, mobile application, and shared backend infrastructure.

## 🚀 Tech Stack

- **Frontend (Web):** Next.js 15 (App Router), React 19, Tailwind CSS 4, shadcn/ui.
- **Frontend (Mobile):** React Native (Expo).
- **Backend:** Convex (Realtime Database, Functions, Cron Jobs).
- **Authentication:** Better-Auth (with Convex Adapter).
- **AI Integration:** OpenAI / Gemini (via Convex Actions).
- **Tooling:** Turborepo, Biome, TypeScript.

## 🌟 Key Features

- **Interactive Course Player:** Rich text and video lessons with progress tracking.
- **AI Tutor:** Real-time chat for homework help, study planning, and quiz feedback.
- **Role-Based Access:** Distinct portals for Students, Tutors, and Admins.
- **Quizzes & Assessments:** Automated grading with AI-generated explanations.
- **Visual Roadmaps:** Structured learning paths for different skills.

## 📂 Project Structure

```bash
aqoon-ai/
├── apps/
│   ├── web/         # Next.js 15 Web Application
│   └── native/      # Expo React Native App
├── packages/
│   ├── backend/     # Convex Schema, API Functions, Auth Config
│   ├── config/      # Shared configurations (Tailwind, TypeScript, Biome)
│   └── env/         # Environment variable validation
```

## 🛠️ Getting Started

1.  **Install Dependencies:**

    ```bash
    pnpm install
    ```

2.  **Setup Backend (Convex):**

    ```bash
    pnpm run dev:setup
    ```

    _Follow the prompts to link to your Convex project._

3.  **Start Development Server:**
    ```bash
    pnpm run dev
    ```

    - Web: [http://localhost:3001](http://localhost:3001)
    - Convex Dashboard: `npx convex dashboard`

## 🔐 Environment Variables

Copy `.env.example` to `.env` in `packages/backend` and `apps/web`.
Required keys:

- `CONVEX_DEPLOYMENT`
- `NEXT_PUBLIC_CONVEX_URL`
- `BETTER_AUTH_SECRET`
- `OPENAI_API_KEY` (or GEMINI_API_KEY)

## 📜 License

Private Property of Aqoon AI.
