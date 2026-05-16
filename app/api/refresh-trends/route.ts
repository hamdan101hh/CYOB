import { NextResponse } from "next/server";
import { z } from "zod";

import { isMonthlyCapExceeded } from "@/lib/services/cap";
import { createSupabaseServerClient } from "@/lib/supabase/server";
const bodySchema = z.object({ run_id: z.string().uuid() });

export async function POST(req: Request) {
  if (await isMonthlyCapExceeded()) {
    return NextResponse.json(
      { error: "Monthly API cap reached", code: "cap_hit" },
      { status: 429 },
    );
  }

  const json: unknown = await req.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid run_id" }, { status: 400 });
  }

  const sb = await createSupabaseServerClient();
  if (!sb) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: run } = await sb
    .from("runs")
    .select("id,user_id")
    .eq("id", parsed.data.run_id)
    .maybeSingle();

  if (!run || run.user_id !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Re-run agent 02 only when Claude is wired; for now acknowledge request.
  await sb.from("trend_refreshes").insert({
    run_id: parsed.data.run_id,
    triggered_by: "manual",
    cost_cents: 0,
  });

  return NextResponse.json({ ok: true, message: "Trend refresh queued (agent 02 wiring pending keys)." });
}
