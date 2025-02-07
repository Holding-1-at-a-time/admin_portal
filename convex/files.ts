import { v } from "convex/values"
import { mutation } from "./_generated/server"
import { ConvexError } from "convex/values"

export const generateUploadUrl = mutation({
  args: {
    contentType: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new ConvexError("You must be logged in to upload files")
    }

    return await ctx.storage.generateUploadUrl(args.contentType)
  },
})

export const saveLogoUrl = mutation({
  args: {
    storageId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new ConvexError("You must be logged in to save logo URL")
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique()

    if (!user) {
      throw new ConvexError("User not found")
    }

    const settings = await ctx.db
      .query("settings")
      .filter((q) => q.eq(q.field("userId"), user._id))
      .unique()

    const url = await ctx.storage.getUrl(args.storageId)

    if (settings) {
      await ctx.db.patch(settings._id, { logoUrl: url })
    } else {
      await ctx.db.insert("settings", {
        userId: user._id,
        logoUrl: url,
      })
    }

    return url
  },
})

