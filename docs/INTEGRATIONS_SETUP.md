# cyob API integrations — step by step

Admin UI: **https://cyob.site/admin** (or `/admin` locally).

1. Enter admin **password** (default dev: `142011` — set `ADMIN_GATE_PASSWORD` on Vercel for production).
2. See the 5 API cards → **Add credit** / **Test** / paste keys in Vercel.

No Supabase login required for admin anymore.

Keys are **never** saved in the database. Set them in:

1. `C:\Users\Desktop\cyob\.env.local` (dev)
2. Vercel → Project → Settings → Environment Variables → **Production**
3. **Redeploy** after changing production env

---

## Step 1 — Anthropic (Claude) — primary AI

1. https://console.anthropic.com → Billing → add credit ($5–20).
2. Create API key.
3. Add to env:

```env
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-sonnet-4-6
```

4. In admin → **Test** on Anthropic row.

**Used for:** all 10 agents, trend refresh.

---

## Step 2 — Google Gemini — backup AI

1. https://aistudio.google.com/apikey
2. Add:

```env
GEMINI_API_KEY=...
```

**Used when:** Claude/OpenAI keys are missing.

---

## Step 3 — Serper — live competitor search

1. https://serper.dev → sign up → **$50 pack** (50k searches) when you outgrow 2,500 free.
2. Add:

```env
SERPER_API_KEY=...
```

**Used for:** Agent 4 research.

---

## Step 4 — fal.ai — premium images

1. https://fal.ai → billing → API key.
2. Add:

```env
FAL_KEY=...
```

**Used for:** Library campaign images. Without it, Pollinations (free) is used.

---

## Step 5 — Resend — login email

1. https://resend.com → API key.
2. Add:

```env
RESEND_API_KEY=re_...
```

3. Supabase → Auth → SMTP → `smtp.resend.com` (see `docs/SUPABASE_SMTP_FIX.md`).

---

## Step 6 — Deploy

1. Paste the same vars into Vercel Production.
2. Redeploy `production`.
3. Admin → **Refresh** → should show **5/5** connected.
4. Run a live intake on cyob.site.

---

## Optional

| Key | Role |
|-----|------|
| `OPENAI_API_KEY` | LLM between Claude and Gemini |
| `TAVILY_API_KEY` | Search if Serper fails |
| `APIFY_TOKEN` | Heavy scraping (expensive) |

---

## Budget

```env
WEEKLY_BUDGET_AED=300
```

Tracks spend in `spending_log`. Adjust in admin **Weekly spend guard**.

Recommended starter top-ups (one time):

| Provider | Suggested |
|----------|-----------|
| Anthropic | $20 |
| Serper | $50 pack |
| fal | $10 |
| Resend | Free → $20/mo if needed |
