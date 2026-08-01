-- ============================================================
-- MIGRATION: Add token_balance column for Pay-As-You-Go feature
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Add 'token_balance' column to users table
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS token_balance integer DEFAULT 0 NOT NULL;

-- 2. Optional: Function to add tokens securely
CREATE OR REPLACE FUNCTION public.add_tokens(user_id uuid, amount integer)
RETURNS void AS $$
BEGIN
  UPDATE public.users
  SET token_balance = token_balance + amount
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
