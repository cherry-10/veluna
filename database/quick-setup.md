# VELUNA by SKF - Quick Database Setup Guide

## Prerequisites
- Supabase account created
- New Supabase project created
- Project credentials ready (URL, Anon Key, Service Role Key)

## 5-Minute Setup

### Step 1: Run Main Schema (2 minutes)
1. Open Supabase Dashboard → SQL Editor
2. Copy entire contents of `schema.sql`
3. Paste and click **Run**
4. Wait for "Success. No rows returned"

### Step 2: Load Sample Data (1 minute)
1. Create new query in SQL Editor
2. Copy entire contents of `sample-data.sql`
3. Paste and click **Run**
4. Verify: You should see ~15 products, 4 categories, 6 occasions

### Step 3: Create Storage Buckets (1 minute)
1. Go to **Storage** section
2. Create these buckets (all PUBLIC):
   - `product-images` (5MB limit, image/*)
   - `category-images` (3MB limit, image/*)
   - `occasion-images` (3MB limit, image/*)
   - `custom-candle-references` (5MB limit, image/*)

### Step 4: Apply Storage Policies (30 seconds)
1. Back to SQL Editor
2. Copy contents of `storage-policies.sql`
3. Paste and click **Run**

### Step 5: Enable Authentication (30 seconds)
1. Go to **Authentication** → **Providers**
2. Verify **Email** is enabled (default)
3. Optional: Configure email templates

## Verification Checklist

Run these queries in SQL Editor to verify:

```sql
-- Should return 20 tables
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_schema = 'public';

-- Should return ~15 products
SELECT COUNT(*) FROM public.products;

-- Should return 4 categories
SELECT COUNT(*) FROM public.categories;

-- Should return 6 occasions
SELECT COUNT(*) FROM public.occasions;

-- Check if RLS is enabled (should return TRUE for all)
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
LIMIT 5;
```

## Get Your Credentials

### For Backend (.env file):
```env
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Find these in: **Settings** → **API**

### For Frontend (.env file):
```env
REACT_APP_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## What's Been Created?

### Database Tables (20 total)
✅ User management (users, addresses)
✅ Product catalog (products, categories, subcategories, occasions)
✅ Shopping (cart, orders, order_items)
✅ Custom candles (custom_candles)
✅ Reviews & ratings (reviews)
✅ Marketing (discounts, newsletter_subscribers)
✅ Admin (contact_messages, inventory_log, site_settings)

### Security Features
✅ Row Level Security (RLS) on all tables
✅ User data isolation
✅ Public read for catalog
✅ Secure authentication

### Automation
✅ Auto-generated order numbers (VLN20260206XXXXX)
✅ Auto-generated custom request numbers (CUS20260206XXXXX)
✅ Auto-updated timestamps
✅ Auto-stock management on orders

### Sample Data Included
✅ 15+ products (candles, bouquets, flower boxes, gift sets)
✅ 4 main categories
✅ 6 subcategories
✅ 6 occasions
✅ 3 discount codes
✅ Site settings

## Next Steps

After database setup:
1. ✅ Database ready
2. ⏭️ Provide Supabase credentials to developer
3. ⏭️ Set up backend API (Node.js + Express)
4. ⏭️ Build frontend (React + Tailwind CSS)
5. ⏭️ Integrate Stripe/Razorpay payments
6. ⏭️ Configure email service
7. ⏭️ Deploy to production

## Common Issues

**Issue**: "permission denied for schema public"
**Fix**: Make sure you're running queries as the postgres user (default in SQL Editor)

**Issue**: "relation already exists"
**Fix**: Tables already created. Skip to sample data or drop tables first:
```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```

**Issue**: Storage policies not working
**Fix**: Ensure buckets are created first, then run storage-policies.sql

## Support Resources
- 📚 Full documentation: See `README.md`
- 🔍 Query examples: See `useful-queries.sql`
- 🗄️ Schema reference: See `schema.sql`

---

**Ready to connect your application!** 🚀
