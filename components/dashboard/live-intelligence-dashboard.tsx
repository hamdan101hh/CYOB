import Link from "next/link";
import { FileText } from "lucide-react";

import { AgentPipelineVisual } from "@/components/run/agent-pipeline-visual";
import {
  CompareBars,
  DualLineChart,
  MiniPieChart,
} from "@/components/charts/intelligence-charts";
import { LiveBadge } from "@/components/ui/live-badge";
import { VisualThumbnail } from "@/components/home/visual-thumbnail";
import { TALABAT_VS_DELIVEROO } from "@/lib/market/competitor-showcase";
import type { CompetitorItem, TrendItem } from "@/lib/data/parse-run-display";

type LiveIntelligenceDashboardProps = {
  company: string;
  trends: TrendItem[];
  competitors: CompetitorItem[];
  heroImageUrl?: string | null;
  currentAgent: number;
  status: string;
  runId: string;
  insights: string[];
};

export function LiveIntelligenceDashboard({
  company,
  trends,
  competitors,
  heroImageUrl,
  currentAgent,
  status,
  runId,
  insights,
}: LiveIntelligenceDashboardProps) {
  const showcase = TALABAT_VS_DELIVEROO;
  const topTrends = trends.slice(0, 3);
  const pair = competitors.slice(0, 2);
  const leftName = pair[0]?.name ?? showcase.left.name;
  const rightName = pair[1]?.name ?? showcase.right.name;

  const spendSlices = showcase.spendSplit;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <LiveBadge state={status === "running" ? "updating" : "synced"} />
        <p className="text-xs text-[var(--text-4)]">
          Live intelligence · {company}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {/* 1 Live Trends */}
        <article className="stealth-card p-5 xl:col-span-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-medium text-[var(--text)]">Live trends</h3>
            <LiveBadge state={topTrends.length > 0 ? "detected" : "updating"} />
          </div>
          <p className="mt-1 text-[10px] text-[var(--text-4)]">
            Instagram · TikTok · Facebook · YouTube via web scan
          </p>
          {topTrends.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {topTrends.map((t) => (
                <li
                  key={t.name}
                  className="flex items-center justify-between gap-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-2)] px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs text-[var(--text)]">{t.name}</p>
                    <p className="text-[10px] text-[var(--text-4)]">{t.channel}</p>
                  </div>
                  <span className="shrink-0 text-xs tabular-nums text-[var(--accent)]">
                    {t.heat}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-xs text-[var(--text-4)]">Trends populate as agents run.</p>
          )}
          <div className="mt-4 h-px bg-[var(--border)]" />
          <DualLineChart
            series={showcase.trendSeries}
            leftColor={showcase.left.color}
            rightColor={showcase.right.color}
          />
        </article>

        {/* 2 Company comparison */}
        <article className="stealth-card p-5 xl:col-span-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-medium text-[var(--text)]">Company comparison</h3>
            <LiveBadge state="changed" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <VisualThumbnail
              title={leftName}
              subtitle="Your set"
              gradient="bg-gradient-to-br from-[#4a2008]/80 via-[#0d2847] to-[#0a0c10]"
              aspect="square"
            />
            <VisualThumbnail
              title={rightName}
              subtitle="Rival set"
              gradient="bg-gradient-to-br from-[#003d38]/80 via-[#12101a] to-[#0a0c10]"
              aspect="square"
            />
          </div>
          <p className="mt-3 text-center text-[11px] text-[var(--text-3)]">
            {leftName} vs {rightName}
          </p>
          <div className="mt-3">
            <CompareBars items={showcase.contentShare} />
          </div>
        </article>

        {/* 3 Spend breakdown */}
        <article className="stealth-card p-5 xl:col-span-1">
          <h3 className="text-sm font-medium text-[var(--text)]">Spend breakdown</h3>
          <p className="mt-1 text-[11px] text-[var(--text-4)]">
            {showcase.left.name} estimated mix
          </p>
          <div className="mt-4">
            <MiniPieChart slices={spendSlices} />
          </div>
          <p className="mt-3 text-[10px] text-[var(--text-4)]">
            Paid social leads · creator second
          </p>
        </article>

        {/* 4 Customer POV */}
        <article className="stealth-card p-5 xl:col-span-1">
          <h3 className="text-sm font-medium text-[var(--text)]">Customer POV</h3>
          <p className="mt-3 text-xs leading-relaxed text-[var(--text-3)]">
            {showcase.insights[0]?.body}
          </p>
          {insights[0] ? (
            <p className="mt-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-2)] px-3 py-2 text-[11px] text-[var(--text-2)]">
              {insights[0]}
            </p>
          ) : null}
        </article>

        {/* 5 Content signals */}
        <article className="stealth-card p-5 xl:col-span-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-medium text-[var(--text)]">Content signals</h3>
            <LiveBadge state="added" />
          </div>
          {heroImageUrl ? (
            <div className="relative mt-4 aspect-[16/10] overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImageUrl}
                alt=""
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <p className="absolute bottom-2 left-3 text-[10px] text-white/80">
                Campaign visual
              </p>
            </div>
          ) : (
            <div className="mt-4">
              <VisualThumbnail
                title="Content frame"
                subtitle="Library when complete"
                gradient="bg-gradient-to-br from-[#1a1040] via-[#0d2847] to-[#0a0c10]"
                aspect="wide"
              />
            </div>
          )}
        </article>

        {/* 6 Agent output */}
        <article className="stealth-card p-5 xl:col-span-1">
          <h3 className="text-sm font-medium text-[var(--text)]">Agent output</h3>
          <div className="mt-3">
            <AgentPipelineVisual
              currentAgent={currentAgent}
              status={status}
              compact
              interactive
              minimal
            />
          </div>
          <Link
            href={`/plan/${runId}`}
            className="mt-4 flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-2)] px-3 py-2 text-xs text-[var(--text-2)] transition-colors hover:border-[var(--border-2)] hover:text-[var(--text)]"
          >
            <FileText className="h-3.5 w-3.5 text-[var(--accent)]" aria-hidden />
            Open strategy document
          </Link>
        </article>
      </div>
    </div>
  );
}
