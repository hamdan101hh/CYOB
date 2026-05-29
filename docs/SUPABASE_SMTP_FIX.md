# Fix “Error sending magic link email”

Supabase shows this for **any** auth email failure (OTP or link). Fix SMTP + settings below.

## Fastest fix — Resend ↔ Supabase integration

1. https://resend.com/settings/integrations  
2. **Supabase** → Connect → pick project **uxwrbupzrhrdktmrxyat**  
3. Let it configure SMTP automatically  
4. Test https://cyob.site/login  

## Manual SMTP (must match exactly)

https://supabase.com/dashboard/project/uxwrbupzrhrdktmrxyat/auth/smtp

| Field | Value |
|--------|--------|
| Enable custom SMTP | ON |
| Sender email | `noreply@cyob.site` (after domain verified). Avoid `onboarding@resend.dev` when Link domain is `cyob.site`. |
| Sender name | `cyob` |
| Host | `smtp.resend.com` (no spaces before/after) |
| Port | `465`, or `587` if 465 fails |
| Username | `resend` |
| Password | Resend API key `re_...` |

**Common mistakes:** username `cyob`, wrong sender domain, spaces in host, old/regenerated API key not updated in Supabase.

## Auth settings

| Setting | Value |
|--------|--------|
| Allow new users to sign up | ON |
| Confirm email | **OFF** |
| Email OTP length | 6 |
| Email OTP expiration | 600 |

## Template

https://supabase.com/dashboard/project/uxwrbupzrhrdktmrxyat/auth/templates  

**Magic Link** — body must include `{{ .Token }}` and must **not** use `{{ .ConfirmationURL }}` for code-only login.

## See the real error

https://supabase.com/dashboard/project/uxwrbupzrhrdktmrxyat/logs/auth  

Trigger one Send code, refresh logs (e.g. `535`, `sender`, `DNS`).

## Resend

https://resend.com/emails — failed row shows why.

Free tier: test with the **same email you used to sign up for Resend** first.

## Re-apply templates via script

```powershell
cd C:\Users\Desktop\cyob
$env:SUPABASE_ACCESS_TOKEN = "from dashboard account tokens"
node scripts/supabase-batch.mjs
```
