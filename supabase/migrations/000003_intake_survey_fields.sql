-- Optional survey fields for richer intake data
alter table public.intakes
  add column if not exists company_type text,
  add column if not exists website text,
  add column if not exists instagram text,
  add column if not exists social_links text,
  add column if not exists referral_source text,
  add column if not exists ai_tools_known text;
