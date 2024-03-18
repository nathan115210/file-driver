import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

export const createFile = mutation({
  args: { name: v.string(), orgId: v.string() },
  async handler(ctx, args) {
    const authIdentity = await ctx.auth.getUserIdentity();
    if (!authIdentity) {
      throw new ConvexError("You must be logged in to upload tha file");
    }

    await ctx.db.insert("files", {
      name: args.name,
      orgId: args.orgId,
    });
  },
});

export const getAllFiles = query({
  args: { orgId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    // return empty array if not identified
    if (!identity) {
      return [];
    } else {
      return ctx.db
        .query("files")
        .withIndex("by_orgId", (query) => query.eq("orgId", args.orgId))
        .collect();
    }
  },
});
