/** Pollinations.ai — no API key; URL returns a generated image. */
export function pollinationsImageUrl(prompt: string): string {
  const safe = prompt.trim().slice(0, 800);
  const encoded = encodeURIComponent(safe);
  return `https://image.pollinations.ai/prompt/${encoded}?width=1280&height=720&nologo=true`;
}

export async function generatePollinationsImage(params: {
  prompt: string;
}): Promise<{ publicUrl: string; costCents: number }> {
  const publicUrl = pollinationsImageUrl(params.prompt);
  return { publicUrl, costCents: 0 };
}
