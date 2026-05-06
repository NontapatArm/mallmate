-- ─────────────────────────────────────────────
-- MallMate — initial schema
-- ─────────────────────────────────────────────

-- uuid-ossp not needed; gen_random_uuid() is built-in since Postgres 13

-- ── Profiles ────────────────────────────────
create table public.profiles (
  id          uuid        primary key references auth.users(id) on delete cascade,
  full_name   text,
  email       text,
  phone       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, phone)
  values (new.id, new.phone);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Malls ───────────────────────────────────
create table public.malls (
  id           uuid        primary key default gen_random_uuid(),
  name         text        not null,
  icon         text        not null default '🏢',
  dist_km      numeric(4,1),
  store_count  text,
  featured     boolean     not null default false,
  address      text,
  open_time    time,
  close_time   time,
  created_at   timestamptz not null default now()
);
alter table public.malls enable row level security;

create policy "Malls are publicly readable"
  on public.malls for select
  using (true);

-- ── Stores ──────────────────────────────────
create type public.store_type as enum ('restaurant', 'shopping', 'services');

create table public.stores (
  id               uuid              primary key default gen_random_uuid(),
  mall_id          uuid              not null references public.malls(id) on delete cascade,
  name             text              not null,
  icon             text              not null default '🏪',
  floor            text,
  avg_wait_minutes integer           not null default 0,
  type             public.store_type not null,
  created_at       timestamptz       not null default now()
);
alter table public.stores enable row level security;

create policy "Stores are publicly readable"
  on public.stores for select
  using (true);

-- ── Queue Reservations ───────────────────────
create type public.reservation_status as enum ('waiting', 'ready', 'completed', 'cancelled');

create table public.queue_reservations (
  id              uuid                      primary key default gen_random_uuid(),
  user_id         uuid                      not null references auth.users(id) on delete cascade,
  store_id        uuid                      not null references public.stores(id),
  mall_id         uuid                      not null references public.malls(id),
  party_size      integer                   not null default 1,
  estimated_wait  integer                   not null default 0,
  status          public.reservation_status not null default 'waiting',
  created_at      timestamptz               not null default now(),
  updated_at      timestamptz               not null default now()
);
alter table public.queue_reservations enable row level security;

create policy "Users can view own reservations"
  on public.queue_reservations for select
  using (auth.uid() = user_id);

create policy "Users can insert own reservations"
  on public.queue_reservations for insert
  with check (auth.uid() = user_id);

create policy "Users can update own reservations"
  on public.queue_reservations for update
  using (auth.uid() = user_id);

-- ── Parking Records ──────────────────────────
create type public.parking_status as enum ('active', 'expired');

create table public.parking_records (
  id          uuid                  primary key default gen_random_uuid(),
  user_id     uuid                  not null references auth.users(id) on delete cascade,
  mall_id     uuid                  not null references public.malls(id),
  level       text                  not null,
  zone        text                  not null,
  spot        text                  not null,
  status      public.parking_status not null default 'active',
  saved_at    timestamptz           not null default now(),
  expires_at  timestamptz           not null default now() + interval '12 hours'
);
alter table public.parking_records enable row level security;

create policy "Users can view own parking"
  on public.parking_records for select
  using (auth.uid() = user_id);

create policy "Users can insert own parking"
  on public.parking_records for insert
  with check (auth.uid() = user_id);

create policy "Users can update own parking"
  on public.parking_records for update
  using (auth.uid() = user_id);

-- ── Seed: Malls ─────────────────────────────
insert into public.malls (id, name, icon, dist_km, store_count, featured, address) values
  ('11111111-0000-0000-0000-000000000001', 'Central World',     '🏢', 2.3, '500+', true,  'Ratchadamri Rd, Pathum Wan, Bangkok'),
  ('11111111-0000-0000-0000-000000000002', 'Siam Paragon',      '🏬', 1.8, '350+', false, '991 Rama I Rd, Pathum Wan, Bangkok'),
  ('11111111-0000-0000-0000-000000000003', 'EmQuartier',        '🏘️', 3.1, '280+', false, '689 Sukhumvit Rd, Khlong Toei, Bangkok'),
  ('11111111-0000-0000-0000-000000000004', 'The Mall Bangkapi', '🏪', 5.2, '220+', false, '3522 Ladprao Rd, Wang Thonglang, Bangkok');

-- ── Seed: Stores ────────────────────────────
insert into public.stores (mall_id, name, icon, floor, avg_wait_minutes, type) values
  ('11111111-0000-0000-0000-000000000001', 'Siam Kitchen',  '🍽️', 'L3', 28, 'restaurant'),
  ('11111111-0000-0000-0000-000000000001', 'Ramen House',   '🍜', 'L2', 15, 'restaurant'),
  ('11111111-0000-0000-0000-000000000001', 'Café Amazon',   '☕',  'G',   8, 'restaurant'),
  ('11111111-0000-0000-0000-000000000001', 'Zara',          '👗', 'L1',   0, 'shopping'),
  ('11111111-0000-0000-0000-000000000001', 'Watsons',       '💊', 'G',    0, 'services'),
  ('11111111-0000-0000-0000-000000000002', 'Food Republic', '🍱', 'L4',  20, 'restaurant'),
  ('11111111-0000-0000-0000-000000000002', 'H&M',           '👔', 'L2',   0, 'shopping'),
  ('11111111-0000-0000-0000-000000000003', 'Kinokuniya',    '📚', 'L3',   0, 'shopping'),
  ('11111111-0000-0000-0000-000000000003', 'Roast Coffee',  '☕',  'L1',  12, 'restaurant');

-- ── Indexes ─────────────────────────────────
create index on public.stores (mall_id);
create index on public.queue_reservations (user_id);
create index on public.queue_reservations (store_id);
create index on public.parking_records (user_id);
create index on public.parking_records (mall_id);
