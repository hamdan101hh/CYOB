# cyob — Hamdan batch checklist (do when back)

## Agent work complete (code-only)

| Phase | Status |
|-------|--------|
| 0 Setup | Done locally |
| 1 Auth + intake | UI + demo flow |
| 2 Bot engine | Orchestrator + agent routes + rich demo JSON |
| 3 Dashboard/plan/library | Parsed trends/gaps/competitors + refresh button |
| 4 Pricing | Toggle UI + checkout/webhook shells + price env names |
| 5 Admin | Shell + service-tier API (`is_admin` required) |
| 6 Cron | Routes + `CRON_SECRET` guard + `vercel.json` schedules |
| 7 Launch | **Your batch** (below) |

Also added: Supabase magic-link callback, logout route, waitlist, enterprise inquiry, asset/PDF stubs, daily boss summary stub, PR/security docs.

Real Claude/OpenAI/Apify/Stripe/Resend/PDF run only after keys in `.env.local` and provider setup.

---

## Your batch (~45–60 min)

### 1. Sync both servers
```powershell
cd C:\Users\Desktop\cyob
git pull
npm.cmd install
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
npm.cmd run build
npm.cmd run dev
```

### 2. Supabase
- Project with **createyourownbot.ai@gmail.com**
- Run `supabase/migrations/000001_initial_schema.sql`
- Auth → Email OTP on
- Copy URL, anon, service role → `.env.local` + Vercel
- Add redirect URLs:
  - `http://localhost:3000/auth/callback`
  - `http://localhost:3001/auth/callback` (if local dev uses 3001)
  - `https://cyob.live/auth/callback` (launch)
- Optional: customize email templates using `docs/SUPABASE_EMAIL_TEMPLATE.md`

### 3. `.env.local`
Copy `.env.example`, fill keys, remove `SKIP_ENV_VALIDATION` when ready.

### 4. GitHub
- Branch `production` (never push `main` without approval)
- PR → merge when preview looks good

### 5. Vercel
- Preview branch `production`
- All env vars from `.env.local`
- `CRON_SECRET` = random 32 chars
- Cron schedules are in `vercel.json`

### 6. Paid APIs (your sign-in, no spend without OK)
Anthropic, OpenAI, Stripe, Resend, fal.ai, Apify — paste keys into Vercel + local.

### 7. Test
1. localhost:3000  
2. Start intake → Skip login (demo)  
3. Preparing → Dashboard (trends/gaps)  
4. Plan / Library / Pricing / Login  
5. Supabase magic link → `/auth/callback` signs in

### 8. Optional
- Slack `#cyob-build` one message with preview URL  
- Linear mark phases Done  

**Boss email:** `BOSS_EMAIL=hamdaaninh101@gmail.com` (digests after Resend).

---

Reply **"ready for handoff"** and we walk through live.
