"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { SparkBars } from "@/components/run/charts";
import { CompareSlogan, TrendVideoGrid } from "@/components/run/visual-blocks";
import type { MarketLens } from "@/lib/market/types";

type MarketSnapshotPanelProps = {
  initial: MarketLens;
  geography: string;
  city?: string;
  industry?: string;
};

export function MarketSnapshotPanel({
  initial,
  geography,
  city,
  industry,
}: MarketSnapshotPanelProps) {
  const router = useRouter();
  const [lens, setLens] = useState(initial);
  const [seed, setSeed] = useState(0);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/market-snapshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          geography,
          city,
          industry,
          seed,
        }),
      });
      if (!res.ok) return;
      const data = (await res.json()) as MarketLens & { nextSeed?: number };
      setLens(data);
      if (typeof data.nextSeed === "number") setSeed(data.nextSeed);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }, [geography, city, industry, seed, router]);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-medium uppercase tracking-wide text-[var(--text-4)]">
            {lens.regionLabel} market lens
          </h2>
          <p className="mt-0.5 text-xs text-[var(--text-4)]">
            Curated examples · rotates free (within weekly budget)
          </p>
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={() => void refresh()}
          className="btn btn-secondary h-9 px-3 text-xs"
        >
          {busy ? "Refreshing…" : "Rotate examples"}
        </button>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        {lens.companies.map((co) => (
          <article
            key={co.id}
            className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-2)] p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-[var(--text)]">{co.name}</p>
                <p className="text-[10px] text-[var(--text-4)]">{co.sector}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold tabular-nums text-[var(--accent)]">
                  {co.signalIndex}
                </p>
                <p className="text-[9px] uppercase text-[var(--text-4)]">
                  {co.signalLabel}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <SparkBars series={co.series} />
            </div>
            <p className="mt-3 text-[10px] text-[var(--text-3)]">
              Trend: <span className="text-[var(--text-2)]">{co.highlightTrend}</span>
            </p>
          </article>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4">
          <h3 className="text-xs font-medium uppercase text-[var(--text-4)]">
            Live trend signals
          </h3>
          <div className="mt-3">
            <TrendVideoGrid trends={lens.trends} />
          </div>
        </div>
        <div className="space-y-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4">
          <h3 className="text-xs font-medium uppercase text-[var(--text-4)]">
            Quick compares
          </h3>
          {lens.comparisons.map((pair) => (
            <CompareSlogan
              key={`${pair.left}-${pair.right}`}
              left={pair.left}
              right={pair.right}
              slogan={pair.slogan}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
