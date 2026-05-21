-- runs.created_at (used by list-user-runs)
alter table public.runs
add column if not exists created_at timestamptz not null default now ();

create index if not exists runs_created_at_idx on public.runs (created_at desc);

-- trend_refreshes: allow owners to log manual refreshes
drop policy if exists "trend_refreshes_insert_own_run" on public.trend_refreshes;
create policy "trend_refreshes_insert_own_run" on public.trend_refreshes
for insert
to authenticated
with check (public.user_owns_run (run_id));

-- waitlist: dedupe emails
create unique index if not exists waitlist_email_lower_unique on public.waitlist (lower(email));

-- seed current month cap row
insert into public.monthly_cap (month_year, cap_cents, spent_cents)
values (to_char(now(), 'YYYY-MM'), 20000, 0)
on conflict (month_year) do nothing;
