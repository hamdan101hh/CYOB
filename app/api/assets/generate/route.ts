import { NextResponse } from "next/server";
import { z } from "zod";

import { requireUser, verifyRunOwnership } from "@/lib/auth/session";
import { createSupabaseAdminClientOrNull } from "@/lib/db/supabase-admin";
import { generateImage } from "@/lib/services/fal";
import { generatePollinationsImage } from "@/lib/services/pollinations";
import { generateSeedanceVideo } from "@/lib/services/seedance";
import { isMonthlyCapExceeded, logSpending } from "@/lib/services/cap";

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

  const admin = createSupabaseAdminClientOrNull();
  if (!admin) {
    return NextResponse.json(
      { error: "Supabase admin not configured" },
      { status: 503 },
    );
  }

  let publicUrl: string | null = null;
  let costCents = 0;
  let providerError: string | undefined;

  if (parsed.data.asset_type === "image") {
    const fal = await generateImage({ prompt: parsed.data.prompt });
    if (fal.publicUrl) {
      publicUrl = fal.publicUrl;
      costCents = fal.costCents;
    } else {
      const free = await generatePollinationsImage({
        prompt: parsed.data.prompt,
      });
      publicUrl = free.publicUrl;
      costCents = free.costCents;
      if (fal.error) providerError = fal.error;
    }
  } else {
    const video = await generateSeedanceVideo({ prompt: parsed.data.prompt });
    if (video.publicUrl) {
      publicUrl = video.publicUrl;
      costCents = video.costCents;
    } else if (video.error) {
      providerError = video.error;
    }
  }

  const { data: row } = await admin
    .from("generated_assets")
    .insert({
      run_id: parsed.data.run_id,
      asset_type: parsed.data.asset_type,
      campaign_index: parsed.data.campaign_index ?? 0,
      prompt: parsed.data.prompt,
      public_url: publicUrl,
      storage_path: publicUrl ? null : "pending",
      cost_cents: costCents,
    })
    .select("id,public_url,asset_type")
    .single();

  if (costCents > 0) {
    await logSpending({
      userId: auth.user.id,
      runId: parsed.data.run_id,
      service:
        parsed.data.asset_type === "video"
          ? "seedance"
          : costCents > 0
            ? "fal"
            : "pollinations",
      costCents,
    });
  }

  return NextResponse.json({
    queued: true,
    asset_id: row?.id,
    public_url: publicUrl,
    run_id: parsed.data.run_id,
    asset_type: parsed.data.asset_type,
    message: publicUrl
      ? "Asset generated."
      : providerError ??
        (parsed.data.asset_type === "video"
          ? "Add FAL_KEY for Seedance video, or set ENABLE_SEEDANCE_VIDEO=false to skip."
          : "Image URL ready (Pollinations free tier; add FAL_KEY for Flux)."),
  });
}
