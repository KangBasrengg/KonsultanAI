-- ============================================================
-- MIGRATION: Transactions & E-Commerce Flow
-- ============================================================

CREATE TABLE IF NOT EXISTS public.transactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id text UNIQUE NOT NULL,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  plan_name text NOT NULL,
  amount numeric NOT NULL,
  status text DEFAULT 'PENDING' NOT NULL,
  snap_token text,
  payment_method text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can insert their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Admins can view all transactions" ON public.transactions;
DROP POLICY IF EXISTS "Admins can update all transactions" ON public.transactions;
DROP POLICY IF EXISTS "Service role can manage all transactions" ON public.transactions;

-- RLS Policies
CREATE POLICY "Users can view their own transactions" ON public.transactions 
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can insert their own transactions" ON public.transactions 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update all transactions" ON public.transactions 
  FOR UPDATE USING (public.is_admin());

-- Allow service role to bypass RLS for webhook updates
CREATE POLICY "Service role can manage all transactions" ON public.transactions
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');
