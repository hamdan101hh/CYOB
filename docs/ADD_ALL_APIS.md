# Add all best APIs to cyob — step by step

Do this from **http://localhost:3000/admin** (password `142011`) or after deploy.

---

## Best-value stack (recommended)

| # | API | Env vars | What it powers |
|---|-----|----------|----------------|
| 1 | **Claude** | `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL=claude-sonnet-4-6` | 10 agents (default brain) |
| 2 | **Gemini** | `GEMINI_API_KEY` | Backup if Claude/OpenAI fail |
| 3 | **Serper** | `SERPER_API_KEY` | Live competitor search |
| 4 | **fal.ai** | `FAL_KEY` | Flux images + **Seedance video** |
| 5 | **Resend** | `RESEND_API_KEY` | Login email |

### Premium add-ons

| API | Env | When to add |
|-----|-----|-------------|
| **ChatGPT** | `OPENAI_API_KEY`, `LLM_PROVIDER=openai`, optional `OPENAI_MODEL=gpt-4o` | You want OpenAI instead of Claude |
| **Seedance** | Same `FAL_KEY`, `ENABLE_SEEDANCE_VIDEO=true` | Library video clips (~$0.18 per 5s) |
| **Tavily** | `TAVILY_API_KEY` | Backup search |
| **Apify** | `APIFY_TOKEN` | Heavy scraping only (costly) |

---

## Step 1 — ChatGPT (OpenAI)

1. https://platform.openai.com → Billing → add **$10–20**
2. API keys → Create key
3. Add to `.env.local` and Vercel:

```env
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```

**Use ChatGPT for all agents:**

```env
LLM_PROVIDER=openai
OPENAI_MODEL=gpt-4o
```

4. Admin → **Test** on OpenAI row

---

## Step 2 — Claude (if not using ChatGPT first)

```env
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-sonnet-4-6
LLM_PROVIDER=anthropic
```

---

## Step 3 — Gemini (free backup)

```env
GEMINI_API_KEY=...
```

---

## Step 4 — Serper

1. https://serper.dev → $50 pack when needed
2. `SERPER_API_KEY=...`

---

## Step 5 — fal (images + Seedance video)

1. https://fal.ai → Billing → API key
2. One key does both:

```env
FAL_KEY=...
ENABLE_SEEDANCE_VIDEO=true
```

- **Images:** every campaign hero (Flux)
- **Video:** first campaign only gets a **5s Seedance** clip (saves money)

To disable video and only use images:

```env
ENABLE_SEEDANCE_VIDEO=false
```

---

## Step 6 — Resend

```env
RESEND_API_KEY=re_...
```

Plus Supabase SMTP (see `docs/SUPABASE_SMTP_FIX.md`).

---

## Step 7 — Optional Tavily + Apify

```env
TAVILY_API_KEY=tvly-...
APIFY_TOKEN=apify_...
```

Apify only worth it for deep scrapes — skip at first.

---

## Step 8 — Deploy

1. Admin → **Copy env names**
2. Vercel → Production env → paste all keys
3. Redeploy
4. Admin → **Refresh** → test each row

---

## How cyob picks the AI

| `LLM_PROVIDER` | Order |
|----------------|--------|
| (empty / auto) | Claude → ChatGPT → Gemini |
| `openai` | ChatGPT → Claude → Gemini |
| `anthropic` | Claude → ChatGPT → Gemini |
| `gemini` | Gemini → Claude → ChatGPT |

You only pay for the **first** provider that works per agent call.
