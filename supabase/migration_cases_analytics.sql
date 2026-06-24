-- ============================================================
-- PRD v2.5 Migration: Cases + Case Analytics Tables
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Create Cases Table (Intake Form submissions)
CREATE TABLE IF NOT EXISTS public.cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  case_type VARCHAR NOT NULL,           -- pidana, perdata, keluarga, bisnis
  sub_category VARCHAR NOT NULL,        -- penipuan, perceraian, sengketa_tanah, etc.
  kronologi TEXT NOT NULL,
  wilayah VARCHAR NOT NULL,             -- Kabupaten/Kota
  jumlah_nilai NUMERIC DEFAULT 0,       -- Nilai uang terlibat (Rupiah)
  urgency_level VARCHAR NOT NULL DEFAULT 'normal',  -- immediate, normal, planning
  sudah_advokat BOOLEAN DEFAULT false,
  sudah_lapor_polisi BOOLEAN DEFAULT false,
  
  -- AI Triage Results (stored after classifier runs)
  triage_severity INT CHECK (triage_severity BETWEEN 1 AND 5),
  triage_recommendation VARCHAR,        -- AI_ANALYSIS, LEARNING_FIRST, ADVOKAT_URGENT, TEMPLATES
  triage_result TEXT,                   -- Full AI triage text output
  recommended_modules TEXT[],           -- Array of recommended learning module IDs
  
  -- Case lifecycle
  status VARCHAR DEFAULT 'open',        -- open, in_progress, closed, abandoned
  outcome VARCHAR,                      -- settled, ongoing, escalated, abandoned
  closed_at TIMESTAMP WITH TIME ZONE,
  
  -- Analytics reference
  analytics_id UUID,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for cases
CREATE INDEX IF NOT EXISTS idx_cases_user ON public.cases(user_id);
CREATE INDEX IF NOT EXISTS idx_cases_type ON public.cases(case_type, created_at);
CREATE INDEX IF NOT EXISTS idx_cases_wilayah ON public.cases(wilayah, created_at);

-- Enable RLS for Cases
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;

-- Users can see own cases
DROP POLICY IF EXISTS "Users can view own cases" ON public.cases;
CREATE POLICY "Users can view own cases" ON public.cases
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create cases
DROP POLICY IF EXISTS "Users can create cases" ON public.cases;
CREATE POLICY "Users can create cases" ON public.cases
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update own cases
DROP POLICY IF EXISTS "Users can update own cases" ON public.cases;
CREATE POLICY "Users can update own cases" ON public.cases
  FOR UPDATE USING (auth.uid() = user_id);

-- Admin can see all cases
DROP POLICY IF EXISTS "Admin can view all cases" ON public.cases;
CREATE POLICY "Admin can view all cases" ON public.cases
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 2. Create Case Analytics Table (Anonymized)
CREATE TABLE IF NOT EXISTS public.case_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_type VARCHAR NOT NULL,
  sub_category VARCHAR,
  severity_level INT CHECK (severity_level BETWEEN 1 AND 5),
  urgency_level VARCHAR,
  wilayah_kabupaten VARCHAR,
  wilayah_provinsi VARCHAR,
  outcome VARCHAR,                      -- settled, ongoing, escalated, abandoned
  has_advokat BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  closed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for analytics
CREATE INDEX IF NOT EXISTS idx_analytics_wilayah_time ON public.case_analytics(wilayah_kabupaten, created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_type_time ON public.case_analytics(case_type, created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_severity ON public.case_analytics(severity_level, created_at);

-- Enable RLS for Analytics
ALTER TABLE public.case_analytics ENABLE ROW LEVEL SECURITY;

-- Government/Business role can read aggregated analytics
DROP POLICY IF EXISTS "Business tier read analytics" ON public.case_analytics;
CREATE POLICY "Business tier read analytics" ON public.case_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND (role = 'admin' OR role = 'government' OR role = 'enterprise')
    )
    AND is_deleted = false
  );

-- Admin can insert analytics records
DROP POLICY IF EXISTS "Service can insert analytics" ON public.case_analytics;
CREATE POLICY "Service can insert analytics" ON public.case_analytics
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Add analytics_id FK to cases (after both tables exist)
ALTER TABLE public.cases DROP CONSTRAINT IF EXISTS fk_cases_analytics;
ALTER TABLE public.cases 
  ADD CONSTRAINT fk_cases_analytics 
  FOREIGN KEY (analytics_id) REFERENCES public.case_analytics(id);

-- 3. Updated timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS cases_updated_at ON public.cases;
CREATE TRIGGER cases_updated_at
  BEFORE UPDATE ON public.cases
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
