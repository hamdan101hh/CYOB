import { TALABAT_VS_DELIVEROO } from "@/lib/market/competitor-showcase";

import {
  CompareBars,
  DualLineChart,
  MiniPieChart,
} from "@/components/charts/intelligence-charts";
import { LiveBadge } from "@/components/ui/live-badge";
import { VisualThumbnail } from "@/components/home/visual-thumbnail";

export function CompetitorShowcase() {
  const c = TALABAT_VS_DELIVEROO;

  return (
    <section className="cyob-reveal">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Company comparison</p>
          <h2 className="page-title mt-2">
            {c.left.name} vs {c.right.name}
          </h2>
          <p className="mt-2 max-w-lg text-sm text-[var(--text-3)]">{c.headline}</p>
        </div>
        <LiveBadge state="updating" />
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-12">
        <div className="stealth-card p-5 lg:col-span-5">
          <div className="grid grid-cols-2 gap-3">
            <VisualThumbnail
              title={c.left.name}
              subtitle="Volume · deals · habit"
              gradient="bg-gradient-to-br from-[#4a2008] via-[#ff5a00]/40 to-[#0a0c10]"
              aspect="square"
            />
            <VisualThumbnail
              title={c.right.name}
              subtitle="Premium · speed · zones"
              gradient="bg-gradient-to-br from-[#003d38] via-[#00ccbc]/35 to-[#0a0c10]"
              aspect="square"
            />
          </div>
          <div className="mt-4 flex justify-between text-center text-xs">
            <div>
              <p className="text-[var(--text-4)]">Spend share</p>
              <p className="mt-1 font-semibold tabular-nums" style={{ color: c.left.color }}>
                {c.left.spendPct}%
              </p>
            </div>
            <div>
              <p className="text-[var(--text-4)]">Spend share</p>
              <p className="mt-1 font-semibold tabular-nums" style={{ color: c.right.color }}>
                {c.right.spendPct}%
              </p>
            </div>
          </div>
        </div>

        <div className="stealth-card p-5 lg:col-span-4">
          <p className="text-[10px] uppercase tracking-wider text-[var(--text-4)]">
            Trend growth
          </p>
          <div className="mt-4">
            <DualLineChart
              series={c.trendSeries}
              leftColor={c.left.color}
              rightColor={c.right.color}
            />
          </div>
          <div className="mt-4 flex gap-4 text-[10px]">
            <span className="flex items-center gap-1.5">
              <span className="h-0.5 w-4 rounded" style={{ background: c.left.color }} />
              {c.left.name}
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="h-0.5 w-4 rounded border border-dashed"
                style={{ borderColor: c.right.color }}
              />
              {c.right.name}
            </span>
          </div>
        </div>

        <div className="stealth-card p-5 lg:col-span-3">
          <p className="text-[10px] uppercase tracking-wider text-[var(--text-4)]">
            Spend split
          </p>
          <div className="mt-4">
            <MiniPieChart slices={c.spendSplit.map((s) => ({ ...s }))} />
          </div>
        </div>

        <div className="stealth-card p-5 lg:col-span-4">
          <p className="text-[10px] uppercase tracking-wider text-[var(--text-4)]">
            Content share by category
          </p>
          <div className="mt-4">
            <CompareBars items={c.contentShare} />
          </div>
        </div>

        <div className="stealth-card p-5 lg:col-span-8">
          <p className="text-[10px] uppercase tracking-wider text-[var(--text-4)]">
            Market insight
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {c.insights.map((ins) => (
              <li
                key={ins.title}
                className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-2)] px-4 py-3"
              >
                <p className="text-[10px] uppercase text-[var(--accent)]">{ins.tag}</p>
                <p className="mt-1 text-sm font-medium text-[var(--text)]">{ins.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-[var(--text-3)]">{ins.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
