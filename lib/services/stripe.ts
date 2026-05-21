import Stripe from "stripe";

import { env } from "@/lib/env";

let client: Stripe | null = null;

export function getStripe(): Stripe | null {
  if (!env.STRIPE_SECRET_KEY) return null;
  if (!client) {
    client = new Stripe(env.STRIPE_SECRET_KEY);
  }
  return client;
}

export type CheckoutPriceKey =
  | "cyob_spark_monthly"
  | "cyob_spark_annual"
  | "cyob_studio_monthly"
  | "cyob_studio_annual"
  | "cyob_one_time_report";

export function tierFromPriceKey(
  priceKey: CheckoutPriceKey,
): "spark" | "studio" | null {
  if (priceKey.includes("studio")) return "studio";
  if (priceKey.includes("spark") || priceKey === "cyob_one_time_report") {
    return "spark";
  }
  return null;
}

export async function createCheckoutSession(params: {
  priceId: string;
  priceKey: CheckoutPriceKey;
  userId: string;
  email: string;
  customerId?: string | null;
  appUrl: string;
}): Promise<Stripe.Checkout.Session> {
  const stripe = getStripe();
  if (!stripe) throw new Error("Stripe not configured");

  const tier = tierFromPriceKey(params.priceKey);
  const isOneTime = params.priceKey === "cyob_one_time_report";

  return stripe.checkout.sessions.create({
    mode: isOneTime ? "payment" : "subscription",
    customer: params.customerId ?? undefined,
    customer_email: params.customerId ? undefined : params.email,
    line_items: [{ price: params.priceId, quantity: 1 }],
    success_url: `${params.appUrl}/dashboard?checkout=success`,
    cancel_url: `${params.appUrl}/pricing?checkout=cancelled`,
    metadata: {
      user_id: params.userId,
      price_key: params.priceKey,
      tier: tier ?? "spark",
    },
    subscription_data: isOneTime
      ? undefined
      : {
          metadata: {
            user_id: params.userId,
            price_key: params.priceKey,
            tier: tier ?? "spark",
          },
        },
  });
}

export function constructStripeEvent(
  payload: string,
  signature: string,
): Stripe.Event {
  const stripe = getStripe();
  const secret = env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    throw new Error("Stripe webhook not configured");
  }
  return stripe.webhooks.constructEvent(payload, signature, secret);
}
