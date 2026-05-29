import { env } from "@/lib/env";
import { resolveActiveStack } from "@/lib/integrations/active-stack";
import { CYOB_CORE_PROVIDERS } from "@/lib/integrations/registry";
import { getWeeklySpendFils, weeklyBudgetFils } from "@/lib/services/weekly-budget";

function isConfigured(envKeys: string[]): boolean {
  const map: Record<string, string | undefined> = {
    ANTHROPIC_API_KEY: env.ANTHROPIC_API_KEY,
    OPENAI_API_KEY: env.OPENAI_API_KEY,
    GEMINI_API_KEY: env.GEMINI_API_KEY,
    SERPER_API_KEY: env.SERPER_API_KEY,
    TAVILY_API_KEY: env.TAVILY_API_KEY,
    FAL_KEY: env.FAL_KEY,
    RESEND_API_KEY: env.RESEND_API_KEY,
  };
  return envKeys.every((k) => Boolean(map[k]?.trim()));
}

export async function getIntegrationsStatus() {
  const providers = CYOB_CORE_PROVIDERS.map((p) => ({
    ...p,
    configured: isConfigured(p.envKeys),
  }));

  const coreFive = providers.filter((p) => p.step <= 5);
  const coreConnected = coreFive.filter((p) => p.configured).length;

  const stack = resolveActiveStack();
  const weeklyBudgetAed = weeklyBudgetFils() / 100;
  const weeklySpentAed = (await getWeeklySpendFils()) / 100;

  const envTemplate = `# Paste into .env.local and Vercel Production
ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=claude-sonnet-4-6
GEMINI_API_KEY=
SERPER_API_KEY=
FAL_KEY=
RESEND_API_KEY=
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
LLM_PROVIDER=openai
TAVILY_API_KEY=
APIFY_TOKEN=
ENABLE_SEEDANCE_VIDEO=true
WEEKLY_BUDGET_AED=300
`;

  return {
    providers,
    coreConnected,
    coreTotal: 5,
    stack,
    budget: {
      weeklyLimitAed: weeklyBudgetAed,
      weeklySpentAed: weeklySpentAed,
      weeklyRemainingAed: Math.max(0, weeklyBudgetAed - weeklySpentAed),
    },
    envTemplate,
    deployUrl: "https://vercel.com/dashboard",
  };
}
