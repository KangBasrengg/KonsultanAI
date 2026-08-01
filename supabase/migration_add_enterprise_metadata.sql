-- Add enterprise metadata columns
ALTER TABLE public.users 
ADD COLUMN institution_type VARCHAR(50) DEFAULT 'swasta',
ADD COLUMN has_analytics_access BOOLEAN DEFAULT false;
