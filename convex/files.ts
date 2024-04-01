import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getUser } from "./users";
import { fileTypeUnion } from "./schema";
/*import { Id } from "@/convex/_generated/dataModel";*/

export const createFile = mutation({
  args: {
    name: v.string(),
    fileId: v.id("_storage"),
    orgId: v.string(),
    type: fileTypeUnion,
  },
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
        fileId: args.fileId,
        orgId: args.orgId,
        type: args.type,
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
      let files = await ctx.db
        .query("files")
        .withIndex("by_orgId", (query) => query.eq("orgId", args.orgId))
        .collect();

      return Promise.all(
        files.map(async (file) => ({
          ...file,
          fileUrl: await ctx.storage.getUrl(file.fileId),
        })),
      );
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

export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  // return empty array if not identified
  if (!identity) {
    throw new ConvexError("You must be logged in before upload file");
  }
  return await ctx.storage.generateUploadUrl();
});

export const deleteFile = mutation({
  args: { fileId: v.id("files") },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("You must be logged in to upload tha file");
    }

    const file = await ctx.db.get(args.fileId);
    if (!file) {
      throw new ConvexError("This file dose not exist");
    }

    const hasAccess = file.orgId
      ? await hasAccessToOrg(ctx, identity.tokenIdentifier, file.orgId)
      : false;

    if (!hasAccess) {
      throw new ConvexError("You do not have access to delete this file");
    }

    await ctx.db.delete(args.fileId);
  },
});
