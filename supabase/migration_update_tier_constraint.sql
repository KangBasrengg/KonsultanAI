-- 1. Pindahkan semua pengguna yang masih memiliki tier 'basic' (jika ada) ke tier 'free'
-- Hal ini wajib dilakukan, karena jika ada pengguna dengan tier 'basic' yang tersisa, 
-- PostgreSQL akan menolak constraint baru yang tidak memasukkan opsi 'basic'.
UPDATE public.users SET tier = 'free' WHERE tier = 'basic';

-- 2. Menghapus constraint tier yang lama
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS valid_tier;

-- 3. Menambahkan constraint tier yang baru (TANPA 'basic')
ALTER TABLE public.users ADD CONSTRAINT valid_tier CHECK (tier IN ('free', 'professional', 'enterprise', 'enterprise_member'));
