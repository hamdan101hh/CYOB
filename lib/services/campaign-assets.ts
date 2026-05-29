import type { CampaignItem } from "@/lib/data/parse-run-display";
import { createSupabaseAdminClientOrNull } from "@/lib/db/supabase-admin";
import { generateImage } from "@/lib/services/fal";
import { generatePollinationsImage } from "@/lib/services/pollinations";
import { generateSeedanceVideo } from "@/lib/services/seedance";
import { logSpending } from "@/lib/services/cap";

async function createImageAsset(params: {
  runId: string;
  campaignIndex: number;
  prompt: string;
  userId?: string;
}): Promise<string | null> {
  const admin = createSupabaseAdminClientOrNull();
  if (!admin) return null;

  const fal = await generateImage({ prompt: params.prompt });
  let publicUrl = fal.publicUrl;
  let costCents = fal.costCents;
  if (!publicUrl) {
    const free = await generatePollinationsImage({ prompt: params.prompt });
    publicUrl = free.publicUrl;
    costCents = free.costCents;
  }
  if (!publicUrl) return null;

  await admin.from("generated_assets").insert({
    run_id: params.runId,
    asset_type: "image",
    campaign_index: params.campaignIndex,
    prompt: params.prompt,
    public_url: publicUrl,
    storage_path: null,
    cost_cents: costCents,
  });

  if (params.userId && costCents > 0) {
    await logSpending({
      userId: params.userId,
      runId: params.runId,
      service: costCents > 0 ? "fal" : "pollinations",
      costCents,
    });
  }

  return publicUrl;
}

async function createVideoAsset(params: {
  runId: string;
  campaignIndex: number;
  prompt: string;
  userId?: string;
}): Promise<string | null> {
  const admin = createSupabaseAdminClientOrNull();
  if (!admin) return null;

  const video = await generateSeedanceVideo({ prompt: params.prompt });
  if (!video.publicUrl) return null;

  await admin.from("generated_assets").insert({
    run_id: params.runId,
    asset_type: "video",
    campaign_index: params.campaignIndex,
    prompt: params.prompt,
    public_url: video.publicUrl,
    storage_path: null,
    cost_cents: video.costCents,
  });

  if (params.userId && video.costCents > 0) {
    await logSpending({
      userId: params.userId,
      runId: params.runId,
      service: "seedance",
      costCents: video.costCents,
    });
  }

  return video.publicUrl;
}

function campaignPrompt(
  company: string,
  vibe: string,
  industry: string,
  campaign: CampaignItem,
  variant: "hero" | "alt",
): string {
  const base = `${vibe} ${industry} brand, ${company}, campaign "${campaign.name}"`;
  if (variant === "hero") {
    return `${base}, cinematic hero key visual: ${campaign.big_idea ?? campaign.name}. Premium advertising photography, no text, no watermark`;
  }
  return `${base}, short ad clip storyboard: ${campaign.big_idea ?? campaign.name}. Dynamic motion, social ad, no text`;
}

/** Generate hero image + optional Seedance clip per campaign when missing. */
export async function ensureCampaignAssets(params: {
  runId: string;
  userId?: string;
  company: string;
  industry: string;
  vibe: string;
  campaigns: CampaignItem[];
  /** User-approved prompts from prompt studio */
  imagePrompt?: string;
  videoPrompt?: string;
  skipVideo?: boolean;
}): Promise<number> {
  const admin = createSupabaseAdminClientOrNull();
  if (!admin) return 0;

  let created = 0;
  const list =
    params.campaigns.length > 0
      ? params.campaigns
      : [
          { name: "Hero launch", big_idea: "Proof-led brand story" },
          { name: "Social sprint", big_idea: "Short-form POV series" },
        ];

  const videoEnabled = process.env.ENABLE_SEEDANCE_VIDEO !== "false";

  for (let i = 0; i < Math.min(list.length, 4); i++) {
    const campaign = list[i]!;

    const { count: heroCount } = await admin
      .from("generated_assets")
      .select("id", { count: "exact", head: true })
      .eq("run_id", params.runId)
      .eq("campaign_index", i)
      .eq("asset_type", "image");

    if (!heroCount) {
      const prompt =
        i === 0 && params.imagePrompt
          ? params.imagePrompt
          : campaignPrompt(
              params.company,
              params.vibe,
              params.industry,
              campaign,
              "hero",
            );
      const url = await createImageAsset({
        runId: params.runId,
        campaignIndex: i,
        prompt,
        userId: params.userId,
      });
      if (url) created += 1;
    }

    if (!videoEnabled || i > 0 || params.skipVideo) continue;

    const { count: videoCount } = await admin
      .from("generated_assets")
      .select("id", { count: "exact", head: true })
      .eq("run_id", params.runId)
      .eq("campaign_index", i)
      .eq("asset_type", "video");

    if (!videoCount) {
      const prompt =
        params.videoPrompt ??
        campaignPrompt(
          params.company,
          params.vibe,
          params.industry,
          campaign,
          "alt",
        );
      const url = await createVideoAsset({
        runId: params.runId,
        campaignIndex: i,
        prompt,
        userId: params.userId,
      });
      if (url) created += 1;
    }
  }

  return created;
}
