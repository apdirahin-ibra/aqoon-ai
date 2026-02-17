import type { Doc } from "./_generated/dataModel";
import type { QueryCtx, MutationCtx } from "./_generated/server";
import { authComponent } from "./auth";

/**
 * Get the authenticated user or return null.
 */
export async function optionalAuth(ctx: QueryCtx | MutationCtx) {
    return await authComponent.safeGetAuthUser(ctx);
}

/**
 * Get the authenticated user or throw if not logged in.
 */
export async function requireAuth(ctx: QueryCtx | MutationCtx) {
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) {
        throw new Error("Authentication required");
    }

    // Look up the app-level user record by email
    const user = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", authUser.email))
        .unique();

    return { authUser, user };
}

/**
 * Require authentication AND a specific role (admin or tutor).
 */
export async function requireRole(
    ctx: QueryCtx | MutationCtx,
    role: "admin" | "tutor",
) {
    const { authUser, user } = await requireAuth(ctx);

    if (!user) {
        throw new Error("User profile not found. Please complete your profile.");
    }

    if (user.role !== role && user.role !== "admin") {
        throw new Error(`Access denied. Required role: ${role}`);
    }

    return { authUser, user };
}

/**
 * Require admin role specifically.
 */
export async function requireAdmin(ctx: QueryCtx | MutationCtx) {
    return requireRole(ctx, "admin");
}

/**
 * Require tutor role (admins also pass).
 */
export async function requireTutor(ctx: QueryCtx | MutationCtx) {
    return requireRole(ctx, "tutor");
}
