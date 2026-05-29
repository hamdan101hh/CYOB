import Link from "next/link";

import { RefreshTrendsButton } from "@/components/dashboard/refresh-trends-button";
import { ChannelMixChart, MetricStrip } from "@/components/run/charts";
import { TierLock } from "@/components/run/tier-lock";
import {
  CollapsibleMemo,
  CompetitorCompare,
  GapList,
  MediaFrame,
  TrendVideoGrid,
} from "@/components/run/visual-blocks";
import { requireRunBundle } from "@/lib/data/require-run";
import { parseRunDisplay } from "@/lib/data/parse-run-display";
import { isRunContentLocked } from "@/lib/features/content-access";
import { getMarketLens } from "@/lib/market/get-market-lens";
import { listRunAssets } from "@/lib/data/list-run-assets";

export default async function PlanRunPage({
  params,
  searchParams,
}: {
  params: Promise<{ runId: string }>;
  searchParams: Promise<{ print?: string }>;
}) {
  const { runId } = await params;
  const { print } = await searchParams;
  const isPrint = print === "1";
  const bundle = await requireRunBundle(runId, `/plan/${runId}`);
  const assets = await listRunAssets(runId);

  const locked = isRunContentLocked(bundle.tier);
  const display = parseRunDisplay(bundle);
  const hero = assets.find((a) => a.asset_type === "image");
  const market = getMarketLens({
    geography: bundle.intake.geography,
    city: bundle.intake.city,
    industry: bundle.intake.industry,
  });

  const byChannel = display.trends.reduce<Record<string, number>>((acc, t) => {
    const ch = t.channel ?? "Other";
    acc[ch] = Math.max(acc[ch] ?? 0, t.heat);
    return acc;
  }, {});

  return (
    <div className={`page-wrap max-w-6xl space-y-8 ${isPrint ? "print-plan" : ""}`}>
      <div
        className={`flex flex-wrap items-center justify-between gap-4 ${isPrint ? "no-print" : ""}`}
      >
        <div>
          <p className="eyebrow">Strategic plan</p>
          <h1 className="page-title mt-1">{bundle.intake.company}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <RefreshTrendsButton runId={runId} />
          <Link href={`/plan/${runId}?print=1`} className="btn btn-secondary h-10 px-4">
            Print
          </Link>
          <Link href={`/library/${runId}`} className="btn btn-secondary h-10 px-4">
            Library
          </Link>
        </div>
      </div>

      {hero?.public_url ? (
        <div className="relative aspect-[21/9] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={hero.public_url} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-transparent" />
          <p className="absolute bottom-4 left-4 text-sm text-[var(--text)]">
            {display.campaigns[0]?.name ?? "Primary launch"}
          </p>
        </div>
      ) : null}

      <TierLock locked={locked}>
        <MetricStrip
          items={[
            { label: "Trends", value: display.trends.length, tone: "amber" },
            { label: "Gaps", value: display.gaps.length, tone: "accent" },
            { label: "Moves", value: display.priorities.length, tone: "green" },
            { label: "Horizon", value: display.horizons[0]?.years ? `${display.horizons[0].years}y` : "—" },
          ]}
        />

        <CollapsibleMemo memo={display.memo} insights={display.insights} />

        <section id="trends" className="scroll-mt-24 grid gap-4 lg:grid-cols-2">
          <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-2)] p-4">
            <h2 className="text-xs font-medium uppercase text-[var(--text-4)]">
              Trends + video refs
            </h2>
            <div className="mt-3">
              <TrendVideoGrid trends={display.trends} />
            </div>
          </div>
          <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4">
            <h2 className="text-xs font-medium uppercase text-[var(--text-4)]">
              Channel mix
            </h2>
            <div className="mt-3">
              <ChannelMixChart
                channels={Object.entries(byChannel).map(([channel, heat]) => ({
                  channel,
                  heat,
                }))}
              />
            </div>
          </div>
        </section>

        <section id="competitors" className="scroll-mt-24">
          <h2 className="text-xs font-medium uppercase text-[var(--text-4)]">
            Competitor compare
          </h2>
          <div className="mt-3">
            <CompetitorCompare items={display.competitors} />
          </div>
        </section>

        <section
          id="gaps"
          className="scroll-mt-24 grid gap-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-2)] p-4 lg:grid-cols-2"
        >
          <div>
            <h2 className="text-xs font-medium uppercase text-[var(--text-4)]">Gaps</h2>
            <div className="mt-3">
              <GapList gaps={display.gaps} />
            </div>
          </div>
          <div>
            <h2 className="text-xs font-medium uppercase text-[var(--text-4)]">Moves</h2>
            {display.northStar ? (
              <p className="mt-2 text-sm text-[var(--gold)]">{display.northStar}</p>
            ) : null}
            <ul className="mt-3 space-y-2">
              {display.priorities.map((move) => (
                <li
                  key={move.title}
                  className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)]"
                >
                  {move.title}
                  {move.horizon ? (
                    <span className="ml-2 text-[var(--text-4)]">{move.horizon}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="campaigns" className="scroll-mt-24 space-y-3">
          <h2 className="text-xs font-medium uppercase text-[var(--text-4)]">
            Campaign boards
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {display.campaigns.map((c, i) => {
              const img = assets.find(
                (a) => a.campaign_index === i && a.asset_type === "image",
              );
              return (
                <div
                  key={c.name}
                  className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]"
                >
                  <MediaFrame title={c.name} subtitle={c.type} imageUrl={img?.public_url} />
                  <p className="p-3 text-xs text-[var(--text-3)]">{c.big_idea}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section id="roadmap" className="scroll-mt-24">
          <h2 className="text-xs font-medium uppercase text-[var(--text-4)]">Roadmap</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {(display.horizons.length > 0
              ? display.horizons.map((h) => ({
                  label: `${h.years}y`,
                  body: h.prediction,
                }))
              : display.priorities.map((p) => ({
                  label: p.horizon ?? "Phase",
                  body: p.title,
                }))
            ).map((item) => (
              <div
                key={item.label + item.body}
                className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-3 text-xs"
              >
                <p className="uppercase text-[var(--accent)]">{item.label}</p>
                <p className="mt-2 text-[var(--text-2)]">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4">
          <h2 className="text-xs font-medium uppercase text-[var(--text-4)]">
            {market.regionLabel} reference compares
          </h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {market.comparisons.map((pair) => (
              <p
                key={`${pair.left}-${pair.right}`}
                className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-2)] px-3 py-2 text-center text-[11px] text-[var(--text-3)]"
              >
                <span className="font-medium text-[var(--text)]">{pair.left}</span>
                {" · "}
                <span className="font-medium text-[var(--text)]">{pair.right}</span>
                <br />
                {pair.slogan}
              </p>
            ))}
          </div>
        </section>
      </TierLock>
    </div>
  );
}
