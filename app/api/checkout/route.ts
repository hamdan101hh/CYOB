import { NextResponse } from "next/server";
import { z } from "zod";

import { requireUser } from "@/lib/auth/session";
import { createSupabaseAdminClientOrNull } from "@/lib/db/supabase-admin";
import { env } from "@/lib/env";
import {
  createCheckoutSession,
  getStripe,
  type CheckoutPriceKey,
} from "@/lib/services/stripe";

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
  if (!getStripe()) {
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 503 },
    );
  }

  const auth = await requireUser();
  if (!auth.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
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

  const admin = createSupabaseAdminClientOrNull();
  if (!admin) {
    return NextResponse.json(
      { error: "Supabase admin not configured" },
      { status: 503 },
    );
  }

  const { data: profile } = await admin
    .from("users")
    .select("email,stripe_customer_id")
    .eq("id", auth.user.id)
    .maybeSingle();

  const email = profile?.email ?? auth.user.email;
  if (!email) {
    return NextResponse.json({ error: "User email missing" }, { status: 400 });
  }

  let customerId = profile?.stripe_customer_id as string | null | undefined;
  const stripe = getStripe()!;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email,
      metadata: { user_id: auth.user.id },
    });
    customerId = customer.id;
    await admin
      .from("users")
      .update({ stripe_customer_id: customerId })
      .eq("id", auth.user.id);
  }

  const appUrl = (env.NEXT_PUBLIC_APP_URL ?? "https://cyob.site").replace(
    /\/$/,
    "",
  );

  const session = await createCheckoutSession({
    priceId,
    priceKey: parsed.data.price_key as CheckoutPriceKey,
    userId: auth.user.id,
    email,
    customerId,
    appUrl,
  });

  return NextResponse.json({ url: session.url });
}
