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

  const body = await req.text();
  void body;

  // Fail closed until Stripe SDK signature verification is wired.
  return NextResponse.json(
    {
      error:
        "Stripe webhook verification not implemented yet. Do not point Stripe at this URL until the SDK handler is added.",
    },
    { status: 501 },
  );
}
