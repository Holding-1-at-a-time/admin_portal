import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { ConvexError } from "convex/values"

export const getDetailPackages = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new ConvexError("Not authenticated")
    }

<<<<<<< HEAD
        return await ctx.db
                    .query("detailPackages")
                    .filter((q) => q.eq(q.field("tenantId"), identity.tenantId))
                    .collect();

    },
=======
    const packages = await ctx.db
      .query("detailPackages")
      .filter((q) => q.eq(q.field("tenantId"), identity.tenantId))
      .collect()

    return packages
  },
>>>>>>> bfb0ff6 (feat: Update transaction details modal and API routes)
})

export const getDetailServices = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new ConvexError("Not authenticated")
    }

<<<<<<< HEAD
        return await ctx.db
                    .query("detailServices")
                    .filter((q) => q.eq(q.field("tenantId"), identity.tenantId))
                    .collect();

    },
=======
    const services = await ctx.db
      .query("detailServices")
      .filter((q) => q.eq(q.field("tenantId"), identity.tenantId))
      .collect()

    return services
  },
>>>>>>> bfb0ff6 (feat: Update transaction details modal and API routes)
})

export const createDetailPackage = mutation({
  args: {
    name: v.string(),
    pricingMethod: v.string(),
    price: v.number(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new ConvexError("Not authenticated")
    }

<<<<<<< HEAD
        return await ctx.db.insert("detailPackages", {
                    ...args,
                    tenantId: identity.tenantId,
                    isActive: true,
                });

    },
=======
    const packageId = await ctx.db.insert("detailPackages", {
      ...args,
      tenantId: identity.tenantId,
      isActive: true,
    })

    return packageId
  },
>>>>>>> bfb0ff6 (feat: Update transaction details modal and API routes)
})

export const createDetailService = mutation({
  args: {
    name: v.string(),
    pricingMethod: v.string(),
    price: v.number(),
    duration: v.optional(v.number()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new ConvexError("Not authenticated")
    }

<<<<<<< HEAD
        return await ctx.db.insert("detailServices", {
                    ...args,
                    tenantId: identity.tenantId,
                    isActive: true,
                });

    },
=======
    const serviceId = await ctx.db.insert("detailServices", {
      ...args,
      tenantId: identity.tenantId,
      isActive: true,
    })

    return serviceId
  },
>>>>>>> bfb0ff6 (feat: Update transaction details modal and API routes)
})

export const updateDetailPackage = mutation({
  args: {
    id: v.id("detailPackages"),
    name: v.string(),
    pricingMethod: v.string(),
    price: v.number(),
    description: v.optional(v.string()),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new ConvexError("Not authenticated")
    }

    const { id, ...updateData } = args
    await ctx.db.patch(id, updateData)
  },
})

export const updateDetailService = mutation({
  args: {
    id: v.id("detailServices"),
    name: v.string(),
    pricingMethod: v.string(),
    price: v.number(),
    duration: v.optional(v.number()),
    description: v.optional(v.string()),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new ConvexError("Not authenticated")
    }

    const { id, ...updateData } = args
    await ctx.db.patch(id, updateData)
  },
})

export const deleteDetailPackage = mutation({
  args: { id: v.id("detailPackages") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new ConvexError("Not authenticated")
    }

    await ctx.db.delete(args.id)
  },
})

export const deleteDetailService = mutation({
  args: { id: v.id("detailServices") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new ConvexError("Not authenticated")
    }

    await ctx.db.delete(args.id)
  },
})

