# Free API layer (cyob)

Wire these in **Vercel Production** (and `.env.local` for dev). Paid keys still take priority when set.

## Priority chain (already in code)

| Need | Free (add keys below) | Upgrade (existing) |
|------|------------------------|---------------------|
| Agent text | **Gemini** `GEMINI_API_KEY` | Anthropic → OpenAI |
| Agent 4 research | **Serper** → **Tavily** | Apify (studio+ only) |
| Images | **Pollinations** (no key) | `FAL_KEY` |
| Login email | **Resend SMTP** in Supabase dashboard | — |
| Boss digest | `RESEND_API_KEY` | — |

## 1. Gemini (agents)

1. https://aistudio.google.com/apikey → Create API key  
2. Vercel / `.env.local`:

```env
GEMINI_API_KEY=AIza...
```

Model used: `gemini-2.0-flash` (free tier quotas apply).

## 2. Serper (competitor search — recommended)

1. https://serper.dev → sign up → API key  
2. Env:

```env
SERPER_API_KEY=...
```

~2,500 free Google searches. Used on **Agent 4** before Tavily/Apify.

## 3. Tavily (optional second search)

1. https://tavily.com → API key  
2. Env:

```env
TAVILY_API_KEY=tvly-...
```

Used only if Serper is missing or fails.

## 4. Pollinations (images)

**No key.** If `FAL_KEY` is unset, `/api/assets/generate` returns a Pollinations image URL.

## 5. Resend (login + cron)

- **Cron:** `RESEND_API_KEY` + `BOSS_EMAIL` (already wired).  
- **Login OTP:** Supabase → Authentication → SMTP → `smtp.resend.com`, user `resend`, password = API key. See handoff / `docs/SUPABASE_EMAIL_TEMPLATE.md`.

## Quick local test

```powershell
cd C:\Users\Desktop\cyob
# Add GEMINI_API_KEY and SERPER_API_KEY to .env.local
npm run dev
```

Start a **live** run (not demo) after login — agents should show `live: true` in outputs when Gemini responds.

## Vercel checklist

```env
GEMINI_API_KEY=
SERPER_API_KEY=
TAVILY_API_KEY=          # optional
RESEND_API_KEY=
# existing Supabase + CRON_SECRET unchanged
```

Redeploy `production` after saving env vars.

## Weekly budget (≈100 AED)

Set on Vercel:

```env
WEEKLY_BUDGET_AED=100
```

- **Market examples** (Careem, noon, talabat, etc.) rotate from curated data — **free**, no API call.
- **Rotate examples** button on the war room uses `POST /api/market-snapshot` (still free).
- **Gemini + Serper free tiers** should stay within ~100 AED/week if you avoid paid image APIs (`FAL_KEY`) and limit manual trend refreshes.
- Spending is tracked in `spending_log` (fils ≈ AED × 100).
