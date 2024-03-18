import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getUser } from "./users";

export const createFile = mutation({
  args: { name: v.string(), orgId: v.string() },
  async handler(ctx, args) {
    const authIdentity = await ctx.auth.getUserIdentity();
    if (!authIdentity) {
      throw new ConvexError("You must be logged in to upload tha file");
    }
    const hasAccess = await hasAccessToOrg(
      ctx,
      authIdentity.tokenIdentifier,
      args.orgId,
    );
    if (!hasAccess) {
      throw new ConvexError("You do not have access to this organization ");
    } else {
      await ctx.db.insert("files", {
        name: args.name,
        orgId: args.orgId,
      });
    }
  },
});

export const getAllFiles = query({
  args: { orgId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    // return empty array if not identified
    if (!identity) {
      return [];
    }
    const hasAccess = await hasAccessToOrg(
      ctx,
      identity.tokenIdentifier,
      args.orgId,
    );
    // return empty array if no access
    if (!hasAccess) {
      return [];
    } else {
      return ctx.db
        .query("files")
        .withIndex("by_orgId", (query) => query.eq("orgId", args.orgId))
        .collect();
    }
  },
});

const hasAccessToOrg = async (
  ctx: QueryCtx | MutationCtx,
  tokenIdentifier: string,
  orgId: string,
): Promise<boolean> => {
  const user = await getUser(ctx, tokenIdentifier);
  const hasAccess =
    user.orgIds.includes(orgId) || user.tokenIdentifier.includes(orgId);

  return hasAccess;
};
