import Link from "next/link";

import { PricingClient } from "@/components/pricing/pricing-client";

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:px-10">
      <div className="max-w-2xl">
        <p className="text-sm text-[var(--text-3)]">Pricing</p>
        <h1 className="mt-2 text-4xl font-medium tracking-tight text-[var(--text)] md:text-5xl">
          Choose your depth
        </h1>
        <p className="mt-4 text-lg text-[var(--text-2)]">
          Annual billing is the default. Sign in to upgrade via Stripe Checkout.
        </p>
      </div>
      <PricingClient />
      <Link
        href="/"
        className="mt-10 inline-flex text-sm text-[var(--gold)] underline-offset-4 hover:underline"
      >
        Back to home
      </Link>
    </div>
  );
}
