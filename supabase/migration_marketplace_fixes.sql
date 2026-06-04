-- ============================================================
-- MIGRATION: Marketplace Fixes & Missing Pieces
-- KonsultanAI v2.1 - Jalankan di SQL Editor Supabase
-- ============================================================
-- Catatan: Jalankan ini SETELAH marketplace_schema.sql
-- File ini AMAN untuk dijalankan berulang kali (idempotent)
-- ============================================================

-- ═══════════════════════════════════════════════════════════════
-- 1. FIX: valid_role constraint - tambah 'advokat'
-- ═══════════════════════════════════════════════════════════════
ALTER TABLE users DROP CONSTRAINT IF EXISTS valid_role;
ALTER TABLE users ADD CONSTRAINT valid_role CHECK (role IN ('user', 'admin', 'advokat'));

-- ═══════════════════════════════════════════════════════════════
-- 2. FIX: RLS - Admin bisa akses SEMUA tabel marketplace
-- ═══════════════════════════════════════════════════════════════

-- Admin bisa lihat SEMUA advocates (termasuk pending/rejected)
DROP POLICY IF EXISTS "Admins can view all advocates" ON advocates;
CREATE POLICY "Admins can view all advocates"
  ON advocates FOR SELECT
  USING (public.is_admin());

-- Admin bisa update advocates (setujui/tolak)
DROP POLICY IF EXISTS "Admins can update advocates" ON advocates;
CREATE POLICY "Admins can update advocates"
  ON advocates FOR UPDATE
  USING (public.is_admin());

-- Admin bisa lihat semua dokumen advokat
DROP POLICY IF EXISTS "Admins can view advocate documents" ON advocate_documents;
CREATE POLICY "Admins can view advocate documents"
  ON advocate_documents FOR SELECT
  USING (public.is_admin());

-- Admin bisa lihat semua bookings
DROP POLICY IF EXISTS "Admins can view all bookings" ON bookings;
CREATE POLICY "Admins can view all bookings"
  ON bookings FOR SELECT
  USING (public.is_admin());

-- Admin bisa update bookings
DROP POLICY IF EXISTS "Admins can update bookings" ON bookings;
CREATE POLICY "Admins can update bookings"
  ON bookings FOR UPDATE
  USING (public.is_admin());

-- Admin bisa lihat semua withdrawals
DROP POLICY IF EXISTS "Admins can view all withdrawals" ON withdrawals;
CREATE POLICY "Admins can view all withdrawals"
  ON withdrawals FOR SELECT
  USING (public.is_admin());

-- Admin bisa update withdrawals (proses penarikan)
DROP POLICY IF EXISTS "Admins can update withdrawals" ON withdrawals;
CREATE POLICY "Admins can update withdrawals"
  ON withdrawals FOR UPDATE
  USING (public.is_admin());

-- Admin bisa lihat semua listings
DROP POLICY IF EXISTS "Admins can view all listings" ON listings;
CREATE POLICY "Admins can view all listings"
  ON listings FOR SELECT
  USING (public.is_admin());

-- ═══════════════════════════════════════════════════════════════
-- 3. FIX: RLS - User bisa update role sendiri ke 'advokat' 
--    (hanya dari 'user' ke 'advokat', bukan ke 'admin')
-- ═══════════════════════════════════════════════════════════════
DROP POLICY IF EXISTS "Users can update own role to advokat" ON users;
CREATE POLICY "Users can update own role to advokat"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND (
      role IN ('user', 'advokat')  -- user hanya bisa set role ke user/advokat
    )
  );

-- ═══════════════════════════════════════════════════════════════
-- 4. Storage Bucket (aman jika sudah ada)
-- ═══════════════════════════════════════════════════════════════
INSERT INTO storage.buckets (id, name, public) 
VALUES ('advocate-docs', 'advocate-docs', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies (drop dulu biar aman re-run)
DROP POLICY IF EXISTS "Public can view advocate documents" ON storage.objects;
CREATE POLICY "Public can view advocate documents"
ON storage.objects FOR SELECT USING (bucket_id = 'advocate-docs');

DROP POLICY IF EXISTS "Advocates can upload own documents" ON storage.objects;
CREATE POLICY "Advocates can upload own documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'advocate-docs' AND
  (storage.foldername(name))[1] = 'advocates'
);

DROP POLICY IF EXISTS "Advocates can update own documents" ON storage.objects;
CREATE POLICY "Advocates can update own documents"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'advocate-docs' AND
  (storage.foldername(name))[1] = 'advocates'
);

-- ═══════════════════════════════════════════════════════════════
-- 5. Refresh PostgREST schema cache
-- ═══════════════════════════════════════════════════════════════
NOTIFY pgrst, 'reload schema';

-- ============================================================
-- SELESAI! ✅
-- Setelah menjalankan ini:
-- 1. Pendaftaran advokat akan berfungsi (role update works)
-- 2. Admin bisa melihat/verifikasi semua advokat
-- 3. Upload dokumen berfungsi (storage bucket ready)
-- 4. Penarikan saldo bisa dikelola admin
-- ============================================================
