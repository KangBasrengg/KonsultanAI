-- ============================================================
-- MIGRATION: Subscription Live Chat & Storage
-- Run this AFTER migration_role_tier.sql
-- ============================================================

-- 0. Ensure is_admin() function exists (safe to re-run)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- 1. Drop existing tables if they exist to rebuild with new FKs
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.chats CASCADE;

-- 2. Create chats table
CREATE TABLE public.chats (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  plan text NOT NULL,
  status text DEFAULT 'open' NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create messages table
CREATE TABLE public.messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id uuid REFERENCES public.chats(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  content text,
  image_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable RLS
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies if re-running
DROP POLICY IF EXISTS "Users can view their own chats" ON public.chats;
DROP POLICY IF EXISTS "Users can insert their own chats" ON public.chats;
DROP POLICY IF EXISTS "Admins can view all chats" ON public.chats;
DROP POLICY IF EXISTS "Admins can update all chats" ON public.chats;
DROP POLICY IF EXISTS "Users can view messages of their chats" ON public.messages;
DROP POLICY IF EXISTS "Users can insert messages" ON public.messages;
DROP POLICY IF EXISTS "Admins can read users for chat" ON public.users;

-- 5. RLS Policies for Chats
-- Users can view their own chats
CREATE POLICY "Users can view their own chats" ON public.chats 
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

-- Users can insert their own chats
CREATE POLICY "Users can insert their own chats" ON public.chats 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can update all chats (mark resolved, etc.)
CREATE POLICY "Admins can update all chats" ON public.chats 
  FOR UPDATE USING (public.is_admin());

-- 6. RLS Policies for Messages
-- Users can view messages of their chats, Admins can view all
CREATE POLICY "Users can view messages of their chats" ON public.messages 
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.chats WHERE id = chat_id AND user_id = auth.uid()) 
    OR public.is_admin()
  );

-- Users can insert messages to their chats, Admins can insert to any
CREATE POLICY "Users can insert messages" ON public.messages 
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.chats WHERE id = chat_id AND user_id = auth.uid()) 
    OR public.is_admin()
  );

-- 7. Admin needs to read users table for the chat join (full_name, email)
CREATE POLICY "Admins can read users for chat" ON public.users
  FOR SELECT USING (public.is_admin());

-- 8. Enable Realtime for these tables (safe to re-run)
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.chats;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 9. Create Storage Bucket for chat images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('chat-images', 'chat-images', true) 
ON CONFLICT DO NOTHING;

-- 10. Drop existing storage policies if re-running
DROP POLICY IF EXISTS "Anyone can view chat images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload chat images" ON storage.objects;

-- 11. Storage Policies
CREATE POLICY "Anyone can view chat images" ON storage.objects 
  FOR SELECT USING (bucket_id = 'chat-images');
CREATE POLICY "Authenticated users can upload chat images" ON storage.objects 
  FOR INSERT WITH CHECK (bucket_id = 'chat-images' AND auth.role() = 'authenticated');
