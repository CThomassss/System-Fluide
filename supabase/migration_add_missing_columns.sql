-- Migration: Add missing columns to profiles table
-- Run this in the Supabase SQL Editor

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS first_name text,
  ADD COLUMN IF NOT EXISTS last_name text,
  ADD COLUMN IF NOT EXISTS sex text,
  ADD COLUMN IF NOT EXISTS height numeric(5,1),
  ADD COLUMN IF NOT EXISTS weight numeric(5,1),
  ADD COLUMN IF NOT EXISTS age integer,
  ADD COLUMN IF NOT EXISTS activity_level text,
  ADD COLUMN IF NOT EXISTS training_data text,
  ADD COLUMN IF NOT EXISTS custom_meals text,
  ADD COLUMN IF NOT EXISTS role text DEFAULT 'user';
