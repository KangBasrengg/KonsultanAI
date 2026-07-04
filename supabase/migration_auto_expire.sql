-- ============================================================
-- MIGRATION: Auto Downgrade Expired Subscriptions
-- ============================================================

-- 1. Add subscription_expires_at to the users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS subscription_expires_at timestamp with time zone;

-- 2. Create the function to downgrade expired subscriptions
CREATE OR REPLACE FUNCTION public.downgrade_expired_subscriptions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.users
  SET 
    tier = 'Free',
    is_premium = false,
    subscription_expires_at = null
  WHERE 
    subscription_expires_at IS NOT NULL 
    AND subscription_expires_at <= now();
END;
$$;

-- 3. Enable the pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 4. Schedule the job to run every day at midnight (00:00 UTC)
-- Note: This requires the pg_cron extension and might need to be run as postgres role
SELECT cron.schedule(
  'downgrade-expired-subscriptions-daily', -- Job name
  '0 0 * * *',                             -- Cron schedule (every day at midnight)
  'SELECT public.downgrade_expired_subscriptions();'
);
