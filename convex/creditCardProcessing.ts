import { GenericId, v } from "convex/values"
import { mutation, query, action } from "./_generated/server"
import { ConvexError } from "convex/values"
import Stripe from "stripe"
import { api } from "./_generated/api"
import { GenericMutationCtx } from "convex/server"
import { count } from "console"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export const getCreditCardProcessingSettings = query({
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
      stripeConnectedAccountId: settings?.stripeConnectedAccountId,
      stripePaymentsEnabled: settings?.stripePaymentsEnabled ?? false,
    }
  },
})
export const updateCreditCardProcessingSettings = mutation({
  args: {
    stripeConnectedAccountId: v.optional(v.string()),
    stripePaymentsEnabled: v.boolean(),
  },
  async handler(args, ctx) {
    const identity = await ctx.auth.getUserIdentity()
    if (identity.tenantId !== undefined) {
      await ctx.db.insert("settings", {
        ...args,
        tenantId: identity.tenantId,
      })
    } else {
      // handle the case where tenantId is undefined
      throw new ConvexError("Tenant ID is required")
    }
  },
})
/**
 * Returns a paginated list of transactions for the current tenant.
 *
 * @param page The page number to retrieve. The first page is page 1.
 * @param pageSize The number of transactions to retrieve per page.
 * @returns An object with the following properties:
 *   - transactions: An array of transactions. The array is guaranteed to have at most `pageSize` elements.
 *   - totalCount: The total number of transactions for the current tenant.
 *   - hasMore: A boolean indicating whether there are more transactions after the ones returned.
 */
export const getPaginatedTransactions = query({
  args: {
    page: v.number(),
    pageSize: v.number(),
  },
  handler: async (ctx, { page, pageSize }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new ConvexError("Not authenticated")
    }
    const skip = (page - 1) * pageSize
    const transactions = await ctx.db
      .query("transactions")
      .filter((q) => q.eq(q.field("tenantId"), identity.tenantId))
      .order("desc")
      .collect()

    const totalCount = await ctx.db
      .query("transactions")
      
      .filter((q) => q.eq(q.field("tenantId"), identity.tenantId))
      .collect()
      .count();

    return {
      transactions,
      totalCount,
      hasMore: totalCount > skip + pageSize,
    }
  },
})

export const refundTransaction = action({
  args: { transactionId: v.id("transactions") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new ConvexError("Not authenticated")
    }

    const transaction = await ctx.runQuery(api.creditCardProcessing.getTransaction, {
      transactionId: args.transactionId,
    })

    if (!transaction) {
      throw new ConvexError("Transaction not found")
    }

    const settings = await ctx.runQuery(api.creditCardProcessing.getCreditCardProcessingSettings)

    if (!settings?.stripeConnectedAccountId) {
      throw new ConvexError("Stripe account not connected")
    }

    try {
      const refund = await stripe.refunds.create({
        charge: transaction.stripeChargeId,
      }, {
        stripeAccount: settings.stripeConnectedAccountId,
      }) as Stripe.Refund
      await ctx.runMutation(api.creditCardProcessing.updateTransactionRefundStatus, {
        transactionId: args.transactionId,
        refunded: true,
        refundId: refund.id,
      })

      return { success: true, refundId: refund.id }
    } catch (error) {
      console.error("Error processing refund:", error)
      throw new ConvexError("Failed to process refund")
    }
  },
})

export const getTransaction = query({
  args: { transactionId: v.id("transactions") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new ConvexError("Not authenticated")
    }

    const transaction = await ctx.db.get(args.transactionId)

    if (!transaction || transaction.tenantId !== identity.tenantId) {
      throw new ConvexError("Transaction not found")
    }

    return transaction
  },
})

export const updateTransactionRefundStatus = mutation({
  args: {
    transactionId: v.id("transactions"),
    refunded: v.boolean(),
    refundId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new ConvexError("Not authenticated")
    }

    const transaction = await ctx.db.get(args.transactionId)

    if (!transaction || transaction.tenantId !== identity.tenantId) {
      throw new ConvexError("Transaction not found")
    }

    await ctx.db.patch(args.transactionId, {
      refunded: args.refunded,
      refundId: args.refundId,
    })
  },
})

export const getStripeConnectUrl = query({
  args: { tenantId: v.id("tenants") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new ConvexError("Not authenticated")
    }

    if (identity.tenantId !== args.tenantId) {
      throw new ConvexError("Tenant not found")
    }
    return ctx.stripe.getStripeConnectUrl(args.tenantId)
  },
})