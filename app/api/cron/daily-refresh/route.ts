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
      job: "daily-refresh",
      refreshed: 0,
      message: "Supabase admin not configured.",
    });
  }

  const { data: users } = await admin
    .from("users")
    .select("id")
    .in("tier", ["studio", "enterprise"]);

  const userIds = (users ?? []).map((u) => u.id as string);
  if (userIds.length === 0) {
    return NextResponse.json({
      ok: true,
      job: "daily-refresh",
      refreshed: 0,
      message: "No studio/enterprise users.",
    });
  }

  const { data: runs } = await admin
    .from("runs")
    .select("id")
    .in("user_id", userIds)
    .eq("status", "complete")
    .order("completed_at", { ascending: false })
    .limit(5);

  const ids = (runs ?? []).map((r) => r.id as string);
  for (const runId of ids) {
    await executeRunPipeline(runId);
  }

  return NextResponse.json({
    ok: true,
    job: "daily-refresh",
    refreshed: ids.length,
    runIds: ids,
  });
}
