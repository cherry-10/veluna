# Add Categories to Supabase Database

## Step 1: Go to Supabase Dashboard

1. Visit: https://supabase.com/dashboard
2. Select your project: **VELUNA by SKF**
3. Go to **SQL Editor** (left sidebar)

## Step 2: Run This SQL Query

Copy and paste this entire query into the SQL Editor and click **Run**:

```sql
-- Insert categories for VELUNA by SKF
INSERT INTO public.categories (name, slug, description, display_order, is_active) VALUES
('Handcrafted Candles', 'handcrafted-candles', 'Beautiful handmade candles crafted with love', 1, true),
('Jar Candles', 'jar-candles', 'Elegant candles in glass jars', 2, true),
('Flower Candles', 'flower-candles', 'Candles decorated with beautiful flowers', 3, true),
('Pillar Candles', 'pillar-candles', 'Classic pillar-style candles', 4, true),
('Gift Sets', 'gift-sets', 'Curated candle gift sets for special occasions', 5, true)
ON CONFLICT (slug) DO NOTHING;
```

## Step 3: Verify Categories Were Added

Run this query to check:

```sql
SELECT * FROM public.categories ORDER BY display_order;
```

You should see all 5 categories listed!

## ✅ Done!

Now your admin panel will show these categories in the dropdown when adding products.
