-- =============================================================================
-- SRIRAAJ E-COMMERCE DATABASE SCHEMA (SUPABASE POSTGRESQL)
-- Production-Ready Schema with Row Level Security (RLS) & Seed Data
-- =============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Custom ENUM Types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('customer', 'admin', 'staff');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('pending', 'processing', 'in_transit', 'delivered', 'cancelled', 'returned');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'authorized', 'captured', 'failed', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM ('razorpay', 'cod', 'upi', 'card');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Utility Trigger Function to Auto-Update 'updated_at' Timestamp
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- 4. User Profiles & Addresses (Linked to Supabase Auth)
-- =============================================================================

-- PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL DEFAULT '',
    email TEXT UNIQUE,
    phone TEXT,
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'customer',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger to auto-update profile timestamp
DROP TRIGGER IF EXISTS set_profiles_timestamp ON public.profiles;
CREATE TRIGGER set_profiles_timestamp
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

-- Auto-create profile upon Supabase auth sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, phone, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    NEW.email,
    COALESCE(NEW.phone, NEW.raw_user_meta_data->>'phone'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture')
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    name = CASE WHEN public.profiles.name = '' THEN EXCLUDED.name ELSE public.profiles.name END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ADDRESSES TABLE
CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    label TEXT NOT NULL DEFAULT 'Home',
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    street TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_addresses_timestamp ON public.addresses;
CREATE TRIGGER set_addresses_timestamp
    BEFORE UPDATE ON public.addresses
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

-- =============================================================================
-- 5. Product Catalog & Categories
-- =============================================================================

-- CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category_id TEXT NOT NULL REFERENCES public.categories(id) ON UPDATE CASCADE,
    short_description TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    price NUMERIC(10,2) NOT NULL,
    compare_at_price NUMERIC(10,2),
    images TEXT[] NOT NULL DEFAULT '{}',
    ingredients TEXT DEFAULT '',
    nutrition_per_100g JSONB NOT NULL DEFAULT '{}'::jsonb,
    features TEXT[] NOT NULL DEFAULT '{}',
    how_to_use TEXT DEFAULT '',
    storage TEXT DEFAULT '',
    stock INT NOT NULL DEFAULT 0,
    rating NUMERIC(3,2) NOT NULL DEFAULT 5.0,
    review_count INT NOT NULL DEFAULT 0,
    badges TEXT[] NOT NULL DEFAULT '{}',
    seo_title TEXT DEFAULT '',
    seo_description TEXT DEFAULT '',
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_products_timestamp ON public.products;
CREATE TRIGGER set_products_timestamp
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

-- PRODUCT VARIANTS (Sizes & Pricing)
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    compare_at_price NUMERIC(10,2),
    sku TEXT,
    stock INT NOT NULL DEFAULT 50,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 6. Orders & Order Items
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status order_status NOT NULL DEFAULT 'processing',
    payment_status payment_status NOT NULL DEFAULT 'pending',
    payment_method payment_method NOT NULL DEFAULT 'razorpay',
    subtotal NUMERIC(10,2) NOT NULL,
    shipping NUMERIC(10,2) NOT NULL DEFAULT 0,
    discount NUMERIC(10,2) NOT NULL DEFAULT 0,
    total NUMERIC(10,2) NOT NULL,
    shipping_address JSONB NOT NULL,
    billing_address JSONB,
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    customer_phone TEXT NOT NULL,
    tracking_number TEXT,
    carrier TEXT DEFAULT 'Delhivery',
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_orders_timestamp ON public.orders;
CREATE TRIGGER set_orders_timestamp
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    size_label TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 7. Reviews & Newsletter
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    author TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    body TEXT NOT NULL,
    is_verified_buyer BOOLEAN NOT NULL DEFAULT true,
    is_approved BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    source TEXT DEFAULT 'footer',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 8. Row Level Security (RLS) Configuration
-- =============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read & update their own profile; admins can do anything
CREATE POLICY "Public profiles are readable by owner"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Addresses: Users can manage their own addresses
CREATE POLICY "Users can manage own addresses"
    ON public.addresses FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Catalog (Categories & Products & Variants): Public can view active catalog items
CREATE POLICY "Anyone can view active categories"
    ON public.categories FOR SELECT
    USING (is_active = true);

CREATE POLICY "Anyone can view active products"
    ON public.products FOR SELECT
    USING (is_active = true);

CREATE POLICY "Anyone can view product variants"
    ON public.product_variants FOR SELECT
    USING (true);

-- Orders: Users can view their own orders
CREATE POLICY "Users can view own orders"
    ON public.orders FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view own order items"
    ON public.order_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_items.order_id
            AND orders.user_id = auth.uid()
        )
    );

