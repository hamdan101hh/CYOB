# CYOB — UI/UX only work (laptop prompt)

Copy everything below the line into Cursor on your **other laptop** (after you have the project files there).

---

## PROMPT START (copy from here)

You are helping me improve **only the UI and UX** of **CYOB** — a Next.js 15 app (React, Tailwind CSS, App Router). Do **not** change backend logic, API routes, database, auth, env secrets, or integrations unless I explicitly ask.

### Goal
Make the product feel **minimal, premium, and easy** — like ChatGPT simple: clear steps, few choices per screen, readable charts, calm dark theme (charcoal, deep blue, subtle purple). No clutter, no walls of chips, no cheap green overload.

### Hard rules
1. **UI/UX only** — layout, copy, spacing, colors, components, animations, responsive design.
2. **Do not break** routes: `/`, `/login`, `/dashboard`, `/plan`, `/library`, `/pricing`, `/admin`, `/preparing/[runId]`.
3. **Do not remove** working features (intake modal, auth, run pipeline, library prompt studio).
4. **Do not commit** `.env.local` or API keys.
5. **Match existing patterns** — reuse `stealth-card`, `btn`, `btn-primary`, `page-wrap`, CSS variables in `app/globals.css`.
6. **Keep builds passing** — Mac: `npm run build` · Windows: `npm.cmd run build`

### Design system (use these, don’t invent random colors)
- Background: near-black / charcoal (`--bg`, `--bg-2`, `--graphite`)
- Text: `--text`, `--text-2`, `--text-3`, `--text-4`
- Accent: deep blue `--accent`, `--accent-bright`
- Purple: sparing glow only `--accent-2`
- Green: **only** tiny status dots (`--live`), not big green buttons
- Cards: `stealth-card` class, light glass, soft borders
- Primary CTA: `btn btn-primary btn-glow`

### Files you SHOULD edit for UI/UX
| Area | Files |
|------|--------|
| Global theme | `app/globals.css`, `app/layout.tsx` |
| Homepage | `app/page.tsx`, `components/home/*` |
| Header / nav | `components/site-header.tsx`, `components/site-nav.tsx`, `components/site-auth-actions.tsx` |
| Intake | `components/intake/intake-modal.tsx`, `components/home/intake-cta.tsx`, `components/home/home-hero-actions.tsx` |
| Dashboard | `app/dashboard/page.tsx`, `app/dashboard/[runId]/page.tsx`, `components/dashboard/*`, `components/runs/runs-hub.tsx` |
| Plan / Library / Preparing | `app/plan/[runId]/page.tsx`, `app/library/[runId]/page.tsx`, `app/preparing/**` |
| Charts (visual only) | `components/charts/intelligence-charts.tsx`, `components/run/charts.tsx`, `components/home/mini-chart.tsx` |
| Run visuals | `components/run/visual-blocks.tsx`, `components/run/agent-pipeline-visual.tsx` |
| Login / pricing | `app/login/page.tsx`, `components/login/*`, `app/pricing/page.tsx` |
| Library prompts UI | `components/library/asset-prompt-studio.tsx` |
| Splash | `components/splash/*` |

### Files you should NOT edit (unless I say so)
- `app/api/**` — all API routes
- `lib/agents/**`, `lib/orchestrator/**`, `lib/services/**` (LLM, Serper, fal, Supabase)
- `lib/env.ts`, `middleware.ts`, `lib/supabase/**`
- `supabase/migrations/**`
- `.env.local`, `docs` about API keys

### Local preview on laptop

**Mac (Terminal):**
```bash
cd ~/path/to/cyob
npm install
npm run dev
```
Open http://localhost:3000 — hard refresh: **Cmd + Shift + R**

**Windows (PowerShell):**
```powershell
cd C:\Users\Desktop\cyob
npm install
npm.cmd run dev
```
Hard refresh: **Ctrl + F5**

Optional `.env.local` for **UI-only** (app may still run with `SKIP_ENV_VALIDATION=1`):
```env
SKIP_ENV_VALIDATION=1
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### How to sync with my main PC
- **Git (best):** push from one machine → `git pull` on the other. Only commit UI files if we agree.
- **Mac pull example:** `cd ~/Projects/cyob && git pull`
- **Or:** copy the whole `cyob` folder (AirDrop / USB / iCloud) — don’t share `.env.local` with secrets.

### UX priorities (in order)
1. Intake: 3 steps, dropdowns, one primary button, mobile-friendly sheet
2. Homepage: less empty space below hero, clearer “what CYOB does”
3. Charts: side-by-side bars + legend, not confusing overlapping lines
4. Dashboard: 6 clear cards max, calm spacing
5. Library: prompt studio before generate (already exists — polish UI only)
6. Typography: short sentences, `text-sm` for body, strong hierarchy on headings

### When you finish a task
- Say which files changed
- Confirm routes still work
- Mention if `npm run build` passed
- Do **not** push to Vercel unless I ask

### Example requests I might give you
- “Make intake step 1 even simpler — only company + market”
- “Reduce homepage section spacing by 20%”
- “Make dashboard cards same height on desktop”
- “Improve mobile nav”
- “Soften hero panel — less dense”

Work incrementally. Small focused diffs. Ask before touching `app/api` or `lib/services`.

## PROMPT END
