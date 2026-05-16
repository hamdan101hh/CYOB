-- cyob — initial schema + RLS (apply via Supabase CLI or SQL editor)

-- ---------------------------------------------------------------------------
-- public.users (extends auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text unique not null,
  tier text not null default 'free',
  stripe_customer_id text,
  stripe_subscription_id text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  constraint users_tier_check check (
    tier in ('free', 'spark', 'studio', 'enterprise')
  )
);

create index if not exists users_email_idx on public.users (email);

-- ---------------------------------------------------------------------------
-- intakes
-- ---------------------------------------------------------------------------
create table if not exists public.intakes (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references public.users (id) on delete cascade,
  company text not null,
  industry text,
  geography text,
  city text,
  size text,
  vibe text,
  audience text,
  audience_type text,
  budget text,
  notes text,
  created_at timestamptz not null default now ()
);

create index if not exists intakes_user_id_idx on public.intakes (user_id);

-- ---------------------------------------------------------------------------
-- runs
-- ---------------------------------------------------------------------------
create table if not exists public.runs (
  id uuid primary key default gen_random_uuid (),
  intake_id uuid not null references public.intakes (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  status text not null default 'queued',
  current_agent int not null default 0,
  agent_status text,
  started_at timestamptz,
  completed_at timestamptz,
  total_cost_cents int not null default 0,
  pdf_url text,
  error_message text,
  constraint runs_status_check check (
    status in ('queued', 'running', 'complete', 'failed')
  ),
  constraint runs_current_agent_check check (
    current_agent >= 0
    and current_agent <= 10
  )
);

create index if not exists runs_user_id_idx on public.runs (user_id);
create index if not exists runs_intake_id_idx on public.runs (intake_id);

-- ---------------------------------------------------------------------------
-- agent_outputs
-- ---------------------------------------------------------------------------
create table if not exists public.agent_outputs (
  id uuid primary key default gen_random_uuid (),
  run_id uuid not null references public.runs (id) on delete cascade,
  agent_number int not null,
  agent_name text not null,
  status text not null default 'queued',
  input_tokens int,
  output_tokens int,
  cost_cents int,
  output_json jsonb,
  output_text text,
  error_message text,
  created_at timestamptz not null default now (),
  constraint agent_outputs_status_check check (
    status in ('queued', 'running', 'complete', 'failed')
  )
);

create index if not exists agent_outputs_run_id_idx on public.agent_outputs (run_id);

-- ---------------------------------------------------------------------------
-- generated_assets
-- ---------------------------------------------------------------------------
create table if not exists public.generated_assets (
  id uuid primary key default gen_random_uuid (),
  run_id uuid not null references public.runs (id) on delete cascade,
  asset_type text not null,
  campaign_index int,
  variant_index int,
  storage_path text,
  public_url text,
  prompt text,
  cost_cents int,
  created_at timestamptz not null default now (),
  constraint generated_assets_type_check check (
    asset_type in ('image', 'video', 'pdf')
  )
);

create index if not exists generated_assets_run_id_idx on public.generated_assets (run_id);

-- ---------------------------------------------------------------------------
-- trend_refreshes
-- ---------------------------------------------------------------------------
create table if not exists public.trend_refreshes (
  id uuid primary key default gen_random_uuid (),
  run_id uuid not null references public.runs (id) on delete cascade,
  triggered_at timestamptz not null default now (),
  triggered_by text,
  output_json jsonb,
  cost_cents int
);

create index if not exists trend_refreshes_run_id_idx on public.trend_refreshes (run_id);

-- ---------------------------------------------------------------------------
-- spending_log
-- ---------------------------------------------------------------------------
create table if not exists public.spending_log (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references public.users (id) on delete cascade,
  run_id uuid references public.runs (id) on delete set null,
  service text not null,
  cost_cents int not null,
  notes text,
  created_at timestamptz not null default now ()
);

create index if not exists spending_log_user_id_idx on public.spending_log (user_id);

-- ---------------------------------------------------------------------------
-- service_tiers
-- ---------------------------------------------------------------------------
create table if not exists public.service_tiers (
  id text primary key,
  current_tier text not null,
  monthly_cost_cents int not null default 0,
  updated_at timestamptz not null default now (),
  updated_by uuid references public.users (id)
);

-- ---------------------------------------------------------------------------
-- competitor_cache
-- ---------------------------------------------------------------------------
create table if not exists public.competitor_cache (
  id uuid primary key default gen_random_uuid (),
  competitor_name text not null,
  industry text,
  geography text,
  data jsonb not null default '{}'::jsonb,
  fetched_at timestamptz not null default now (),
  expires_at timestamptz not null
);

create index if not exists competitor_cache_lookup_idx on public.competitor_cache (
  competitor_name,
  industry,
  geography
);

-- ---------------------------------------------------------------------------
-- waitlist
-- ---------------------------------------------------------------------------
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid (),
  email text not null,
  reason text,
  metadata jsonb,
  created_at timestamptz not null default now ()
);

