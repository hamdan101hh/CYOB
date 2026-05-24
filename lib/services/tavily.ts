import { env } from "@/lib/env";

/** Tavily — free tier for AI search. https://tavily.com */
export async function tavilySearch(query: string): Promise<{
  summary: string;
  costCents: number;
} | null> {
  if (!env.TAVILY_API_KEY) return null;

  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: env.TAVILY_API_KEY,
      query,
      max_results: 5,
      search_depth: "basic",
    }),
  });

  if (!res.ok) {
    console.error(`Tavily error ${res.status}`);
    return null;
  }

  const json = (await res.json()) as {
    results?: Array<{ title?: string; url?: string; content?: string }>;
    answer?: string;
  };

  const header = json.answer ? `Summary: ${json.answer}\n\n` : "";
  const lines = (json.results ?? [])
    .slice(0, 5)
    .map(
      (r, i) =>
        `${i + 1}. ${r.title ?? "Result"} — ${r.url ?? ""}\n   ${(r.content ?? "").slice(0, 200)}`,
    )
    .join("\n");

  return {
    summary: header + (lines || "No Tavily results returned."),
    costCents: 0,
  };
}
