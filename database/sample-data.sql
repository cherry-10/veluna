-- VELUNA by SKF - Sample Data for Testing and Development
-- This file contains sample products, categories, and test data

-- =====================================================
-- SAMPLE PRODUCTS - CANDLES
-- =====================================================

-- Get category IDs for reference
DO $$
DECLARE
    candles_cat_id UUID;
    scented_subcat_id UUID;
    jar_subcat_id UUID;
    mold_subcat_id UUID;
    wedding_occ_id UUID;
    birthday_occ_id UUID;
BEGIN
    -- Get category and subcategory IDs
    SELECT id INTO candles_cat_id FROM public.categories WHERE slug = 'candles';
    SELECT id INTO scented_subcat_id FROM public.subcategories WHERE slug = 'scented-candles';
    SELECT id INTO jar_subcat_id FROM public.subcategories WHERE slug = 'jar-candles';
    SELECT id INTO mold_subcat_id FROM public.subcategories WHERE slug = 'mold-candles';
    SELECT id INTO wedding_occ_id FROM public.occasions WHERE slug = 'wedding';
    SELECT id INTO birthday_occ_id FROM public.occasions WHERE slug = 'birthday';

    -- Insert sample candle products
    INSERT INTO public.products (
        sku, name, slug, description, short_description, category_id, subcategory_id,
        price, original_price, is_featured, is_bestseller, stock_quantity,
        weight, burn_time, fragrance_notes, is_active
    ) VALUES
    (
        'CAN-LAV-100',
        'Lavender Dreams Jar Candle',
        'lavender-dreams-jar-candle',
        'Immerse yourself in the calming essence of pure lavender. Hand-poured with natural soy wax and infused with premium lavender essential oils, this candle creates a serene atmosphere perfect for relaxation and meditation. Each candle is crafted with love in our home studio, ensuring the highest quality and attention to detail.',
        'Calming lavender scented candle in elegant glass jar',
        candles_cat_id,
        jar_subcat_id,
        599.00,
        NULL,
        TRUE,
        TRUE,
        50,
        200,
        35,
        'Top: Fresh Lavender, Middle: Herbal Notes, Base: Soft Musk',
        TRUE
    ),
    (
        'CAN-VAN-150',
        'Vanilla Bean Bliss',
        'vanilla-bean-bliss',
        'Indulge in the warm, comforting aroma of Madagascar vanilla beans. This luxurious candle fills your space with sweet, creamy notes that evoke feelings of home and happiness. Perfect for cozy evenings and creating a welcoming ambiance.',
        'Sweet vanilla scented candle with warm undertones',
        candles_cat_id,
        scented_subcat_id,
        749.00,
        NULL,
        TRUE,
        TRUE,
        35,
        250,
        40,
        'Top: Vanilla Bean, Middle: Cream, Base: Caramel',
        TRUE
    ),
    (
        'CAN-ROSE-100',
        'Rose Garden Elegance',
        'rose-garden-elegance',
        'Experience the romantic fragrance of fresh roses in full bloom. This elegant candle captures the essence of a beautiful rose garden, making it perfect for special occasions or everyday luxury.',
        'Romantic rose scented candle',
        candles_cat_id,
        scented_subcat_id,
        649.00,
        799.00,
        FALSE,
        TRUE,
        40,
        200,
        35,
        'Top: Fresh Rose Petals, Middle: Jasmine, Base: White Musk',
        TRUE
    ),
    (
        'CAN-SAN-200',
        'Sandalwood Serenity',
        'sandalwood-serenity',
        'Find your inner peace with the grounding aroma of sandalwood. This sophisticated candle combines earthy sandalwood with subtle spice notes, creating a meditative atmosphere.',
        'Earthy sandalwood scented candle',
        candles_cat_id,
        scented_subcat_id,
        899.00,
        NULL,
        TRUE,
        FALSE,
        25,
        300,
        45,
        'Top: Bergamot, Middle: Sandalwood, Base: Amber',
        TRUE
    ),
    (
        'CAN-CIT-100',
        'Citrus Burst',
        'citrus-burst',
        'Energize your space with the refreshing scent of citrus fruits. This invigorating candle blends orange, lemon, and grapefruit for a bright, uplifting experience.',
        'Refreshing citrus scented candle',
        candles_cat_id,
        jar_subcat_id,
        549.00,
        NULL,
        FALSE,
        FALSE,
        60,
        200,
        30,
        'Top: Orange & Lemon, Middle: Grapefruit, Base: Light Musk',
        TRUE
    ),
    (
        'CAN-FLWR-MOLD',
        'Flower Mold Candle Set',
        'flower-mold-candle-set',
        'Beautiful decorative candles shaped like delicate flowers. Perfect for weddings, parties, or as elegant home decor. Set of 3 handcrafted flower candles.',
        'Decorative flower-shaped candles',
        candles_cat_id,
        mold_subcat_id,
        799.00,
        NULL,
        TRUE,
        FALSE,
        30,
        150,
        20,
        'Unscented or lightly scented',
        TRUE
    ),
    (
        'CAN-EUCAL-150',
        'Eucalyptus Mint Refresh',
        'eucalyptus-mint-refresh',
        'Breathe easy with the cooling combination of eucalyptus and mint. This therapeutic candle helps clear the mind and refresh your living space.',
        'Cooling eucalyptus and mint candle',
        candles_cat_id,
        scented_subcat_id,
        699.00,
        NULL,
        FALSE,
        TRUE,
        45,
        250,
        38,
        'Top: Eucalyptus, Middle: Spearmint, Base: Cedar',
        TRUE
    ),
    (
        'CAN-COCO-100',
        'Coconut Paradise',
        'coconut-paradise',
        'Transport yourself to a tropical paradise with the sweet scent of coconut. This candle brings vacation vibes to your home year-round.',
        'Tropical coconut scented candle',
        candles_cat_id,
        jar_subcat_id,
        599.00,
        NULL,
        FALSE,
        FALSE,
        55,
        200,
        35,
        'Top: Coconut, Middle: Vanilla, Base: Tonka Bean',
        TRUE
    );

    -- Insert product images for sample products
    INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
    SELECT id, 'https://placehold.co/800x800/F7F3EE/8B5E3C?text=Lavender+Candle', 'Lavender Dreams Jar Candle', 0, TRUE
    FROM public.products WHERE sku = 'CAN-LAV-100';

    INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
    SELECT id, 'https://placehold.co/800x800/F7F3EE/8B5E3C?text=Vanilla+Candle', 'Vanilla Bean Bliss Candle', 0, TRUE
    FROM public.products WHERE sku = 'CAN-VAN-150';

    INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
    SELECT id, 'https://placehold.co/800x800/F7F3EE/8B5E3C?text=Rose+Candle', 'Rose Garden Elegance Candle', 0, TRUE
    FROM public.products WHERE sku = 'CAN-ROSE-100';

    -- Link products to occasions
    INSERT INTO public.product_occasions (product_id, occasion_id)
    SELECT p.id, wedding_occ_id
    FROM public.products p
    WHERE p.sku IN ('CAN-ROSE-100', 'CAN-FLWR-MOLD');

    INSERT INTO public.product_occasions (product_id, occasion_id)
    SELECT p.id, birthday_occ_id
    FROM public.products p
    WHERE p.sku IN ('CAN-VAN-150', 'CAN-CIT-100');

