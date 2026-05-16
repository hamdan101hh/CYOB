export type AgentContext = {
  intake: {
    company: string;
    industry: string;
    geography: string;
    city?: string;
    size?: string;
    vibe: string;
    audience?: string;
    budget?: string;
  };
  priorOutputs: Record<number, { output_json: unknown; output_text: string }>;
  tier: "free" | "spark" | "studio" | "enterprise";
};
