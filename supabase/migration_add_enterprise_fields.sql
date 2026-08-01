-- 1. Add parent_id to users table to support Enterprise sub-accounts
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS institution_name TEXT;

-- 2. Create index for faster querying of sub-accounts
CREATE INDEX IF NOT EXISTS idx_users_parent_id ON public.users(parent_id);
