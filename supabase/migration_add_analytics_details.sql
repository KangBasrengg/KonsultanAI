-- Tambahkan kolom untuk menyimpan detail kasus anonim
ALTER TABLE public.case_analytics 
ADD COLUMN IF NOT EXISTS summary TEXT,
ADD COLUMN IF NOT EXISTS recommendation TEXT;
