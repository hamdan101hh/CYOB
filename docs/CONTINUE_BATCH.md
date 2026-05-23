# Continue batch (~5 min)

Code is live on **`production`** (`c3e03e0`). Finish Supabase + login, then add paid keys when ready.

## Option A — one script (recommended)

1. Create a token: https://supabase.com/dashboard/account/tokens  
2. Run in PowerShell:

```powershell
cd C:\Users\Desktop\cyob
$env:SUPABASE_ACCESS_TOKEN = "YOUR_TOKEN"
node scripts/supabase-batch.mjs
```

This applies `000002` and sets auth redirect URLs.

## Option B — Supabase dashboard

1. **SQL Editor** — paste `supabase/migrations/000002_runs_created_at_and_policies.sql` → Run  
2. **Authentication → URL Configuration** — see `HANDOFF.md`  
3. **Emails** — OTP template in `docs/SUPABASE_EMAIL_TEMPLATE.md`

## Verify

```text
https://cyob.site/login   → 200, login form
```

Sign in with your email; you should land on `/dashboard` after OTP.

## Later (paid features)

Add to Vercel Production: `STRIPE_*`, `RESEND_API_KEY`, `ANTHROPIC_API_KEY` or `OPENAI_API_KEY`, optional `FAL_KEY`, `APIFY_TOKEN`.  
Stripe webhook: `https://cyob.site/api/webhooks/stripe`
