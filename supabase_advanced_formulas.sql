-- ============================================
-- AUREEVO Database Update for Delivery Charges & Precise Calculations
-- Run this SQL in your Supabase SQL Editor
-- ============================================

-- 1. Introduce Delivery Charge tracking to Custom Orders
ALTER TABLE public.custom_orders ADD COLUMN IF NOT EXISTS delivery_charge NUMERIC(10, 2) DEFAULT 0;

-- 2. Introduce Delivery Charge tracking to Standard Orders
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_charge NUMERIC(10, 2) DEFAULT 0;
