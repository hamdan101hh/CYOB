"use client";

import { GitCompare, Sparkles } from "lucide-react";

import { SimpleTrendChart } from "@/components/charts/intelligence-charts";
import { LiveBadge } from "@/components/ui/live-badge";
import { TALABAT_VS_DELIVEROO } from "@/lib/market/competitor-showcase";

export function HeroPanel() {
  const c = TALABAT_VS_DELIVEROO;
  const latest = c.trendSeries[c.trendSeries.length - 1]!;

  return (
    <div className="relative w-full lg:min-h-[380px]">
      <div
        className="pointer-events-none absolute -inset-8 rounded-[2rem] bg-[radial-gradient(ellipse_at_70%_0%,rgba(59,130,246,0.1),transparent_55%)]"
        aria-hidden
      />

      <div className="stealth-card relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border-2)] p-5 md:p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--graphite)]">
              <Sparkles className="h-5 w-5 text-[var(--accent-bright)]" aria-hidden />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text)]">Live command panel</p>
              <p className="text-[11px] text-[var(--text-4)]">Example · UAE delivery</p>
            </div>
          </div>
          <LiveBadge state="synced" />
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--graphite)] p-4">
            <p className="text-[10px] uppercase tracking-wider text-[var(--text-4)]">
              Market signal
            </p>
            <p className="mt-2 text-2xl font-semibold tabular-nums text-[var(--accent-bright)]">
              Rising
            </p>
            <p className="mt-1 text-xs text-[var(--text-3)]">
              Food delivery engagement · Dubai
            </p>
          </div>

          <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--graphite)] p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[10px] uppercase tracking-wider text-[var(--text-4)]">
                Compare
              </p>
              <GitCompare className="h-3.5 w-3.5 text-[var(--text-4)]" aria-hidden />
            </div>
            <p className="mt-2 text-sm font-medium text-[var(--text)]">
              <span style={{ color: c.left.color }}>{c.left.name}</span>
              {" vs "}
              <span style={{ color: c.right.color }}>{c.right.name}</span>
            </p>
            <p className="mt-1 text-xs text-[var(--text-3)]">{c.headline}</p>
          </div>
        </div>

        <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--graphite)] p-4">
          <p className="text-[10px] uppercase tracking-wider text-[var(--text-4)]">
            Trend line · last 5 months
          </p>
          <div className="mt-3">
            <SimpleTrendChart
              series={c.trendSeries}
              leftLabel={c.left.name}
              rightLabel={c.right.name}
              leftColor={c.left.color}
              rightColor={c.right.color}
            />
          </div>
          <p className="mt-2 text-[10px] text-[var(--text-4)]">
            {c.left.name} index {latest.left} · {c.right.name} index {latest.right}
          </p>
        </div>

        <ul className="mt-4 space-y-2 border-t border-[var(--border)] pt-4 text-[11px] text-[var(--text-3)]">
          <li className="flex gap-2">
            <span className="text-[var(--accent)]">→</span>
            Agents scan Instagram, TikTok, Facebook, YouTube (when Serper is on)
          </li>
          <li className="flex gap-2">
            <span className="text-[var(--accent)]">→</span>
            You get charts, compares, and strategy — not text walls
          </li>
        </ul>
      </div>
    </div>
  );
}
