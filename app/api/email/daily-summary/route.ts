import { NextResponse } from "next/server";

import { verifyCronSecret } from "@/lib/api/cron-auth";
import { dailyBossSummaryTemplate } from "@/lib/email/templates";
import { createSupabaseAdminClientOrNull } from "@/lib/db/supabase-admin";
import { env } from "@/lib/env";

export async function GET(req: Request) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createSupabaseAdminClientOrNull();
  let runCount = 0;
  let spendCents = 0;
  const warnings: string[] = [];

  if (admin) {
    const since = new Date();
    since.setHours(0, 0, 0, 0);

    const { count } = await admin
      .from("runs")
      .select("id", { count: "exact", head: true })
      .gte("created_at", since.toISOString());

    runCount = count ?? 0;

    const { data: spendRows } = await admin
      .from("spending_log")
      .select("cost_cents")
      .gte("created_at", since.toISOString());

    spendCents = (spendRows ?? []).reduce(
      (sum, r) => sum + (r.cost_cents as number),
      0,
    );
  } else {
    warnings.push("Supabase service role not configured.");
  }

  if (!env.RESEND_API_KEY) {
    warnings.push("Resend key not configured — email not sent.");
  }
  if (!env.BOSS_EMAIL) {
    warnings.push("BOSS_EMAIL not set.");
  }

  const email = dailyBossSummaryTemplate({
    runCount,
    spendCents,
    warnings,
  });

  return NextResponse.json({
    ok: true,
    to: env.BOSS_EMAIL,
    subject: email.subject,
    html: email.html,
    sent: false,
    preview: env.RESEND_API_KEY
      ? "Wire Resend send when ready."
      : "Preview only until RESEND_API_KEY is set.",
  });
}
