import { NextResponse } from "next/server";

import { verifyCronSecret } from "@/lib/api/cron-auth";
import { dailyBossSummaryTemplate } from "@/lib/email/templates";
import { env } from "@/lib/env";

export async function GET(req: Request) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = dailyBossSummaryTemplate({
    runCount: 0,
    spendCents: 0,
    warnings: env.RESEND_API_KEY ? [] : ["Resend key not configured."],
  });

  return NextResponse.json({
    ok: true,
    to: env.BOSS_EMAIL,
    subject: email.subject,
    preview: "Resend send call wires after RESEND_API_KEY/domain setup.",
  });
}
