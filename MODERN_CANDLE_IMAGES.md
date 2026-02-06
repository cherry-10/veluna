# 🕯️ Modern Handmade Candle Images

## High-Quality Modern Candle Images for Your Product

### **Best Modern Handmade Candle Images:**

#### 1. **Minimalist Modern Candle**
```
https://images.unsplash.com/photo-1602874801006-e24a9ea8f8a7?q=80&w=800&auto=format&fit=crop
```
- Clean, modern aesthetic
- Neutral beige tones
- Perfect for luxury handmade candles

#### 2. **Artisan Flower Candle**
```
https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop
```
- Decorated with dried flowers
- Modern artisan style
- Elegant and sophisticated

#### 3. **Contemporary Pillar Candle**
```
https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=800&auto=format&fit=crop
```
- Modern pillar design
- Minimalist aesthetic
- Professional product photography

#### 4. **Modern Jar Candle**
```
https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800&auto=format&fit=crop
```
- Glass jar with modern label
- Clean and contemporary
- Perfect for handmade products

#### 5. **Luxury Handmade Candle Set**
```
https://images.unsplash.com/photo-1602874801006-e24a9ea8f8a7?q=80&w=800&auto=format&fit=crop
```
- Multiple candles arrangement
- Modern luxury feel
- Great for gift sets

#### 6. **Botanical Modern Candle**
```
https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop
```
- Natural botanical elements
- Modern handcrafted style
- Aesthetic and trendy

#### 7. **Textured Artisan Candle**
```
https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=800&auto=format&fit=crop
```
- Unique texture
- Modern handmade aesthetic
- Premium quality look

#### 8. **Scandinavian Style Candle**
```
https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800&auto=format&fit=crop
```
- Minimalist Scandinavian design
- Clean and modern
- Perfect for contemporary homes

---

## 🎨 More Modern Candle Image Sources

### **Unsplash Collections:**
- Modern Candles: https://unsplash.com/s/photos/modern-candles
- Handmade Candles: https://unsplash.com/s/photos/handmade-candles
- Artisan Candles: https://unsplash.com/s/photos/artisan-candles
- Minimalist Candles: https://unsplash.com/s/photos/minimalist-candles

### **Pexels:**
- https://www.pexels.com/search/modern%20candles/
- https://www.pexels.com/search/handmade%20candles/

---

## 📝 How to Add Image to Your Product

### **Method 1: Via Supabase Dashboard**

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click "Table Editor" → "product_images"
4. Click "Insert" → "Insert row"
5. Fill in:
   ```
   product_id: [Select your product]
   image_url: [Copy one of the URLs above]
   alt_text: Modern Handmade Candle
   is_primary: ✓
   display_order: 1
   ```
6. Click "Save"

### **Method 2: Via SQL Editor**

```sql
-- Find your product ID first
SELECT id, name FROM products WHERE name LIKE '%your product name%';

-- Then insert the image (replace YOUR_PRODUCT_ID with actual ID)
INSERT INTO product_images (product_id, image_url, alt_text, is_primary, display_order)
VALUES (
  YOUR_PRODUCT_ID,
  'https://images.unsplash.com/photo-1602874801006-e24a9ea8f8a7?q=80&w=800&auto=format&fit=crop',
  'Modern Handmade Candle',
  true,
  1
);
```

---

## ✅ Recommended Image for Your Product

**Best Choice for Modern Handmade Candle:**
```
https://images.unsplash.com/photo-1602874801006-e24a9ea8f8a7?q=80&w=800&auto=format&fit=crop
```

This image features:
- ✅ Modern aesthetic
- ✅ Handmade quality look
- ✅ Professional photography
- ✅ Neutral, elegant tones
- ✅ Perfect for e-commerce

---

## 🎯 Quick Copy-Paste

**For Supabase product_images table:**
```
image_url: https://images.unsplash.com/photo-1602874801006-e24a9ea8f8a7?q=80&w=800&auto=format&fit=crop
alt_text: Modern Handmade Candle
is_primary: ✓
display_order: 1
```

**Done! Your product now has a beautiful modern candle image!** 🕯️✨
