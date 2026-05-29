import { env } from "@/lib/env";
import { serperSearchDetailed } from "@/lib/services/serper";
import { tavilySearch } from "@/lib/services/tavily";

export type LiveTrendItem = {
  name: string;
  channel: string;
  heat: number;
  direction: "up" | "flat" | "down";
  evidence_url: string;
  winner?: string;
  implication?: string;
  source_title?: string;
};

export type TrendResearchResult = {
  trends: LiveTrendItem[];
  digest: string;
  platforms: string[];
  source: "serper" | "tavily" | "mixed";
  costCents: number;
  live: boolean;
  queried_at: string;
};

const PLATFORM_QUERIES = [
  {
    channel: "Instagram",
    build: (ctx: Ctx) =>
      `Instagram Reels trends ${ctx.industry} ${ctx.geography} ${ctx.year}`,
  },
  {
    channel: "TikTok",
    build: (ctx: Ctx) =>
      `TikTok trending ${ctx.industry} ${ctx.geography} ${ctx.year}`,
  },
  {
    channel: "Facebook",
    build: (ctx: Ctx) =>
      `Facebook marketing trends ${ctx.industry} ${ctx.geography}`,
  },
  {
    channel: "YouTube",
    build: (ctx: Ctx) =>
      `YouTube Shorts trends ${ctx.industry} ${ctx.geography} ${ctx.year}`,
  },
] as const;

type Ctx = {
  company: string;
  industry: string;
  geography: string;
  city?: string;
  year: string;
};

function heatFromRank(rank: number): number {
  return Math.max(52, 88 - rank * 6);
}

function directionFromSnippet(snippet: string): "up" | "flat" | "down" {
  const s = snippet.toLowerCase();
  if (/declin|fall|dying|slow|drop/.test(s)) return "down";
  if (/flat|stable|steady/.test(s)) return "flat";
  return "up";
}

function pickEvidenceUrl(link: string, channel: string): string {
  const lower = link.toLowerCase();
  const hosts: Record<string, string[]> = {
    Instagram: ["instagram.com", "facebook.com"],
    TikTok: ["tiktok.com"],
    Facebook: ["facebook.com", "meta.com"],
    YouTube: ["youtube.com", "youtu.be"],
  };
  const preferred = hosts[channel] ?? [];
  if (preferred.some((h) => lower.includes(h))) return link;
  return link;
}

function organicToTrend(
  item: { title?: string; link?: string; snippet?: string },
  channel: string,
  rank: number,
  company: string,
): LiveTrendItem | null {
  const title = item.title?.trim();
  const link = item.link?.trim();
  if (!title || !link) return null;

  const snippet = item.snippet ?? "";
  const shortName =
    title.length > 72 ? `${title.slice(0, 69)}…` : title;

  return {
    name: shortName,
    channel,
    heat: heatFromRank(rank),
    direction: directionFromSnippet(snippet),
    evidence_url: pickEvidenceUrl(link, channel),
    source_title: title,
    winner: snippet.slice(0, 120) || undefined,
    implication: `Relevant for ${company} on ${channel} — verify in source link.`,
  };
}

function dedupeTrends(trends: LiveTrendItem[]): LiveTrendItem[] {
  const seen = new Set<string>();
  const out: LiveTrendItem[] = [];
  for (const t of trends) {
    const key = `${t.channel}:${t.evidence_url}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(t);
  }
  return out.slice(0, 12);
}

export function isTrendResearchConfigured(): boolean {
  return Boolean(env.SERPER_API_KEY || env.TAVILY_API_KEY);
}

/**
 * Live trend scan across Instagram, TikTok, Facebook, and YouTube via web search.
 * Uses Serper (primary) and Tavily (fallback digest). Not official platform APIs,
 * but grounded in real indexed pages, posts, and articles.
 */
export async function runTrendResearch(params: {
  company: string;
  industry: string;
  geography: string;
  city?: string;
  vibe?: string;
}): Promise<TrendResearchResult | null> {
  if (!isTrendResearchConfigured()) return null;

  const ctx: Ctx = {
    company: params.company,
    industry: params.industry,
    geography: params.city
      ? `${params.city} ${params.geography}`
      : params.geography,
    city: params.city,
    year: String(new Date().getFullYear()),
  };

  const collected: LiveTrendItem[] = [];
  const digestParts: string[] = [];
  let costCents = 0;
  let usedSerper = false;
  const platforms: string[] = [];

  if (env.SERPER_API_KEY) {
    for (const pq of PLATFORM_QUERIES) {
      const query = pq.build(ctx);
      const res = await serperSearchDetailed(query, 5);
      if (!res) continue;
      usedSerper = true;
      platforms.push(pq.channel);
      digestParts.push(`## ${pq.channel}\n${res.summary}`);

      res.organic.slice(0, 2).forEach((row, i) => {
        const trend = organicToTrend(row, pq.channel, i, params.company);
        if (trend) collected.push(trend);
      });
    }
  }

  if (collected.length < 4 && env.TAVILY_API_KEY) {
    const tavily = await tavilySearch(
      `social media marketing trends ${ctx.industry} ${ctx.geography} Instagram TikTok YouTube Facebook ${ctx.year}`,
    );
    if (tavily) {
      digestParts.push(`## Tavily synthesis\n${tavily.summary}`);
      costCents += tavily.costCents;
    }
  }

  const trends = dedupeTrends(collected);
  if (trends.length === 0 && digestParts.length === 0) return null;

  return {
    trends,
    digest: digestParts.join("\n\n"),
    platforms: platforms.length ? platforms : ["Web"],
    source: usedSerper ? "serper" : "tavily",
    costCents,
    live: true,
    queried_at: new Date().toISOString(),
  };
}
