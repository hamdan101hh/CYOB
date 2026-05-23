# cyob — Hamdan batch checklist

## Live

- **Site:** https://cyob.site (Next.js app)
- **Vercel:** `cyob-k28y` — env vars + Next.js configured
- **Branch:** `production`

## Your batch (~5 min)

**Fast path:** `node scripts/supabase-batch.mjs` (needs `SUPABASE_ACCESS_TOKEN`) — see `docs/CONTINUE_BATCH.md`

**Or Supabase dashboard:**

1. Apply migration `supabase/migrations/000002_runs_created_at_and_policies.sql` (SQL editor or script)
2. **Authentication → URL Configuration** — Site URL + redirect URLs (see below)
3. Test magic link at https://cyob.site/login

```text
Site URL: https://cyob.site

Redirect URLs:
https://cyob.site/auth/callback
https://www.cyob.site/auth/callback
https://cyob-k28y.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

**Security:** rotate Supabase `service_role` before public launch.

---

## Agent work (latest — code shipped)

| Area | What |
|------|------|
| Run UX | Dashboard shows agents 1–10; plan uses real priorities/horizons; library parses 4 campaigns |
| Runs hub | Company names + status badges on dashboard/plan/library index |
| Tier lock | Upgrade links to `/pricing`; agent 1 preview on free tier |
| Prompts | All 10 agent preambles wired into mock pipeline (`buildAgentPrompt`) |
| Admin | Cap meter + service tier editor UI |
| Crons | Daily/weekly refresh re-run pipelines; boss email aggregates real counts |
| Intake | Progress bar, localStorage draft, admin bootstrap on OTP verify |
| Auth | Middleware session refresh; protected routes; logout server action |
| SEO | `robots.txt`, `sitemap.xml`, Open Graph metadata |
| API | Rate limits on runs/waitlist/enterprise; PDF returns `print_url` |
| Print | `/plan/[runId]?print=1` print stylesheet |
| Migration | `000002` — `runs.created_at`, trend refresh RLS, waitlist dedupe |

**Paid integrations wired in code** (`c3e03e0`): Stripe Checkout + webhook, Resend boss email, Claude/OpenAI agents, FAL images, Apify scrape (studio+). They activate when Vercel env keys are set; mocks remain as fallback.

Docs: `docs/VERCEL_5MIN.md`, `docs/ONE_COMMAND_DEPLOY.md`
