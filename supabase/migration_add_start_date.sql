-- ============================================================
-- MIGRATION: Add Subscription Start Date
-- ============================================================

-- 1. Add subscription_started_at to the users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS subscription_started_at timestamp with time zone;

-- 2. Koreksi data untuk semua user Premium saat ini
-- Menetapkan tanggal mulai = hari ini, dan tanggal berakhir = 30 hari dari sekarang
UPDATE public.users
SET 
  subscription_started_at = now(),
  subscription_expires_at = now() + interval '30 days'
WHERE 
  role != 'admin' 
  AND (is_premium = true OR tier != 'Free Trial');

-- 3. Perbarui fungsi downgrade_expired_subscriptions agar mereset tanggal mulai juga
CREATE OR REPLACE FUNCTION public.downgrade_expired_subscriptions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.users
  SET 
    tier = 'Free Trial',
    is_premium = false,
    subscription_started_at = null,
    subscription_expires_at = null
  WHERE 
    subscription_expires_at IS NOT NULL 
    AND subscription_expires_at <= now();
END;
$$;
