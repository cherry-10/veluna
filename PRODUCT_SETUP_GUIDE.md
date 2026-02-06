# Product Setup Guide - VELUNA by SKF

## 📸 Adding Product Images

### Option 1: Using Supabase Storage (Recommended)

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project: `xsayrhaibqytafphwpqa`

2. **Navigate to Storage**
   - Click "Storage" in left sidebar
   - You should see these buckets:
     - `product-images`
     - `category-images`
     - `occasion-images`

3. **Upload Product Images**
   - Click on `product-images` bucket
   - Click "Upload File" button
   - Select your candle images (JPG, PNG, WebP)
   - Recommended size: 800x800px or 1000x1000px
   - Name format: `candle-lavender-1.jpg`, `candle-rose-2.jpg`, etc.

4. **Get Image URLs**
   - After upload, click on the image
   - Copy the public URL
   - Format: `https://xsayrhaibqytafphwpqa.supabase.co/storage/v1/object/public/product-images/your-image.jpg`

### Option 2: Free Stock Image Sources

**High-Quality Candle Images:**
- **Unsplash**: https://unsplash.com/s/photos/luxury-candles
- **Pexels**: https://www.pexels.com/search/scented-candles/
- **Pixabay**: https://pixabay.com/images/search/candles/

**Search Terms:**
- "luxury candles"
- "scented candles aesthetic"
- "handmade candles"
- "soy candles"
- "candle with flowers"
- "jar candles"

### Sample Image URLs (Placeholder)

For testing, you can use these placeholder URLs:
```
https://images.unsplash.com/photo-1602874801006-e24a9ea8f8a7?w=800
https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800
https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800
https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800
```

---

## 🛍️ Adding Products to Your Website

### Method 1: Using Supabase Dashboard (Easy)

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your project
   - Click "Table Editor" in sidebar

2. **Add a Category First**
   - Click on `categories` table
   - Click "Insert" → "Insert row"
   - Fill in:
     ```
     name: Jar Candles
     slug: jar-candles
     description: Beautiful candles in decorative jars
     image_url: [your image URL]
     is_active: true
     ```
   - Click "Save"

3. **Add a Product**
   - Click on `products` table
   - Click "Insert" → "Insert row"
   - Fill in:
     ```
     sku: CAN-LAV-001
     name: Lavender Dreams Candle
     slug: lavender-dreams-candle
     description: Handcrafted soy candle with pure lavender essential oil
     short_description: Calming lavender scent
     price: 599
     original_price: 799
     category_id: [select from dropdown]
     stock_quantity: 50
     is_active: true
     is_featured: true
     fragrance_notes: Lavender, Vanilla
     burn_time_hours: 40
     weight_grams: 250
     ```
   - Click "Save"

4. **Add Product Images**
   - Click on `product_images` table
   - Click "Insert" → "Insert row"
   - Fill in:
     ```
     product_id: [select product from dropdown]
     image_url: [your uploaded image URL]
     alt_text: Lavender Dreams Candle
     is_primary: true
     display_order: 1
     ```
   - Add 3-4 images per product (different angles)

### Method 2: Using SQL (Bulk Insert)

1. **Go to SQL Editor in Supabase**
2. **Run this SQL to add multiple products:**

```sql
-- Insert Category
INSERT INTO public.categories (name, slug, description, is_active)
VALUES 
  ('Jar Candles', 'jar-candles', 'Elegant candles in decorative jars', true),
  ('Flower Candles', 'flower-candles', 'Candles adorned with dried flowers', true);

-- Insert Products
INSERT INTO public.products (
  sku, name, slug, description, short_description, 
  price, original_price, category_id, stock_quantity, 
  is_active, is_featured, fragrance_notes, burn_time_hours, weight_grams
)
VALUES 
  (
    'CAN-LAV-001',
    'Lavender Dreams Candle',
    'lavender-dreams-candle',
    'Handcrafted soy candle infused with pure lavender essential oil. Perfect for relaxation and creating a calming atmosphere in your home.',
    'Calming lavender scent for relaxation',
    599,
    799,
    (SELECT id FROM public.categories WHERE slug = 'jar-candles' LIMIT 1),
    50,
    true,
    true,
    'Lavender, Vanilla, Chamomile',
    40,
    250
  ),
  (
    'CAN-ROS-002',
    'Rose Garden Candle',
    'rose-garden-candle',
    'Luxurious candle with the delicate scent of fresh roses. Hand-poured with natural soy wax and adorned with dried rose petals.',
    'Romantic rose fragrance',
    649,
    849,
    (SELECT id FROM public.categories WHERE slug = 'flower-candles' LIMIT 1),
    45,
    true,
    true,
    'Rose, Jasmine, Sandalwood',
    45,
    300
  ),
  (
    'CAN-VAN-003',
    'Vanilla Bliss Candle',
    'vanilla-bliss-candle',
    'Warm and inviting vanilla scented candle. Creates a cozy atmosphere perfect for any room in your home.',
    'Sweet vanilla warmth',
    549,
    699,
    (SELECT id FROM public.categories WHERE slug = 'jar-candles' LIMIT 1),
    60,
    true,
    false,
    'Vanilla, Caramel, Cream',
    35,
    200
  );

-- Insert Product Images (replace URLs with your actual image URLs)
INSERT INTO public.product_images (product_id, image_url, alt_text, is_primary, display_order)
VALUES
  -- Lavender Dreams images
  (
    (SELECT id FROM public.products WHERE sku = 'CAN-LAV-001'),
    'https://images.unsplash.com/photo-1602874801006-e24a9ea8f8a7?w=800',
    'Lavender Dreams Candle',
    true,
    1
  ),
  (
    (SELECT id FROM public.products WHERE sku = 'CAN-LAV-001'),
    'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800',
    'Lavender Dreams Candle - Side View',
    false,
    2
  ),
  -- Rose Garden images
  (
    (SELECT id FROM public.products WHERE sku = 'CAN-ROS-002'),
    'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800',
    'Rose Garden Candle',
    true,
    1
  ),
  -- Vanilla Bliss images
  (
    (SELECT id FROM public.products WHERE sku = 'CAN-VAN-003'),
    'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800',
    'Vanilla Bliss Candle',
    true,
    1
  );
```

