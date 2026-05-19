# One-command finish (Vercel + Supabase)

The agent cannot log into your Vercel/Supabase browser sessions. Run this **once** (takes ~30 seconds):

## 1. Create tokens (copy each)

- **Vercel:** https://vercel.com/account/tokens → Create → **Full Account**
- **Supabase:** https://supabase.com/dashboard/account/tokens → Generate new token

## 2. Run in PowerShell

```powershell
cd C:\Users\Desktop\cyob
$env:VERCEL_TOKEN = "paste-vercel-token"
$env:SUPABASE_ACCESS_TOKEN = "paste-supabase-token"
node scripts/finish-deploy.mjs
```

This script will:

- Set Vercel project **cyob-k28y** to **Next.js** + Node 20
- Point production branch to **production**
- Push all env vars from `.env.local` (+ `NEXT_PUBLIC_APP_URL=https://cyob.site`)
- Trigger a **production** redeploy
- Set Supabase **Site URL** + redirect URLs for `cyob.site`

## 3. Verify

```text
https://cyob.site/login   → must be 200 (not 404)
```

Homepage should show **“Skip login (local demo)”** (Next.js app), not the old static marketing page.