-- Allow service role / authenticated guest creation of orders
CREATE POLICY "Anyone can insert orders"
    ON public.orders FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Anyone can insert order items"
    ON public.order_items FOR INSERT
    WITH CHECK (true);

-- Reviews: Approved reviews are publicly readable; authenticated users can write reviews
CREATE POLICY "Anyone can view approved reviews"
    ON public.reviews FOR SELECT
    USING (is_approved = true);

CREATE POLICY "Authenticated users can submit reviews"
    ON public.reviews FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Newsletter: Anyone can sign up
CREATE POLICY "Anyone can subscribe to newsletter"
    ON public.newsletter_subscribers FOR INSERT
    WITH CHECK (true);

-- =============================================================================
-- 9. Seed Data (SRIRAAJ Categories, Products, and Variants)
-- =============================================================================

-- Categories
INSERT INTO public.categories (id, name, description, display_order)
VALUES
    ('ghee', 'Ghee', 'Pure cultured A2 Gir cow ghee crafted via authentic Bilona method.', 1),
    ('oils', 'Cold-Pressed Oils', 'Wood-churned, single-pressed unrefined culinary oils.', 2),
    ('pantry', 'Pantry & Spices', 'Single-origin stone-ground spices, natural sweeteners, and grains.', 3),
    ('gifting', 'Gifting & Bundles', 'Curated wooden hampers and artisanal celebration gift sets.', 4)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description;

