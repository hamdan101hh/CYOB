# Vercel + Supabase — 5-minute batch (when back)

Project: **cyob-k28y** · Domain: **cyob.site** · Branch: **production**

## Problem (fixed in repo)

If `https://cyob.site` shows the old marketing page and `/login` is **404**, Vercel was building as **Other** (static) instead of **Next.js**. `vercel.json` now pins `framework: nextjs`. Push `production` and redeploy.

## 1. Push latest code (triggers deploy)

```powershell
cd C:\Users\Desktop\cyob
git add vercel.json prototype/ docs/ app/ .env.example
git status
git commit -m "Pin Next.js on Vercel; move legacy HTML to prototype/"
git push origin production
```

## 2. Vercel settings (cyob-k28y)

**Settings → Build and Deployment**

| Setting | Value |
|--------|--------|
| Framework Preset | **Next.js** |
| Root Directory | `./` (blank is OK) |
| Install Command | `npm install` |
| Build Command | `npm run build` |
| Output Directory | *(empty / default)* |
| Node.js | **20.x** (not 24.x) |

**Settings → Environment Variables** (Production):

```env
NEXT_PUBLIC_APP_URL=https://cyob.site
ADMIN_EMAILS=createyourownbot.ai@gmail.com
BOSS_EMAIL=hamdaaninh101@gmail.com
NEXT_PUBLIC_SUPABASE_URL=<from .env.local>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from .env.local>
SUPABASE_SERVICE_ROLE_KEY=<from .env.local>
CRON_SECRET=<random 32+ chars>
```

Remove `SKIP_ENV_VALIDATION` in Production if it was added.

**Deployments** → latest → **⋯ → Redeploy** (prefer **without build cache**).

## 3. Supabase Auth URLs

**Authentication → URL Configuration**

**Site URL:**

```text
https://cyob.site
```

**Redirect URLs** (add all):

```text
http://localhost:3000/auth/callback
https://cyob.site/auth/callback
https://www.cyob.site/auth/callback
https://cyob-k28y.vercel.app/auth/callback
```

## 4. Verify (30 seconds)

After deploy succeeds:

```text
https://cyob.site          → Next home (“Skip login (local demo)”)
https://cyob.site/login    → 200, login form
https://cyob.site/pricing  → 200
```

Old static prototype is under `prototype/` only — not served at `/`.

## 5. Later (before public launch)

- Rotate **Supabase service_role** key (it may have appeared in logs earlier).
- Point **cyob.live** at Vercel if you still want that domain.
- Add paid API keys (Anthropic, Stripe, etc.) when approved.
