-- Storage Location Mapping System - Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  image_url TEXT,
  box_no INTEGER NOT NULL CHECK (box_no BETWEEN 1 AND 2),
  row_no INTEGER NOT NULL CHECK (row_no BETWEEN 1 AND 6),
  slot_no INTEGER NOT NULL CHECK (slot_no BETWEEN 1 AND 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique location (one product per slot)
  CONSTRAINT unique_location UNIQUE (box_no, row_no, slot_no)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_name ON products USING GIN (to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_products_location ON products (box_no, row_no, slot_no);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products (created_at DESC);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Public can read all products
CREATE POLICY "Public read access" ON products
  FOR SELECT USING (true);

-- Only authenticated users can insert
CREATE POLICY "Authenticated insert access" ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Only authenticated users can update
CREATE POLICY "Authenticated update access" ON products
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Only authenticated users can delete
CREATE POLICY "Authenticated delete access" ON products
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public read product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated upload product images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-images' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated update product images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'product-images' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated delete product images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'product-images' AND 
    auth.role() = 'authenticated'
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional)
INSERT INTO products (name, box_no, row_no, slot_no) VALUES
  ('Bearing SKF 6205', 1, 1, 1),
  ('Hydraulic Pump HP-300', 1, 1, 2),
  ('Motor Controller MC-500', 1, 2, 1),
  ('Pressure Sensor PS-100', 1, 2, 3),
  ('Valve Assembly VA-250', 1, 3, 1),
  ('Gear Box GB-400', 2, 1, 1),
  ('Belt Drive BD-150', 2, 1, 2),
  ('Chain Sprocket CS-200', 2, 2, 1)
ON CONFLICT (box_no, row_no, slot_no) DO NOTHING;
