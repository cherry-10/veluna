# 🛍️ How to Add Products to Your VELUNA Website

## Quick & Easy Method - Using Supabase Dashboard

### Step 1: Open Supabase Dashboard
1. Go to: **https://supabase.com/dashboard**
2. Login to your account
3. Select your project: **xsayrhaibqytafphwpqa**

---

### Step 2: Add a Product

1. **Click "Table Editor"** in the left sidebar
2. **Select "products" table** from the list
3. **Click "Insert" button** (green button at top)
4. **Click "Insert row"**

5. **Fill in these fields:**

```
sku: CAN-LAV-001
name: Lavender Dreams Candle
slug: lavender-dreams-candle
description: Handcrafted soy candle with pure lavender essential oil. Perfect for relaxation.
short_description: Calming lavender scent
price: 599
original_price: 799
category_id: [Select from dropdown - choose "Jar Candles"]
stock_quantity: 50
is_active: ✓ (check this box)
is_featured: ✓ (check this box)
fragrance_notes: Lavender, Vanilla
burn_time_hours: 40
weight_grams: 250
```

6. **Click "Save"** button

✅ **Your product is now added!**

---

### Step 3: Add Product Image

1. **Still in Table Editor**, click on **"product_images" table**
2. **Click "Insert" → "Insert row"**

3. **Fill in:**
```
product_id: [Select the product you just created from dropdown]
image_url: https://images.unsplash.com/photo-1602874801006-e24a9ea8f8a7?q=80&w=800
alt_text: Lavender Dreams Candle
is_primary: ✓ (check this box)
display_order: 1
```

4. **Click "Save"**

✅ **Your product now has an image!**

---

### Step 4: View Your Product

1. Open your website: **http://localhost:3000/shop**
2. You should see your new product!

---

## 🎨 Where to Get Product Images

### Free High-Quality Candle Images:

**Unsplash (Best Quality):**
- https://unsplash.com/s/photos/luxury-candles
- https://unsplash.com/s/photos/scented-candles
- https://unsplash.com/s/photos/handmade-candles

**Pexels:**
- https://www.pexels.com/search/candles/

**Pixabay:**
- https://pixabay.com/images/search/candles/

### Ready-to-Use Image URLs:

```
Lavender Candle:
https://images.unsplash.com/photo-1602874801006-e24a9ea8f8a7?q=80&w=800

Rose Candle:
https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800

Vanilla Candle:
https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=800

Eucalyptus Candle:
https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800

Jar Candles:
https://images.unsplash.com/photo-1602874801006-e24a9ea8f8a7?q=80&w=800

Flower Candles:
https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800

Gift Set:
https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800
```

---

## 📝 Quick Copy-Paste Products

### Product 1: Lavender Dreams
```
sku: CAN-LAV-001
name: Lavender Dreams Candle
slug: lavender-dreams-candle
description: Handcrafted soy candle with pure lavender essential oil. Creates a calming atmosphere perfect for relaxation and meditation.
short_description: Calming lavender scent
price: 599
original_price: 799
stock_quantity: 50
is_active: ✓
is_featured: ✓
fragrance_notes: Lavender, Vanilla, Chamomile
burn_time_hours: 40
weight_grams: 250
```

### Product 2: Rose Garden
```
sku: CAN-ROS-002
name: Rose Garden Candle
slug: rose-garden-candle
description: Luxurious candle with the delicate scent of fresh roses. Hand-poured with natural soy wax and adorned with dried rose petals.
short_description: Romantic rose fragrance
price: 649
original_price: 849
stock_quantity: 45
is_active: ✓
is_featured: ✓
fragrance_notes: Rose, Jasmine, Sandalwood
burn_time_hours: 45
weight_grams: 300
```

### Product 3: Vanilla Bliss
```
sku: CAN-VAN-003
name: Vanilla Bliss Candle
slug: vanilla-bliss-candle
description: Warm and inviting vanilla scented candle. Creates a cozy atmosphere perfect for any room in your home.
short_description: Sweet vanilla warmth
price: 549
original_price: 699
stock_quantity: 60
is_active: ✓
is_featured: false
fragrance_notes: Vanilla, Caramel, Cream
burn_time_hours: 35
weight_grams: 200
```

### Product 4: Eucalyptus Mint
```
sku: CAN-EUC-004
name: Eucalyptus Mint Candle
slug: eucalyptus-mint-candle
description: Refreshing eucalyptus and mint blend. Perfect for creating a spa-like atmosphere in your bathroom or bedroom.
short_description: Fresh & invigorating
price: 599
stock_quantity: 55
is_active: ✓
is_featured: false
fragrance_notes: Eucalyptus, Peppermint, Tea Tree
burn_time_hours: 40
weight_grams: 250
```

---

## 🎯 Important Fields Explained

- **sku**: Unique product code (e.g., CAN-LAV-001)
- **name**: Product name shown to customers
- **slug**: URL-friendly name (use hyphens, lowercase)
- **price**: Selling price in rupees
- **original_price**: Original price (for showing discount)
- **stock_quantity**: How many you have in stock
- **is_active**: ✓ to show on website, ✗ to hide
- **is_featured**: ✓ to show in "Featured Products"

---

## ✅ Checklist After Adding Product

- [ ] Product added to `products` table
- [ ] At least 1 image added to `product_images` table
- [ ] `is_active` is checked
- [ ] `stock_quantity` is greater than 0
- [ ] Category is selected
- [ ] Price is set
- [ ] Slug is unique and URL-friendly

---

## 🔄 How to Update Products

### Update Price:
1. Go to `products` table
2. Find your product
3. Click on the price cell
4. Change the value
5. Press Enter

### Update Stock:
1. Go to `products` table
2. Find your product
3. Click on `stock_quantity` cell
4. Change the value
5. Press Enter

### Mark as Featured:
1. Go to `products` table
2. Find your product
3. Check the `is_featured` checkbox
4. Changes save automatically

---

## 🆘 Troubleshooting

**Product not showing on website?**
- ✓ Check `is_active` is checked
- ✓ Check `stock_quantity` > 0
- ✓ Refresh your browser (Ctrl+F5)

**Image not showing?**
- ✓ Check image URL is correct
- ✓ Check `is_primary` is checked
- ✓ Try a different image URL

**Can't find category?**
- ✓ First add categories in `categories` table
- ✓ Then select from dropdown in products

---

## 📞 Need More Help?

Check these files:
- `PRODUCT_SETUP_GUIDE.md` - Detailed guide with SQL
- `database/sample-data.sql` - Example products
- `database/schema.sql` - Database structure

---

**That's it! You're ready to add products! 🎉**

Start with 1-2 products and test them on your website before adding more.
