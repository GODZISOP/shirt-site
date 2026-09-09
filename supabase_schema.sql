-- ==========================================================
-- DEMIR STUDIO - SUPABASE DATABASE SCHEMA
-- Run this whole script in your Supabase SQL Editor
-- ==========================================================

-- 1. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    product_name TEXT NOT NULL,
    item_type TEXT DEFAULT 'tshirt',
    technique TEXT DEFAULT 'print',
    color TEXT,
    quantity INTEGER DEFAULT 1,
    total_price TEXT,
    status_step INTEGER DEFAULT 1,
    carrier TEXT,
    tracking_number TEXT,
    shipping_address TEXT,
    image_url TEXT,
    instructions TEXT,
    cart_data JSONB,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for fast order lookups by order_id
CREATE INDEX IF NOT EXISTS idx_orders_order_id ON public.orders(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);


-- 2. QUOTES TABLE (Wholesale / Bulk Order Requests)
CREATE TABLE IF NOT EXISTS public.quotes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    product_type TEXT,
    technique TEXT,
    quantity TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON public.quotes(created_at DESC);


-- 3. PRODUCTS TABLE (Custom Products added via Admin Panel)
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL, -- 'shirts', 'hats', 'jeans'
    techniques JSONB DEFAULT '["print"]'::jsonb,
    "priceFrom" NUMERIC(10, 2) NOT NULL DEFAULT 9.99,
    image TEXT,
    href TEXT,
    badge TEXT,
    popular BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);


-- ==========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Ensures public visitors & admin can read/write without 403 errors
-- ==========================================================

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to avoid duplicate errors
DROP POLICY IF EXISTS "Public Full Access Orders" ON public.orders;
DROP POLICY IF EXISTS "Public Full Access Quotes" ON public.quotes;
DROP POLICY IF EXISTS "Public Full Access Products" ON public.products;

-- Grant Full Access to public/anon (for checkout, tracking, & admin operations)
CREATE POLICY "Public Full Access Orders" ON public.orders
    FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Public Full Access Quotes" ON public.quotes
    FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Public Full Access Products" ON public.products
    FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Grant schema permissions
GRANT ALL ON TABLE public.orders TO anon, authenticated;
GRANT ALL ON TABLE public.quotes TO anon, authenticated;
GRANT ALL ON TABLE public.products TO anon, authenticated;