-- ---------------------------------------------------------------------------
-- monthly_cap
-- ---------------------------------------------------------------------------
create table if not exists public.monthly_cap (
  month_year text primary key,
  cap_cents int not null default 20000,
  spent_cents int not null default 0,
  raised_by_user uuid references public.users (id),
  raised_at timestamptz
);

-- ---------------------------------------------------------------------------
-- Auth sync: mirror auth.users -> public.users
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user ()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email)
  on conflict (id) do update
    set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users for each row
execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- RLS helpers
-- ---------------------------------------------------------------------------
create or replace function public.is_admin ()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (
      select u.is_admin
      from public.users u
      where u.id = auth.uid ()
    ),
    false
  );
$$;

create or replace function public.user_owns_run (run_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.runs r
    where r.id = run_uuid
      and r.user_id = auth.uid ()
  );
$$;

-- ---------------------------------------------------------------------------
-- Enable RLS
-- ---------------------------------------------------------------------------
alter table public.users enable row level security;
alter table public.intakes enable row level security;
alter table public.runs enable row level security;
alter table public.agent_outputs enable row level security;
alter table public.generated_assets enable row level security;
alter table public.trend_refreshes enable row level security;
alter table public.spending_log enable row level security;
alter table public.service_tiers enable row level security;
alter table public.competitor_cache enable row level security;
alter table public.waitlist enable row level security;
alter table public.monthly_cap enable row level security;

-- ---------------------------------------------------------------------------
-- Policies: users
-- ---------------------------------------------------------------------------
drop policy if exists "users_select_self_or_admin" on public.users;
create policy "users_select_self_or_admin" on public.users for select using (
  id = (select auth.uid ())
  or public.is_admin ()
);

drop policy if exists "users_update_self" on public.users;
create policy "users_update_self" on public.users for update using (id = (select auth.uid ()))
with check (id = (select auth.uid ()));

-- ---------------------------------------------------------------------------
-- Policies: intakes
-- ---------------------------------------------------------------------------
drop policy if exists "intakes_select_own" on public.intakes;
create policy "intakes_select_own" on public.intakes for select using (
  user_id = (select auth.uid ())
  or public.is_admin ()
);

drop policy if exists "intakes_insert_own" on public.intakes;
create policy "intakes_insert_own" on public.intakes for insert with check (
  user_id = (select auth.uid ())
);

drop policy if exists "intakes_update_own" on public.intakes;
create policy "intakes_update_own" on public.intakes for update using (
  user_id = (select auth.uid ())
)
with check (user_id = (select auth.uid ()));

drop policy if exists "intakes_delete_own" on public.intakes;
create policy "intakes_delete_own" on public.intakes for delete using (
  user_id = (select auth.uid ())
);

