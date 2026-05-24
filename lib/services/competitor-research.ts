import { env } from "@/lib/env";
import { runCompetitorScrape } from "@/lib/services/apify";
import { serperSearch } from "@/lib/services/serper";
import { tavilySearch } from "@/lib/services/tavily";

export type CompetitorResearchResult = {
  summary: string;
  costCents: number;
  source: "serper" | "tavily" | "apify";
};

function buildQuery(params: {
  company: string;
  industry: string;
  geography: string;
}): string {
  return `${params.company} ${params.industry} competitors ${params.geography}`;
}

/**
 * Free-first competitor signals for Agent 4.
 * Serper → Tavily → Apify (studio/enterprise only, when APIFY_TOKEN set).
 */
export async function runCompetitorResearch(
  params: {
    company: string;
    industry: string;
    geography: string;
    tier: string;
  },
): Promise<CompetitorResearchResult | null> {
  const query = buildQuery(params);

  const serper = await serperSearch(query);
  if (serper) {
    return { ...serper, source: "serper" };
  }

  const tavily = await tavilySearch(query);
  if (tavily) {
    return { ...tavily, source: "tavily" };
  }

  if (params.tier === "studio" || params.tier === "enterprise") {
    const apify = await runCompetitorScrape(params);
    if (apify) {
      return { ...apify, source: "apify" };
    }
  }

  return null;
}

export function isCompetitorResearchConfigured(): boolean {
  return Boolean(
    env.SERPER_API_KEY || env.TAVILY_API_KEY || env.APIFY_TOKEN,
  );
}
