-- Migration script to update RLS for case_analytics

-- Hapus kebijakan (policy) RLS 'SELECT' lama jika ada, 
-- agar kita bisa menggantinya dengan kebijakan yang baru.
-- (Ganti nama 'Select Policy' dengan nama policy lama Anda jika berbeda)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.case_analytics;
DROP POLICY IF EXISTS "Allow select for admin" ON public.case_analytics;

-- Buat kebijakan baru yang aman tanpa perlu bypass di Backend
-- Kebijakan ini akan mengizinkan akses 'SELECT' (baca) jika pengguna yang login:
-- 1. Memiliki role 'admin' atau 'government'
-- 2. Memiliki has_analytics_access = true (dicentang oleh superadmin)
-- 3. Atau memiliki institution_type = 'pemerintah'
CREATE POLICY "Allow authorized users to read case_analytics" 
ON public.case_analytics 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() 
    AND (
      users.role IN ('admin', 'government') 
      OR users.has_analytics_access = true 
      OR users.institution_type = 'pemerintah'
    )
  )
);
