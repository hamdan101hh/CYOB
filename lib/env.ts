import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  skipValidation:
    Boolean(process.env.SKIP_ENV_VALIDATION) ||
    process.env.npm_lifecycle_event === "lint",
  server: {
    CRON_SECRET: z.string().min(1).optional(),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
    ANTHROPIC_API_KEY: z.string().min(1).optional(),
    OPENAI_API_KEY: z.string().min(1).optional(),
    FAL_KEY: z.string().min(1).optional(),
    APIFY_TOKEN: z.string().min(1).optional(),
    RESEND_API_KEY: z.string().min(1).optional(),
    STRIPE_SECRET_KEY: z.string().min(1).optional(),
    STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),
    STRIPE_PRICE_SPARK_MONTHLY: z.string().min(1).optional(),
    STRIPE_PRICE_SPARK_ANNUAL: z.string().min(1).optional(),
    STRIPE_PRICE_STUDIO_MONTHLY: z.string().min(1).optional(),
    STRIPE_PRICE_STUDIO_ANNUAL: z.string().min(1).optional(),
    STRIPE_PRICE_ONE_TIME_REPORT: z.string().min(1).optional(),
    SENTRY_DSN: z.string().optional(),
    ADMIN_EMAILS: z.string().optional(),
    BOSS_EMAIL: z.union([z.string().email(), z.literal("")]).optional(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1).optional(),
  },
  runtimeEnv: {
    CRON_SECRET: process.env.CRON_SECRET,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    FAL_KEY: process.env.FAL_KEY,
    APIFY_TOKEN: process.env.APIFY_TOKEN,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    STRIPE_PRICE_SPARK_MONTHLY: process.env.STRIPE_PRICE_SPARK_MONTHLY,
    STRIPE_PRICE_SPARK_ANNUAL: process.env.STRIPE_PRICE_SPARK_ANNUAL,
    STRIPE_PRICE_STUDIO_MONTHLY: process.env.STRIPE_PRICE_STUDIO_MONTHLY,
    STRIPE_PRICE_STUDIO_ANNUAL: process.env.STRIPE_PRICE_STUDIO_ANNUAL,
    STRIPE_PRICE_ONE_TIME_REPORT: process.env.STRIPE_PRICE_ONE_TIME_REPORT,
    SENTRY_DSN: process.env.SENTRY_DSN,
    ADMIN_EMAILS: process.env.ADMIN_EMAILS,
    BOSS_EMAIL: process.env.BOSS_EMAIL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  },
});
