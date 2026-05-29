import { FileText, Lightbulb } from "lucide-react";

import {
  CompareBars,
  DualLineChart,
  MiniPieChart,
} from "@/components/charts/intelligence-charts";
import { TALABAT_VS_DELIVEROO } from "@/lib/market/competitor-showcase";

import { InsightPreviewCard } from "@/components/home/insight-preview-card";
import { LiveBadge } from "@/components/ui/live-badge";
import { VisualThumbnail } from "@/components/home/visual-thumbnail";

export function DubaiMarketExample() {
  const c = TALABAT_VS_DELIVEROO;
  const customer = c.insights.find((i) => i.tag === "customer")!;
  const driver = c.insights.find((i) => i.tag === "driver")!;

  return (
    <section className="cyob-reveal">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className="eyebrow">Dubai market example</p>
          <h2 className="page-title mt-2">Bot output · {c.left.name} vs {c.right.name}</h2>
          <p className="mt-3 text-sm text-[var(--text-3)]">
            CYOB researches the market, compares companies, finds trends, and turns
            everything into visual strategy outputs.
          </p>
        </div>
        <LiveBadge state="updating" />
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-12">
        <div className="stealth-card p-5 lg:col-span-5">
          <p className="text-[10px] uppercase tracking-wider text-[var(--text-4)]">
            Trend growth
          </p>
          <div className="mt-4 cyob-chart-in">
            <DualLineChart
              series={c.trendSeries}
              leftColor={c.left.color}
              rightColor={c.right.color}
            />
          </div>
          <div className="mt-4 flex gap-4 text-[10px]">
            <span className="flex items-center gap-1.5" style={{ color: c.left.color }}>
              <span className="h-0.5 w-4 rounded bg-current" />
              {c.left.name}
            </span>
            <span className="flex items-center gap-1.5" style={{ color: c.right.color }}>
              <span className="h-0.5 w-4 rounded border border-dashed border-current opacity-80" />
              {c.right.name}
            </span>
          </div>
        </div>

        <div className="stealth-card p-5 lg:col-span-3">
          <p className="text-[10px] uppercase tracking-wider text-[var(--text-4)]">
            Content category split
          </p>
          <div className="mt-4">
            <CompareBars items={c.contentShare} />
          </div>
        </div>

        <div className="stealth-card p-5 lg:col-span-4">
          <p className="text-[10px] uppercase tracking-wider text-[var(--text-4)]">
            Spend mix
          </p>
          <div className="mt-4">
            <MiniPieChart slices={c.spendSplit} />
          </div>
        </div>

        <div className="lg:col-span-4">
          <InsightPreviewCard
            tag="Customer POV"
            title={customer.title}
            body={customer.body}
          />
        </div>
        <div className="lg:col-span-4">
          <InsightPreviewCard tag="Driver POV" title={driver.title} body={driver.body} />
        </div>

        <div className="stealth-card p-5 lg:col-span-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-[var(--accent-bright)]" aria-hidden />
            <p className="text-sm font-medium text-[var(--text)]">Strategic recommendation</p>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-[var(--text-3)]">
            Lead with habit-building offers on Reels while testing premium convenience
            zones where Deliveroo is strongest — split creative by audience, not brand.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <VisualThumbnail
              title={c.left.name}
              subtitle="Volume narrative"
              gradient="bg-gradient-to-br from-[#4a2008]/90 via-[#0d2847] to-[#0a0c10]"
              aspect="square"
            />
            <VisualThumbnail
              title={c.right.name}
              subtitle="Premium narrative"
              gradient="bg-gradient-to-br from-[#003d38]/90 via-[#12101a] to-[#0a0c10]"
              aspect="square"
            />
          </div>
        </div>

        <div className="stealth-card p-5 lg:col-span-6">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-[var(--accent-2)]" aria-hidden />
            <p className="text-sm font-medium text-[var(--text)]">Document preview</p>
          </div>
          <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-2)] p-4">
            <p className="text-xs font-medium text-[var(--text)]">
              Strategy brief · {c.left.name} competitive lens
            </p>
            <div className="mt-3 space-y-2">
              <div className="h-2 w-full rounded bg-[var(--surface-3)]" />
              <div className="h-2 w-[92%] rounded bg-[var(--surface-2)]" />
              <div className="h-2 w-[88%] rounded bg-[var(--surface-2)]" />
              <div className="h-2 w-[75%] rounded bg-[var(--surface-2)]" />
              <div className="h-2 w-[60%] rounded bg-[var(--surface-2)]" />
            </div>
            <p className="mt-4 text-[10px] text-[var(--accent-bright)]">Export ready · PDF</p>
          </div>
        </div>

        <div className="stealth-card flex items-center justify-center p-5 lg:col-span-6">
          <ul className="w-full space-y-3 text-sm text-[var(--text-3)]">
            <li className="flex gap-3">
              <span className="text-[var(--accent)]">01</span>
              <span>Agents scan live trends and category momentum in Dubai.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--accent)]">02</span>
              <span>Rivals are compared on content, spend, and audience POV.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--accent)]">03</span>
              <span>Visuals and charts become your strategy command center.</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
