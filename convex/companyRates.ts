import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { ConvexError } from "convex/values"

export const getCompanyRates = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new ConvexError("Not authenticated")
    }

    const companyRates = await ctx.db
      .query("companyRates")
      .filter((q) => q.eq(q.field("tenantId"), identity.tenantId))
      .unique()

    return companyRates || {}
  },
})

export const updateCompanyRates = mutation({
  args: {
    laborRateRI: v.number(),
    laborRatePaint: v.number(),
    laborRateBody: v.number(),
    paintMaterialRate: v.number(),
    laborRateDetail: v.number(),
    taxRate: v.number(),
    pdrRates: v.object({
      fullFront: v.number(),
      trackPackage: v.number(),
      fullCoverage: v.number(),
      hailMarkupOS: v.boolean(),
      rirrDefaultPricing: v.string(),
      paintBodyDefaultPricing: v.string(),
      flatFee: v.number(),
      interiorDefaultPricing: v.string(),
      interiorFlatFee: v.number(),
    }),
    wheelRates: v.object({
      cosmetic: v.number(),
      remanufactured: v.number(),
      straighten: v.number(),
      backsideRepair: v.number(),
      crackRepair: v.number(),
      powderCoat: v.number(),
      powderCoatTPMSSleeve: v.number(),
      customPaint: v.number(),
      hyperFinish: v.number(),
      machineFinish: v.number(),
      polish: v.number(),
      specialFinish: v.number(),
      twoPieceWheel: v.number(),
      threePieceWheel: v.number(),
      paintCenterCaps: v.number(),
      paintHubcaps: v.number(),
      paintCallipers: v.number(),
      reChromed: v.number(),
      hubcapRepair: v.number(),
      mountAndBalance: v.number(),
      tpmsReset: v.number(),
      ceramicCoating: v.number(),
      tireDisposalFee: v.number(),
    }),
    glassRates: v.object({
      defaultPricingType: v.string(),
      firstRepair: v.number(),
      additionalRepairs: v.number(),
    }),
    tintRates: v.object({
      defaultPricingType: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new ConvexError("Not authenticated")
    }

    const existingRates = await ctx.db
      .query("companyRates")
      .filter((q) => q.eq(q.field("tenantId"), identity.tenantId))
      .unique()

    if (existingRates) {
      await ctx.db.patch(existingRates._id, args)
    } else {
      await ctx.db.insert("companyRates", { ...args, tenantId: identity.tenantId })
    }
  },
})

