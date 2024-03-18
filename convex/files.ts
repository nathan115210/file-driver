import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { GenericMutationCtx, GenericQueryCtx } from "convex/server";
import { DataModel } from "./_generated/dataModel";

export const createFile = mutation({
  args: { name: v.string() },
  async handler(ctx, args) {
    await identity(ctx, () => {
      throw new ConvexError("You must be logged in to upload tha file");
    });

    await ctx.db.insert("files", {
      name: args.name,
    });
  },
});

export const getAllFiles = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    console.log("identity", identity);
    if (!identity) {
      return [];
    } else {
      return await ctx.db.query("files").collect();
    }
  },
});

const identity = async (
  ctx: GenericMutationCtx<DataModel> | GenericQueryCtx<DataModel>,
  callbackFn: () => void,
) => {
  const authIdentity = await ctx.auth.getUserIdentity();
  if (!authIdentity) {
    callbackFn();
  }
};
