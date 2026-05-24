import { env } from "@/lib/env";

type SerperOrganic = { title?: string; link?: string; snippet?: string };

/** Serper.dev — free tier (~2.5k searches). https://serper.dev */
export async function serperSearch(query: string): Promise<{
  summary: string;
  costCents: number;
} | null> {
  if (!env.SERPER_API_KEY) return null;

  const res = await fetch("https://google.serper.dev/search", {
    method: "POST",
    headers: {
      "X-API-KEY": env.SERPER_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ q: query, num: 5 }),
  });

  if (!res.ok) {
    console.error(`Serper error ${res.status}`);
    return null;
  }

  const json = (await res.json()) as { organic?: SerperOrganic[] };
  const lines = (json.organic ?? [])
    .slice(0, 5)
    .map((r, i) => `${i + 1}. ${r.title ?? "Result"} — ${r.link ?? ""}\n   ${r.snippet ?? ""}`)
    .join("\n");

  return {
    summary: lines || "No Serper results returned.",
    costCents: 0,
  };
}