---

## 🎨 Product Image Guidelines

### Image Specifications
- **Format**: JPG or PNG
- **Size**: 800x800px to 1200x1200px
- **Aspect Ratio**: 1:1 (square)
- **File Size**: Under 500KB (optimized)
- **Background**: Clean, neutral (white, cream, or light beige)

### Photography Tips
1. **Good Lighting**: Natural light or soft studio lighting
2. **Multiple Angles**: Front, side, top view, lifestyle shots
3. **Consistent Style**: Same background and lighting across products
4. **Show Details**: Close-ups of textures, labels, decorations
5. **Lifestyle Shots**: Candles in home settings

---

## 📦 Quick Start: Add Your First Product

### Step-by-Step:

1. **Upload Image to Supabase Storage**
   - Go to Storage → product-images
   - Upload your candle photo
   - Copy the public URL

2. **Add Product via SQL Editor**
   ```sql
   INSERT INTO public.products (
     sku, name, slug, description, short_description,
     price, category_id, stock_quantity, is_active, is_featured
   )
   VALUES (
     'CAN-001',
     'My First Candle',
     'my-first-candle',
     'A beautiful handcrafted candle',
     'Handcrafted with love',
     599,
     (SELECT id FROM public.categories WHERE slug = 'jar-candles' LIMIT 1),
     50,
     true,
     true
   );

   INSERT INTO public.product_images (product_id, image_url, alt_text, is_primary)
   VALUES (
     (SELECT id FROM public.products WHERE sku = 'CAN-001'),
     'YOUR_IMAGE_URL_HERE',
     'My First Candle',
     true
   );
   ```

3. **View on Website**
   - Go to http://localhost:3000/shop
   - Your product should appear!

---

## 🔄 Updating Products

### Update Price
```sql
UPDATE public.products 
SET price = 699, original_price = 899
WHERE sku = 'CAN-001';
```

### Update Stock
```sql
UPDATE public.products 
SET stock_quantity = 30
WHERE sku = 'CAN-001';
```

### Mark as Featured
```sql
UPDATE public.products 
SET is_featured = true
WHERE sku = 'CAN-001';
```

---

## 🎯 Product Categories

Recommended categories for your candle shop:
- **Jar Candles** - Classic candles in glass jars
- **Flower Candles** - Decorated with dried flowers
- **Pillar Candles** - Freestanding pillar style
- **Tealight Candles** - Small tealights
- **Gift Sets** - Curated candle gift sets
- **Seasonal** - Holiday and seasonal candles

---

## 📊 Checking Your Products

### View All Products
```sql
SELECT 
  p.name,
  p.price,
  p.stock_quantity,
  c.name as category,
  (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as image
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.is_active = true;
```

### Count Products
```sql
SELECT COUNT(*) as total_products FROM products WHERE is_active = true;
```

---

## 🆘 Troubleshooting

**Product not showing?**
- Check `is_active = true`
- Verify category exists
- Check stock_quantity > 0

**Image not loading?**
- Verify image URL is public
- Check Supabase storage bucket is public
- Ensure image format is supported (JPG, PNG, WebP)

**Price showing wrong?**
- Check both `price` and `original_price` fields
- Prices are in rupees (₹)

---

## 📞 Need Help?

Check these files for reference:
- Database schema: `database/schema.sql`
- Sample data: `database/sample-data.sql`
- API endpoints: `backend/README.md`

---

**Happy selling! 🕯️✨**
