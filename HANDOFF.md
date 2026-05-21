# cyob — Hamdan batch checklist

## Live

- **Site:** https://cyob.site (Next.js app)
- **Vercel:** `cyob-k28y` — env vars + Next.js framework configured
- **Branch:** `production`

## Your batch later (~5 min)

**Supabase only** (deferred): sign in with the account that owns project `uxwrbupzrhrdktmrxyat`, then **Authentication → URL Configuration**:

```text
Site URL: https://cyob.site

Redirect URLs:
https://cyob.site/auth/callback
https://www.cyob.site/auth/callback
https://cyob-k28y.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

Then test magic link at https://cyob.site/login

**Security (before public launch):** rotate Supabase `service_role` key.

**Optional:** revoke Vercel token `cyob-deploy-agent` if still active.

---

## Agent work (code — latest)

| Area | Done |
|------|------|
| API security | Run/asset routes require auth + run ownership; agents admin-only in prod |
| Stripe webhook | Fails closed (501) until signature verify is wired |
| Cap plumbing | Pipeline checks cap; spending log hooks on agents |
| Dashboard/plan/library | List user runs (no more “Phase 3” placeholders) |
| Home + header | Prod copy; session email + logout |
| Auth | Callback errors; `ADMIN_EMAILS` auto-promotes admin on login |
| Pricing | Waitlist + enterprise forms wired to APIs |
| Errors | `error.tsx`, `not-found.tsx`, pipeline `failed` status |

Still needs **paid API keys** (Anthropic, Stripe, Resend, etc.) when approved — no spend without OK.

Docs: `docs/VERCEL_5MIN.md`, `docs/ONE_COMMAND_DEPLOY.md`
