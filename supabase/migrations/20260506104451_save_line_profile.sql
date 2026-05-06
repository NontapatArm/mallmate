-- LINE profiles — stores every user who has logged in via LIFF
-- Not tied to auth.users because LIFF users don't have Supabase auth accounts
create table public.line_profiles (
  line_user_id    text        primary key,
  display_name    text,
  picture_url     text,
  status_message  text,
  last_seen_at    timestamptz not null default now(),
  created_at      timestamptz not null default now()
);

alter table public.line_profiles enable row level security;

-- Allow anyone (anon) to upsert their own LINE profile
-- The line_user_id is the only identity we have for LIFF users
create policy "Anyone can upsert line profiles"
  on public.line_profiles for all
  using (true)
  with check (true);
