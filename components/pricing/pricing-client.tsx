"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

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

type PaidPriceKey =
  | "cyob_spark_monthly"
  | "cyob_spark_annual"
  | "cyob_studio_monthly"
  | "cyob_studio_annual";

function priceKeyForTier(
  tierId: "spark" | "studio",
  annual: boolean,
): PaidPriceKey {
  if (tierId === "spark") {
    return annual ? "cyob_spark_annual" : "cyob_spark_monthly";
  }
  return annual ? "cyob_studio_annual" : "cyob_studio_monthly";
}

function CheckoutButton({
  priceKey,
  label,
}: {
  priceKey: PaidPriceKey;
  label: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price_key: priceKey }),
      });
      const body = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !body.url) {
        setError(body.error ?? "Checkout unavailable. Sign in or add Stripe keys.");
        return;
      }
      window.location.href = body.url;
    } catch {
      setError("Network error. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        type="button"
        disabled={busy}
        onClick={() => void startCheckout()}
        className="btn btn-primary mt-6 w-full"
      >
        {busy ? "Redirecting…" : label}
      </button>
      {error ? (
        <p className="mt-2 text-xs text-[var(--red)]" role="alert">
          {error}
        </p>
      ) : null}
    </>
  );
}

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
            className="relative h-7 w-12 rounded-full border border-[var(--border)] bg-[var(--bg-3)]"
          >
          <span
            className={`absolute top-0.5 size-6 rounded-full bg-[var(--accent)] shadow-[0_0_12px_var(--accent-glow)] transition-transform ${
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
              className="card card-pad transition-transform duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:border-[var(--border-2)]"
            >
              <p className="text-sm text-[var(--text-3)]">{tier.name}</p>
              <p className="mt-3 text-3xl font-medium text-[var(--text)]">
                {price}
              </p>
              <p className="mt-3 text-sm text-[var(--text-2)]">{tier.blurb}</p>
              {tier.id === "free" ? (
                <Link href="/login" className="btn btn-secondary mt-6 w-full">
                  Start free
                </Link>
              ) : (
                <CheckoutButton
                  priceKey={priceKeyForTier(tier.id, annual)}
                  label={`Upgrade to ${tier.name}`}
                />
              )}
            </div>
          );
        })}
      </div>
      <EnterpriseInquiryForm />
      <WaitlistForm />
    </>
  );
}

function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, reason: "pricing" }),
      });
      if (!res.ok) {
        const body = (await res.json()) as { error?: string };
        setError(body.error ?? "Could not join waitlist.");
        return;
      }
      setDone(true);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={(e) => void submit(e)}
      className="card card-pad mt-12"
    >
      <p className="text-sm font-medium text-[var(--text)]">Launch waitlist</p>
      <p className="mt-1 text-sm text-[var(--text-2)]">
        Get notified about new tiers and features.
      </p>
      {done ? (
        <p className="mt-4 text-sm text-[var(--gold)]">You are on the list.</p>
      ) : (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="input-field flex-1"
          />
          <button
            type="submit"
            disabled={busy}
            className="btn btn-primary px-5"
          >
            Join waitlist
          </button>
        </div>
      )}
      {error ? (
        <p className="mt-2 text-sm text-[var(--red)]" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}

function EnterpriseInquiryForm() {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/enterprise-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company, message }),
      });
      if (!res.ok) {
        const body = (await res.json()) as { error?: string };
        setError(body.error ?? "Could not send inquiry.");
        return;
      }
      setDone(true);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={(e) => void submit(e)}
      className="card card-pad mt-10"
    >
      <p className="text-sm font-medium text-[var(--text)]">Enterprise</p>
      <p className="mt-1 text-sm text-[var(--text-2)]">
        White-label, daily refresh, and custom agent packs.
      </p>
      {done ? (
        <p className="mt-4 text-sm text-[var(--gold)]">
          Thanks — we will follow up by email.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Work email"
            className="input-field"
          />
          <input
            type="text"
            required
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Company"
            className="input-field"
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What do you need? (optional)"
            rows={3}
            className="input-field min-h-[5.5rem] py-2"
          />
          <button
            type="submit"
            disabled={busy}
            className="btn btn-secondary w-full sm:w-auto sm:px-6"
          >
            Contact sales
          </button>
        </div>
      )}
      {error ? (
        <p className="mt-2 text-sm text-[var(--red)]" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
