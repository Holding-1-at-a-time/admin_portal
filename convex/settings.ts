import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { ConvexError } from "convex/values"

export const getSettings = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new ConvexError("Not authenticated")
    }

    const settings = await ctx.db
      .query("settings")
      .filter((q) => q.eq(q.field("tenantId"), identity.tenantId))
      .unique()

    return settings || {}
  },
})

export const updateSettings = mutation({
  args: {
    // Define the structure of your settings object here
    companyName: v.optional(v.string()),
    website: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    fax: v.optional(v.string()),
    taxIdentificationNumber: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    mailingAddress: v.optional(
      v.object({
        country: v.string(),
        address: v.string(),
        city: v.string(),
        state: v.string(),
        zipCode: v.string(),
      }),
    ),
    shopAddress: v.optional(
      v.object({
        country: v.string(),
        address: v.string(),
        city: v.string(),
        state: v.string(),
        zipCode: v.string(),
      }),
    ),
    ccEmails: v.optional(v.array(v.string())),
    autoSaveRetailVehicles: v.optional(v.boolean()),
    autoSaveWholesaleVehicles: v.optional(v.boolean()),
    disableMultiCarEstimates: v.optional(v.boolean()),
    requireWorkOrdersFromEstimate: v.optional(v.boolean()),
    convertEstimatesToInvoices: v.optional(v.boolean()),
    activateTipsOnPayments: v.optional(v.boolean()),
    invoicePrefix: v.optional(v.string()),
    nextInvoiceNumber: v.optional(v.number()),
    stripeConnectedAccountId: v.optional(v.string()),
    stripePaymentsEnabled: v.optional(v.boolean()),
    quickbooksIntegration: v.optional(v.boolean()),
    quickbooksCompanyId: v.optional(v.string()),
    quickbooksToken: v.optional(v.string()),
    subscriptionPlan: v.optional(v.string()),
    billingCycle: v.optional(v.string()),
    nextBillingDate: v.optional(v.string()),
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

