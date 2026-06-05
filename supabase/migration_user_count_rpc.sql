-- Jalankan script ini di SQL Editor Supabase Anda
CREATE OR REPLACE FUNCTION get_total_users_count()
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT count(*)::integer FROM public.users;
$$;
