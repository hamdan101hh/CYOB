"use client";

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
      className="mt-12 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6"
    >
      <p className="text-sm font-medium text-[var(--text)]">Launch waitlist</p>
      <p className="mt-1 text-sm text-[var(--text-2)]">
        Get notified when paid tiers and Stripe checkout go live.
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
            className="h-11 flex-1 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-2)] px-3 text-sm text-[var(--text)]"
          />
          <button
            type="submit"
            disabled={busy}
            className="inline-flex h-11 items-center justify-center rounded-[var(--radius-md)] border border-[var(--gold)]/50 bg-[color-mix(in_oklab,var(--gold)_16%,transparent)] px-5 text-sm font-medium text-[var(--text)] disabled:opacity-50"
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
      className="mt-10 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6"
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
            className="h-11 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-2)] px-3 text-sm text-[var(--text)]"
          />
          <input
            type="text"
            required
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Company"
            className="h-11 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-2)] px-3 text-sm text-[var(--text)]"
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What do you need? (optional)"
            rows={3}
            className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-2)] px-3 py-2 text-sm text-[var(--text)]"
          />
          <button
            type="submit"
            disabled={busy}
            className="inline-flex h-11 w-full items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)] text-sm font-medium text-[var(--text)] disabled:opacity-50 sm:w-auto sm:px-6"
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
