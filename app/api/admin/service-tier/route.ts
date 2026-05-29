import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminGate } from "@/lib/auth/require-admin-gate";
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
  const gate = await requireAdminGate();
  if (!gate.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: gate.status });
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
    updated_by: null,
    updated_at: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
