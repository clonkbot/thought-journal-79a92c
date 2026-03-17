import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  thoughts: defineTable({
    content: v.string(),
    userId: v.id("users"),
    createdAt: v.number(),
    mood: v.optional(v.string()),
  }).index("by_user", ["userId"]).index("by_user_and_time", ["userId", "createdAt"]),
});