-- ---------------------------------------------------------------------------
-- Policies: runs
-- ---------------------------------------------------------------------------
drop policy if exists "runs_select_own" on public.runs;
create policy "runs_select_own" on public.runs for select using (
  user_id = (select auth.uid ())
  or public.is_admin ()
);

drop policy if exists "runs_insert_own" on public.runs;
create policy "runs_insert_own" on public.runs for insert with check (
  user_id = (select auth.uid ())
);

drop policy if exists "runs_update_own" on public.runs;
create policy "runs_update_own" on public.runs for update using (
  user_id = (select auth.uid ())
)
with check (user_id = (select auth.uid ()));

drop policy if exists "runs_delete_own" on public.runs;
create policy "runs_delete_own" on public.runs for delete using (
  user_id = (select auth.uid ())
);

-- ---------------------------------------------------------------------------
-- Policies: agent_outputs (read via run ownership)
-- ---------------------------------------------------------------------------
drop policy if exists "agent_outputs_select_own_run" on public.agent_outputs;
create policy "agent_outputs_select_own_run" on public.agent_outputs for select using (
  public.user_owns_run (run_id)
  or public.is_admin ()
);

-- ---------------------------------------------------------------------------
-- Policies: generated_assets
-- ---------------------------------------------------------------------------
drop policy if exists "generated_assets_select_own_run" on public.generated_assets;
create policy "generated_assets_select_own_run" on public.generated_assets for select using (
  public.user_owns_run (run_id)
  or public.is_admin ()
);

-- ---------------------------------------------------------------------------
-- Policies: trend_refreshes
-- ---------------------------------------------------------------------------
drop policy if exists "trend_refreshes_select_own_run" on public.trend_refreshes;
create policy "trend_refreshes_select_own_run" on public.trend_refreshes for select using (
  public.user_owns_run (run_id)
  or public.is_admin ()
);

-- ---------------------------------------------------------------------------
-- Policies: spending_log
-- ---------------------------------------------------------------------------
drop policy if exists "spending_log_select_own" on public.spending_log;
create policy "spending_log_select_own" on public.spending_log for select using (
  user_id = (select auth.uid ())
  or public.is_admin ()
);

-- ---------------------------------------------------------------------------
-- Policies: service_tiers (read all, write admin)
-- ---------------------------------------------------------------------------
drop policy if exists "service_tiers_select_auth" on public.service_tiers;
create policy "service_tiers_select_auth" on public.service_tiers for select to authenticated using (true);

drop policy if exists "service_tiers_mutate_admin" on public.service_tiers;
create policy "service_tiers_mutate_admin" on public.service_tiers for all using (public.is_admin ())
with check (public.is_admin ());

-- ---------------------------------------------------------------------------
-- Policies: monthly_cap (admin only)
-- ---------------------------------------------------------------------------
drop policy if exists "monthly_cap_admin_all" on public.monthly_cap;
create policy "monthly_cap_admin_all" on public.monthly_cap for all using (public.is_admin ())
with check (public.is_admin ());

-- ---------------------------------------------------------------------------
-- competitor_cache, waitlist: no end-user policies (service role in API)
-- ---------------------------------------------------------------------------

grant usage on schema public to anon, authenticated, service_role;

grant select, insert, update, delete on public.users to authenticated;
grant select, insert, update, delete on public.intakes to authenticated;
grant select, insert, update, delete on public.runs to authenticated;
grant select, insert, update, delete on public.agent_outputs to authenticated;
grant select, insert, update, delete on public.generated_assets to authenticated;
grant select, insert, update, delete on public.trend_refreshes to authenticated;
grant select, insert, update, delete on public.spending_log to authenticated;
grant select, insert, update, delete on public.service_tiers to authenticated;
grant select, insert, update, delete on public.competitor_cache to authenticated;
grant select, insert, update, delete on public.waitlist to authenticated;
grant select, insert, update, delete on public.monthly_cap to authenticated;

grant all on all tables in schema public to service_role;
