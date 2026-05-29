export type ProviderTier = "essential" | "recommended" | "optional";

export type ProviderDefinition = {
  id: string;
  name: string;
  role: string;
  tier: ProviderTier;
  envKeys: string[];
  /** Vercel / local env names to set */
  setupHint: string;
  topUpUrl: string;
  docsUrl: string;
  pricingNote: string;
  usedFor: string[];
  step: number;
};

/** Core stack for cyob — connect in order (steps 1–5). */
export const CYOB_CORE_PROVIDERS: ProviderDefinition[] = [
  {
    id: "anthropic",
    name: "Anthropic (Claude)",
    role: "Primary war-room text (10 agents)",
    tier: "essential",
    envKeys: ["ANTHROPIC_API_KEY"],
    setupHint:
      "platform.anthropic.com → API keys. Optional: ANTHROPIC_MODEL=claude-sonnet-4-6 for best quality.",
    topUpUrl: "https://console.anthropic.com/settings/billing",
    docsUrl: "https://platform.claude.com/docs/en/about-claude/pricing",
    pricingNote: "Haiku ~$1/$5 per 1M tokens · Sonnet ~$3/$15 (recommended)",
    usedFor: ["All agents", "Trend refresh", "Synthesis"],
    step: 1,
  },
  {
    id: "gemini",
    name: "Google Gemini",
    role: "Backup LLM when Claude/OpenAI absent",
    tier: "essential",
    envKeys: ["GEMINI_API_KEY"],
    setupHint: "aistudio.google.com/apikey → GEMINI_API_KEY",
    topUpUrl: "https://aistudio.google.com/apikey",
    docsUrl: "https://ai.google.dev/gemini-api/docs/pricing",
    pricingNote: "2.0 Flash: free tier + ~$0.10/$0.40 per 1M paid",
    usedFor: ["Agent fallback", "Low-cost runs"],
    step: 2,
  },
  {
    id: "serper",
    name: "Serper",
    role: "Live trend scan (IG/TikTok/FB/YouTube) + competitor search",
    tier: "essential",
    envKeys: ["SERPER_API_KEY"],
    setupHint: "serper.dev → API key → SERPER_API_KEY",
    topUpUrl: "https://serper.dev/",
    docsUrl: "https://serper.dev/",
    pricingNote: "2,500 free · then $50 / 50k searches",
    usedFor: ["Competitor scout", "Live research"],
    step: 3,
  },
  {
    id: "fal",
    name: "fal.ai (Flux)",
    role: "Hero campaign images in Library",
    tier: "recommended",
    envKeys: ["FAL_KEY"],
    setupHint: "fal.ai dashboard → API key → FAL_KEY",
    topUpUrl: "https://fal.ai/dashboard/billing",
    docsUrl: "https://fal.ai/pricing",
    pricingNote: "Flux schnell ~$0.003–0.01 / image · Pollinations free if unset",
    usedFor: ["Campaign assets", "Library frames"],
    step: 4,
  },
  {
    id: "resend",
    name: "Resend",
    role: "Login OTP (SMTP) + boss digest email",
    tier: "essential",
    envKeys: ["RESEND_API_KEY"],
    setupHint:
      "resend.com API key → RESEND_API_KEY + Supabase Auth SMTP (see docs/SUPABASE_SMTP_FIX.md)",
    topUpUrl: "https://resend.com/billing",
    docsUrl: "https://resend.com/pricing",
    pricingNote: "Free tier for dev · paid from ~$20/mo at scale",
    usedFor: ["Login codes", "Daily summary cron"],
    step: 5,
  },
  {
    id: "openai",
    name: "OpenAI (ChatGPT)",
    role: "ChatGPT agents — set LLM_PROVIDER=openai to use first",
    tier: "recommended",
    envKeys: ["OPENAI_API_KEY"],
    setupHint:
      "platform.openai.com → OPENAI_API_KEY. Optional: OPENAI_MODEL=gpt-4o and LLM_PROVIDER=openai",
    topUpUrl: "https://platform.openai.com/settings/organization/billing",
    docsUrl: "https://developers.openai.com/api/docs/pricing",
    pricingNote: "gpt-4o-mini cheap · gpt-4o best quality",
    usedFor: ["All agents when preferred"],
    step: 6,
  },
  {
    id: "seedance",
    name: "Seedance video",
    role: "Short video clips in Library (uses same FAL_KEY)",
    tier: "recommended",
    envKeys: ["FAL_KEY"],
    setupHint:
      "Same fal.ai key as images. ENABLE_SEEDANCE_VIDEO=true (default). Uses lite 5s clips.",
    topUpUrl: "https://fal.ai/dashboard/billing",
    docsUrl: "https://fal.ai/models/bytedance/seedance/v1/lite/text-to-video",
    pricingNote: "~$0.18 per 5s clip — use sparingly",
    usedFor: ["Library Concept B video"],
    step: 7,
  },
  {
    id: "tavily",
    name: "Tavily",
    role: "Search fallback if Serper fails",
    tier: "optional",
    envKeys: ["TAVILY_API_KEY"],
    setupHint: "tavily.com → TAVILY_API_KEY",
    topUpUrl: "https://tavily.com/pricing",
    docsUrl: "https://docs.tavily.com/documentation/api-credits",
    pricingNote: "1,000 credits/mo free · ~$0.008/credit",
    usedFor: ["Agent 4 backup search"],
    step: 8,
  },
  {
    id: "apify",
    name: "Apify",
    role: "Deep web scrape (expensive — studio tier)",
    tier: "optional",
    envKeys: ["APIFY_TOKEN"],
    setupHint: "apify.com → API token → APIFY_TOKEN",
    topUpUrl: "https://console.apify.com/billing",
    docsUrl: "https://apify.com/pricing",
    pricingNote: "$29/mo+ · only if Serper is not enough",
    usedFor: ["Agent 4 heavy research"],
    step: 9,
  },
];

export const CORE_STEP_COUNT = 5;

export const PREMIUM_PROVIDERS = CYOB_CORE_PROVIDERS.filter((p) => p.step >= 6);
