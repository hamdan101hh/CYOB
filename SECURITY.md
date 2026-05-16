# Security Notes

- Never commit `.env.local`, service-role keys, Stripe secrets, or AI provider keys.
- `SUPABASE_SERVICE_ROLE_KEY` is server-only. Do not import it in client components.
- RLS is enabled in `supabase/migrations/000001_initial_schema.sql`.
- Paid API routes must check the monthly cap before provider calls.
- Stripe webhooks must verify signatures before mutating data when the Stripe SDK is wired.
