-- Migration: Legal Learning Center
-- Description: Tabel-tabel untuk fitur Legal Learning Center berdasarkan PRD Phase 2.

-- 1. Tabel Kategori Hukum
CREATE TABLE IF NOT EXISTS public.legal_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL, -- e.g., Hukum Pidana, Hukum Perdata
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. Tabel Materi Hukum
CREATE TABLE IF NOT EXISTS public.legal_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.legal_categories(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0, -- Urutan materi dalam kategori
    is_premium BOOLEAN DEFAULT FALSE, -- True jika butuh langganan tier tertentu
    required_tier VARCHAR(50) DEFAULT 'free', -- free, basic, professional, business
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. Tabel Progres Belajar Pengguna
CREATE TABLE IF NOT EXISTS public.user_learning_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    material_id UUID NOT NULL REFERENCES public.legal_materials(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(user_id, material_id)
);

-- 4. Tabel Kuis Evaluasi
CREATE TABLE IF NOT EXISTS public.legal_quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_id UUID NOT NULL REFERENCES public.legal_materials(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options JSONB NOT NULL, -- Format: ["Opsi A", "Opsi B", "Opsi C", "Opsi D"]
    correct_option_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 5. Tabel Sertifikat Pengguna (Hanya Professional/Business)
CREATE TABLE IF NOT EXISTS public.user_certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.legal_categories(id) ON DELETE CASCADE,
    certificate_url TEXT NOT NULL,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(user_id, category_id)
);

-- RLS Policies (Row Level Security)

-- Aktifkan RLS untuk semua tabel
ALTER TABLE public.legal_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_certificates ENABLE ROW LEVEL SECURITY;

-- Policy Categories: Bisa dibaca semua orang
CREATE POLICY "Categories are viewable by everyone" ON public.legal_categories
    FOR SELECT USING (true);

-- Policy Materials: Bisa dibaca oleh yang terautentikasi (nanti difilter via backend/API sesuai tier)
CREATE POLICY "Materials are viewable by authenticated users" ON public.legal_materials
    FOR SELECT USING (auth.role() = 'authenticated');

-- Policy Progress: User hanya bisa melihat dan mengupdate progress mereka sendiri
CREATE POLICY "Users can view own progress" ON public.user_learning_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON public.user_learning_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.user_learning_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy Quizzes: Bisa dibaca oleh yang terautentikasi
CREATE POLICY "Quizzes are viewable by authenticated users" ON public.legal_quizzes
    FOR SELECT USING (auth.role() = 'authenticated');

-- Policy Certificates: User hanya bisa melihat sertifikat mereka sendiri
CREATE POLICY "Users can view own certificates" ON public.user_certificates
    FOR SELECT USING (auth.uid() = user_id);
