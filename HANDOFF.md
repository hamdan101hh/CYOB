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

**While you were away:** `vercel.json` pins Next.js; legacy HTML moved to `prototype/` so Vercel no longer serves the old static site at `/`. See **`docs/VERCEL_5MIN.md`** for the full 5-minute Vercel + Supabase batch.

Real Claude/OpenAI/Apify/Stripe/Resend/PDF run only after keys in `.env.local` and provider setup.

---

## Your batch (~5 min if code is pushed)

**Start here:** [`docs/VERCEL_5MIN.md`](docs/VERCEL_5MIN.md)

Quick checklist:

1. **Push** `production` (if not already) → Vercel redeploys
2. **Vercel** `cyob-k28y`: Framework **Next.js**, Node **20.x**, `NEXT_PUBLIC_APP_URL=https://cyob.site`, redeploy
3. **Supabase** redirect URLs for `cyob.site`, `www`, `cyob-k28y.vercel.app`, localhost
4. **Test** `https://cyob.site/login` (must be **200**, not 404)

### Local dev (optional)

```powershell
cd C:\Users\Desktop\cyob
git pull
npm.cmd install
npm.cmd run dev
```

### Supabase redirect URLs

```text
http://localhost:3000/auth/callback
https://cyob.site/auth/callback
https://www.cyob.site/auth/callback
https://cyob-k28y.vercel.app/auth/callback
```

Site URL: `https://cyob.site`

### Security

Rotate **Supabase service_role** before public launch (may have appeared in prior tooling output).

**Boss email:** `BOSS_EMAIL=hamdaaninh101@gmail.com` (digests after Resend).

---

Reply **"ready for handoff"** and we walk through live.
