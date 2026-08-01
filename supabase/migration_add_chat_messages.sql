-- Create chat_messages table to store real-time conversation history
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID, -- Can be consultation_id or case_id
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL, -- 'user', 'assistant'
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own chat messages" ON public.chat_messages 
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own chat messages" ON public.chat_messages 
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all chat messages" ON public.chat_messages 
FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND (u.role = 'admin' OR u.tier = 'enterprise'))
);
