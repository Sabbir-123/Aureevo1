-- Create the analytics tracking table
CREATE TABLE public.analytics_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    session_id TEXT NOT NULL,
    path TEXT NOT NULL,
    product_id TEXT,
    duration_seconds INTEGER DEFAULT 0
);

-- Turn on Row Level Security (RLS)
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow anyone (even unauthenticated visitors) to INSERT new analytic events
CREATE POLICY "Allow anonymous inserts" ON public.analytics_events 
FOR INSERT TO public WITH CHECK (true);

-- Allow anyone to UPDATE an existing event (so we can update duration)
CREATE POLICY "Allow public updates for duration" ON public.analytics_events 
FOR UPDATE TO public USING (true);

-- Allow ONLY admins (or public for now) to SELECT events for the dashboard
CREATE POLICY "Allow all reads for dashboard" ON public.analytics_events 
FOR SELECT TO public USING (true);
