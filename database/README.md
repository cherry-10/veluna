# VELUNA by SKF - Database Setup Guide

## Overview
This directory contains all database schema files, sample data, and useful queries for the VELUNA by SKF e-commerce platform using Supabase (PostgreSQL).

## Files

- **schema.sql** - Complete database schema with all tables, indexes, RLS policies, functions, and triggers
- **sample-data.sql** - Sample products, categories, and test data for development
- **useful-queries.sql** - Common queries for development and administration
- **setup-instructions.md** - Step-by-step setup guide (this file)

## Database Architecture

### Core Tables
1. **users** - Customer profiles (extends Supabase auth.users)
2. **addresses** - Customer shipping/billing addresses
3. **categories** - Main product categories (Candles, Bouquets, Flower Boxes, Gift Sets)
4. **subcategories** - Product subcategories (Scented Candles, Jar Candles, etc.)
5. **occasions** - Event-based browsing (Wedding, Birthday, Anniversary, etc.)
6. **products** - Product catalog with full details
7. **product_images** - Multiple images per product
8. **product_occasions** - Many-to-many relationship between products and occasions
9. **product_variants** - Size, color, and other variations
10. **cart** - Shopping cart (supports both logged-in and guest users)
11. **orders** - Order master table
12. **order_items** - Order line items
13. **custom_candles** - Custom candle requests
14. **reviews** - Product reviews and ratings
15. **contact_messages** - Contact form submissions
16. **discounts** - Promotional codes and discounts
17. **wishlist** - User wishlists
18. **newsletter_subscribers** - Email newsletter subscriptions
19. **inventory_log** - Stock movement tracking
20. **site_settings** - Global site configuration

## Setup Instructions

### Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in project details:
   - **Name**: veluna-skf
   - **Database Password**: (create a strong password and save it)
   - **Region**: Choose closest to your target audience
5. Wait for project to be provisioned (2-3 minutes)

### Step 2: Get Your Supabase Credentials

Once your project is ready, you'll need these credentials:

1. **Project URL**: Found in Settings > API
   - Format: `https://xxxxxxxxxxxxx.supabase.co`
   
2. **Anon/Public Key**: Found in Settings > API
   - This is safe to use in frontend code
   - Format: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   
3. **Service Role Key**: Found in Settings > API (keep this secret!)
   - Only use in backend/server code
   - Never expose in frontend
   - Format: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

4. **Database Password**: The password you created in Step 1

### Step 3: Run Database Schema

1. Open your Supabase project dashboard
2. Go to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy the entire contents of `schema.sql`
5. Paste into the SQL editor
6. Click **Run** (or press Ctrl/Cmd + Enter)
7. Wait for execution to complete (should take 10-20 seconds)
8. Verify success - you should see "Success. No rows returned"

### Step 4: Load Sample Data (Optional but Recommended)

1. In the SQL Editor, create another new query
2. Copy the entire contents of `sample-data.sql`
3. Paste into the SQL editor
4. Click **Run**
5. This will populate your database with:
   - 4 main categories
   - 6 subcategories for candles
   - 6 occasions
   - ~15 sample products (candles, bouquets, flower boxes, gift sets)
   - Product images (placeholder URLs)
   - 3 sample discount codes
   - Site settings

### Step 5: Configure Storage Buckets

For product images and custom candle references:

1. Go to **Storage** in Supabase dashboard
2. Create a new bucket called `product-images`
   - Make it **Public**
   - Enable file size limit: 5MB
   - Allowed MIME types: image/jpeg, image/png, image/webp
3. Create another bucket called `custom-candle-references`
   - Make it **Public**
   - Enable file size limit: 5MB
4. Create a bucket called `category-images`
   - Make it **Public**
   - Enable file size limit: 3MB

### Step 6: Set Up Storage Policies

Run these policies in SQL Editor:

```sql
-- Allow public read access to product images
CREATE POLICY "Public read access for product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- Similar policies for other buckets
CREATE POLICY "Public read access for category images"
ON storage.objects FOR SELECT
USING (bucket_id = 'category-images');

CREATE POLICY "Public read access for custom candle references"
ON storage.objects FOR SELECT
USING (bucket_id = 'custom-candle-references');

CREATE POLICY "Anyone can upload custom candle references"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'custom-candle-references');
```

### Step 7: Enable Realtime (Optional)

For real-time order status updates:

1. Go to **Database** > **Replication**
2. Enable replication for these tables:
   - `orders`
   - `custom_candles`
   - `cart`

### Step 8: Configure Authentication

1. Go to **Authentication** > **Providers**
2. Enable **Email** provider (enabled by default)
3. Configure email templates:
   - Go to **Authentication** > **Email Templates**
   - Customize confirmation email, password reset, etc.
4. Optional: Enable OAuth providers (Google, Facebook)

### Step 9: Set Up Environment Variables

Create a `.env` file in your backend directory:

