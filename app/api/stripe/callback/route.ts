import { NextResponse } from "next/server"
import Stripe from "stripe"
import { api } from "@/convex/_generated/api"
import { ConvexHttpClient } from "convex/browser"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const convexClient = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")

  if (!code) {
    return NextResponse.json({ error: "Missing code parameter" }, { status: 400 })
  }

  try {
    const response = await stripe.oauth.token({
      grant_type: "authorization_code",
      code,
    })

    const connectedAccountId = response.stripe_user_id

    if (!connectedAccountId) {
      throw new Error("Failed to get connected account ID")
    }

    // Store the connected account ID using Convex
    await convexClient.mutation(api.creditCardProcessing.storeStripeConnectedAccountId, {
      connectedAccountId,
    })

    // Redirect to the settings page
    return NextResponse.redirect(new URL("/admin/settings/credit-card-processing", request.url))
  } catch (error) {
    console.error("Error in Stripe OAuth callback:", error)
    return NextResponse.json({ error: "Failed to connect Stripe account" }, { status: 500 })
  }
}
