import { CompareSlogan } from "@/components/run/visual-blocks";
import { SparkBars } from "@/components/run/charts";
import { DUBAI_COMPARE_POOL, DUBAI_COMPANY_POOL, DUBAI_TREND_POOL } from "@/lib/market/dubai-pool";

import { MetricCard } from "@/components/home/metric-card";
import { MiniBarCompare, MiniLineChart } from "@/components/home/mini-chart";

export function VisualIntelligenceLayer() {
  const careem = DUBAI_COMPANY_POOL[0]!;
  const talabat = DUBAI_COMPANY_POOL[2]!;
  const compare = DUBAI_COMPARE_POOL[0]!;
  const trends = DUBAI_TREND_POOL.slice(0, 3);

  return (
    <section className="cyob-reveal">
      <p className="eyebrow">Visual intelligence layer</p>
      <h2 className="page-title mt-2 max-w-2xl">
        Charts, compares, and trend signals — built in
      </h2>
      <p className="page-lead max-w-xl">
        Every run surfaces market motion as visuals you can scan in seconds.
      </p>

      <div className="mt-10 grid gap-4 lg:grid-cols-12">
        <MetricCard
          label={`${careem.name} · Dubai`}
          value={careem.signalIndex}
          sub={careem.signalLabel}
          glow="accent"
          className="lg:col-span-4"
        >
          <MiniLineChart series={careem.series} />
        </MetricCard>

        <MetricCard
          label="Channel mix"
          sub="Paid · organic · creator"
          className="lg:col-span-4"
        >
          <MiniBarCompare
            items={[
              { label: "Instagram Reels", value: 84 },
              { label: "Paid social", value: 71 },
              { label: "LinkedIn", value: 58, tone: "purple" },
            ]}
          />
        </MetricCard>

        <MetricCard
          label="Image compare"
          sub="Concept A vs B"
          glow="purple"
          className="lg:col-span-4"
        >
          <div className="grid grid-cols-2 gap-2">
            <div className="aspect-[4/5] rounded-[var(--radius-md)] border border-[var(--border)] bg-gradient-to-br from-[var(--bg-3)] to-[color-mix(in_oklab,var(--accent)_20%,var(--bg-3))]" />
            <div className="aspect-[4/5] rounded-[var(--radius-md)] border border-[var(--border)] bg-gradient-to-br from-[var(--bg-3)] to-[color-mix(in_oklab,var(--accent-2)_25%,var(--bg-3))]" />
          </div>
          <p className="mt-2 text-center text-[10px] text-[var(--text-4)]">A/B hero frames</p>
        </MetricCard>

        <div className="glass-card rounded-[var(--radius-lg)] p-5 lg:col-span-5">
          <p className="text-[10px] uppercase tracking-wider text-[var(--text-4)]">
            Competitor compare
          </p>
          <div className="mt-4">
            <CompareSlogan
              left={compare.left}
              right={compare.right}
              slogan={compare.slogan}
            />
          </div>
        </div>

        <MetricCard label={talabat.name} sub={talabat.sector} className="lg:col-span-3">
          <SparkBars series={talabat.series} />
        </MetricCard>

        <div className="glass-card rounded-[var(--radius-lg)] p-5 lg:col-span-4">
          <p className="text-[10px] uppercase tracking-wider text-[var(--text-4)]">
            Trend video links
          </p>
          <ul className="mt-3 space-y-2">
            {trends.map((t) => (
              <li
                key={t.name}
                className="flex items-center justify-between gap-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-2)] px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-[var(--text)]">{t.name}</p>
                  <p className="text-[10px] text-[var(--text-4)]">{t.channel}</p>
                </div>
                <span className="shrink-0 text-xs tabular-nums text-[var(--amber)]">
                  {t.heat}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
