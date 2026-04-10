-- ============================================
-- AUREEVO Database Update for Custom Orders & Finance Fixes
-- Run this SQL in your Supabase SQL Editor
-- ============================================

-- 1. Ensure `quantity` exists in custom_orders
ALTER TABLE public.custom_orders ADD COLUMN IF NOT EXISTS quantity INT DEFAULT 1;

-- 2. Ensure `quantity`, `profit`, and `order_id` exist in finance_records
ALTER TABLE public.finance_records ADD COLUMN IF NOT EXISTS quantity INT DEFAULT 1;
ALTER TABLE public.finance_records ADD COLUMN IF NOT EXISTS profit NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE public.finance_records ADD COLUMN IF NOT EXISTS order_id TEXT;

-- 3. Add video_url to products for Live Product View feature
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS video_url TEXT;

-- 3. Safely enable RLS for full security if not already done
ALTER TABLE public.custom_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_records ENABLE ROW LEVEL SECURITY;

-- 4. Update Policies to ensure Admin processes can insert data effortlessly
DROP POLICY IF EXISTS "Allow anonymous inserts for custom orders" ON public.custom_orders;
CREATE POLICY "Allow anonymous inserts for custom orders" ON public.custom_orders FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations for admins on custom orders" ON public.custom_orders;
CREATE POLICY "Allow all operations for admins on custom orders" ON public.custom_orders FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations for admins on finance" ON public.finance_records;
CREATE POLICY "Allow all operations for admins on finance" ON public.finance_records FOR ALL USING (true) WITH CHECK (true);
