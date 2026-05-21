import { NextResponse } from "next/server";

import { verifyCronSecret } from "@/lib/api/cron-auth";
import { createSupabaseAdminClientOrNull } from "@/lib/db/supabase-admin";
import { executeRunPipeline } from "@/lib/orchestrator/run-pipeline";

export async function GET(req: Request) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createSupabaseAdminClientOrNull();
  if (!admin) {
    return NextResponse.json({
      ok: true,
      job: "weekly-refresh",
      refreshed: 0,
    });
  }

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const { data: runs } = await admin
    .from("runs")
    .select("id")
    .eq("status", "complete")
    .gte("completed_at", weekAgo.toISOString())
    .order("completed_at", { ascending: false })
    .limit(10);

  const ids = (runs ?? []).map((r) => r.id as string);
  for (const runId of ids) {
    await executeRunPipeline(runId);
  }

  return NextResponse.json({
    ok: true,
    job: "weekly-refresh",
    refreshed: ids.length,
    runIds: ids,
  });
}
