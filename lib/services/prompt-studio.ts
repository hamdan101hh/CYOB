import { studioPlanSchema, type StudioPlan } from "@/lib/schemas/asset-prompt";
import { completeAgentText, isLlmConfigured } from "@/lib/services/llm";

function fallbackPlan(params: {
  roughPrompt: string;
  company?: string;
  vibe?: string;
}): StudioPlan {
  const base = params.roughPrompt.trim();
  const brand = [params.vibe, params.company].filter(Boolean).join(" · ");

  return {
    summary: "Scene plan (offline template — add LLM key for AI refinement).",
    imagePrompt: `${base}. Premium advertising still, cinematic lighting, ${brand}. No text, no watermark, 16:9.`,
    videoPrompt: `${base}. 5 second social ad, ${brand}. Smooth camera motion, no on-screen text.`,
    scenes: [
      {
        id: 1,
        startSec: 0,
        endSec: 2,
        visual: "Opening hook — product or hero subject enters frame",
        camera: "Wide establishing",
        mood: "Confident",
      },
      {
        id: 2,
        startSec: 2,
        endSec: 4,
        visual: base.slice(0, 120),
        camera: "Medium push-in",
        mood: "Energetic",
      },
      {
        id: 3,
        startSec: 4,
        endSec: 5,
        visual: "Brand moment — logo-safe negative space, CTA-ready end frame",
        camera: "Static hero",
        mood: "Premium",
      },
    ],
  };
}

export async function buildStudioPlan(params: {
  roughPrompt: string;
  assetType: "image" | "video" | "both";
  company?: string;
  industry?: string;
  vibe?: string;
  campaignName?: string;
}): Promise<{ plan: StudioPlan; live: boolean; costCents: number }> {
  if (!isLlmConfigured()) {
    return { plan: fallbackPlan(params), live: false, costCents: 0 };
  }

  const llm = await completeAgentText({
    system: `You are a creative director for ad production. Output ONLY valid JSON matching this shape:
{
  "summary": "one sentence",
  "imagePrompt": "single detailed still-image prompt for Flux/fal",
  "videoPrompt": "single 5-second video prompt for Seedance with motion cues",
  "scenes": [
    { "id": 1, "startSec": 0, "endSec": 2, "visual": "...", "camera": "...", "mood": "..." }
  ]
}
Rules:
- 3 to 5 scenes for video, total duration 5 seconds unless user asks longer
- No on-screen text in visuals
- Be specific: lighting, subject, environment, motion
- imagePrompt and videoPrompt must be production-ready, not meta commentary`,
    user: [
      `Rough idea: ${params.roughPrompt}`,
      `Asset focus: ${params.assetType}`,
      params.company ? `Company: ${params.company}` : "",
      params.industry ? `Industry: ${params.industry}` : "",
      params.vibe ? `Brand vibe: ${params.vibe}` : "",
      params.campaignName ? `Campaign: ${params.campaignName}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
  });

  if (!llm?.text) {
    return {
      plan: fallbackPlan(params),
      live: false,
      costCents: llm?.costCents ?? 0,
    };
  }

  try {
    const jsonStart = llm.text.indexOf("{");
    const jsonEnd = llm.text.lastIndexOf("}");
    const raw = JSON.parse(llm.text.slice(jsonStart, jsonEnd + 1)) as unknown;
    const parsed = studioPlanSchema.safeParse(raw);
    if (parsed.success) {
      return { plan: parsed.data, live: true, costCents: llm.costCents };
    }
  } catch {
    /* fall through */
  }

  return {
    plan: fallbackPlan(params),
    live: false,
    costCents: llm.costCents,
  };
}
