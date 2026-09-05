create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  quit_date date not null default current_date,
  cigarettes_per_day numeric not null default 10,
  cigarettes_per_pack numeric not null default 20,
  cost_per_pack numeric not null default 8,
  created_at timestamptz not null default now()
);

create table if not exists public.craving_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  trigger text not null,
  intensity smallint check (intensity between 1 and 10),
  outcome text not null check (outcome in ('survived', 'smoked')),
  created_at timestamptz not null default now()
);

create index if not exists craving_logs_user_id_created_at_idx
  on public.craving_logs (user_id, created_at desc);


alter table public.profiles enable row level security;
alter table public.craving_logs enable row level security;

create policy "profiles: read own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id);
create policy "profiles: insert own" on public.profiles
  for insert with check (auth.uid() = id);

create policy "craving_logs: read own" on public.craving_logs
  for select using (auth.uid() = user_id);
create policy "craving_logs: insert own" on public.craving_logs
  for insert with check (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
