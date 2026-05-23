# Supabase email — code only (no link)

Login emails must show **only** `{{ .Token }}` — no `{{ .ConfirmationURL }}` or “Sign in” button.

## One command (after code deploy)

```powershell
cd C:\Users\Desktop\cyob
$env:SUPABASE_ACCESS_TOKEN = "your-token-in-quotes"
node scripts/supabase-batch.mjs
```

Sets:

- 6-digit codes (`mailer_otp_length: 6`)
- 3-minute expiry (`mailer_otp_exp: 180`)
- No links in Magic Link + Confirm signup templates

## Manual dashboard

https://supabase.com/dashboard/project/uxwrbupzrhrdktmrxyat/auth/templates

Edit **Magic Link** and **Confirm signup** — same body, no links:

```html
<h2>Your cyob sign-in code</h2>
<p>Your sign-in code:</p>
<p style="font-size:32px;font-weight:700;letter-spacing:0.2em;margin:24px 0">{{ .Token }}</p>
<p>Open https://cyob.site/login in the same browser, enter your email, then paste this code.</p>
<p>This code expires in 3 minutes.</p>
```

**Authentication → Providers → Email → Email OTP expiration:** set to **180** seconds (3 minutes).

## How users sign in

1. Stay on https://cyob.site/login  
2. Enter email → **Send code**  
3. Copy code from email → paste on same page → **Verify**

Do not use the email link (old templates only).
