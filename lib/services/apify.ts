import { env } from "@/lib/env";

export async function runCompetitorScrape(params: {
  company: string;
  industry: string;
  geography: string;
}): Promise<{ summary: string; costCents: number } | null> {
  if (!env.APIFY_TOKEN) return null;

  const query = `${params.company} ${params.industry} competitors ${params.geography}`;
  const url = new URL("https://api.apify.com/v2/acts/apify~google-search-scraper/run-sync-get-dataset-items");
  url.searchParams.set("token", env.APIFY_TOKEN);
  url.searchParams.set("format", "json");

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      queries: query,
      maxPagesPerQuery: 1,
      resultsPerPage: 5,
    }),
  });

  if (!res.ok) {
    return {
      summary: `Apify scrape failed (${res.status}). Using pipeline context only.`,
      costCents: 0,
    };
  }

  const items = (await res.json()) as Array<{ title?: string; url?: string }>;
  const lines = items
    .slice(0, 5)
    .map((i, idx) => `${idx + 1}. ${i.title ?? "Result"} — ${i.url ?? ""}`)
    .join("\n");

  return {
    summary: lines || "No competitor URLs returned from Apify.",
    costCents: 15,
  };
}
