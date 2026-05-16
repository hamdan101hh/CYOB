import { NextResponse } from "next/server";
import { z } from "zod";

import { env } from "@/lib/env";

const priceMap = {
  cyob_spark_monthly: "STRIPE_PRICE_SPARK_MONTHLY",
  cyob_spark_annual: "STRIPE_PRICE_SPARK_ANNUAL",
  cyob_studio_monthly: "STRIPE_PRICE_STUDIO_MONTHLY",
  cyob_studio_annual: "STRIPE_PRICE_STUDIO_ANNUAL",
  cyob_one_time_report: "STRIPE_PRICE_ONE_TIME_REPORT",
} as const;

const bodySchema = z.object({
  price_key: z.enum([
    "cyob_spark_monthly",
    "cyob_spark_annual",
    "cyob_studio_monthly",
    "cyob_studio_annual",
    "cyob_one_time_report",
  ]),
});

export async function POST(req: Request) {
  if (!env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 503 },
    );
  }

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid price_key" }, { status: 400 });
  }

  const envKey = priceMap[parsed.data.price_key];
  const priceId = process.env[envKey];
  if (!priceId) {
    return NextResponse.json(
      { error: `${envKey} is not configured` },
      { status: 503 },
    );
  }

  return NextResponse.json({
    message: "Stripe Checkout session creation is ready for Stripe SDK wiring.",
    price_key: parsed.data.price_key,
    price_id: priceId,
  });
}
