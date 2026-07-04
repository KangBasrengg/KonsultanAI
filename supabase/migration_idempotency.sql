-- Create processed_webhooks table for idempotency
CREATE TABLE IF NOT EXISTS public.processed_webhooks (
    order_id TEXT PRIMARY KEY,
    status TEXT NOT NULL,
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS but allow no access (only service role can access)
ALTER TABLE public.processed_webhooks ENABLE ROW LEVEL SECURITY;
