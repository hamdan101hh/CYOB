import { NextResponse } from "next/server";

import { verifyCronSecret } from "@/lib/api/cron-auth";

export async function GET(req: Request) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    job: "weekly-refresh",
    message: "Studio tier auto-refresh runs when Supabase + agents are live.",
  });
}
