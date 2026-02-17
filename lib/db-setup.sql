-- ============================================
-- AUREEVO eCommerce Database Schema
-- Run this SQL in your Supabase SQL Editor
-- Dashboard > SQL Editor > New Query > Paste & Run
-- ============================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('hoodies', 'tshirts')),
  price NUMERIC(10, 2) NOT NULL,
  description TEXT DEFAULT '',
  sizes JSONB DEFAULT '["S", "M", "L", "XL"]'::jsonb,
  colors JSONB DEFAULT '[]'::jsonb,
  stock JSONB DEFAULT '{}'::jsonb,
  images TEXT[] DEFAULT '{}',
  is_visible BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'delivered', 'cancelled')),
  total_price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- ORDER ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_image TEXT DEFAULT '',
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price NUMERIC(10, 2) NOT NULL
);

-- ============================================
-- SETTINGS TABLE (single row)
-- ============================================
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  facebook_pixel_id TEXT DEFAULT '',
  whatsapp_number TEXT DEFAULT '',
  store_name TEXT DEFAULT 'AUREEVO',
  currency TEXT DEFAULT 'BDT',
  currency_symbol TEXT DEFAULT '৳',
  shipping_cost NUMERIC(10, 2) DEFAULT 120.00,
  low_stock_threshold INTEGER DEFAULT 3,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- ADMIN USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT DEFAULT 'Admin',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_visible ON products(is_visible);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_order_id ON orders(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- ============================================
-- INSERT DEFAULT SETTINGS (if not exists)
-- ============================================
INSERT INTO settings (id, store_name) VALUES (1, 'AUREEVO')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- DISABLE RLS FOR ALL TABLES (simple setup)
-- For production, enable RLS with proper policies
-- ============================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Allow public read for products (visible only)
CREATE POLICY "Public can read visible products" ON products
  FOR SELECT USING (is_visible = true);

-- Allow all operations for authenticated requests (via service key or anon with policies)
CREATE POLICY "Allow all for anon" ON products
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for anon" ON orders
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for anon" ON order_items
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for anon" ON settings
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for anon" ON admin_users
  FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- STORAGE BUCKET FOR PRODUCT IMAGES
-- ============================================
-- 1. Create the bucket (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Enable RLS on objects (it's enabled by default, but good practice to be explicit if managing policies)
-- The storage.objects table is in the `storage` schema.

-- 3. Create policies for the bucket
-- Allow public access to view images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'product-images' );

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'product-images' AND auth.role() = 'authenticated' );

-- Allow authenticated users to update images
CREATE POLICY "Authenticated Update" ON storage.objects FOR UPDATE USING ( bucket_id = 'product-images' AND auth.role() = 'authenticated' );

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated Delete" ON storage.objects FOR DELETE USING ( bucket_id = 'product-images' AND auth.role() = 'authenticated' );

