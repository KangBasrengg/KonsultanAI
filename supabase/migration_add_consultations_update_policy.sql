-- MIGRATION: Add UPDATE policy for consultations table
-- Memperbolehkan pengguna memperbarui baris konsultasi milik mereka sendiri (misal: menyimpan hasil analisis AI)

DROP POLICY IF EXISTS "Users can update their own consultations" ON public.consultations;

CREATE POLICY "Users can update their own consultations" 
ON public.consultations 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
