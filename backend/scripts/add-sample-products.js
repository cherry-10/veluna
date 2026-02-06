require('dotenv').config();
const { supabaseAdmin } = require('../config/supabase');

async function addSampleProducts() {
  console.log('Adding sample products to database...');

  // Get categories first
  const { data: categories, error: catError } = await supabaseAdmin
    .from('categories')
    .select('id, name')
    .order('name');

  if (catError) {
    console.error('Error fetching categories:', catError);
    return;
  }

  console.log('Found categories:', categories.map(c => c.name));

  // Sample products - 1 per category (4 total)
  const sampleProducts = [
    {
      sku: 'HC-LAV-001',
      name: 'Lavender Dream Candle',
      slug: 'lavender-dream-candle',
      description: 'Handcrafted lavender scented candle with natural soy wax. Perfect for relaxation and aromatherapy.',
      short_description: 'Soothing lavender scent for relaxation',
      price: 299,
      original_price: 399,
      stock_quantity: 25,
      category_id: categories.find(c => c.name === 'Handcrafted Candles')?.id,
      is_featured: true,
      is_bestseller: true,
      fragrance_notes: 'Lavender, Chamomile, Vanilla',
      burn_time: 30,
      weight: 200,
      image_url: 'https://images.unsplash.com/photo-1602874801006-e04b6bacd1e5?w=400'
    },
    {
      sku: 'JC-VAN-001',
      name: 'Vanilla Bean Jar Candle',
      slug: 'vanilla-bean-jar-candle',
      description: 'Luxury vanilla scented jar candle with premium soy wax. Comes in elegant glass jar.',
      short_description: 'Rich vanilla aroma in elegant jar',
      price: 349,
      original_price: 449,
      stock_quantity: 30,
      category_id: categories.find(c => c.name === 'Jar Candles')?.id,
      is_featured: true,
      is_bestseller: false,
      fragrance_notes: 'Vanilla Bean, Cream, Sugar',
      burn_time: 40,
      weight: 250,
      image_url: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400'
    },
    {
      sku: 'FC-ROS-001',
      name: 'Rose Garden Flower Candle',
      slug: 'rose-garden-flower-candle',
      description: 'Beautiful flower-shaped candle with rose fragrance. Perfect gift for special occasions.',
      short_description: 'Elegant rose-scented flower candle',
      price: 399,
      original_price: 499,
      stock_quantity: 20,
      category_id: categories.find(c => c.name === 'Flower Candles')?.id,
      is_featured: false,
      is_bestseller: true,
      fragrance_notes: 'Rose, Jasmine, Lily',
      burn_time: 25,
      weight: 180,
      image_url: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400'
    },
    {
      sku: 'PC-CIN-001',
      name: 'Cinnamon Spice Pillar Candle',
      slug: 'cinnamon-spice-pillar-candle',
      description: 'Classic pillar candle with warm cinnamon spice fragrance. Long-lasting and elegant.',
      short_description: 'Warm cinnamon spice pillar candle',
      price: 279,
      original_price: 349,
      stock_quantity: 35,
      category_id: categories.find(c => c.name === 'Pillar Candles')?.id,
      is_featured: true,
      is_bestseller: true,
      fragrance_notes: 'Cinnamon, Nutmeg, Clove',
      burn_time: 50,
      weight: 300,
      image_url: 'https://images.unsplash.com/photo-1602874801006-e04b6bacd1e5?w=400'
    }
  ];

  // Add products one by one
  for (const product of sampleProducts) {
    console.log(`\nAdding product: ${product.name}...`);

    // Separate image_url from product data
    const { image_url, ...productFields } = product;

    // Insert product
    const { data: insertedProduct, error: productError } = await supabaseAdmin
      .from('products')
      .insert(productFields)
      .select()
      .single();

    if (productError) {
      console.error(`Error adding ${product.name}:`, productError.message);
      continue;
    }

    console.log(`✓ Product added with ID: ${insertedProduct.id}`);

    // Add product image
    if (image_url) {
      const { error: imageError } = await supabaseAdmin
        .from('product_images')
        .insert({
          product_id: insertedProduct.id,
          image_url: image_url,
          is_primary: true,
          display_order: 1
        });

      if (imageError) {
        console.error(`Error adding image for ${product.name}:`, imageError.message);
      } else {
        console.log(`✓ Image added for ${product.name}`);
      }
    }
  }

  console.log('\n✅ Sample products added successfully!');
  console.log('Total products added:', sampleProducts.length);
}

// Run the script
addSampleProducts()
  .then(() => {
    console.log('\n🎉 Script completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
