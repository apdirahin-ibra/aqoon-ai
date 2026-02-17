import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { optionalAuth, requireAuth, requireAdmin } from "./helpers";

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

        await ctx.db.patch(user._id, updates);
        return user._id;
    },
});

// ─── Update user role (admin only) ────────────────────────────────────────────
export const updateRole = mutation({
    args: {
        userId: v.id("users"),
        role: v.union(
            v.literal("admin"),
            v.literal("tutor"),
            v.literal("student"),
        ),
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
