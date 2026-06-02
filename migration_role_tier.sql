-- ============================================================
-- MIGRATION: Add role column and admin policies
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Add 'role' column to users table
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS role text DEFAULT 'user' NOT NULL;

-- Add constraint to ensure valid roles
ALTER TABLE public.users
  ADD CONSTRAINT valid_role CHECK (role IN ('user', 'admin'));

-- 2. Add 'tier' column for subscription tier tracking
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS tier text DEFAULT 'free' NOT NULL;

-- Add constraint for valid tiers
ALTER TABLE public.users
  ADD CONSTRAINT valid_tier CHECK (tier IN ('free', 'basic', 'professional'));

-- 3. Update RLS policies for admin access
-- Allow admins to view all users
CREATE POLICY "Admins can view all users"
  ON public.users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users AS u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

-- Allow admins to update all users
CREATE POLICY "Admins can update all users"
  ON public.users FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users AS u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

-- 4. Set your admin user (replace with your actual email)
-- UPDATE public.users SET role = 'admin' WHERE email = 'your-admin-email@example.com';