END $$;

-- =====================================================
-- SAMPLE PRODUCTS - BOUQUETS
-- =====================================================

DO $$
DECLARE
    bouquets_cat_id UUID;
    wedding_occ_id UUID;
    anniversary_occ_id UUID;
BEGIN
    SELECT id INTO bouquets_cat_id FROM public.categories WHERE slug = 'bouquets';
    SELECT id INTO wedding_occ_id FROM public.occasions WHERE slug = 'wedding';
    SELECT id INTO anniversary_occ_id FROM public.occasions WHERE slug = 'anniversary';

    INSERT INTO public.products (
        sku, name, slug, description, short_description, category_id,
        price, original_price, is_featured, is_bestseller, stock_quantity,
        is_active
    ) VALUES
    (
        'BQT-ROSE-RED',
        'Classic Red Rose Bouquet',
        'classic-red-rose-bouquet',
        'A timeless expression of love featuring 12 premium red roses, elegantly arranged with fresh greenery. Perfect for anniversaries, romantic gestures, or saying "I love you".',
        'Elegant bouquet of 12 red roses',
        bouquets_cat_id,
        1299.00,
        NULL,
        TRUE,
        TRUE,
        20,
        TRUE
    ),
    (
        'BQT-MIX-SPRING',
        'Spring Garden Mix',
        'spring-garden-mix',
        'A vibrant collection of seasonal flowers including tulips, daisies, and lilies. This cheerful bouquet brings the freshness of spring to any occasion.',
        'Colorful mixed flower bouquet',
        bouquets_cat_id,
        999.00,
        NULL,
        TRUE,
        FALSE,
        25,
        TRUE
    ),
    (
        'BQT-LILY-WHITE',
        'Pure White Lily Bouquet',
        'pure-white-lily-bouquet',
        'Sophisticated and elegant, this bouquet features pristine white lilies symbolizing purity and devotion. Ideal for weddings and formal occasions.',
        'Elegant white lily arrangement',
        bouquets_cat_id,
        1499.00,
        NULL,
        FALSE,
        TRUE,
        15,
        TRUE
    );

    -- Insert product images
    INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
    SELECT id, 'https://placehold.co/800x800/F7F3EE/8B5E3C?text=Red+Roses', 'Classic Red Rose Bouquet', 0, TRUE
    FROM public.products WHERE sku = 'BQT-ROSE-RED';

    -- Link to occasions
    INSERT INTO public.product_occasions (product_id, occasion_id)
    SELECT p.id, anniversary_occ_id
    FROM public.products p
    WHERE p.sku = 'BQT-ROSE-RED';

    INSERT INTO public.product_occasions (product_id, occasion_id)
    SELECT p.id, wedding_occ_id
    FROM public.products p
    WHERE p.sku = 'BQT-LILY-WHITE';

