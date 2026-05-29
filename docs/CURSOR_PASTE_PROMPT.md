# Cursor paste prompt (cyob)

Copy **everything inside the fenced block below** into a new Cursor Agent chat (or Cloud Agent task). Update this file when live URLs, branch policy, or priorities change.

---

```
You are working on **cyob** — Create Your Own Bot: a Next.js 15 SaaS that runs a 10-agent marketing pipeline (intake → preparing → dashboard → plan → library). Live app: https://cyob.site · Vercel project **cyob-k28y** · deploy branch **`production`**.

## Repo map

| Path | Purpose |
|------|---------|
| `app/` | App Router pages + `app/api/*` route handlers |
| `components/` | UI (intake, dashboard, plan, library, admin, login) |
| `lib/orchestrator/run-pipeline.ts` | Main run pipeline |
| `lib/agents/run-agent.ts`, `lib/agents/build-prompt.ts` | Agent execution + preambles |
| `lib/services/` | LLM (Gemini/Anthropic/OpenAI), Serper/Tavily/Apify, FAL/Pollinations, Stripe, Resend |
| `lib/supabase/` | Server/browser Supabase clients, route-handler helpers |
| `supabase/migrations/` | SQL migrations (`000001`, `000002`) |
| `prototype/` | Legacy static HTML demo (not served at `/`) |
| `docs/` | Ops runbooks — read before deploy/auth changes |

**Branches:** `production` = live Next.js app. `main` may lag (static prototype only); prefer branching from `production` for app work.

## Stack & conventions

- **Next.js 15**, React 19, TypeScript, Tailwind 4, `@t3-oss/env-nextjs` in `lib/env.ts`
- **Supabase** Auth (OTP/magic link) + Postgres + RLS — use `@supabase/ssr`; never expose `service_role` to the client
- **Mocks with real fallbacks:** missing paid API keys → template/mock output; free keys (Gemini, Serper, Tavily, Pollinations) activate when set — see `docs/FREE_APIS.md`
- **Node 20.x** on Vercel (not 24). `vercel.json` pins `framework: nextjs`
- Minimize scope; match existing patterns; no secrets in git

## Local dev

```bash
cp .env.example .env.local   # SKIP_ENV_VALIDATION=1 until keys filled
npm install
npm run dev                  # http://localhost:3000
```

## Human ops (often still pending)

1. Supabase: apply `000002`, auth redirect URLs, OTP email template — `docs/CONTINUE_BATCH.md`, `docs/SUPABASE_EMAIL_TEMPLATE.md`
2. Vercel Production env: Supabase keys, `NEXT_PUBLIC_APP_URL=https://cyob.site`, `CRON_SECRET`, then paid keys when approved — `docs/VERCEL_5MIN.md`
3. Verify: `/login` 200, OTP → `/dashboard`, intake creates a `run`

## Security (non-negotiable)

- RLS on exposed tables; do not authorize from `user_metadata`
- Rotate `SUPABASE_SERVICE_ROLE_KEY` before public launch if it was ever logged
- Rate limits exist on sensitive APIs — preserve them

## Typical agent tasks

- Fix auth/session (middleware, `app/api/auth/verify-otp`, cookies)
- Wire or harden an integration in `lib/services/*` with mock fallback
- Pipeline/agent bugs in `lib/orchestrator` / `lib/agents`
- Admin caps / tiers: `app/admin`, `app/api/admin/*`
- Crons: `app/api/cron/*` (needs `CRON_SECRET`)

## When done

- Run `npm run lint` and `npm run build` if you changed app code
- Small focused commits; PR target branch **`production`** unless told otherwise
- Point humans to the right doc in `docs/` for dashboard-only steps (Supabase/Vercel UI)

**Current priority ask:** [DESCRIBE YOUR TASK HERE — e.g. "Fix OTP redirect on cyob.site" or "Wire Stripe webhook for Spark monthly"]
```

---

## Maintainer notes

- Replace the `**Current priority ask:**` line in the block before each paste, or add it in the chat after pasting.
- Related docs: `HANDOFF.md`, `docs/CONTINUE_BATCH.md`, `docs/FREE_APIS.md`, `docs/VERCEL_5MIN.md`, `docs/ONE_COMMAND_DEPLOY.md`.
- For Supabase-heavy work, use the Supabase skill/MCP and verify changes with SQL or a test login.
