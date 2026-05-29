import { env } from "@/lib/env";

/** ByteDance Seedance via fal — short clips for Library concept B. */
const SEEDANCE_LITE_T2V = "fal-ai/bytedance/seedance/v1/lite/text-to-video";

export async function generateSeedanceVideo(params: {
  prompt: string;
}): Promise<{ publicUrl: string | null; costCents: number; error?: string }> {
  if (!env.FAL_KEY) {
    return { publicUrl: null, costCents: 0, error: "FAL_KEY not set (Seedance uses fal)" };
  }

  if (process.env.ENABLE_SEEDANCE_VIDEO === "false") {
    return { publicUrl: null, costCents: 0, error: "Seedance disabled (ENABLE_SEEDANCE_VIDEO=false)" };
  }

  try {
    const res = await fetch(`https://fal.run/${SEEDANCE_LITE_T2V}`, {
      method: "POST",
      headers: {
        Authorization: `Key ${env.FAL_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: params.prompt,
        aspect_ratio: "16:9",
        resolution: "720p",
        duration: "5",
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return {
        publicUrl: null,
        costCents: 0,
        error: `Seedance ${res.status}: ${err.slice(0, 200)}`,
      };
    }

    const json = (await res.json()) as {
      video?: { url?: string };
      output?: { video?: { url?: string } };
    };
    const publicUrl =
      json.video?.url ?? json.output?.video?.url ?? null;

    return {
      publicUrl,
      costCents: publicUrl ? 18 : 0,
    };
  } catch (e) {
    return {
      publicUrl: null,
      costCents: 0,
      error: e instanceof Error ? e.message : "Seedance request failed",
    };
  }
}