END $$;

-- =====================================================
-- SAMPLE PRODUCTS - FLOWER BOXES
-- =====================================================

DO $$
DECLARE
    flowerbox_cat_id UUID;
    birthday_occ_id UUID;
BEGIN
    SELECT id INTO flowerbox_cat_id FROM public.categories WHERE slug = 'flower-boxes';
    SELECT id INTO birthday_occ_id FROM public.occasions WHERE slug = 'birthday';

    INSERT INTO public.products (
        sku, name, slug, description, short_description, category_id,
        price, original_price, is_featured, stock_quantity, is_active
    ) VALUES
    (
        'FBX-ROSE-PINK',
        'Pink Rose Luxury Box',
        'pink-rose-luxury-box',
        'Exquisite pink roses arranged in a premium gift box. This luxurious presentation makes a stunning gift that lasts longer than traditional bouquets.',
        'Premium pink roses in elegant box',
        flowerbox_cat_id,
        1799.00,
        NULL,
        TRUE,
        18,
        TRUE
    ),
    (
        'FBX-MIX-PASTEL',
        'Pastel Dreams Flower Box',
        'pastel-dreams-flower-box',
        'A dreamy collection of pastel-colored flowers including roses, carnations, and baby\'s breath, beautifully arranged in a decorative box.',
        'Soft pastel flower arrangement',
        flowerbox_cat_id,
        1599.00,
        NULL,
        FALSE,
        22,
        TRUE
    );

    -- Insert product images
    INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
    SELECT id, 'https://placehold.co/800x800/F7F3EE/8B5E3C?text=Pink+Rose+Box', 'Pink Rose Luxury Box', 0, TRUE
    FROM public.products WHERE sku = 'FBX-ROSE-PINK';

    -- Link to occasions
    INSERT INTO public.product_occasions (product_id, occasion_id)
    SELECT p.id, birthday_occ_id
    FROM public.products p
    WHERE p.sku IN ('FBX-ROSE-PINK', 'FBX-MIX-PASTEL');

END $$;

-- =====================================================
-- SAMPLE PRODUCTS - GIFT SETS
-- =====================================================

DO $$
DECLARE
    giftset_cat_id UUID;
    wedding_occ_id UUID;
    thankyou_occ_id UUID;
