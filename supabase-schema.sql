-- CleanStart Game Database Schema
-- Run this in your Supabase SQL Editor

create table public.games (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  quarter integer not null default 1,
  cash numeric not null default 1000000,
  engineers integer not null default 4,
  sales_staff integer not null default 2,
  quality numeric not null default 50,
  status text not null default 'active' check (status in ('active', 'won', 'lost')),
  cumulative_revenue numeric not null default 0,
  cumulative_costs numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.game_turns (
  id uuid primary key default gen_random_uuid(),
  game_id uuid references public.games(id) on delete cascade not null,
  quarter integer not null,
  unit_price numeric not null,
  new_engineers integer not null,
  new_sales integer not null,
  salary_pct numeric not null,
  revenue numeric not null,
  units_sold integer not null,
  net_income numeric not null,
  cash_after numeric not null,
  engineers_after integer not null,
  sales_after integer not null,
  total_costs numeric not null,
  created_at timestamptz not null default now()
);

create index idx_games_user on public.games(user_id);
create index idx_turns_game on public.game_turns(game_id);

alter table public.games enable row level security;
alter table public.game_turns enable row level security;

create policy "Users can view own games"
  on public.games for select
  using (auth.uid() = user_id);

create policy "Users can insert own games"
  on public.games for insert
  with check (auth.uid() = user_id);

create policy "Users can update own games"
  on public.games for update
  using (auth.uid() = user_id);

create policy "Users can view own turns"
  on public.game_turns for select
  using (
    game_id in (select id from public.games where user_id = auth.uid())
  );

create policy "Users can insert own turns"
  on public.game_turns for insert
  with check (
    game_id in (select id from public.games where user_id = auth.uid())
  );
