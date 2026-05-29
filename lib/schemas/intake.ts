import { z } from "zod";

const optionalText = (max: number) => z.string().max(max).default("");

export const intakeSchema = z.object({
  company: optionalText(200),
  company_type: optionalText(80),
  industry: optionalText(120),
  geography: optionalText(120),
  city: optionalText(120),
  size: optionalText(80),
  vibe: optionalText(80),
  audience: optionalText(2000),
  audience_type: optionalText(80),
  budget: optionalText(80),
  notes: optionalText(4000),
  website: optionalText(500),
  instagram: optionalText(200),
  social_links: optionalText(500),
  referral_source: optionalText(120),
  ai_tools_known: optionalText(500),
  email: z.string().max(320).default(""),
  otp: optionalText(8),
});

export type IntakePayload = z.infer<typeof intakeSchema>;

export const createRunSchema = intakeSchema.omit({ otp: true }).extend({
  demo: z.boolean().optional(),
});

export type CreateRunPayload = z.infer<typeof createRunSchema>;

const DEFAULTS = {
  company: "Untitled company",
  industry: "General",
  geography: "Global",
  vibe: "Tech-native",
  audience: "General audience",
  audience_type: "B2C",
  budget: "Not specified",
  size: "Not specified",
} as const;

/** Fill gaps so the agent pipeline always has context. */
export function normalizeIntakePayload(
  data: Omit<CreateRunPayload, "demo">,
): Omit<IntakePayload, "otp"> & { otp: "" } {
  const trim = (s: string | undefined, fallback: string) => {
    const t = (s ?? "").trim();
    return t || fallback;
  };

  return {
    company: trim(data.company, DEFAULTS.company),
    company_type: (data.company_type ?? "").trim(),
    industry: trim(data.industry, DEFAULTS.industry),
    geography: trim(data.geography, DEFAULTS.geography),
    city: (data.city ?? "").trim(),
    size: trim(data.size, DEFAULTS.size),
    vibe: trim(data.vibe, DEFAULTS.vibe),
    audience: trim(data.audience, DEFAULTS.audience),
    audience_type: trim(data.audience_type, DEFAULTS.audience_type),
    budget: trim(data.budget, DEFAULTS.budget),
    notes: (data.notes ?? "").trim(),
    website: (data.website ?? "").trim(),
    instagram: (data.instagram ?? "").trim(),
    social_links: (data.social_links ?? "").trim(),
    referral_source: (data.referral_source ?? "").trim(),
    ai_tools_known: (data.ai_tools_known ?? "").trim(),
    email: (data.email ?? "").trim(),
    otp: "",
  };
}
