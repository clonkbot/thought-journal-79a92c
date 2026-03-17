import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("thoughts")
      .withIndex("by_user_and_time", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: { content: v.string(), mood: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return await ctx.db.insert("thoughts", {
      content: args.content,
      userId,
      createdAt: Date.now(),
      mood: args.mood,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("thoughts") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const thought = await ctx.db.get(args.id);
    if (!thought || thought.userId !== userId) throw new Error("Not found");
    await ctx.db.delete(args.id);
  },
});

export const update = mutation({
  args: { id: v.id("thoughts"), content: v.string(), mood: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const thought = await ctx.db.get(args.id);
    if (!thought || thought.userId !== userId) throw new Error("Not found");
    await ctx.db.patch(args.id, { content: args.content, mood: args.mood });
  },
});