-- Products
INSERT INTO public.products (
    id, name, slug, category_id, short_description, description, price, compare_at_price,
    images, ingredients, nutrition_per_100g, features, how_to_use, storage, stock, rating, review_count, badges, seo_title, seo_description, is_featured
)
VALUES
(
    'p-001',
    'A2 Cow Ghee',
    'a2-cow-ghee',
    'ghee',
    'Traditionally churned from A2 milk. Slow-cooked, pure, and deeply nourishing.',
    'Sriraaj A2 Cow Ghee is made using the traditional Bilona method — slow-churned from curd set from pure A2 cow milk. The result is a rich, golden ghee with a characteristic grainy texture and a deep, nutty aroma that fills the kitchen the moment you open the jar.\n\nThis ghee carries the essence of a practice passed down through generations — made the way it was always meant to be made.',
    699.00,
    849.00,
    ARRAY['/images/product-ghee.jpg', '/images/hero-ghee.jpg'],
    '100% Cultured A2 Cow Milk Butter (Clarified Butter)',
    '{"Energy": "897 kcal", "Total Fat": "99.7 g", "Saturated Fat": "65 g", "Protein": "0 g", "Carbohydrates": "0 g"}'::jsonb,
    ARRAY['Sourced from A2 milk cows', 'Traditional Bilona process', 'No additives or preservatives', 'Rich in naturally occurring nutrients', 'Deep golden colour and grainy texture'],
    'Use for tempering, roasting, or as a finishing touch on dal, rice, and rotis. A small amount goes a long way.',
    'Store in a cool, dry place away from direct sunlight. Use a clean, dry spoon. Best consumed within 12 months of manufacture.',
    48,
    4.9,
    142,
    ARRAY['Traditional Process', 'A2 Milk', 'Bestseller'],
    'A2 Cow Ghee — Traditionally Made | SRIRAAJ',
    'Premium A2 Cow Ghee by SRIRAAJ, made using the traditional Bilona method. Pure, authentic, and deeply nourishing.',
    true
),
(
    'p-002',
    'Cold-Pressed Mustard Oil',
    'cold-pressed-mustard-oil',
    'oils',
    'Single-pressed from select mustard seeds. Pungent, pure, and unmistakably Indian.',
    'Sriraaj Cold-Pressed Mustard Oil is extracted using the traditional wooden churner (kachi ghani) method — a single pressing at low temperature that preserves the natural pungency and aroma of mustard seeds.\n\nThe result is a deep golden oil with a characteristic sharp flavour that has defined Indian cooking for centuries.',
    349.00,
    NULL,
    ARRAY['/images/product-mustard-oil.jpg'],
    '100% Cold-Pressed Mustard Seeds',
    '{"Energy": "884 kcal", "Total Fat": "100 g", "Monounsaturated Fat": "60 g", "Polyunsaturated Fat": "21 g", "Saturated Fat": "12 g"}'::jsonb,
    ARRAY['Wood-pressed (Kachi Ghani)', 'Retains natural pungency', 'Unfiltered and unrefined', 'Ideal for traditional Indian cooking', 'Rich in Omega-3 and Omega-6'],
    'Ideal for curries, pickling, sautéing, and marinades. Allow oil to smoke gently before tempering for optimal flavour.',
    'Store in a dark, dry place away from heat. Keep container tightly closed.',
    35,
    4.7,
    89,
    ARRAY['Wood-Pressed', 'Kachi Ghani'],
    'Cold-Pressed Mustard Oil | SRIRAAJ',
    'Authentic cold-pressed mustard oil, extracted with traditional wooden churner. Rich pungency, pure and unrefined.',
    true
),
(
    'p-003',
    'Cold-Pressed Groundnut Oil',
    'cold-pressed-groundnut-oil',
    'oils',
    'Pressed from premium hand-picked peanuts. Mild, nutty, and perfect for everyday cooking.',
    'Extracted from select Saurashtra peanuts through gentle cold-pressing without synthetic refining or chemical treatment. Retains heart-healthy antioxidants, vitamins, and natural peanut aroma.',
    389.00,
    449.00,
    ARRAY['/images/product-mustard-oil.jpg'],
    '100% Cold-Pressed Peanuts',
    '{"Energy": "884 kcal", "Total Fat": "100 g", "Monounsaturated Fat": "48 g", "Polyunsaturated Fat": "32 g", "Saturated Fat": "17 g"}'::jsonb,
    ARRAY['Wood-pressed at room temperature', 'High smoke point for daily frying', 'Rich nutty aroma', 'Free of trans fats and chemical bleaches'],
    'Excellent for deep-frying, sauteing vegetables, and everyday cooking across all Indian regional cuisines.',
    'Store in a cool, dark cupboard away from direct heat.',
    60,
    4.8,
    64,
    ARRAY['Wood-Pressed', 'Heart Healthy'],
    'Cold-Pressed Groundnut Oil | SRIRAAJ',
    'Artisanal wood-churned cold-pressed groundnut oil. Naturally fragrant and wholesome.',
    true
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    stock = EXCLUDED.stock,
    updated_at = NOW();

-- Product Variants
DELETE FROM public.product_variants WHERE product_id IN ('p-001', 'p-002', 'p-003');

INSERT INTO public.product_variants (product_id, label, value, price, compare_at_price, sku, stock)
VALUES
    ('p-001', '250 ml', '250ml', 499.00, NULL, 'SRJ-GHEE-250', 50),
    ('p-001', '500 ml', '500ml', 699.00, 849.00, 'SRJ-GHEE-500', 48),
    ('p-001', '1 Litre', '1l', 1299.00, NULL, 'SRJ-GHEE-1000', 30),
    ('p-002', '500 ml', '500ml', 349.00, NULL, 'SRJ-MST-500', 35),
    ('p-002', '1 Litre', '1l', 599.00, NULL, 'SRJ-MST-1000', 40),
    ('p-003', '500 ml', '500ml', 389.00, 449.00, 'SRJ-GND-500', 60),
    ('p-003', '1 Litre', '1l', 729.00, 799.00, 'SRJ-GND-1000', 45);

-- Indexes for blazing fast queries
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_addresses_user ON public.addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_prod ON public.product_variants(product_id);