BEGIN
    SELECT id INTO giftset_cat_id FROM public.categories WHERE slug = 'gift-sets';
    SELECT id INTO wedding_occ_id FROM public.occasions WHERE slug = 'wedding';
    SELECT id INTO thankyou_occ_id FROM public.occasions WHERE slug = 'thank-you';

    INSERT INTO public.products (
        sku, name, slug, description, short_description, category_id,
        price, original_price, is_featured, is_bestseller, stock_quantity,
        is_active
    ) VALUES
    (
        'GFT-CANDLE-ROSE',
        'Candle & Rose Gift Set',
        'candle-rose-gift-set',
        'The perfect combination of our signature scented candle paired with a beautiful rose arrangement. Thoughtfully curated for special occasions.',
        'Scented candle with rose bouquet',
        giftset_cat_id,
        1899.00,
        2199.00,
        TRUE,
        TRUE,
        15,
        TRUE
    ),
    (
        'GFT-WEDDING-FAVOR',
        'Wedding Favor Mini Candles (Set of 10)',
        'wedding-favor-mini-candles',
        'Charming mini candles perfect as wedding favors or thank you gifts. Each candle is beautifully packaged and can be customized with your event details.',
        'Set of 10 mini candles for events',
        giftset_cat_id,
        1499.00,
        NULL,
        FALSE,
        TRUE,
        30,
        TRUE
    );

    -- Insert product images
    INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
    SELECT id, 'https://placehold.co/800x800/F7F3EE/8B5E3C?text=Gift+Set', 'Candle & Rose Gift Set', 0, TRUE
    FROM public.products WHERE sku = 'GFT-CANDLE-ROSE';

    -- Link to occasions
    INSERT INTO public.product_occasions (product_id, occasion_id)
    SELECT p.id, wedding_occ_id
    FROM public.products p
    WHERE p.sku = 'GFT-WEDDING-FAVOR';

    INSERT INTO public.product_occasions (product_id, occasion_id)
    SELECT p.id, thankyou_occ_id
    FROM public.products p
    WHERE p.sku = 'GFT-WEDDING-FAVOR';

END $$;

-- =====================================================
-- UPDATE CATEGORY IMAGES
-- =====================================================

UPDATE public.categories SET image_url = 'https://placehold.co/600x400/F7F3EE/8B5E3C?text=Candles' WHERE slug = 'candles';
UPDATE public.categories SET image_url = 'https://placehold.co/600x400/F7F3EE/8B5E3C?text=Bouquets' WHERE slug = 'bouquets';
UPDATE public.categories SET image_url = 'https://placehold.co/600x400/F7F3EE/8B5E3C?text=Flower+Boxes' WHERE slug = 'flower-boxes';
UPDATE public.categories SET image_url = 'https://placehold.co/600x400/F7F3EE/8B5E3C?text=Gift+Sets' WHERE slug = 'gift-sets';

-- =====================================================
-- UPDATE OCCASION IMAGES
-- =====================================================

UPDATE public.occasions SET image_url = 'https://placehold.co/600x400/F7F3EE/8B5E3C?text=Wedding' WHERE slug = 'wedding';
UPDATE public.occasions SET image_url = 'https://placehold.co/600x400/F7F3EE/8B5E3C?text=Birthday' WHERE slug = 'birthday';
UPDATE public.occasions SET image_url = 'https://placehold.co/600x400/F7F3EE/8B5E3C?text=Anniversary' WHERE slug = 'anniversary';
UPDATE public.occasions SET image_url = 'https://placehold.co/600x400/F7F3EE/8B5E3C?text=Friendship' WHERE slug = 'friendship';
UPDATE public.occasions SET image_url = 'https://placehold.co/600x400/F7F3EE/8B5E3C?text=Thank+You' WHERE slug = 'thank-you';
UPDATE public.occasions SET image_url = 'https://placehold.co/600x400/F7F3EE/8B5E3C?text=Festivals' WHERE slug = 'festivals';

-- =====================================================
-- SAMPLE DISCOUNT CODES
-- =====================================================

INSERT INTO public.discounts (code, description, discount_type, discount_value, min_order_amount, usage_limit, valid_from, valid_until, is_active) VALUES
('WELCOME10', 'Welcome discount for new customers', 'percentage', 10.00, 500.00, 100, NOW(), NOW() + INTERVAL '30 days', TRUE),
('FESTIVE20', 'Festival special discount', 'percentage', 20.00, 1000.00, 50, NOW(), NOW() + INTERVAL '15 days', TRUE),
('FLAT100', 'Flat ₹100 off on orders above ₹1000', 'fixed_amount', 100.00, 1000.00, NULL, NOW(), NOW() + INTERVAL '60 days', TRUE);

-- =====================================================
-- SAMPLE NEWSLETTER SUBSCRIBERS
-- =====================================================

INSERT INTO public.newsletter_subscribers (email, name, is_subscribed) VALUES
('test1@example.com', 'Test User 1', TRUE),
('test2@example.com', 'Test User 2', TRUE);

COMMIT;
