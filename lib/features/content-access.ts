import type { AgentContext } from "@/lib/agents/context";

/**
 * When true, all run views are fully visible (no blur / upgrade overlays).
 * Set to `false` when you want free-tier locks back.
 */
export const UNLOCK_ALL_CONTENT = true;

export function isRunContentLocked(tier: string): boolean {
  if (UNLOCK_ALL_CONTENT) return false;
  return tier === "free";
}

/** Pipeline features (e.g. Apify on agent 4) follow this tier while unlocked. */
export function effectivePipelineTier(
  tier: AgentContext["tier"],
): AgentContext["tier"] {
  if (UNLOCK_ALL_CONTENT) return "studio";
  return tier;
}
