import { NextResponse } from "next/server";

import { verifyCronSecret } from "@/lib/api/cron-auth";
import { isMonthlyCapExceeded } from "@/lib/services/cap";

export async function GET(req: Request) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const exceeded = await isMonthlyCapExceeded();
  return NextResponse.json({ exceeded });
}
