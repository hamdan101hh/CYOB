import { z } from "zod";

export const intakeSchema = z.object({
  company: z.string().min(1, "Company is required").max(200),
  industry: z.string().min(1).max(120),
  geography: z.string().min(1).max(120),
  city: z.string().max(120),
  size: z.string().min(1).max(80),
  vibe: z.string().min(1).max(80),
  audience: z.string().min(1).max(2000),
  audience_type: z.string().min(1).max(80),
  budget: z.string().min(1).max(80),
  notes: z.string().max(4000),
  email: z.string().email(),
  /** Empty until verify step; length checked in submit handler when using OTP */
  otp: z.string().max(6),
});

export type IntakePayload = z.infer<typeof intakeSchema>;

export const createRunSchema = intakeSchema.omit({ otp: true }).extend({
  demo: z.boolean().optional(),
});

export type CreateRunPayload = z.infer<typeof createRunSchema>;
