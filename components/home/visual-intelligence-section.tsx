import { CompareBars, SimpleTrendChart } from "@/components/charts/intelligence-charts";
import { TALABAT_VS_DELIVEROO } from "@/lib/market/competitor-showcase";

import { MiniChartCard } from "@/components/home/mini-chart-card";
import { SpendBreakdownCard } from "@/components/home/spend-breakdown-card";
import { VisualThumbnail } from "@/components/home/visual-thumbnail";

const EVIDENCE = [
  {
    title: "Campaign frame",
    subtitle: "Meal drop · Reels",
    gradient: "bg-gradient-to-br from-[#2a1810] via-[#0d2847] to-[#0a0c10]",
  },
  {
    title: "Delivery POV",
    subtitle: "Driver incentive narrative",
    gradient: "bg-gradient-to-br from-[#003d38] via-[#12101a] to-[#050608]",
  },
  {
    title: "Brand positioning",
    subtitle: "Premium vs volume",
    gradient: "bg-gradient-to-br from-[#1a1040] via-[#0d1f3a] to-[#0a0c10]",
  },
] as const;

export function VisualIntelligenceSection() {
  const c = TALABAT_VS_DELIVEROO;

  return (
    <section className="cyob-reveal">
      <div className="max-w-2xl">
        <p className="eyebrow">Live visual intelligence</p>
        <h2 className="page-title mt-2">What CYOB surfaces in real time</h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-3)]">
          Trends, rival compares, spend splits, and visual evidence — the bot researches
          the market and outputs strategy you can scan in seconds.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MiniChartCard
          title="Trend scan"
          caption="Dubai food delivery trend rising"
          liveState="detected"
        >
          <SimpleTrendChart
            series={c.trendSeries}
            leftLabel={c.left.name}
            rightLabel={c.right.name}
            leftColor={c.left.color}
            rightColor={c.right.color}
          />
        </MiniChartCard>

        <MiniChartCard
          title="Competitor compare"
          caption={`${c.left.name} vs ${c.right.name}`}
          liveState="changed"
        >
          <CompareBars items={c.contentShare} />
          <div className="mt-3 flex justify-between text-[10px]">
            <span style={{ color: c.left.color }}>{c.left.name}</span>
            <span style={{ color: c.right.color }}>{c.right.name}</span>
          </div>
        </MiniChartCard>

        <SpendBreakdownCard slices={c.spendSplit} />

        <MiniChartCard title="Visual evidence" caption="Campaign & POV snapshots" liveState="added">
          <div className="grid grid-cols-3 gap-2">
            {EVIDENCE.map((e) => (
              <VisualThumbnail
                key={e.title}
                title={e.title}
                subtitle={e.subtitle}
                gradient={e.gradient}
                aspect="square"
              />
            ))}
          </div>
        </MiniChartCard>
      </div>
    </section>
  );
}
