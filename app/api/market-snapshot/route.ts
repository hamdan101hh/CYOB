import { NextResponse } from "next/server";

import { getMarketLens } from "@/lib/market/get-market-lens";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const geography = searchParams.get("geography") ?? "UAE";
  const city = searchParams.get("city") ?? "Dubai";
  const industry = searchParams.get("industry") ?? "";
  const seed = Number(searchParams.get("seed") ?? "0") || undefined;

  const lens = getMarketLens({ geography, city, industry, seed });
  return NextResponse.json(lens);
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    geography?: string;
    city?: string;
    industry?: string;
    seed?: number;
  };

  const supabase = await createSupabaseServerClient();
  const user = supabase
    ? (await supabase.auth.getUser()).data.user
    : null;

  const seed =
    typeof body.seed === "number"
      ? body.seed
      : Math.floor(Date.now() / 1000) % 997;

  const lens = getMarketLens({
    geography: body.geography ?? "UAE",
    city: body.city,
    industry: body.industry,
    seed: seed + 1,
  });

  if (user) {
    const { logWeeklySpend } = await import("@/lib/services/weekly-budget");
    await logWeeklySpend({
      userId: user.id,
      service: "market_snapshot_rotate",
      costFils: 0,
      notes: "curated rotation — no API charge",
    });
  }

  return NextResponse.json({ ...lens, nextSeed: seed + 1 });
}
