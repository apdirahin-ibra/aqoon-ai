import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	// ─── Users ────────────────────────────────────────────────────────────────
	// App-level user profile. Created/synced when a user signs up via Better-Auth.
	users: defineTable({
		name: v.string(),
		email: v.string(),
		image: v.optional(v.string()),
		role: v.union(v.literal("admin"), v.literal("tutor"), v.literal("student")),
		bio: v.optional(v.string()),
		specialties: v.optional(v.array(v.string())),
		createdAt: v.number(),
		updatedAt: v.number(),
	}).index("by_email", ["email"]),

	// ─── Courses ──────────────────────────────────────────────────────────────
	courses: defineTable({
		title: v.string(),
		description: v.optional(v.string()),
		thumbnailUrl: v.optional(v.string()),
		category: v.string(),
		level: v.string(), // 'beginner' | 'intermediate' | 'advanced'
		isPremium: v.boolean(),
		priceCents: v.optional(v.number()),
		tutorId: v.id("users"),
		isPublished: v.boolean(),
		createdAt: v.number(),
		updatedAt: v.number(),
	})
		.index("by_tutor", ["tutorId"])
		.index("by_category", ["category"])
		.index("by_published", ["isPublished"]),

	// ─── Lessons ──────────────────────────────────────────────────────────────
	lessons: defineTable({
		courseId: v.id("courses"),
		title: v.string(),
		content: v.string(),
		orderIndex: v.number(),
		durationMinutes: v.optional(v.number()),
		isPreview: v.boolean(),
	})
		.index("by_course", ["courseId"])
		.index("by_course_order", ["courseId", "orderIndex"]),

	// ─── Enrollments ──────────────────────────────────────────────────────────
	enrollments: defineTable({
		userId: v.id("users"),
		courseId: v.id("courses"),
		enrolledAt: v.number(),
		completedAt: v.optional(v.number()),
		status: v.string(), // 'active' | 'completed' | 'dropped'
	})
		.index("by_user", ["userId"])
		.index("by_course", ["courseId"])
		.index("by_user_course", ["userId", "courseId"]),

	// ─── Lesson Progress ──────────────────────────────────────────────────────
	lessonProgress: defineTable({
		userId: v.id("users"),
		lessonId: v.id("lessons"),
		completed: v.boolean(),
		completedAt: v.optional(v.number()),
	})
		.index("by_user_lesson", ["userId", "lessonId"])
		.index("by_user", ["userId"]),

	// ─── Quizzes ──────────────────────────────────────────────────────────────
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

	// ─── Quiz Attempts ────────────────────────────────────────────────────────
	quizAttempts: defineTable({
		quizId: v.id("quizzes"),
		userId: v.id("users"),
		answers: v.array(v.number()),
		score: v.number(),
		feedback: v.optional(v.string()),
		completedAt: v.number(),
	})
		.index("by_user", ["userId"])
		.index("by_quiz", ["quizId"]),

	// ─── Payments ─────────────────────────────────────────────────────────────
	payments: defineTable({
		userId: v.id("users"),
		courseId: v.id("courses"),
		amountCents: v.number(),
		stripePaymentId: v.string(),
		status: v.string(), // 'succeeded' | 'pending' | 'failed'
		createdAt: v.number(),
	}).index("by_user", ["userId"]).index("by_course", ["courseId"]),

	// ─── Reviews ──────────────────────────────────────────────────────────────
	reviews: defineTable({
		userId: v.id("users"),
		courseId: v.id("courses"),
		rating: v.number(), // 1-5
		comment: v.optional(v.string()),
		createdAt: v.number(),
	})
		.index("by_course", ["courseId"])
		.index("by_user_course", ["userId", "courseId"]),

	// ─── Wishlist ─────────────────────────────────────────────────────────────
	wishlist: defineTable({
		userId: v.id("users"),
		courseId: v.id("courses"),
		addedAt: v.number(),
	})
		.index("by_user", ["userId"])
		.index("by_user_course", ["userId", "courseId"]),

	// ─── Tutor Payouts ────────────────────────────────────────────────────────
	payouts: defineTable({
		tutorId: v.id("users"),
		amountCents: v.number(),
		stripeTransferId: v.string(),
		status: v.string(), // 'pending' | 'paid' | 'failed'
		processedAt: v.number(),
	}).index("by_tutor", ["tutorId"]),

	// ─── Certificates ─────────────────────────────────────────────────────────
	certificates: defineTable({
		userId: v.id("users"),
		courseId: v.id("courses"),
		issuedAt: v.number(),
		certificateUrl: v.string(),
		code: v.string(), // Unique verification code
	})
		.index("by_user", ["userId"])
		.index("by_course", ["courseId"])
		.index("by_code", ["code"]),

	// ─── Forum Posts ──────────────────────────────────────────────────────────
	forumPosts: defineTable({
		courseId: v.id("courses"),
		userId: v.id("users"),
		title: v.string(),
		content: v.string(),
		createdAt: v.number(),
	})
		.index("by_course", ["courseId"])
		.index("by_user", ["userId"]),

	// ─── Forum Replies ────────────────────────────────────────────────────────
	forumReplies: defineTable({
		postId: v.id("forumPosts"),
		userId: v.id("users"),
		content: v.string(),
		createdAt: v.number(),
	}).index("by_post", ["postId"]),

	// ─── Notifications ────────────────────────────────────────────────────────
	notifications: defineTable({
		userId: v.id("users"),
		type: v.string(), // 'enrollment' | 'quiz_result' | 'certificate' | 'forum_reply'
		title: v.string(),
		message: v.string(),
		isRead: v.boolean(),
		link: v.optional(v.string()),
		createdAt: v.number(),
	}).index("by_user", ["userId"]),

	// ─── Direct Messages ──────────────────────────────────────────────────────
	messages: defineTable({
		senderId: v.id("users"),
		receiverId: v.id("users"),
		content: v.string(),
		isRead: v.boolean(),
		createdAt: v.number(),
	})
		.index("by_sender", ["senderId"])
		.index("by_receiver", ["receiverId"]),

	// ─── Course Resources ─────────────────────────────────────────────────────
	resources: defineTable({
		courseId: v.id("courses"),
		title: v.string(),
		description: v.optional(v.string()),
		fileUrl: v.string(),
		fileType: v.string(), // 'document' | 'code' | 'image' | 'video'
		fileSizeBytes: v.optional(v.number()),
		createdAt: v.number(),
	}).index("by_course", ["courseId"]),

	// ─── Audit Logs ───────────────────────────────────────────────────────────
	auditLogs: defineTable({
		userId: v.optional(v.id("users")),
		userName: v.string(),
		action: v.string(),
		details: v.string(),
		category: v.string(), // 'auth' | 'course' | 'user' | 'payment' | 'system'
		createdAt: v.number(),
	}).index("by_category", ["category"]),
});