```env
# Supabase Configuration
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Database Direct Connection (for migrations)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres

# Application Settings
NODE_ENV=development
PORT=5000

# Payment Gateway (Stripe)
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Email Service (Nodemailer with Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=VELUNA by SKF <noreply@velunaskf.com>

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# JWT Secret (for additional auth if needed)
JWT_SECRET=your-random-secret-key-here
```

Create a `.env` file in your frontend directory:

```env
# Supabase Configuration
REACT_APP_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here

# API Configuration
REACT_APP_API_URL=http://localhost:5000/api

# Stripe Configuration
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx

# Google Maps (for address autocomplete)
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

## Database Schema Overview

### Key Relationships

```
users (1) -----> (M) addresses
users (1) -----> (M) orders
users (1) -----> (M) cart
users (1) -----> (M) custom_candles
users (1) -----> (M) wishlist
users (1) -----> (M) reviews

categories (1) -----> (M) products
categories (1) -----> (M) subcategories
subcategories (1) -----> (M) products

products (M) <-----> (M) occasions (via product_occasions)
products (1) -----> (M) product_images
products (1) -----> (M) product_variants
products (1) -----> (M) reviews

orders (1) -----> (M) order_items
products (1) -----> (M) order_items
```

### Important Features

1. **Row Level Security (RLS)**: All tables have RLS enabled
   - Users can only access their own data
   - Public read access for catalog data
   - Admin access requires service role key

2. **Automatic Timestamps**: `created_at` and `updated_at` managed by triggers

3. **Order Number Generation**: Automatic sequential order numbers (VLN20260206XXXXX)

4. **Custom Request Numbers**: Automatic sequential numbers (CUS20260206XXXXX)

5. **Stock Management**: Automatic stock updates when orders are paid

6. **Soft Deletes**: Most tables use `is_active` flags instead of hard deletes

## Testing Your Setup

Run these queries to verify everything is working:

```sql
-- Check if all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Count sample products
SELECT COUNT(*) as product_count FROM public.products;

-- Check categories
SELECT * FROM public.categories;

-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

## Common Operations

### Add a New Product

```sql
INSERT INTO public.products (
    sku, name, slug, description, short_description,
    category_id, price, stock_quantity, is_active
) VALUES (
    'CAN-NEW-001',
    'New Candle Product',
    'new-candle-product',
    'Full description here',
    'Short description',
    (SELECT id FROM public.categories WHERE slug = 'candles'),
    599.00,
    50,
    TRUE
);
```

### Update Product Stock

```sql
UPDATE public.products 
SET stock_quantity = stock_quantity - 5 
WHERE sku = 'CAN-LAV-100';
```

### Create a Discount Code

```sql
INSERT INTO public.discounts (
    code, description, discount_type, discount_value,
    min_order_amount, usage_limit, valid_until, is_active
) VALUES (
    'SUMMER25',
    'Summer sale - 25% off',
    'percentage',
    25.00,
    500.00,
    100,
    NOW() + INTERVAL '30 days',
    TRUE
);
```

## Backup and Maintenance

### Backup Database

1. Go to **Database** > **Backups** in Supabase dashboard
2. Backups are automatic (daily)
3. For manual backup, use pg_dump:

```bash
pg_dump -h db.xxxxxxxxxxxxx.supabase.co -U postgres -d postgres > backup.sql
```

### Monitor Performance

1. Go to **Database** > **Query Performance**
2. Check slow queries
3. Add indexes if needed

### Update Statistics

```sql
ANALYZE public.products;
ANALYZE public.orders;
```

## Security Best Practices

1. **Never expose service role key** in frontend code
2. **Use RLS policies** for all user data access
3. **Validate input** on both frontend and backend
4. **Use prepared statements** to prevent SQL injection
5. **Rotate keys** periodically
6. **Enable 2FA** on Supabase account
7. **Monitor logs** for suspicious activity
8. **Keep dependencies updated**

## Troubleshooting

### Issue: RLS blocking queries

**Solution**: Check if you're using the correct key:
- Frontend: Use anon key
- Backend admin operations: Use service role key

### Issue: Can't insert data

**Solution**: Check RLS policies and ensure user is authenticated

### Issue: Slow queries

**Solution**: Add indexes or optimize queries using EXPLAIN ANALYZE

### Issue: Storage upload fails

**Solution**: Check bucket policies and file size limits

## Next Steps

After database setup is complete:

1. ✅ Database schema created
2. ✅ Sample data loaded
3. ✅ Storage buckets configured
4. ⏭️ Set up backend API (Node.js + Express)
5. ⏭️ Build frontend (React + Tailwind CSS)
6. ⏭️ Integrate payment gateway
7. ⏭️ Configure email service
8. ⏭️ Deploy to production

## Support

For issues or questions:
- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- PostgreSQL Docs: https://www.postgresql.org/docs/

---

**Ready to provide your Supabase credentials to connect the application!**
