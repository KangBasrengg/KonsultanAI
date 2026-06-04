-- ============================================================
-- MIGRATION: Consultation Chat Rooms (Advokat-User)
-- KonsultanAI v2.2 - Jalankan di SQL Editor Supabase
-- ============================================================
-- SETELAH menjalankan: migration_marketplace_fixes.sql
-- ============================================================

-- 1. Consultation Rooms (terbuat otomatis setelah payment sukses)
CREATE TABLE IF NOT EXISTS consultation_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  advocate_id UUID NOT NULL REFERENCES advocates(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired')),
  expires_at TIMESTAMPTZ,  -- Batas waktu konsultasi (opsional)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(booking_id)
);

-- 2. Consultation Messages
CREATE TABLE IF NOT EXISTS consultation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES consultation_rooms(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable RLS
ALTER TABLE consultation_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_messages ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies if re-running
DROP POLICY IF EXISTS "Users can view own consultation rooms" ON consultation_rooms;
DROP POLICY IF EXISTS "Advocates can view own consultation rooms" ON consultation_rooms;
DROP POLICY IF EXISTS "System can create consultation rooms" ON consultation_rooms;
DROP POLICY IF EXISTS "Admins can view all consultation rooms" ON consultation_rooms;
DROP POLICY IF EXISTS "Users can view messages in their rooms" ON consultation_messages;
DROP POLICY IF EXISTS "Users can send messages in their rooms" ON consultation_messages;
DROP POLICY IF EXISTS "Admins can view all consultation messages" ON consultation_messages;

-- 5. RLS Policies for Consultation Rooms
-- Users can view rooms where they are the client
CREATE POLICY "Users can view own consultation rooms" ON consultation_rooms
  FOR SELECT USING (auth.uid() = user_id);

-- Advocates can view rooms where they are the advocate
CREATE POLICY "Advocates can view own consultation rooms" ON consultation_rooms
  FOR SELECT USING (
    advocate_id IN (SELECT id FROM advocates WHERE user_id = auth.uid())
  );

-- Authenticated users can create rooms (called from server-side after payment)
CREATE POLICY "System can create consultation rooms" ON consultation_rooms
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins see all
CREATE POLICY "Admins can view all consultation rooms" ON consultation_rooms
  FOR SELECT USING (public.is_admin());

-- Allow room status updates by participants
DROP POLICY IF EXISTS "Participants can update room status" ON consultation_rooms;
CREATE POLICY "Participants can update room status" ON consultation_rooms
  FOR UPDATE USING (
    auth.uid() = user_id 
    OR advocate_id IN (SELECT id FROM advocates WHERE user_id = auth.uid())
    OR public.is_admin()
  );

-- 6. RLS Policies for Consultation Messages
-- Both user and advocate in the room can read messages
CREATE POLICY "Users can view messages in their rooms" ON consultation_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM consultation_rooms 
      WHERE id = room_id 
      AND (
        user_id = auth.uid() 
        OR advocate_id IN (SELECT id FROM advocates WHERE user_id = auth.uid())
      )
    )
    OR public.is_admin()
  );

-- Both user and advocate can send messages
CREATE POLICY "Users can send messages in their rooms" ON consultation_messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM consultation_rooms 
      WHERE id = room_id 
      AND status = 'active'
      AND (
        user_id = auth.uid() 
        OR advocate_id IN (SELECT id FROM advocates WHERE user_id = auth.uid())
      )
    )
  );

-- 7. Enable Realtime
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE consultation_rooms;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE consultation_messages;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 8. Storage bucket for consultation attachments
INSERT INTO storage.buckets (id, name, public) 
VALUES ('consultation-files', 'consultation-files', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "View consultation files" ON storage.objects;
CREATE POLICY "View consultation files" ON storage.objects
  FOR SELECT USING (bucket_id = 'consultation-files');

DROP POLICY IF EXISTS "Upload consultation files" ON storage.objects;
CREATE POLICY "Upload consultation files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'consultation-files' AND auth.role() = 'authenticated');

-- ============================================================
-- SELESAI! ✅
-- Tabel consultation_rooms & consultation_messages siap digunakan.
-- ============================================================
