import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
  optionalAuth,
  requireAdmin,
  requireAuth,
  requireTutor,
} from "./helpers";

// ─── Get current user profile ─────────────────────────────────────────────────
export const current = query({
  args: {},
  handler: async (ctx) => {
    const result = await optionalAuth(ctx);
    if (!result) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", result.email))
      .unique();

    return user;
  },
});

// ─── Get user by ID (public profile) ──────────────────────────────────────────
export const getById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;

    // Return only public fields
    return {
      _id: user._id,
      name: user.name,
      image: user.image,
      role: user.role,
      bio: user.bio,
      specialties: user.specialties,
    };
  },
});

// ─── Update own profile ───────────────────────────────────────────────────────
export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    bio: v.optional(v.string()),
    specialties: v.optional(v.array(v.string())),
    theme: v.optional(v.string()),
    language: v.optional(v.string()),
    timezone: v.optional(v.string()),
    notificationPrefs: v.optional(
      v.object({
        emailNotifications: v.boolean(),
        courseUpdates: v.boolean(),
        marketingEmails: v.boolean(),
      }),
    ),
    learningPrefs: v.optional(
      v.object({
        weeklyGoalHours: v.number(),
        preferredPace: v.string(),
        studyReminders: v.boolean(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const { user } = await requireAuth(ctx);
    if (!user) {
      throw new Error("User profile not found");
    }

    const updates: Record<string, unknown> = { updatedAt: Date.now() };
    if (args.name !== undefined) updates.name = args.name;
    if (args.image !== undefined) updates.image = args.image;
    if (args.bio !== undefined) updates.bio = args.bio;
    if (args.specialties !== undefined) updates.specialties = args.specialties;
    if (args.theme !== undefined) updates.theme = args.theme;
    if (args.language !== undefined) updates.language = args.language;
    if (args.timezone !== undefined) updates.timezone = args.timezone;
    if (args.notificationPrefs !== undefined)
      updates.notificationPrefs = args.notificationPrefs;
    if (args.learningPrefs !== undefined)
      updates.learningPrefs = args.learningPrefs;

    await ctx.db.patch(user._id, updates);
    return user._id;
  },
});

// ─── Update payout info (tutor only) ──────────────────────────────────────────
export const updatePayoutInfo = mutation({
  args: {
    bankName: v.string(),
    accountLast4: v.string(),
    payoutMethod: v.string(),
  },
  handler: async (ctx, args) => {
    const { user } = await requireTutor(ctx);
    if (!user) {
      throw new Error("User profile not found");
    }

    await ctx.db.patch(user._id, {
      payoutInfo: {
        bankName: args.bankName,
        accountLast4: args.accountLast4,
        payoutMethod: args.payoutMethod,
      },
      updatedAt: Date.now(),
    });
    return user._id;
  },
});

// ─── Delete own account (cascade) ─────────────────────────────────────────────
export const deleteAccount = mutation({
  args: {},
  handler: async (ctx) => {
    const { user } = await requireAuth(ctx);
    if (!user) {
      throw new Error("User profile not found");
    }

    // Cascade delete all user-related data — explicit per table for type safety
    const deleteByUser = async (tableName: string, records: { _id: any }[]) => {
      for (const record of records) {
        await ctx.db.delete(record._id);
      }
    };

    await deleteByUser(
      "enrollments",
      await ctx.db
        .query("enrollments")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .collect(),
    );
    await deleteByUser(
      "lessonProgress",
      await ctx.db
        .query("lessonProgress")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .collect(),
    );
    await deleteByUser(
      "quizAttempts",
      await ctx.db
        .query("quizAttempts")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .collect(),
    );
    await deleteByUser(
      "wishlist",
      await ctx.db
        .query("wishlist")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .collect(),
    );
    await deleteByUser(
      "forumPosts",
      await ctx.db
        .query("forumPosts")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .collect(),
    );
    await deleteByUser(
      "notifications",
      await ctx.db
        .query("notifications")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .collect(),
    );
    await deleteByUser(
      "certificates",
      await ctx.db
        .query("certificates")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .collect(),
    );

    // Reviews don't have a by_user index, filter manually
    const allReviews = await ctx.db.query("reviews").collect();
    for (const review of allReviews) {
      if (review.userId === user._id) {
        await ctx.db.delete(review._id);
      }
    }

    // Delete sent and received messages
    const sentMessages = await ctx.db
      .query("messages")
      .withIndex("by_sender", (q) => q.eq("senderId", user._id))
      .collect();
    for (const msg of sentMessages) {
      await ctx.db.delete(msg._id);
    }
    const receivedMessages = await ctx.db
      .query("messages")
      .withIndex("by_receiver", (q) => q.eq("receiverId", user._id))
      .collect();
    for (const msg of receivedMessages) {
      await ctx.db.delete(msg._id);
    }

    // Delete forum replies by user
    const allPosts = await ctx.db.query("forumPosts").collect();
    for (const post of allPosts) {
      const replies = await ctx.db
        .query("forumReplies")
        .withIndex("by_post", (q) => q.eq("postId", post._id))
        .collect();
      for (const reply of replies) {
        if (reply.userId === user._id) {
          await ctx.db.delete(reply._id);
        }
      }
    }

    // If tutor, delete payout records and courses (cascade)
    if (user.role === "tutor") {
      const payouts = await ctx.db
        .query("payouts")
        .withIndex("by_tutor", (q) => q.eq("tutorId", user._id))
        .collect();
      for (const p of payouts) {
        await ctx.db.delete(p._id);
      }

      const courses = await ctx.db
        .query("courses")
        .withIndex("by_tutor", (q) => q.eq("tutorId", user._id))
        .collect();
      for (const course of courses) {
        // Delete lessons, resources, enrollments, etc. for each course
        const lessons = await ctx.db
          .query("lessons")
          .withIndex("by_course", (q) => q.eq("courseId", course._id))
          .collect();
        for (const lesson of lessons) {
          await ctx.db.delete(lesson._id);
        }
        const resources = await ctx.db
          .query("resources")
          .withIndex("by_course", (q) => q.eq("courseId", course._id))
          .collect();
        for (const r of resources) {
          await ctx.db.delete(r._id);
        }
        await ctx.db.delete(course._id);
      }
    }

    // Finally, delete the user record
    await ctx.db.delete(user._id);
  },
});

// ─── Update user role (admin only) ────────────────────────────────────────────
export const updateRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("admin"), v.literal("tutor"), v.literal("student")),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const targetUser = await ctx.db.get(args.userId);
    if (!targetUser) {
      throw new Error("User not found");
    }

    await ctx.db.patch(args.userId, {
      role: args.role,
      updatedAt: Date.now(),
    });
    return args.userId;
  },
});

// ─── Sync user from Better-Auth (creates or updates app-level profile) ────────
export const syncFromAuth = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        image: args.image,
        updatedAt: Date.now(),
      });
      return existing._id;
    }

    const now = Date.now();
    return await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      image: args.image,
      role: "student", // Default role for new users
      createdAt: now,
      updatedAt: now,
    });
  },
});

// ─── List all users (admin only) ──────────────────────────────────────────────
export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db.query("users").collect();
  },
});
