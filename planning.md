# Migration Plan & Technical Specification: Lovable to Aqoon AI

**Date:** 2026-02-07
**Project:** Aqoon AI (`aqoon-ai`)
**Architecture:** Next.js 15 (App Router) + Convex (Backend/Database) + Better-Auth.

## 1. Convex Database Schema (`convex/schema.ts`)

We will migrate the PostgreSQL schema to Convex's document-based schema.

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users (Managed by Better-Auth, but we extend/augment if needed)
  // Better-Auth will create its own 'users', 'sessions', 'accounts', 'verifications' tables.
  // We might store app-specific profile data here or link to it.

  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    role: v.union(v.literal("admin"), v.literal("tutor"), v.literal("student")),
    // ... any other fields Better-Auth syncs
  }).index("by_email", ["email"]),

  // Courses
  courses: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()), // Uploaded via Convex Storage
    category: v.string(), // e.g., 'coding', 'business'
    level: v.string(), // 'beginner', 'intermediate', 'advanced'
    isPremium: v.boolean(),
    priceCents: v.optional(v.number()), // 0 if free, otherwise price
    tutorId: v.id("users"), // Link to Tutor
    isPublished: v.boolean(),
    // Metadata
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_tutor", ["tutorId"])
    .index("by_category", ["category"])
    .index("by_published", ["isPublished"]),

  // Lessons
  lessons: defineTable({
    courseId: v.id("courses"),
    title: v.string(),
    content: v.string(), // Rich text / Markdown
    orderIndex: v.number(),
    durationMinutes: v.optional(v.number()),
    isPreview: v.boolean(), // Accessible without enrollment?
  })
    .index("by_course", ["courseId"])
    .index("by_course_order", ["courseId", "orderIndex"]),

  // Enrollments
  enrollments: defineTable({
    userId: v.id("users"),
    courseId: v.id("courses"),
    enrolledAt: v.number(),
    completedAt: v.optional(v.number()),
    status: v.string(), // 'active', 'completed', 'dropped'
  })
    .index("by_user", ["userId"])
    .index("by_course", ["courseId"])
    .index("by_user_course", ["userId", "courseId"]), // Unique constraint equivalent

  // Lesson Progress
  lessonProgress: defineTable({
    userId: v.id("users"),
    lessonId: v.id("lessons"),
    completed: v.boolean(),
    completedAt: v.optional(v.number()),
  }).index("by_user_lesson", ["userId", "lessonId"]),

  // Quizzes
  quizzes: defineTable({
    lessonId: v.id("lessons"),
    title: v.string(),
    questions: v.array(
      v.object({
        question: v.string(),
        options: v.array(v.string()),
        correctOptionIndex: v.number(),
        explanation: v.optional(v.string()),
      }),
    ),
  }).index("by_lesson", ["lessonId"]),

  // Quiz Attempts
  quizAttempts: defineTable({
    quizId: v.id("quizzes"),
    userId: v.id("users"),
    answers: v.array(v.number()), // Indices of selected options
    score: v.number(),
    feedback: v.optional(v.string()), // AI Generated feedback
    completedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_quiz", ["quizId"]),

  // Payments (Stripe)
  payments: defineTable({
    userId: v.id("users"),
    courseId: v.id("courses"),
    amountCents: v.number(),
    stripePaymentId: v.string(),
    status: v.string(), // 'succeeded', 'pending', 'failed'
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  // Reviews
  reviews: defineTable({
    userId: v.id("users"),
    courseId: v.id("courses"),
    rating: v.number(), // 1-5
    comment: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_course", ["courseId"])
    .index("by_user_course", ["userId", "courseId"]), // One review per course

  // Wishlist
  wishlist: defineTable({
    userId: v.id("users"),
    courseId: v.id("courses"),
    addedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_course", ["userId", "courseId"]),

  // Tutor Payouts
  payouts: defineTable({
    tutorId: v.id("users"),
    amountCents: v.number(),
    stripeTransferId: v.string(),
    status: v.string(), // 'pending', 'paid', 'failed'
    processedAt: v.number(),
  }).index("by_tutor", ["tutorId"]),

  // Certificates
  certificates: defineTable({
    userId: v.id("users"),
    courseId: v.id("courses"),
    issuedAt: v.number(),
    certificateUrl: v.string(), // URL to generated PDF in Storage
    code: v.string(), // Unique verification code
  })
    .index("by_user", ["userId"])
    .index("by_course", ["courseId"])
    .index("by_code", ["code"]), // For public verification
```

---

## 2. Backend API Functions (`convex/*.ts`)

We will replace Supabase direct DB calls with secure Convex Queries and Mutations.

### Authentication & Users (`convex/users.ts`)

- `query("current")`: Returns the currently logged-in user's profile and role.
- `mutation("sync")`: Syncs Better-Auth user data to our Convex `users` table (called via Webhook).

### Courses (`convex/courses.ts`)

- `query("listPublic")`: Returns all `isPublished: true` courses. Supports filtering by category/level.
- `query("get")`: Returns full course details. **Auth Check:** If not published, user must be the Tutor/Admin.
- `mutation("create")`: Creates a new course. **Auth Check:** User must be `tutor` or `admin`.
- `mutation("update")`: Updates course metadata. **Auth Check:** User must be owner (Tutor) or `admin`.
- `mutation("delete")`: Deletes a course. **Auth Check:** User must be `admin`.

### Lessons (`convex/lessons.ts`)

- `query("list")`: Returns lesson list (titles, durations) for a course.
- `query("get")`: Returns lesson content. **Auth Check:**
  - If `isPreview`, allow.
  - If User enrolled, allow.
  - If User is Tutor/Admin, allow.
  - Else -> Throw Error ("Enrollment Required").
- `mutation("create")`, `mutation("update")`, `mutation("delete")`: **Auth Check:** Tutor(Owner) or Admin.

### Reviews & Wishlist (`convex/reviews.ts`, `convex/wishlist.ts`)

- `mutation("addReview")`:
  - Args: `{ courseId, rating, comment }`
  - Logic: Verify enrollment. Check if already reviewed. Insert.
- `query("listByCourse")`: Returns reviews for a course.
- `mutation("toggleWishlist")`: Adds/Removes course from user's wishlist.
- `query("getWishlist")`: Returns user's wishlisted courses.

### Tutor Payouts (`convex/payouts.ts`)

- `query("getMyPayouts")`: Returns payout history.
- `action("requestPayout")`:
  - Logic: Check balance. Trigger Stripe Connect transfer. Record payout.

### admin (`convex/admin.ts`)

- `mutation("approveCourse")`:
  - Args: `{ courseId }`
  - Logic: Sets `isPublished` to true. Notifications to Tutor.
- `mutation("rejectCourse")`:
  - Args: `{ courseId, reason }`
  - Logic: Sets `isPublished` to false. Sends feedback.

### Enrollments (`convex/enrollments.ts`)

- `query("mine")`: specific to current user.
- `query("check")`: Returns `true` if current user is enrolled in specific course.
- `mutation("enroll")`: **Critical Security Function**
  - Args: `{ courseId: v.id("courses") }`
  - Logic:
    1.  Fetch Course.
    2.  If `course.isPremium`: Verify payment record exists OR verify Stripe webhook confirmation. (FIXES VULNERABILITY).
    3.  If `!course.isPremium`: Allow immediately.
    4.  Insert into `enrollments`.

### Progress (`convex/progress.ts`)

- `mutation("markComplete")`: Marks a lesson as complete.
- `query("getCourseProgress")`: Returns % complete for a course.

### AI Capabilities (`convex/ai.ts` & `convex/actions/ai.ts`)

- `action("generateQuizFeedback")`:
  - Args: `{ quizId, answers }`
  - Logic: Calls OpenAI/Gemini (via `langchain` or `openai` SDK). Analzyes wrong answers. Returns text feedback.
- `action("generateStudyPlan")`:
  - Args: `{ goal, hoursPerWeek, level }`
  - Logic: Generates a JSON study plan.
- `action("chatWithTutor")`:
  - Args: `{ lessonContent, userQuestion }`
  - Logic: RAG style interaction with lesson content.

### Certificates (`convex/certificates.ts`)

- `mutation("generate")`:
  - Args: `{ courseId }`
  - Logic: Validate 100% progress. Generate PDF (using `react-pdf` or edge service). Store in Storage. Create record. Return URL.
- `query("get")`: Returns certificate by ID or Code.
- `query("listMine")`: Returns all certificates for current user.

### Dashboards (`convex/dashboard.ts`)

- `query("studentStats")`:
  - Returns: `{ enrolledCount, completedCount, totalStudyTime, recentActivity[] }`
- `query("tutorStats")`:
  - Returns: `{ totalStudents, totalRevenue, topCourses[], recentEnrollments[] }`
- `query("adminStats")`:
  - Returns: `{ totalUsers, totalRevenue, systemHealth }`

### Payments (`convex/payments.ts`)

- `action("createCheckoutSession")`:
  - Args: `{ courseId }`
  - Logic: Calls Stripe API to create Session. Returns `checkoutUrl`.
- `internalMutation("fulfill")`:
  - Used by Stripe Webhook to mark payment as `succeeded` and trigger `enrollments.enroll`.

---

## 3. Better-Auth Configuration (`packages/backend/auth.ts`)

```typescript
import { betterAuth } from "better-auth";
import { convexAdapter } from "@better-auth/convex-adapter";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: convexAdapter(convex),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  plugins: [
    // We will define a custom role plugin or use built-in if available
    {
      id: "rbac",
      schema: {
        user: {
          role: { type: "string", required: true, defaultValue: "student" },
        },
      },
    },
  ],
});
```

---

## 4. UI / Frontend Structure (`apps/web`)

### Main Pages (App Router)

- `app/(public)/page.tsx` -> Landing Page
- `app/(public)/courses/page.tsx` -> Course Catalog (Server Component, fetches `api.courses.listPublic`)
- `app/(public)/courses/[id]/page.tsx` -> Course Detail (Server Component)
- `app/(app)/dashboard/page.tsx` -> Student Dashboard (Client Component with `useQuery`)
- `app/(app)/learn/[courseId]/[lessonId]/page.tsx` -> Lesson Player
- `app/(admin)/admin/users/page.tsx` -> Admin User Management (Table)

### Components (Shared)

- `components/course-card.tsx`
- `components/lesson-player.tsx` (Video + Text)
- `components/quiz-view.tsx`
- `components/ai-chat.tsx` (Floating chat bubble)

---

## 5. Migration Execution Steps

1.  **Init:** `pnpm dlx create-convex` inside `packages/backend`.
2.  **Schema:** Copy the `schema.ts` above to `packages/backend/convex/schema.ts`.
3.  **Auth:** Setup `better-auth` files and environment variables.
4.  **Backend Functions:** Implement `courses.ts` and `enrollments.ts` first.
5.  **Frontend:** Copy `v1/src/pages/Courses.tsx` -> `apps/web/app/courses/page.tsx` and refactor to use Convex hooks.
6.  **Verify:** Test **Enrollment Logic** manually to ensure Premium courses cannot be accessed for free.
