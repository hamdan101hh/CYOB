"use client";

import { useState } from "react";

type CapRow = {
  month_year: string;
  cap_cents: number;
  spent_cents: number;
};

type TierRow = {
  id: string;
  current_tier: string;
  monthly_cost_cents: number;
};

export function AdminPanel({
  cap,
  tiers,
}: {
  cap: CapRow | null;
  tiers: TierRow[];
}) {
  const [service, setService] = useState("claude");
  const [nextTier, setNextTier] = useState("standard");
  const [costCents, setCostCents] = useState(0);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const spentPct = cap
    ? Math.min(100, Math.round((cap.spent_cents / cap.cap_cents) * 100))
    : 0;

  const saveTier = async () => {
    setMsg(null);
    setErr(null);
    const res = await fetch("/api/admin/service-tier", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service,
        next_tier: nextTier,
        monthly_cost_cents: costCents,
      }),
    });
    if (!res.ok) {
      const j = (await res.json().catch(() => null)) as { error?: string } | null;
      setErr(j?.error ?? "Update failed");
      return;
    }
    setMsg("Service tier updated.");
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="text-xs uppercase tracking-wide text-[var(--text-4)]">
          Monthly API cap
        </p>
        {cap ? (
          <>
            <p className="mt-3 text-2xl font-medium text-[var(--text)]">
              ${(cap.spent_cents / 100).toFixed(2)} / $
              {(cap.cap_cents / 100).toFixed(0)}
            </p>
            <p className="mt-1 text-sm text-[var(--text-3)]">{cap.month_year}</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--bg-3)]">
              <div
                className="h-full bg-[var(--gold)]"
                style={{ width: `${spentPct}%` }}
              />
            </div>
          </>
        ) : (
          <p className="mt-3 text-sm text-[var(--text-2)]">
            No cap row for this month yet. Migration 000002 seeds one on apply.
          </p>
        )}
      </section>

      <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="text-xs uppercase tracking-wide text-[var(--text-4)]">
          Service tiers
        </p>
        <ul className="mt-4 space-y-2 text-sm text-[var(--text-2)]">
          {tiers.length === 0 ? (
            <li>No tier rows yet.</li>
          ) : (
            tiers.map((t) => (
              <li key={t.id}>
                <span className="text-[var(--text)]">{t.id}</span> →{" "}
                {t.current_tier} (${(t.monthly_cost_cents / 100).toFixed(2)}/mo)
              </li>
            ))
          )}
        </ul>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="h-11 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-2)] px-3 text-sm text-[var(--text)]"
          >
            {["claude", "gpt", "dalle", "seedance", "apify"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <input
            value={nextTier}
            onChange={(e) => setNextTier(e.target.value)}
            placeholder="Tier name"
            className="h-11 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-2)] px-3 text-sm text-[var(--text)]"
          />
          <input
            type="number"
            min={0}
            value={costCents}
            onChange={(e) => setCostCents(Number(e.target.value))}
            placeholder="Monthly cost (cents)"
            className="h-11 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-2)] px-3 text-sm text-[var(--text)]"
          />
        </div>
        <button
          type="button"
          onClick={() => void saveTier()}
          className="mt-4 inline-flex h-11 items-center justify-center rounded-[var(--radius-md)] border border-[var(--gold)]/50 bg-[color-mix(in_oklab,var(--gold)_16%,transparent)] px-5 text-sm font-medium text-[var(--text)]"
        >
          Update tier
        </button>
        {msg ? <p className="mt-2 text-sm text-[var(--gold)]">{msg}</p> : null}
        {err ? (
          <p className="mt-2 text-sm text-[var(--red)]" role="alert">
            {err}
          </p>
        ) : null}
      </section>
    </div>
  );
}
