import { NextResponse } from "next/server";
import { z } from "zod";

import { requireUser, verifyRunOwnership } from "@/lib/auth/session";
import { isMonthlyCapExceeded } from "@/lib/services/cap";

const schema = z.object({
  run_id: z.string().uuid(),
  asset_type: z.enum(["image", "video"]),
  prompt: z.string().min(1).max(4000),
  campaign_index: z.number().int().min(0).optional(),
});

export async function POST(req: Request) {
  if (await isMonthlyCapExceeded()) {
    return NextResponse.json({ error: "Monthly API cap reached" }, { status: 429 });
  }

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid asset request" }, { status: 400 });
  }

  const auth = await requireUser();
  if (!auth.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  }

  const access = await verifyRunOwnership(parsed.data.run_id, auth.user.id);
  if (!access.ok) {
    return NextResponse.json({ error: "Not found" }, { status: access.status });
  }

  return NextResponse.json({
    queued: true,
    run_id: parsed.data.run_id,
    asset_type: parsed.data.asset_type,
    message:
      "Asset generation queue is ready; provider keys are required before paid calls run.",
  });
}
