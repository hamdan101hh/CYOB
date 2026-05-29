import { NextResponse } from "next/server";

import { requireUser, verifyRunOwnership } from "@/lib/auth/session";
import { getRunBundle } from "@/lib/data/get-run";
import { parseRunDisplay } from "@/lib/data/parse-run-display";
import { generateAssetsRequestSchema } from "@/lib/schemas/asset-prompt";
import { ensureCampaignAssets } from "@/lib/services/campaign-assets";

export async function POST(
  req: Request,
  context: { params: Promise<{ runId: string }> },
) {
  const { runId } = await context.params;
  const auth = await requireUser();
  if (!auth.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  }

  const access = await verifyRunOwnership(runId, auth.user.id);
  if (!access.ok) {
    return NextResponse.json({ error: "Not found" }, { status: access.status });
  }

  const bundle = await getRunBundle(runId);
  if (!bundle) {
    return NextResponse.json({ error: "Run not found" }, { status: 404 });
  }
  const body: unknown = await req.json().catch(() => ({}));
  const parsedBody = generateAssetsRequestSchema.safeParse(body);

  const display = parseRunDisplay(bundle);
  const created = await ensureCampaignAssets({
    runId,
    userId: auth.user.id,
    company: bundle.intake.company,
    industry: bundle.intake.industry,
    vibe: bundle.intake.vibe,
    campaigns: display.campaigns,
    imagePrompt: parsedBody.success ? parsedBody.data.imagePrompt : undefined,
    videoPrompt: parsedBody.success ? parsedBody.data.videoPrompt : undefined,
    skipVideo: parsedBody.success ? parsedBody.data.skipVideo : undefined,
  });

  return NextResponse.json({ ok: true, created });
}
