import { env } from "@/lib/env";

export async function generateImage(params: {
  prompt: string;
}): Promise<{ publicUrl: string | null; costCents: number; error?: string }> {
  if (!env.FAL_KEY) {
    return { publicUrl: null, costCents: 0, error: "FAL_KEY not configured" };
  }

  const res = await fetch("https://fal.run/fal-ai/flux/schnell", {
    method: "POST",
    headers: {
      Authorization: `Key ${env.FAL_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: params.prompt,
      image_size: "landscape_16_9",
      num_images: 1,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return {
      publicUrl: null,
      costCents: 0,
      error: `FAL error ${res.status}: ${err.slice(0, 200)}`,
    };
  }

  const json = (await res.json()) as {
    images?: Array<{ url?: string }>;
  };
  const publicUrl = json.images?.[0]?.url ?? null;
  return { publicUrl, costCents: publicUrl ? 8 : 0 };
}
