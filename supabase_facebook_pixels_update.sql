-- ============================================
-- AUREEVO Database Update for Facebook Pixel Settings
-- Run this SQL in your Supabase SQL Editor
-- Dashboard > SQL Editor > New Query > Paste & Run
-- ============================================

-- Add new fields to settings table for Facebook Conversions API and Test Events
ALTER TABLE settings ADD COLUMN IF NOT EXISTS facebook_pixel_token TEXT DEFAULT '';
ALTER TABLE settings ADD COLUMN IF NOT EXISTS facebook_test_event_code TEXT DEFAULT '';
