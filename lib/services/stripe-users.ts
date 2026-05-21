import { createSupabaseAdminClientOrNull } from "@/lib/db/supabase-admin";
import type { CheckoutPriceKey } from "@/lib/services/stripe";
import { tierFromPriceKey } from "@/lib/services/stripe";

export async function setUserTier(params: {
  userId: string;
  tier: "free" | "spark" | "studio" | "enterprise";
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
}) {
  const admin = createSupabaseAdminClientOrNull();
  if (!admin) return;

  await admin
    .from("users")
    .update({
      tier: params.tier,
      ...(params.stripeCustomerId
        ? { stripe_customer_id: params.stripeCustomerId }
        : {}),
      ...(params.stripeSubscriptionId !== undefined
        ? { stripe_subscription_id: params.stripeSubscriptionId }
        : {}),
    })
    .eq("id", params.userId);
}

export async function applyCheckoutMetadata(params: {
  userId: string;
  priceKey: string;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
}) {
  const tier = tierFromPriceKey(params.priceKey as CheckoutPriceKey);
  if (!tier) return;
  await setUserTier({
    userId: params.userId,
    tier,
    stripeCustomerId: params.stripeCustomerId,
    stripeSubscriptionId: params.stripeSubscriptionId,
  });
}
