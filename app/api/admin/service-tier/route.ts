import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/admin";
import { createSupabaseAdminClientOrNull } from "@/lib/db/supabase-admin";

const schema = z.object({
  service: z.enum([
    "claude",
    "gpt",
    "gemini",
    "serper",
    "tavily",
    "fal",
    "pollinations",
    "dalle",
    "seedance",
    "apify",
  ]),
  next_tier: z.string().min(1).max(80),
  monthly_cost_cents: z.number().int().nonnegative().default(0),
});

export async function POST(req: Request) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: adminCheck.status });
  }

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClientOrNull();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase service role not configured" }, { status: 503 });
  }

  await supabase.from("service_tiers").upsert({
    id: parsed.data.service,
    current_tier: parsed.data.next_tier,
    monthly_cost_cents: parsed.data.monthly_cost_cents,
    updated_by: adminCheck.userId,
    updated_at: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
