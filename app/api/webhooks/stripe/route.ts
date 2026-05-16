import { NextResponse } from "next/server";

import { env } from "@/lib/env";

export async function POST(req: Request) {
  const secret = env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Stripe webhook secret not configured" },
      { status: 503 },
    );
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  // Stripe SDK verify + subscription handlers wire when STRIPE_SECRET_KEY is set.
  const body = await req.text();
  void body;

  return NextResponse.json({ received: true });
}
