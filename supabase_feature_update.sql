-- ============================================
-- AUREEVO Database Update for Custom Orders, Finance, and Analytics
-- Run this SQL in your Supabase SQL Editor
-- ============================================

-- 1. Create Custom Orders Table
CREATE TABLE IF NOT EXISTS public.custom_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    design_description TEXT,
    design_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected', 'completed')),
    admin_notes TEXT,
    quoted_price NUMERIC(10, 2)
);

ALTER TABLE public.custom_orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anonymous inserts for custom orders" ON public.custom_orders;
CREATE POLICY "Allow anonymous inserts for custom orders" ON public.custom_orders FOR INSERT TO public WITH CHECK (true);
DROP POLICY IF EXISTS "Allow all operations for admins on custom orders" ON public.custom_orders;
CREATE POLICY "Allow all operations for admins on custom orders" ON public.custom_orders FOR ALL USING (true) WITH CHECK (true);

-- 2. Create Finance Records Table
CREATE TABLE IF NOT EXISTS public.finance_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    amount NUMERIC(10, 2) NOT NULL,
    description TEXT,
    category TEXT,
    date DATE DEFAULT CURRENT_DATE
);

ALTER TABLE public.finance_records ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all operations for admins on finance" ON public.finance_records;
CREATE POLICY "Allow all operations for admins on finance" ON public.finance_records FOR ALL USING (true) WITH CHECK (true);

-- 3. Update Products Table for Cost, SEO & GEO
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS cost_price NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS seo_title TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS seo_keywords TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS target_country TEXT DEFAULT 'Bangladesh';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS target_region TEXT;

-- 3.5. Update Orders and Order Items for Profit Tracking
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS total_cost NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS total_profit NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS cost_price NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS profit NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE public.finance_records ADD COLUMN IF NOT EXISTS order_id TEXT;
ALTER TABLE public.finance_records ADD COLUMN IF NOT EXISTS profit NUMERIC(10, 2) DEFAULT 0;

-- 4. Update Analytics Events Table for deep tracking
ALTER TABLE public.analytics_events ADD COLUMN IF NOT EXISTS device_type TEXT;
ALTER TABLE public.analytics_events ADD COLUMN IF NOT EXISTS location_country TEXT;
ALTER TABLE public.analytics_events ADD COLUMN IF NOT EXISTS location_city TEXT;
ALTER TABLE public.analytics_events ADD COLUMN IF NOT EXISTS event_type TEXT DEFAULT 'page_view';
ALTER TABLE public.analytics_events ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- 5. Storage Buckets Setup 
insert into storage.buckets (id, name, public) values ('custom-designs', 'custom-designs', true) on conflict do nothing;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
create policy "Public Access" on storage.objects for select using ( bucket_id = 'custom-designs' );
DROP POLICY IF EXISTS "Anon Uploads" ON storage.objects;
create policy "Anon Uploads" on storage.objects for insert with check ( bucket_id = 'custom-designs' );
