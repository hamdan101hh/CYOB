import Link from "next/link";

import { PricingClient } from "@/components/pricing/pricing-client";

export default function PricingPage() {
  return (
    <div className="page-wrap">
      <p className="eyebrow">Pricing</p>
      <h1 className="page-title">Choose your depth</h1>
      <p className="page-lead">
        Annual billing is the default. Sign in to upgrade via Stripe Checkout.
      </p>
      <PricingClient />
      <Link href="/" className="link-accent mt-10 inline-flex text-sm">
        Back to home
      </Link>
    </div>
  );
}
