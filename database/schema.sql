-- VELUNA by SKF E-Commerce Platform - Supabase Database Schema
-- Complete SQL Schema with all tables, relationships, indexes, and Row Level Security policies

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE 1: USERS (extends Supabase auth.users)
-- =====================================================
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE 2: ADDRESSES
-- =====================================================
CREATE TABLE public.addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    address_type VARCHAR(20) DEFAULT 'shipping', -- 'shipping' or 'billing'
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE 3: CATEGORIES
-- =====================================================
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE 4: SUBCATEGORIES
-- =====================================================
CREATE TABLE public.subcategories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE 5: OCCASIONS
-- =====================================================
CREATE TABLE public.occasions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE 6: PRODUCTS
-- =====================================================
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    short_description TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    subcategory_id UUID REFERENCES public.subcategories(id) ON DELETE SET NULL,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    cost_price DECIMAL(10, 2),
    is_featured BOOLEAN DEFAULT FALSE,
    is_bestseller BOOLEAN DEFAULT FALSE,
    is_new BOOLEAN DEFAULT FALSE,
    is_on_sale BOOLEAN DEFAULT FALSE,
    sale_badge_text VARCHAR(50),
    stock_quantity INTEGER DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 5,
    weight DECIMAL(8, 2), -- in grams
    dimensions JSONB, -- {length, width, height}
    ingredients TEXT,
    care_instructions TEXT,
    burn_time INTEGER, -- in hours for candles
    fragrance_notes TEXT,
    is_customizable BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE 7: PRODUCT_IMAGES
-- =====================================================
CREATE TABLE public.product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(255),
    display_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE 8: PRODUCT_OCCASIONS (Many-to-Many)
-- =====================================================
CREATE TABLE public.product_occasions (
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    occasion_id UUID REFERENCES public.occasions(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, occasion_id)
);

-- =====================================================
-- TABLE 9: PRODUCT_VARIANTS (for size, color variations)
-- =====================================================
CREATE TABLE public.product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    variant_name VARCHAR(100) NOT NULL,
    variant_value VARCHAR(100) NOT NULL,
    price_adjustment DECIMAL(10, 2) DEFAULT 0,
    stock_quantity INTEGER DEFAULT 0,
    sku VARCHAR(50) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE 10: CART
-- =====================================================
CREATE TABLE public.cart (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    session_id VARCHAR(255), -- for guest users
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL,
    customization_details JSONB, -- for custom candles
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT cart_user_or_session CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);

-- =====================================================
-- TABLE 11: ORDERS
-- =====================================================
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    guest_email VARCHAR(255),
    guest_name VARCHAR(255),
    guest_phone VARCHAR(20),
    status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, processing, shipped, delivered, cancelled, refunded
    payment_status VARCHAR(50) DEFAULT 'pending', -- pending, paid, failed, refunded
    payment_method VARCHAR(50),
    payment_id VARCHAR(255),
    subtotal DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    shipping_cost DECIMAL(10, 2) DEFAULT 0,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    shipping_address JSONB NOT NULL,
    billing_address JSONB,
    shipping_method VARCHAR(100),
    tracking_number VARCHAR(255),
    notes TEXT,
    admin_notes TEXT,
    estimated_delivery_date DATE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancellation_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE 12: ORDER_ITEMS
-- =====================================================
CREATE TABLE public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    product_sku VARCHAR(50),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    customization_details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE 13: CUSTOM_CANDLES
-- =====================================================
CREATE TABLE public.custom_candles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    guest_email VARCHAR(255),
    guest_name VARCHAR(255),
    guest_phone VARCHAR(20),
    jar_size VARCHAR(50) NOT NULL, -- 30ml, 50ml, 100ml, etc.
    jar_type VARCHAR(100) NOT NULL, -- Clear Glass, Frosted Glass, etc.
    mold_type VARCHAR(100), -- Flower Mold, Geometric Mold, etc.
    candle_color VARCHAR(100),
    color_hex VARCHAR(10),
    fragrance VARCHAR(100),
    fragrance_intensity VARCHAR(20), -- Light, Medium, Strong
    quantity INTEGER NOT NULL DEFAULT 1,
    special_instructions TEXT,
    reference_image_url TEXT,
    estimated_price DECIMAL(10, 2),
    final_price DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'received', -- received, in_review, approved, in_production, completed, shipped, cancelled
    admin_notes TEXT,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT custom_candle_user_or_guest CHECK (user_id IS NOT NULL OR (guest_email IS NOT NULL AND guest_name IS NOT NULL))
);

