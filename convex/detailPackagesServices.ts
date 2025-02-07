import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { ConvexError } from "convex/values"

export const getDetailPackages = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) {
            throw new ConvexError("Not authenticated")
        }

        return await ctx.db
                    .query("detailPackages")
                    .filter((q) => q.eq(q.field("tenantId"), identity.tenantId))
                    .collect();

    },
})

export const getDetailServices = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) {
            throw new ConvexError("Not authenticated")
        }

        const services = await ctx.db
            .query("detailServices")
            .filter((q) => q.eq(q.field("tenantId"), identity.tenantId))
            .collect()

        return services
    },
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

        const packageId = await ctx.db.insert("detailPackages", {
            ...args,
            tenantId: identity.tenantId,
            isActive: true,
        })

        return packageId
    },
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

        return await ctx.db.insert("detailServices", {
                    ...args,
                    tenantId: identity.tenantId,
                    isActive: true,
                });

    },
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

