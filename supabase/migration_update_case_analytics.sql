-- Add case_id to case_analytics to link with real-time chat messages
ALTER TABLE public.case_analytics
ADD COLUMN IF NOT EXISTS case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE;

-- Allow regular authenticated users to insert into case_analytics
DROP POLICY IF EXISTS "Service can insert analytics" ON public.case_analytics;
CREATE POLICY "Users can insert analytics" ON public.case_analytics
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