-- =====================================================
-- TABLE 14: REVIEWS
-- =====================================================
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    reviewer_name VARCHAR(255) NOT NULL,
    reviewer_email VARCHAR(255),
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE 15: CONTACT_MESSAGES
-- =====================================================
CREATE TABLE public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    attachment_url TEXT,
    status VARCHAR(50) DEFAULT 'new', -- new, in_progress, resolved, closed
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE 16: DISCOUNTS
-- =====================================================
CREATE TABLE public.discounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL, -- percentage, fixed_amount
    discount_value DECIMAL(10, 2) NOT NULL,
    min_order_amount DECIMAL(10, 2),
    max_discount_amount DECIMAL(10, 2),
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,
    valid_from TIMESTAMP WITH TIME ZONE,
    valid_until TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    applicable_categories UUID[],
    applicable_products UUID[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE 17: WISHLIST
-- =====================================================
CREATE TABLE public.wishlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- =====================================================
-- TABLE 18: NEWSLETTER_SUBSCRIBERS
-- =====================================================
CREATE TABLE public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    is_subscribed BOOLEAN DEFAULT TRUE,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unsubscribed_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- TABLE 19: INVENTORY_LOG
-- =====================================================
CREATE TABLE public.inventory_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    change_type VARCHAR(50) NOT NULL, -- restock, sale, adjustment, return
    quantity_change INTEGER NOT NULL,
    quantity_before INTEGER NOT NULL,
    quantity_after INTEGER NOT NULL,
    reference_id UUID, -- order_id or other reference
    notes TEXT,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE 20: SITE_SETTINGS
-- =====================================================
CREATE TABLE public.site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Products indexes
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_subcategory ON public.products(subcategory_id);
CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_products_sku ON public.products(sku);
CREATE INDEX idx_products_featured ON public.products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_products_bestseller ON public.products(is_bestseller) WHERE is_bestseller = TRUE;
CREATE INDEX idx_products_active ON public.products(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_products_price ON public.products(price);

-- Orders indexes
CREATE INDEX idx_orders_user ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created ON public.orders(created_at DESC);
CREATE INDEX idx_orders_number ON public.orders(order_number);

-- Cart indexes
CREATE INDEX idx_cart_user ON public.cart(user_id);
CREATE INDEX idx_cart_session ON public.cart(session_id);
CREATE INDEX idx_cart_product ON public.cart(product_id);

-- Reviews indexes
CREATE INDEX idx_reviews_product ON public.reviews(product_id);
CREATE INDEX idx_reviews_approved ON public.reviews(is_approved) WHERE is_approved = TRUE;

-- Custom candles indexes
CREATE INDEX idx_custom_candles_user ON public.custom_candles(user_id);
CREATE INDEX idx_custom_candles_status ON public.custom_candles(status);
CREATE INDEX idx_custom_candles_created ON public.custom_candles(created_at DESC);

-- Addresses indexes
CREATE INDEX idx_addresses_user ON public.addresses(user_id);

-- Product images indexes
CREATE INDEX idx_product_images_product ON public.product_images(product_id);

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.occasions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_occasions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_candles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Addresses policies
CREATE POLICY "Users can view own addresses" ON public.addresses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own addresses" ON public.addresses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own addresses" ON public.addresses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own addresses" ON public.addresses FOR DELETE USING (auth.uid() = user_id);

-- Public read access for catalog tables
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Subcategories are viewable by everyone" ON public.subcategories FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Occasions are viewable by everyone" ON public.occasions FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Product images are viewable by everyone" ON public.product_images FOR SELECT USING (TRUE);
CREATE POLICY "Product occasions are viewable by everyone" ON public.product_occasions FOR SELECT USING (TRUE);
CREATE POLICY "Product variants are viewable by everyone" ON public.product_variants FOR SELECT USING (is_active = TRUE);

-- Cart policies
CREATE POLICY "Users can view own cart" ON public.cart FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert to own cart" ON public.cart FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cart" ON public.cart FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete from own cart" ON public.cart FOR DELETE USING (auth.uid() = user_id);

-- Orders policies
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- Custom candles policies
CREATE POLICY "Users can view own custom requests" ON public.custom_candles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert custom requests" ON public.custom_candles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Reviews policies
CREATE POLICY "Approved reviews are viewable by everyone" ON public.reviews FOR SELECT USING (is_approved = TRUE);
CREATE POLICY "Users can insert reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);

-- Wishlist policies
CREATE POLICY "Users can view own wishlist" ON public.wishlist FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert to own wishlist" ON public.wishlist FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete from own wishlist" ON public.wishlist FOR DELETE USING (auth.uid() = user_id);

-- Contact messages policies
CREATE POLICY "Anyone can insert contact messages" ON public.contact_messages FOR INSERT WITH CHECK (TRUE);

-- Discounts policies (public read for validation)
CREATE POLICY "Active discounts are viewable by everyone" ON public.discounts FOR SELECT USING (is_active = TRUE);

-- Newsletter policies
CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscribers FOR INSERT WITH CHECK (TRUE);

-- Site settings policies
CREATE POLICY "Site settings are viewable by everyone" ON public.site_settings FOR SELECT USING (TRUE);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON public.addresses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subcategories_updated_at BEFORE UPDATE ON public.subcategories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_occasions_updated_at BEFORE UPDATE ON public.occasions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_updated_at BEFORE UPDATE ON public.cart
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_candles_updated_at BEFORE UPDATE ON public.custom_candles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_messages_updated_at BEFORE UPDATE ON public.contact_messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_discounts_updated_at BEFORE UPDATE ON public.discounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    new_order_number TEXT;
BEGIN
    new_order_number := 'VLN' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(NEXTVAL('order_number_seq')::TEXT, 5, '0');
    RETURN new_order_number;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

-- Function to generate custom candle request number
CREATE OR REPLACE FUNCTION generate_custom_request_number()
RETURNS TEXT AS $$
DECLARE
    new_request_number TEXT;
BEGIN
    new_request_number := 'CUS' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(NEXTVAL('custom_request_seq')::TEXT, 5, '0');
    RETURN new_request_number;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for custom request numbers
CREATE SEQUENCE IF NOT EXISTS custom_request_seq START 1;

-- Function to update product stock after order
CREATE OR REPLACE FUNCTION update_product_stock_after_order()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.payment_status = 'paid' AND OLD.payment_status != 'paid' THEN
        UPDATE public.products p
        SET stock_quantity = stock_quantity - oi.quantity
        FROM public.order_items oi
        WHERE oi.order_id = NEW.id AND oi.product_id = p.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stock_on_payment AFTER UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION update_product_stock_after_order();

-- Function to calculate order total
CREATE OR REPLACE FUNCTION calculate_order_total(order_id UUID)
RETURNS DECIMAL AS $$
DECLARE
    total DECIMAL;
BEGIN
    SELECT COALESCE(SUM(total_price), 0) INTO total
    FROM public.order_items
    WHERE order_items.order_id = calculate_order_total.order_id;
    RETURN total;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- INITIAL DATA SEEDING
-- =====================================================

-- Insert default categories
INSERT INTO public.categories (name, slug, description, display_order) VALUES
('Candles', 'candles', 'Handcrafted candles with premium fragrances', 1),
('Bouquets', 'bouquets', 'Beautiful floral arrangements', 2),
('Flower Boxes', 'flower-boxes', 'Elegant flowers in decorative boxes', 3),
('Gift Sets', 'gift-sets', 'Curated gift collections', 4);

-- Insert subcategories for Candles
INSERT INTO public.subcategories (category_id, name, slug, display_order)
SELECT id, 'Scented Candles', 'scented-candles', 1 FROM public.categories WHERE slug = 'candles'
UNION ALL
SELECT id, 'Non-Scented Candles', 'non-scented-candles', 2 FROM public.categories WHERE slug = 'candles'
UNION ALL
SELECT id, 'Jar Candles', 'jar-candles', 3 FROM public.categories WHERE slug = 'candles'
UNION ALL
SELECT id, 'Mold Candles', 'mold-candles', 4 FROM public.categories WHERE slug = 'candles'
UNION ALL
SELECT id, 'Flower Candles', 'flower-candles', 5 FROM public.categories WHERE slug = 'candles'
UNION ALL
SELECT id, 'Decor Candles', 'decor-candles', 6 FROM public.categories WHERE slug = 'candles';

-- Insert occasions
INSERT INTO public.occasions (name, slug, description, display_order) VALUES
('Wedding', 'wedding', 'Perfect gifts for weddings and celebrations', 1),
('Birthday', 'birthday', 'Make birthdays special with our curated gifts', 2),
('Anniversary', 'anniversary', 'Celebrate love with romantic candles and flowers', 3),
('Friendship', 'friendship', 'Show appreciation to your friends', 4),
('Thank You', 'thank-you', 'Express gratitude with thoughtful gifts', 5),
('Festivals', 'festivals', 'Celebrate festivals with warmth', 6);

-- Insert default site settings
INSERT INTO public.site_settings (setting_key, setting_value, description) VALUES
('shipping_cost', '{"standard": 50, "express": 150}', 'Shipping costs in INR'),
('tax_rate', '{"rate": 0.18}', 'GST rate'),
('currency', '{"code": "INR", "symbol": "₹"}', 'Default currency'),
('contact_email', '{"email": "hello@velunaskf.com"}', 'Contact email'),
('social_media', '{"instagram": "https://instagram.com/velunaskf"}', 'Social media links');
