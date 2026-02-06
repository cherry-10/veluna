require('dotenv').config();
const { supabaseAdmin } = require('../config/supabase');

async function seedCategories() {
    console.log('🌱 Seeding categories...');

    const categories = [
        {
            name: 'Handcrafted Candles',
            slug: 'handcrafted-candles',
            description: 'Beautiful handmade candles crafted with love and care',
            display_order: 1,
            is_active: true
        },
        {
            name: 'Jar Candles',
            slug: 'jar-candles',
            description: 'Elegant candles in beautiful glass jars',
            display_order: 2,
            is_active: true
        },
        {
            name: 'Flower Candles',
            slug: 'flower-candles',
            description: 'Candles decorated with beautiful dried flowers',
            display_order: 3,
            is_active: true
        },
        {
            name: 'Pillar Candles',
            slug: 'pillar-candles',
            description: 'Classic pillar-style candles for any occasion',
            display_order: 4,
            is_active: true
        },
        {
            name: 'Gift Sets',
            slug: 'gift-sets',
            description: 'Curated candle gift sets for special occasions',
            display_order: 5,
            is_active: true
        }
    ];

    try {
        // Insert categories
        const { data, error } = await supabaseAdmin
            .from('categories')
            .upsert(categories, { onConflict: 'slug' })
            .select();

        if (error) {
            console.error('❌ Error seeding categories:', error);
            process.exit(1);
        }

        console.log('✅ Categories seeded successfully!');
        console.log(`📊 Added ${data.length} categories:`);
        data.forEach(cat => {
            console.log(`   - ${cat.name} (${cat.slug})`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Fatal error:', error);
        process.exit(1);
    }
}

seedCategories();
