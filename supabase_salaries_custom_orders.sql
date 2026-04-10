-- ============================================
-- AUREEVO Database Update for Salaries and Advanced Finance
-- Run this SQL in your Supabase SQL Editor
-- ============================================

-- 1. Updates to Custom Orders
ALTER TABLE public.custom_orders ADD COLUMN IF NOT EXISTS sale_price NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE public.custom_orders ADD COLUMN IF NOT EXISTS cost_price NUMERIC(10, 2) DEFAULT 0;

-- 2. Employee Salaries Table
CREATE TABLE IF NOT EXISTS public.employee_salaries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    employee_id UUID REFERENCES public.admin_users(id),
    employee_name TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    notes TEXT
);

-- 3. Row Level Security for Salaries
ALTER TABLE public.employee_salaries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all operations for admins on salaries" ON public.employee_salaries;
CREATE POLICY "Allow all operations for admins on salaries" ON public.employee_salaries FOR ALL USING (true) WITH CHECK (true);
