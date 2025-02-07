import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    { error: "This endpoint is no longer in use. Logo uploads are now handled by Convex." },
    { status: 410 },
  )
}

