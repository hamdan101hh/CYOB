# Supabase Email Template

Until this is changed, Supabase may send a magic link instead of a six-digit code.

In Supabase:

1. Authentication → Emails / Email Templates
2. Open **Confirm signup** and **Magic Link**
3. Include:

```text
Your cyob verification code is:

{{ .Token }}

Enter this code in the cyob app.
```

Also set the redirect URL to:

```text
http://localhost:3000/auth/callback
```

For deployment, also add:

```text
https://cyob.site/auth/callback
https://www.cyob.site/auth/callback
https://cyob-k28y.vercel.app/auth/callback
```
