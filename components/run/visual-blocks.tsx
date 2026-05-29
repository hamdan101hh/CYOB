import Link from "next/link";
import { ExternalLink, Play } from "lucide-react";

import { ChannelMixChart, SeverityChart } from "@/components/run/charts";
import type { MarketTrendSignal } from "@/lib/market/types";
import type { CompetitorItem, GapItem, TrendItem } from "@/lib/data/parse-run-display";

export function TrendHeatGrid({ trends }: { trends: TrendItem[] }) {
  if (trends.length === 0) return null;
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {trends.map((t) => (
        <div
          key={t.name}
          className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-3"
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-[var(--text)]">{t.name}</p>
            <span className="text-xs tabular-nums text-[var(--amber)]">{t.heat}</span>
          </div>
          {typeof t.heat === "number" ? (
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--bg-3)]">
              <div
                className="h-full rounded-full bg-[var(--accent)]"
                style={{ width: `${Math.min(100, t.heat)}%` }}
              />
            </div>
          ) : null}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {t.channel ? (
              <span className="text-[10px] text-[var(--text-4)]">{t.channel}</span>
            ) : null}
            {t.direction ? (
              <span className="text-[10px] uppercase text-[var(--green)]">
                {t.direction}
              </span>
            ) : null}
            {t.evidence_url ? (
              <a
                href={t.evidence_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 text-[10px] text-[var(--accent)] hover:underline"
              >
                <Play className="h-3 w-3" aria-hidden />
                Watch
              </a>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

export function TrendVideoGrid({
  trends,
}: {
  trends: MarketTrendSignal[] | TrendItem[];
}) {
  if (trends.length === 0) return null;
  return (
    <ul className="space-y-2">
      {trends.map((t) => {
        const url =
          "videoUrl" in t && t.videoUrl
            ? t.videoUrl
            : "evidence_url" in t
              ? t.evidence_url
              : undefined;
        return (
          <li
            key={t.name}
            className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-2)] px-3 py-2"
          >
            <div className="min-w-0">
              <p className="truncate text-sm text-[var(--text)]">{t.name}</p>
              <p className="text-[10px] text-[var(--text-4)]">{t.channel}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="text-xs tabular-nums text-[var(--amber)]">
                {t.heat}
              </span>
              {url ? (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] text-[var(--accent)] hover:bg-[var(--surface-2)]"
                  aria-label={`Video for ${t.name}`}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function CompareSlogan({
  left,
  right,
  slogan,
}: {
  left: string;
  right: string;
  slogan: string;
}) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-2)] px-4 py-3">
      <div className="flex items-center justify-center gap-3 text-sm font-medium text-[var(--text)]">
        <span>{left}</span>
        <span className="text-[10px] font-normal uppercase tracking-wider text-[var(--text-4)]">
          vs
        </span>
        <span>{right}</span>
      </div>
      <p className="mt-2 text-center text-[11px] leading-snug text-[var(--text-3)]">
        {slogan}
      </p>
    </div>
  );
}

export function CompetitorCompare({ items }: { items: CompetitorItem[] }) {
  const pair = items.slice(0, 2);
  if (pair.length < 2) {
    return (
      <ul className="space-y-2">
        {items.map((c) => (
          <li
            key={c.name}
            className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
          >
            <span className="font-medium text-[var(--text)]">{c.name}</span>
            <span className="ml-2 text-[var(--text-4)]">{c.threat}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="space-y-4">
      <CompareSlogan
        left={pair[0]!.name}
        right={pair[1]!.name}
        slogan={`${pair[0]!.positioning} · ${pair[1]!.positioning}`}
      />
      <div className="grid gap-3 md:grid-cols-2">
        {pair.map((c) => (
          <div
            key={c.name}
            className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-3"
          >
            <p className="text-[10px] uppercase text-[var(--text-4)]">{c.threat}</p>
            <p className="mt-1 text-sm font-medium text-[var(--text)]">{c.name}</p>
            {c.strength ? (
              <p className="mt-2 text-[11px] text-[var(--text-3)]">+ {c.strength}</p>
            ) : null}
            {c.weakness ? (
              <p className="text-[11px] text-[var(--text-4)]">− {c.weakness}</p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export function GapList({ gaps }: { gaps: GapItem[] }) {
  if (gaps.length === 0) return null;
  return (
    <div className="space-y-3">
      <SeverityChart gaps={gaps} />
      <ul className="space-y-1.5">
        {gaps.map((g) => (
          <li
            key={g.name}
            className="flex items-center justify-between gap-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs"
          >
            <span className="text-[var(--text)]">{g.name}</span>
            <span className="shrink-0 uppercase text-[var(--red)]">{g.severity}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CollapsibleMemo({
  memo,
  insights,
}: {
  memo: string | null;
  insights: string[];
}) {
  if (!memo && insights.length === 0) return null;
  return (
    <details className="group rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-2)]">
      <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-[var(--text)] marker:content-none [&::-webkit-details-marker]:hidden">
        <span className="text-[var(--text-4)] group-open:hidden">▸</span>
        <span className="hidden text-[var(--text-4)] group-open:inline">▾</span>{" "}
        Executive summary
        {insights.length > 0 ? (
          <span className="ml-2 text-xs font-normal text-[var(--text-4)]">
            {insights.length} signals
          </span>
        ) : null}
      </summary>
      <div className="border-t border-[var(--border)] px-4 py-3">
        {memo ? (
          <p className="text-sm leading-relaxed text-[var(--text-2)]">{memo}</p>
        ) : null}
        {insights.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-2">
            {insights.map((line) => (
              <li
                key={line}
                className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-0.5 text-[10px] text-[var(--text-2)]"
              >
                {line}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </details>
  );
}

export function IntelligenceBoard({
  trends,
  gaps,
  competitors,
}: {
  trends: TrendItem[];
  gaps: GapItem[];
  competitors: CompetitorItem[];
}) {
  const byChannel = trends.reduce<Record<string, number>>((acc, t) => {
    const ch = t.channel ?? "Other";
    acc[ch] = Math.max(acc[ch] ?? 0, t.heat);
    return acc;
  }, {});
  const channels = Object.entries(byChannel).map(([channel, heat]) => ({
    channel,
    heat,
  }));

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-2)] p-4 lg:col-span-2">
        <h3 className="text-xs font-medium uppercase text-[var(--text-4)]">
          Trend radar
        </h3>
        <div className="mt-3">
          <TrendHeatGrid trends={trends} />
        </div>
      </div>
      <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4">
        <h3 className="text-xs font-medium uppercase text-[var(--text-4)]">
          Channel mix
        </h3>
        <div className="mt-3">
          <ChannelMixChart channels={channels} />
        </div>
      </div>
      <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4">
        <h3 className="text-xs font-medium uppercase text-[var(--text-4)]">
          Gaps
        </h3>
        <div className="mt-3">
          <GapList gaps={gaps} />
        </div>
      </div>
      <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4 lg:col-span-2">
        <h3 className="text-xs font-medium uppercase text-[var(--text-4)]">
          Competitor lens
        </h3>
        <div className="mt-3">
          <CompetitorCompare items={competitors} />
        </div>
      </div>
    </div>
  );
}

export function MediaFrame({
  title,
  subtitle,
  imageUrl,
}: {
  title: string;
  subtitle?: string;
  imageUrl?: string | null;
}) {
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-3)]">
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--bg-3),var(--surface))]" />
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
        <p className="text-xs font-medium text-white">{title}</p>
        {subtitle ? (
          <p className="text-[10px] text-white/70">{subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}

export function LibraryCompareRow({
  titleA,
  titleB,
  imageA,
  imageB,
  slogan,
}: {
  titleA: string;
  titleB: string;
  imageA?: string | null;
  imageB?: string | null;
  slogan: string;
}) {
  return (
    <div className="space-y-2">
      <CompareSlogan left={titleA} right={titleB} slogan={slogan} />
      <div className="grid gap-3 md:grid-cols-2">
        <MediaFrame title={titleA} imageUrl={imageA} />
        <MediaFrame title={titleB} imageUrl={imageB} />
      </div>
    </div>
  );
}

export function InsightPills({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {items.slice(0, 6).map((line) => (
        <li
          key={line}
          className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-[10px] text-[var(--text-2)]"
        >
          {line}
        </li>
      ))}
    </ul>
  );
}

export function PlanQuickLinks({ runId }: { runId: string }) {
  return (
    <div className="flex flex-wrap gap-2 text-xs">
      <Link href={`/library/${runId}`} className="link-accent">
        Library →
      </Link>
      <Link href={`/dashboard/${runId}`} className="link-accent">
        War room →
      </Link>
    </div>
  );
}
