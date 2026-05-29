import { z } from "zod";

export const promptSceneSchema = z.object({
  id: z.number().int().positive(),
  startSec: z.number().min(0),
  endSec: z.number().positive(),
  visual: z.string().min(1),
  camera: z.string().optional(),
  mood: z.string().optional(),
});

export const studioPlanSchema = z.object({
  summary: z.string(),
  imagePrompt: z.string().min(10),
  videoPrompt: z.string().min(10),
  scenes: z.array(promptSceneSchema).min(1).max(8),
});

export type PromptScene = z.infer<typeof promptSceneSchema>;
export type StudioPlan = z.infer<typeof studioPlanSchema>;

export const enhancePromptRequestSchema = z.object({
  roughPrompt: z.string().min(3).max(2000),
  assetType: z.enum(["image", "video", "both"]).default("both"),
  company: z.string().optional(),
  industry: z.string().optional(),
  vibe: z.string().optional(),
  campaignName: z.string().optional(),
});

export const generateAssetsRequestSchema = z.object({
  imagePrompt: z.string().min(10).optional(),
  videoPrompt: z.string().min(10).optional(),
  skipVideo: z.boolean().optional(),
});
