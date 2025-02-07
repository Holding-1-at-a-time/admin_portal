import { ConvexError, v } from "convex/values"
import { query, mutation } from "./_generated/server"

export const getCompanyInfo = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Not authenticated")
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique()

    if (!user) {
      throw new Error("User not found")
    }

    const settings = await ctx.db
      .query("settings")
      .filter((q) => q.eq(q.field("userId"), user._id))
      .unique()

    return settings || {}
  },
})

export const updateCompanyInfo = mutation({
  args: {
    companyName: v.string(),
    website: v.string(),
    email: v.string(),
    phone: v.string(),
    fax: v.optional(v.string()),
    taxIdentificationNumber: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    mailingAddress: v.object({
      country: v.string(),
      address: v.string(),
      city: v.string(),
      state: v.string(),
      zipCode: v.string(),
    }),
    shopAddress: v.object({
      country: v.string(),
      address: v.string(),
      city: v.string(),
      state: v.string(),
      zipCode: v.string(),
    }),
    ccEmails: v.array(v.string()),
    autoSaveRetailVehicles: v.boolean(),
    autoSaveWholesaleVehicles: v.boolean(),
    disableMultiCarEstimates: v.boolean(),
    requireWorkOrdersFromEstimate: v.boolean(),
    convertEstimatesToInvoices: v.boolean(),
    activateTipsOnPayments: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Not authenticated")
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique()

    if (!user) {
      throw new Error("User not found")
    }

    const existingSettings = await ctx.db
      .query("settings")
      .filter((q) => q.eq(q.field("userId"), user._id))
      .unique()

    if (existingSettings) {
      await ctx.db.patch(existingSettings._id, args)
    } else {
      await ctx.db.insert("settings", {
        ...args, userId: user._id,
        tenantId: "",
        invoicePrefix: "",
        nextInvoiceNumber: 0,
        requiredFields: {
          customerName: false,
          customerPhone: false,
          customerEmail: false,
          vehicleYear: false,
          vehicleMake: false,
          vehicleModel: false,
          vehicleColor: false,
          vehicleMiles: false,
          vehicleVin: false,
          vehicleLicensePlate: false,
        },
        pdfOptions: {
          showVehicleImages: false,
          showVehicleDiagram: false,
        },
        signatureDisclosures: {
          invoiceDisclosure: "",
          estimateDisclosure: "",
        },
        textTemplate: {
          language: "",
          defaultMessage: "",
        }, stripePaymentsEnabled: false
      })
    }
  },
})

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