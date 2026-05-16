"use client";

import { useState } from "react";

const tiers = [
  {
    id: "free",
    name: "Free Preview",
    monthly: 0,
    annual: 0,
    blurb: "Preview depth with upgrade paths.",
  },
  {
    id: "spark",
    name: "Spark",
    monthly: 79,
    annual: 790,
    blurb: "Full strategy, 6 images, 2 videos, weekly refresh, PDF.",
  },
  {
    id: "studio",
    name: "Studio",
    monthly: 199,
    annual: 1990,
    blurb: "Spark + 20 images, Apify competitor scrape, auto refresh.",
  },
] as const;

export function PricingClient() {
  const [annual, setAnnual] = useState(true);

  return (
    <>
      <div className="mt-8 flex items-center gap-3 text-sm">
        <button
          type="button"
          onClick={() => setAnnual(false)}
          className={
            !annual
              ? "text-[var(--text)]"
              : "text-[var(--text-3)] hover:text-[var(--text-2)]"
          }
        >
          Monthly
        </button>
        <button
          type="button"
          role="switch"
          aria-checked={annual}
          aria-label="Toggle annual billing"
          onClick={() => setAnnual(!annual)}
          className="relative h-7 w-12 rounded-full border border-[var(--border)] bg-[var(--surface)]"
        >
          <span
            className={`absolute top-0.5 size-6 rounded-full bg-[var(--gold)] transition-transform ${
              annual ? "left-5" : "left-0.5"
            }`}
          />
        </button>
        <button
          type="button"
          onClick={() => setAnnual(true)}
          className={
            annual
              ? "text-[var(--text)]"
              : "text-[var(--text-3)] hover:text-[var(--text-2)]"
          }
        >
          Annual
        </button>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {tiers.map((tier) => {
          const price =
            tier.monthly === 0
              ? "$0"
              : annual
                ? `$${tier.annual}/yr`
                : `$${tier.monthly}/mo`;
          return (
            <div
              key={tier.id}
              className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 transition-transform duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:border-[var(--border-2)]"
            >
              <p className="text-sm text-[var(--text-3)]">{tier.name}</p>
              <p className="mt-3 text-3xl font-medium text-[var(--text)]">
                {price}
              </p>
              <p className="mt-3 text-sm text-[var(--text-2)]">{tier.blurb}</p>
              <button
                type="button"
                disabled
                className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)] text-sm font-medium text-[var(--text-2)]"
              >
                Checkout after Stripe setup
              </button>
            </div>
          );
        })}
      </div>
      <p className="mt-10 text-sm text-[var(--text-3)]">
        Enterprise: contact for white-label and daily refresh — wired after
        launch prep.
      </p>
    </>
  );
}
