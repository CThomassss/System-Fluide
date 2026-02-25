-- Food logs table: daily food tracking per user
create table if not exists public.food_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  date date not null,
  food_key text not null,
  food_label text not null,
  grams numeric(6,1) not null,
  calories integer not null,
  protein numeric(5,1) not null,
  carbs numeric(5,1) not null,
  fat numeric(5,1) not null,
  created_at timestamptz default now()
);

alter table public.food_logs enable row level security;

create policy "Users can view own food logs"
  on public.food_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert own food logs"
  on public.food_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own food logs"
  on public.food_logs for delete
  using (auth.uid() = user_id);
