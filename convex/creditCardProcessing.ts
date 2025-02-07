import { v } from "convex/values"
import { mutation, query, action } from "./_generated/server"
import { ConvexError } from "convex/values"
import Stripe from "stripe"
import { api } from "./_generated/api"

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
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new ConvexError("Not authenticated")
    }

    const settings = await ctx.db
      .query("settings")
      .filter((q) => q.eq(q.field("tenantId"), identity.tenantId))
      .unique()

    if (settings) {
      await ctx.db.patch(settings._id, args)
    } else {
      await ctx.db.insert("settings", { ...args, tenantId: identity.tenantId })
    }
  },
})

export const getPaginatedTransactions = query({
  args: {
    page: v.number(),
    pageSize: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new ConvexError("Not authenticated")
    }

    const { page, pageSize } = args
    const skip = (page - 1) * pageSize

    const transactions = await ctx.db
      .query("transactions")
      .filter((q) => q.eq(q.field("tenantId"), identity.tenantId))
      .order("desc")
      .paginate({ numItems: pageSize, cursor: skip.toString() })

    const totalCount = await ctx.db
      .query("transactions")
      .filter((q) => q.eq(q.field("tenantId"), identity.tenantId))
      .count()

    return {
      transactions: transactions.page,
      totalCount,
      hasMore: transactions.hasMore,
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
        stripe_account: settings.stripeConnectedAccountId,
      })

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