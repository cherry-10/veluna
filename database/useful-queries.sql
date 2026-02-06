-- VELUNA by SKF - Useful Database Queries
-- Common queries for development and administration

-- =====================================================
-- PRODUCT QUERIES
-- =====================================================

-- Get all active products with category and subcategory names
SELECT 
    p.id,
    p.sku,
    p.name,
    p.slug,
    p.price,
    p.original_price,
    p.stock_quantity,
    p.is_featured,
    p.is_bestseller,
    c.name as category_name,
    sc.name as subcategory_name,
    (SELECT image_url FROM public.product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as primary_image
FROM public.products p
LEFT JOIN public.categories c ON p.category_id = c.id
LEFT JOIN public.subcategories sc ON p.subcategory_id = sc.id
WHERE p.is_active = TRUE
ORDER BY p.created_at DESC;

-- Get featured products for homepage
SELECT 
    p.id,
    p.name,
    p.slug,
    p.price,
    p.original_price,
    p.short_description,
    pi.image_url
FROM public.products p
LEFT JOIN public.product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
WHERE p.is_featured = TRUE AND p.is_active = TRUE
ORDER BY p.created_at DESC
LIMIT 8;

-- Get bestseller products
SELECT 
    p.id,
    p.name,
    p.slug,
    p.price,
    p.original_price,
    pi.image_url,
    COUNT(oi.id) as total_orders
FROM public.products p
LEFT JOIN public.product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
LEFT JOIN public.order_items oi ON p.id = oi.product_id
WHERE p.is_active = TRUE
GROUP BY p.id, pi.image_url
ORDER BY total_orders DESC
LIMIT 10;

-- Get products by category with filters
SELECT 
    p.id,
    p.name,
    p.slug,
    p.price,
    p.stock_quantity,
    pi.image_url
FROM public.products p
LEFT JOIN public.product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
WHERE p.category_id = 'CATEGORY_ID_HERE'
    AND p.is_active = TRUE
    AND p.price BETWEEN 0 AND 2000
    AND p.stock_quantity > 0
ORDER BY p.price ASC;

-- Get single product with all details
SELECT 
    p.*,
    c.name as category_name,
    sc.name as subcategory_name,
    COALESCE(AVG(r.rating), 0) as avg_rating,
    COUNT(DISTINCT r.id) as review_count,
    json_agg(DISTINCT jsonb_build_object(
        'id', pi.id,
        'url', pi.image_url,
        'alt', pi.alt_text,
        'order', pi.display_order
    ) ORDER BY pi.display_order) as images,
    json_agg(DISTINCT jsonb_build_object(
        'id', o.id,
        'name', o.name
    )) FILTER (WHERE o.id IS NOT NULL) as occasions
FROM public.products p
LEFT JOIN public.categories c ON p.category_id = c.id
LEFT JOIN public.subcategories sc ON p.subcategory_id = sc.id
LEFT JOIN public.product_images pi ON p.id = pi.product_id
LEFT JOIN public.reviews r ON p.id = r.product_id AND r.is_approved = TRUE
LEFT JOIN public.product_occasions po ON p.id = po.product_id
LEFT JOIN public.occasions o ON po.occasion_id = o.id
WHERE p.slug = 'PRODUCT_SLUG_HERE'
GROUP BY p.id, c.name, sc.name;

-- Get products by occasion
SELECT 
    p.id,
    p.name,
    p.slug,
    p.price,
    p.short_description,
    pi.image_url
FROM public.products p
INNER JOIN public.product_occasions po ON p.id = po.product_id
INNER JOIN public.occasions o ON po.occasion_id = o.id
LEFT JOIN public.product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
WHERE o.slug = 'OCCASION_SLUG_HERE'
    AND p.is_active = TRUE
ORDER BY p.created_at DESC;

-- Search products by name or description
SELECT 
    p.id,
    p.name,
    p.slug,
    p.price,
    p.short_description,
    pi.image_url,
    ts_rank(to_tsvector('english', p.name || ' ' || COALESCE(p.description, '')), plainto_tsquery('english', 'SEARCH_TERM')) as rank
FROM public.products p
LEFT JOIN public.product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
WHERE to_tsvector('english', p.name || ' ' || COALESCE(p.description, '')) @@ plainto_tsquery('english', 'SEARCH_TERM')
    AND p.is_active = TRUE
ORDER BY rank DESC;

-- Get low stock products (for admin alerts)
SELECT 
    p.id,
    p.sku,
    p.name,
    p.stock_quantity,
    p.low_stock_threshold
FROM public.products p
WHERE p.stock_quantity <= p.low_stock_threshold
    AND p.is_active = TRUE
ORDER BY p.stock_quantity ASC;

-- =====================================================
-- CART QUERIES
-- =====================================================

-- Get user's cart with product details
SELECT 
    c.id as cart_id,
    c.quantity,
    c.price,
    c.customization_details,
    p.id as product_id,
    p.name as product_name,
    p.slug,
    p.stock_quantity,
    pi.image_url,
    (c.quantity * c.price) as item_total
FROM public.cart c
INNER JOIN public.products p ON c.product_id = p.id
LEFT JOIN public.product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
WHERE c.user_id = 'USER_ID_HERE'
ORDER BY c.created_at DESC;

-- Get cart total for user
SELECT 
    COUNT(*) as item_count,
    SUM(c.quantity * c.price) as cart_total
FROM public.cart c
WHERE c.user_id = 'USER_ID_HERE';

-- =====================================================
-- ORDER QUERIES
-- =====================================================

-- Get all orders with customer details (Admin view)
SELECT 
    o.id,
    o.order_number,
    o.status,
    o.payment_status,
    o.total_amount,
    o.created_at,
    COALESCE(u.full_name, o.guest_name) as customer_name,
    COALESCE(u.email, o.guest_email) as customer_email,
    COUNT(oi.id) as item_count
FROM public.orders o
LEFT JOIN public.users u ON o.user_id = u.id
LEFT JOIN public.order_items oi ON o.id = oi.order_id
GROUP BY o.id, u.full_name, u.email
ORDER BY o.created_at DESC;

-- Get single order with all details
SELECT 
    o.*,
    COALESCE(u.full_name, o.guest_name) as customer_name,
    COALESCE(u.email, o.guest_email) as customer_email,
    json_agg(jsonb_build_object(
        'id', oi.id,
        'product_name', oi.product_name,
        'quantity', oi.quantity,
        'unit_price', oi.unit_price,
        'total_price', oi.total_price,
        'customization', oi.customization_details
    )) as items
FROM public.orders o
LEFT JOIN public.users u ON o.user_id = u.id
LEFT JOIN public.order_items oi ON o.id = oi.order_id
WHERE o.order_number = 'ORDER_NUMBER_HERE'
GROUP BY o.id, u.full_name, u.email;

-- Get user's order history
SELECT 
    o.id,
    o.order_number,
    o.status,
    o.payment_status,
    o.total_amount,
    o.created_at,
    COUNT(oi.id) as item_count
FROM public.orders o
LEFT JOIN public.order_items oi ON o.id = oi.order_id
WHERE o.user_id = 'USER_ID_HERE'
GROUP BY o.id
ORDER BY o.created_at DESC;

-- Get orders by status
SELECT 
    o.id,
    o.order_number,
    o.total_amount,
    o.created_at,
    COALESCE(u.full_name, o.guest_name) as customer_name
FROM public.orders o
LEFT JOIN public.users u ON o.user_id = u.id
WHERE o.status = 'pending'
ORDER BY o.created_at ASC;

-- Get revenue statistics
SELECT 
    DATE_TRUNC('day', created_at) as date,
    COUNT(*) as order_count,
    SUM(total_amount) as daily_revenue,
    AVG(total_amount) as avg_order_value
FROM public.orders
WHERE payment_status = 'paid'
    AND created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;

-- =====================================================
-- CUSTOM CANDLE QUERIES
-- =====================================================

-- Get all custom candle requests (Admin view)
SELECT 
    cc.id,
    cc.request_number,
    cc.status,
    cc.jar_size,
    cc.jar_type,
    cc.fragrance,
    cc.quantity,
    cc.estimated_price,
    cc.created_at,
    COALESCE(u.full_name, cc.guest_name) as customer_name,
    COALESCE(u.email, cc.guest_email) as customer_email
FROM public.custom_candles cc
LEFT JOIN public.users u ON cc.user_id = u.id
ORDER BY cc.created_at DESC;

-- Get custom candle requests by status
SELECT 
    cc.*,
    COALESCE(u.full_name, cc.guest_name) as customer_name,
    COALESCE(u.email, cc.guest_email) as customer_email
FROM public.custom_candles cc
LEFT JOIN public.users u ON cc.user_id = u.id
WHERE cc.status = 'received'
ORDER BY cc.created_at ASC;

-- Get user's custom candle requests
SELECT 
    cc.id,
    cc.request_number,
    cc.status,
    cc.jar_size,
    cc.jar_type,
    cc.fragrance,
    cc.quantity,
    cc.estimated_price,
    cc.created_at
FROM public.custom_candles cc
WHERE cc.user_id = 'USER_ID_HERE'
ORDER BY cc.created_at DESC;

-- =====================================================
-- REVIEW QUERIES
-- =====================================================

-- Get approved reviews for a product
SELECT 
    r.id,
    r.rating,
    r.title,
    r.comment,
    r.reviewer_name,
    r.is_verified_purchase,
    r.helpful_count,
    r.created_at
FROM public.reviews r
WHERE r.product_id = 'PRODUCT_ID_HERE'
    AND r.is_approved = TRUE
ORDER BY r.created_at DESC;

-- Get average rating for products
SELECT 
    p.id,
    p.name,
    COALESCE(AVG(r.rating), 0) as avg_rating,
    COUNT(r.id) as review_count
FROM public.products p
LEFT JOIN public.reviews r ON p.id = r.product_id AND r.is_approved = TRUE
GROUP BY p.id
HAVING COUNT(r.id) > 0
ORDER BY avg_rating DESC;

-- Get pending reviews for approval (Admin)
SELECT 
    r.id,
    r.rating,
    r.title,
    r.comment,
    r.reviewer_name,
    r.created_at,
    p.name as product_name
FROM public.reviews r
INNER JOIN public.products p ON r.product_id = p.id
WHERE r.is_approved = FALSE
ORDER BY r.created_at ASC;

-- =====================================================
-- USER QUERIES
-- =====================================================

-- Get user profile with addresses
SELECT 
    u.*,
    json_agg(jsonb_build_object(
        'id', a.id,
        'type', a.address_type,
        'full_name', a.full_name,
        'phone', a.phone,
        'address_line1', a.address_line1,
        'city', a.city,
        'state', a.state,
        'postal_code', a.postal_code,
        'is_default', a.is_default
    )) FILTER (WHERE a.id IS NOT NULL) as addresses
FROM public.users u
LEFT JOIN public.addresses a ON u.id = a.user_id
WHERE u.id = 'USER_ID_HERE'
GROUP BY u.id;

-- Get customer statistics (Admin)
SELECT 
    COUNT(DISTINCT u.id) as total_customers,
    COUNT(DISTINCT o.user_id) as customers_with_orders,
    AVG(order_stats.order_count) as avg_orders_per_customer,
    AVG(order_stats.total_spent) as avg_customer_value
FROM public.users u
LEFT JOIN public.orders o ON u.id = o.user_id
LEFT JOIN (
    SELECT user_id, COUNT(*) as order_count, SUM(total_amount) as total_spent
    FROM public.orders
    WHERE payment_status = 'paid'
    GROUP BY user_id
) order_stats ON u.id = order_stats.user_id;

-- =====================================================
-- WISHLIST QUERIES
-- =====================================================

-- Get user's wishlist with product details
SELECT 
    w.id as wishlist_id,
    p.id as product_id,
    p.name,
    p.slug,
    p.price,
    p.original_price,
    p.stock_quantity,
    pi.image_url,
    w.created_at
FROM public.wishlist w
INNER JOIN public.products p ON w.product_id = p.id
LEFT JOIN public.product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
WHERE w.user_id = 'USER_ID_HERE'
ORDER BY w.created_at DESC;

-- =====================================================
-- ANALYTICS QUERIES
-- =====================================================

-- Top selling products
SELECT 
    p.id,
    p.name,
    p.sku,
    SUM(oi.quantity) as total_sold,
    SUM(oi.total_price) as total_revenue
FROM public.products p
INNER JOIN public.order_items oi ON p.id = oi.product_id
INNER JOIN public.orders o ON oi.order_id = o.id
WHERE o.payment_status = 'paid'
    AND o.created_at >= NOW() - INTERVAL '30 days'
GROUP BY p.id
ORDER BY total_sold DESC
LIMIT 10;

-- Sales by category
SELECT 
    c.name as category,
    COUNT(DISTINCT o.id) as order_count,
    SUM(oi.quantity) as items_sold,
    SUM(oi.total_price) as revenue
FROM public.categories c
INNER JOIN public.products p ON c.id = p.category_id
INNER JOIN public.order_items oi ON p.id = oi.product_id
INNER JOIN public.orders o ON oi.order_id = o.id
WHERE o.payment_status = 'paid'
    AND o.created_at >= NOW() - INTERVAL '30 days'
GROUP BY c.id, c.name
ORDER BY revenue DESC;

-- Monthly revenue trend
SELECT 
    TO_CHAR(created_at, 'YYYY-MM') as month,
    COUNT(*) as order_count,
    SUM(total_amount) as revenue,
    AVG(total_amount) as avg_order_value
FROM public.orders
WHERE payment_status = 'paid'
    AND created_at >= NOW() - INTERVAL '12 months'
GROUP BY TO_CHAR(created_at, 'YYYY-MM')
ORDER BY month DESC;

-- Customer lifetime value (Top customers)
SELECT 
    u.id,
    u.full_name,
    u.email,
    COUNT(o.id) as total_orders,
    SUM(o.total_amount) as lifetime_value,
    MAX(o.created_at) as last_order_date
FROM public.users u
INNER JOIN public.orders o ON u.id = o.user_id
WHERE o.payment_status = 'paid'
GROUP BY u.id
ORDER BY lifetime_value DESC
LIMIT 20;

-- =====================================================
-- INVENTORY MANAGEMENT QUERIES
-- =====================================================

-- Get inventory status
SELECT 
    p.id,
    p.sku,
    p.name,
    p.stock_quantity,
    p.low_stock_threshold,
    CASE 
        WHEN p.stock_quantity = 0 THEN 'Out of Stock'
        WHEN p.stock_quantity <= p.low_stock_threshold THEN 'Low Stock'
        ELSE 'In Stock'
    END as stock_status
FROM public.products p
WHERE p.is_active = TRUE
ORDER BY p.stock_quantity ASC;

-- Get inventory movements
SELECT 
    il.id,
    il.change_type,
    il.quantity_change,
    il.quantity_before,
    il.quantity_after,
    il.notes,
    il.created_at,
    p.name as product_name,
    p.sku
FROM public.inventory_log il
INNER JOIN public.products p ON il.product_id = p.id
ORDER BY il.created_at DESC
LIMIT 50;

-- =====================================================
-- DISCOUNT QUERIES
-- =====================================================

-- Get active discounts
SELECT 
    id,
    code,
    description,
    discount_type,
    discount_value,
    min_order_amount,
    usage_limit,
    usage_count,
    valid_from,
    valid_until
FROM public.discounts
WHERE is_active = TRUE
    AND (valid_from IS NULL OR valid_from <= NOW())
    AND (valid_until IS NULL OR valid_until >= NOW())
ORDER BY created_at DESC;

-- Validate discount code
SELECT 
    id,
    code,
    discount_type,
    discount_value,
    min_order_amount,
    max_discount_amount,
    usage_limit,
    usage_count
FROM public.discounts
WHERE code = 'DISCOUNT_CODE_HERE'
    AND is_active = TRUE
    AND (valid_from IS NULL OR valid_from <= NOW())
    AND (valid_until IS NULL OR valid_until >= NOW())
    AND (usage_limit IS NULL OR usage_count < usage_limit);
