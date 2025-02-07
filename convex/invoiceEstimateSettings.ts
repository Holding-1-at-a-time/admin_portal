import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { ConvexError } from "convex/values"

export const getInvoiceEstimateSettings = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new ConvexError("Not authenticated")
    }

    const settings = await ctx.db
      .query("settings")
      .filter((q) => q.eq(q.field("tenantId"), identity.tenantId))
      .unique()

    return {
      invoicePrefix: settings?.invoicePrefix || "",
      nextInvoiceNumber: settings?.nextInvoiceNumber || 1,
      autoIncrementInvoice: settings?.autoIncrementInvoice || false,
    }
  },
})

export const updateInvoiceEstimateSettings = mutation({
  args: {
    invoicePrefix: v.string(),
    nextInvoiceNumber: v.number(),
    autoIncrementInvoice: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new ConvexError("Not authenticated")
    }

    const existingSettings = await ctx.db
      .query("settings")
      .filter((q) => q.eq(q.field("tenantId"), identity.tenantId))
      .unique()

    if (existingSettings) {
      await ctx.db.patch(existingSettings._id, args)
    } else {
      await ctx.db.insert("settings", { ...args, tenantId: identity.tenantId })
    }
  },
})

