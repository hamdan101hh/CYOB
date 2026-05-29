import { env } from "@/lib/env";

export type SerperOrganic = {
  title?: string;
  link?: string;
  snippet?: string;
};

export type SerperSearchResult = {
  summary: string;
  organic: SerperOrganic[];
  costCents: number;
};

/** Serper.dev — Google search API. https://serper.dev */
export async function serperSearch(query: string): Promise<{
  summary: string;
  costCents: number;
} | null> {
  const full = await serperSearchDetailed(query);
  if (!full) return null;
  return { summary: full.summary, costCents: full.costCents };
}

export async function serperSearchDetailed(
  query: string,
  num = 6,
): Promise<SerperSearchResult | null> {
  if (!env.SERPER_API_KEY) return null;

  const res = await fetch("https://google.serper.dev/search", {
    method: "POST",
    headers: {
      "X-API-KEY": env.SERPER_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ q: query, num }),
  });

  if (!res.ok) {
    console.error(`Serper error ${res.status}`);
    return null;
  }

  const json = (await res.json()) as { organic?: SerperOrganic[] };
  const organic = json.organic ?? [];
  const lines = organic
    .slice(0, num)
    .map(
      (r, i) =>
        `${i + 1}. ${r.title ?? "Result"} — ${r.link ?? ""}\n   ${r.snippet ?? ""}`,
    )
    .join("\n");

  return {
    summary: lines || "No Serper results returned.",
    organic,
    costCents: 0,
  };
}
