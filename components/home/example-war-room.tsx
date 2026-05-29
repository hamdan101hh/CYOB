import { FileText, GitCompare, TrendingUp } from "lucide-react";

import { ChannelMixChart } from "@/components/run/charts";
import { CompareSlogan } from "@/components/run/visual-blocks";
import { DUBAI_COMPARE_POOL, DUBAI_COMPANY_POOL } from "@/lib/market/dubai-pool";

import { MetricCard } from "@/components/home/metric-card";
import { MiniHeatmap, MiniLineChart, ProgressRing } from "@/components/home/mini-chart";

export function ExampleWarRoom() {
  const compare = DUBAI_COMPARE_POOL[0]!;
  const careem = DUBAI_COMPANY_POOL[0]!;

  return (
    <section className="cyob-reveal">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Dubai example war room</p>
          <h2 className="page-title mt-2">What your dashboard could look like</h2>
        </div>
        <span className="chip">UAE · Dubai market</span>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-12">
        <div className="glass-card rounded-[var(--radius-xl)] p-5 md:col-span-2 xl:col-span-5">
          <div className="flex items-center gap-2">
            <GitCompare className="h-4 w-4 text-[var(--accent)]" aria-hidden />
            <p className="text-sm font-medium text-[var(--text)]">
              {compare.left} vs {compare.right}
            </p>
          </div>
          <div className="mt-4">
            <CompareSlogan
              left={compare.left}
              right={compare.right}
              slogan={compare.slogan}
            />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-center text-[10px]">
            <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-2)] py-2">
              <p className="text-[var(--text-4)]">Careem</p>
              <p className="mt-1 text-sm font-semibold text-[var(--accent)]">+12%</p>
            </div>
            <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-2)] py-2">
              <p className="text-[var(--text-4)]">talabat</p>
              <p className="mt-1 text-sm font-semibold text-[var(--amber)]">+18%</p>
            </div>
          </div>
        </div>

        <MetricCard
          label="Trend graph · Careem"
          sub="Signal index · Dubai"
          glow="accent"
          className="xl:col-span-4"
        >
          <MiniLineChart series={careem.series} />
        </MetricCard>

        <div className="glass-card rounded-[var(--radius-xl)] p-5 xl:col-span-3">
          <p className="text-[10px] uppercase tracking-wider text-[var(--text-4)]">
            Competitor heatmap
          </p>
          <div className="mt-4">
            <MiniHeatmap
              rows={[
                { label: "Careem", cells: [40, 65, 80, 72, 90] },
                { label: "talabat", cells: [55, 70, 85, 78, 88] },
                { label: "noon", cells: [30, 50, 60, 68, 75] },
                { label: "Cafu", cells: [25, 45, 55, 62, 70] },
              ]}
            />
          </div>
        </div>

        <div className="glass-card rounded-[var(--radius-xl)] p-5 md:col-span-2 xl:col-span-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[var(--green)]" aria-hidden />
            <p className="text-sm font-medium text-[var(--text)]">Content angles</p>
          </div>
          <ul className="mt-4 space-y-2">
            {[
              "Super-app story vs single-category depth",
              "Founder POV on LinkedIn · Arabic captions",
              "Mall-to-mobile retargeting loop",
            ].map((angle) => (
              <li
                key={angle}
                className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-2)] px-3 py-2 text-xs text-[var(--text-2)]"
              >
                {angle}
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card rounded-[var(--radius-xl)] p-5 xl:col-span-3">
          <p className="text-[10px] uppercase tracking-wider text-[var(--text-4)]">
            Channel pressure
          </p>
          <div className="mt-4">
            <ChannelMixChart
              channels={[
                { channel: "Reels", heat: 84 },
                { channel: "Paid", heat: 71 },
                { channel: "OOH", heat: 45 },
              ]}
            />
          </div>
        </div>

        <div className="glass-card rounded-[var(--radius-xl)] p-5 xl:col-span-2">
          <div className="relative flex justify-center py-2">
            <ProgressRing value={78} label="Emaar index" />
          </div>
        </div>

        <div className="glass-card rounded-[var(--radius-xl)] p-5 md:col-span-2 xl:col-span-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-[var(--accent-2)]" aria-hidden />
            <p className="text-sm font-medium text-[var(--text)]">Document output</p>
          </div>
          <div className="mt-4 space-y-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-2)] p-3">
            <div className="h-2 w-3/4 rounded bg-[var(--surface-3)]" />
            <div className="h-2 w-full rounded bg-[var(--surface-2)]" />
            <div className="h-2 w-5/6 rounded bg-[var(--surface-2)]" />
            <div className="h-2 w-2/3 rounded bg-[var(--surface-2)]" />
            <p className="pt-2 text-[10px] text-[var(--text-4)]">
              Strategy brief · PDF ready
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
