import {
  DUBAI_COMPARE_POOL,
  DUBAI_COMPANY_POOL,
  DUBAI_TREND_POOL,
  rotatePool,
} from "@/lib/market/dubai-pool";
import type { MarketLens } from "@/lib/market/types";

export function isUaeMarket(geography: string, city?: string): boolean {
  const g = geography.toLowerCase();
  const c = (city ?? "").toLowerCase();
  return (
    g.includes("uae") ||
    g.includes("gcc") ||
    g.includes("mena") ||
    g.includes("dubai") ||
    c.includes("dubai") ||
    c.includes("abu dhabi")
  );
}

export function getMarketLens(params: {
  geography: string;
  city?: string;
  industry?: string;
  seed?: number;
}): MarketLens {
  const seed =
    params.seed ??
    Math.floor(Date.now() / 86_400_000) + (params.industry?.length ?? 0);

  const uae = isUaeMarket(params.geography, params.city);
  const regionLabel = uae
    ? params.city?.trim() || "Dubai · UAE"
    : params.geography || "Global";

  if (!uae) {
    return {
      regionLabel,
      companies: rotatePool(DUBAI_COMPANY_POOL, 2, seed).map((c) => ({
        ...c,
        name: `${c.name} (ref)`,
      })),
      trends: rotatePool(DUBAI_TREND_POOL, 3, seed + 1),
      comparisons: rotatePool(DUBAI_COMPARE_POOL, 2, seed + 2),
      rotatedAt: new Date().toISOString(),
      source: "curated",
    };
  }

  return {
    regionLabel,
    companies: rotatePool(DUBAI_COMPANY_POOL, 3, seed),
    trends: rotatePool(DUBAI_TREND_POOL, 4, seed + 1),
    comparisons: rotatePool(DUBAI_COMPARE_POOL, 2, seed + 2),
    rotatedAt: new Date().toISOString(),
    source: "curated",
  };
}
