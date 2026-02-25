-- Custom foods table: admin-defined foods with macro data
create table if not exists public.custom_foods (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  protein_per_100g numeric(5,1) not null,
  carbs_per_100g numeric(5,1) not null,
  fat_per_100g numeric(5,1) not null,
  calories_per_100g numeric(5,1) not null,
  created_at timestamptz default now()
);

alter table public.custom_foods enable row level security;

-- Admin full access
create policy "Admin can manage custom foods"
  on public.custom_foods for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Users can read custom foods
create policy "Users can view custom foods"
  on public.custom_foods for select
  using (auth.uid() is not null);
