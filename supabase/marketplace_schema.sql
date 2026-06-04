-- ============================================================
-- Marketplace Advokat - Database Schema
-- KonsultanAI v2.1
-- ============================================================

-- 1. Advocates table
CREATE TABLE IF NOT EXISTS advocates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  license_number TEXT NOT NULL,          -- Nomor Induk Advokat
  organization TEXT NOT NULL,            -- Organisasi Advokat
  experience_years INTEGER NOT NULL DEFAULT 0,
  cases_handled INTEGER,                 -- Opsional
  bio TEXT,
  photo_url TEXT,
  bank_name TEXT NOT NULL,               -- Nama Bank (Private)
  bank_account TEXT NOT NULL,            -- Nomor Rekening (Private)
  balance INTEGER NOT NULL DEFAULT 0,    -- Saldo (Rupiah)
  consultation_rate INTEGER NOT NULL DEFAULT 50000,  -- Tarif konsultasi (Rupiah)
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  rating_avg NUMERIC(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id),
  UNIQUE(license_number)
);

-- 2. Advocate Specializations
CREATE TABLE IF NOT EXISTS advocate_specializations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advocate_id UUID NOT NULL REFERENCES advocates(id) ON DELETE CASCADE,
  field TEXT NOT NULL,                    -- e.g. 'pidana', 'perdata', 'cybercrime'
  expertise_percent INTEGER NOT NULL CHECK (expertise_percent >= 1 AND expertise_percent <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Advocate Documents
CREATE TABLE IF NOT EXISTS advocate_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advocate_id UUID NOT NULL REFERENCES advocates(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('ktp', 'kartu_advokat', 'berita_acara_sumpah')),
  file_url TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Marketplace Listings
CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advocate_id UUID NOT NULL REFERENCES advocates(id) ON DELETE CASCADE,
  listing_start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  listing_expired_date TIMESTAMPTZ NOT NULL,
  listing_status TEXT NOT NULL DEFAULT 'active' CHECK (listing_status IN ('active', 'expired', 'cancelled')),
  payment_order_id TEXT,
  payment_amount INTEGER NOT NULL DEFAULT 50000,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Bookings (Konsultasi dengan Advokat)
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  advocate_id UUID NOT NULL REFERENCES advocates(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  consultation_rate INTEGER NOT NULL,     -- Tarif saat booking
  platform_fee INTEGER NOT NULL,          -- Komisi platform
  advocate_earning INTEGER NOT NULL,      -- Pendapatan bersih advokat
  payment_order_id TEXT,
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
  notes TEXT,
  scheduled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Reviews
CREATE TABLE IF NOT EXISTS advocate_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  advocate_id UUID NOT NULL REFERENCES advocates(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(booking_id)
);

-- 7. Withdrawals (Penarikan Saldo)
CREATE TABLE IF NOT EXISTS withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advocate_id UUID NOT NULL REFERENCES advocates(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL CHECK (amount > 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
  bank_name TEXT NOT NULL,
  bank_account TEXT NOT NULL,
  notes TEXT,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Platform Settings (untuk komisi dll)
CREATE TABLE IF NOT EXISTS platform_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Default settings
INSERT INTO platform_settings (key, value) VALUES ('commission_percent', '10') ON CONFLICT DO NOTHING;
INSERT INTO platform_settings (key, value) VALUES ('listing_fee', '50000') ON CONFLICT DO NOTHING;
INSERT INTO platform_settings (key, value) VALUES ('listing_duration_days', '30') ON CONFLICT DO NOTHING;

-- Update users table: add 'advokat' role
ALTER TABLE users ADD COLUMN IF NOT EXISTS advocate_id UUID REFERENCES advocates(id);

-- ============================================================
-- RLS Policies
-- ============================================================

-- Advocates: public read for approved, own write
ALTER TABLE advocates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view approved advocates"
  ON advocates FOR SELECT
  USING (verification_status = 'approved');

CREATE POLICY "Users can view own advocate profile"
  ON advocates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own advocate profile"
  ON advocates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own advocate profile"
  ON advocates FOR UPDATE
  USING (auth.uid() = user_id);

-- Specializations: public read, own write
ALTER TABLE advocate_specializations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view specializations"
  ON advocate_specializations FOR SELECT
  USING (true);

CREATE POLICY "Advocates can manage own specializations"
  ON advocate_specializations FOR ALL
  USING (advocate_id IN (SELECT id FROM advocates WHERE user_id = auth.uid()));

-- Documents: only own and admin
ALTER TABLE advocate_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Advocates can manage own documents"
  ON advocate_documents FOR ALL
  USING (advocate_id IN (SELECT id FROM advocates WHERE user_id = auth.uid()));

-- Listings: public read active, own write
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active listings"
  ON listings FOR SELECT
  USING (listing_status = 'active');

CREATE POLICY "Advocates can manage own listings"
  ON listings FOR ALL
  USING (advocate_id IN (SELECT id FROM advocates WHERE user_id = auth.uid()));

-- Bookings: own read/write
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = user_id OR advocate_id IN (SELECT id FROM advocates WHERE user_id = auth.uid()));

CREATE POLICY "Users can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Reviews: public read, own write
ALTER TABLE advocate_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view reviews"
  ON advocate_reviews FOR SELECT
  USING (true);

CREATE POLICY "Users can create own reviews"
  ON advocate_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Withdrawals: own read/write
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Advocates can view own withdrawals"
  ON withdrawals FOR SELECT
  USING (advocate_id IN (SELECT id FROM advocates WHERE user_id = auth.uid()));

CREATE POLICY "Advocates can request withdrawals"
  ON withdrawals FOR INSERT
  WITH CHECK (advocate_id IN (SELECT id FROM advocates WHERE user_id = auth.uid()));

-- ============================================================
-- Storage Bucket for Advocate Documents
-- ============================================================

INSERT INTO storage.buckets (id, name, public) 
VALUES ('advocate-docs', 'advocate-docs', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Public can view advocate documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'advocate-docs');

CREATE POLICY "Advocates can upload own documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'advocate-docs' AND
  (storage.foldername(name))[1] = 'advocates'
);

CREATE POLICY "Advocates can update own documents"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'advocate-docs' AND
  (storage.foldername(name))[1] = 'advocates'
);
