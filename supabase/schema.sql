-- Execute this in the Supabase SQL Editor

-- Profiles table (auto-created on signup via trigger)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  goal text,
  target_calories integer,
  tdee integer,
  bmr integer,
  created_at timestamptz default now()
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

-- Daily entries table
create table if not exists public.daily_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  date date not null,
  weight numeric(5,2),
  steps integer,
  calories integer,
  created_at timestamptz default now(),
  unique (user_id, date)
);

alter table public.daily_entries enable row level security;

create policy "Users can view own entries"
  on public.daily_entries for select
  using (auth.uid() = user_id);

create policy "Users can insert own entries"
  on public.daily_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update own entries"
  on public.daily_entries for update
  using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
