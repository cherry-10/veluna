require('dotenv').config();
const { supabaseAdmin } = require('../config/supabase');

async function addProduct() {
    console.log('🛍️ Adding product to database...');

    try {
        // First, get the category ID for "Handcrafted Candles"
        const { data: categories, error: catError } = await supabaseAdmin
            .from('categories')
            .select('id, name')
            .eq('slug', 'handcrafted-candles')
            .single();

        if (catError || !categories) {
            console.error('❌ Error finding category:', catError);
            console.log('Available categories:');
            const { data: allCats } = await supabaseAdmin.from('categories').select('*');
            console.log(allCats);
            process.exit(1);
        }

        console.log(`✅ Found category: ${categories.name} (${categories.id})`);

        // Add the product
        const productData = {
            sku: 'CAN-CUBE-001',
            name: 'Cube Wax Candles',
            slug: 'cube-wax-candles',
            description: 'Handmade Mini Bubble Heart Scented Candles| Aesthetic Room Decor, Pinterest Trending Gift, Desk & Study Table Decor, Birthday Return Gift for Girls (Multicolor)',
            short_description: 'Cube Wax Candles',
            category_id: categories.id,
            price: 199,
            original_price: 399,
            stock_quantity: 21,
            burn_time_hours: 20,
            weight_grams: 150,
            fragrance_notes: 'fragrance of flowers',
            is_featured: true,
            is_bestseller: false,
            is_active: true
        };

        const { data: product, error: prodError } = await supabaseAdmin
            .from('products')
            .insert(productData)
            .select()
            .single();

        if (prodError) {
            console.error('❌ Error adding product:', prodError);
            process.exit(1);
        }

        console.log('✅ Product added successfully!');
        console.log(`   ID: ${product.id}`);
        console.log(`   Name: ${product.name}`);
        console.log(`   SKU: ${product.sku}`);

        // Add product image
        const imageData = {
            product_id: product.id,
            image_url: 'https://m.media-amazon.com/images/I/41s6NSXr36L._AC_UF350,350_QL80_.jpg',
            is_primary: true,
            display_order: 1
        };

        const { data: image, error: imgError } = await supabaseAdmin
            .from('product_images')
            .insert(imageData)
            .select()
            .single();

        if (imgError) {
            console.error('⚠️ Warning: Could not add image:', imgError);
        } else {
            console.log('✅ Product image added successfully!');
        }

        console.log('\n🎉 Product is now available in your store!');
        console.log(`   View at: http://localhost:3003/product/${product.slug}`);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Fatal error:', error);
        process.exit(1);
    }
}

addProduct();
