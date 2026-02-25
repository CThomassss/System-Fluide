ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS target_calories_override boolean DEFAULT false;
