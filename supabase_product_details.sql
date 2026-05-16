-- ============================================
-- AUREEVO Database Update for Advanced Product Details
-- Run this SQL in your Supabase SQL Editor
-- Dashboard > SQL Editor > New Query > Paste & Run
-- ============================================

-- Add new JSONB columns for structured product data
ALTER TABLE products ADD COLUMN IF NOT EXISTS care_instructions JSONB DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS size_and_fit JSONB DEFAULT '{}'::jsonb;

-- The 'description' column already exists but we will now store HTML in it.
-- The 'specifications' column already exists (JSONB) but we'll ensure it's used as an array.

-- Example of structure expected:
-- care_instructions: ["Machine wash cold", "Do not bleach", "Iron low heat"]
-- size_and_fit: {"fit_type": "Oversized Fit", "model_height": "6'1\"", "wearing_size": "L", "fabric_stretch": "Low", "fabric_weight": "220 GSM"}
-- specifications: ["100% Cotton", "Drop Shoulder", "Acid Wash Finish"]
