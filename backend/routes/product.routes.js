const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');

// Get all products with filters
router.get('/', async (req, res) => {
    try {
        const {
            category,
            subcategory,
            occasion,
            min_price,
            max_price,
            sort = 'created_at',
            order = 'desc',
            search,
            featured,
            bestseller,
            limit = 50,
            offset = 0
        } = req.query;

        let query = supabaseAdmin
            .from('products')
            .select(`
                *,
                category:categories(id, name, slug),
                subcategory:subcategories(id, name, slug),
                images:product_images(id, image_url, alt_text, display_order, is_primary),
                occasions:product_occasions(occasion:occasions(id, name, slug))
            `)
            .eq('is_active', true);

        if (category) {
            query = query.eq('category_id', category);
        }

        if (subcategory) {
            query = query.eq('subcategory_id', subcategory);
        }

        if (min_price) {
            query = query.gte('price', parseFloat(min_price));
        }

        if (max_price) {
            query = query.lte('price', parseFloat(max_price));
        }

        if (featured === 'true') {
            query = query.eq('is_featured', true);
        }

        if (bestseller === 'true') {
            query = query.eq('is_bestseller', true);
        }

        if (search) {
            query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
        }

        query = query.order(sort, { ascending: order === 'asc' });
        query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

        const { data, error, count } = await query;

        if (error) {
            return res.status(400).json({
                error: 'Query Failed',
                message: error.message
            });
        }

        res.json({
            products: data,
            total: count,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch products'
        });
    }
});

// Get single product by slug
router.get('/:slug', async (req, res) => {
    try {
        const { slug } = req.params;

        const { data, error } = await supabaseAdmin
            .from('products')
            .select(`
                *,
                category:categories(id, name, slug),
                subcategory:subcategories(id, name, slug),
                images:product_images(id, image_url, alt_text, display_order, is_primary),
                variants:product_variants(*),
                occasions:product_occasions(occasion:occasions(id, name, slug)),
                reviews:reviews(id, rating, title, comment, reviewer_name, is_verified_purchase, created_at)
            `)
            .eq('slug', slug)
            .eq('is_active', true)
            .single();

        if (error || !data) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Product not found'
            });
        }

        // Calculate average rating
        if (data.reviews && data.reviews.length > 0) {
            const avgRating = data.reviews.reduce((sum, review) => sum + review.rating, 0) / data.reviews.length;
            data.avg_rating = parseFloat(avgRating.toFixed(1));
            data.review_count = data.reviews.length;
        } else {
            data.avg_rating = 0;
            data.review_count = 0;
        }

        res.json({ product: data });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch product'
        });
    }
});

// Get featured products
router.get('/featured/list', async (req, res) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('products')
            .select(`
                id,
                name,
                slug,
                price,
                original_price,
                short_description,
                product_images!inner(image_url)
            `)
            .eq('is_featured', true)
            .eq('is_active', true)
            .eq('product_images.is_primary', true)
            .limit(8);

        if (error) {
            return res.status(400).json({
                error: 'Query Failed',
                message: error.message
            });
        }

        res.json({ products: data });
    } catch (error) {
        console.error('Get featured products error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch featured products'
        });
    }
});

// Get bestseller products
router.get('/bestsellers/list', async (req, res) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('products')
            .select(`
                id,
                name,
                slug,
                price,
                original_price,
                short_description,
                product_images!inner(image_url)
            `)
            .eq('is_bestseller', true)
            .eq('is_active', true)
            .eq('product_images.is_primary', true)
            .limit(10);

        if (error) {
            return res.status(400).json({
                error: 'Query Failed',
                message: error.message
            });
        }

        res.json({ products: data });
    } catch (error) {
        console.error('Get bestseller products error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch bestseller products'
        });
    }
});

// Create new product (Admin)
router.post('/', async (req, res) => {
    try {
        const productData = req.body;

        // Insert product
        const { data: product, error: productError } = await supabaseAdmin
            .from('products')
            .insert(productData)
            .select()
            .single();

        if (productError) {
            return res.status(400).json({
                error: 'Insert Failed',
                message: productError.message
            });
        }

        // If image_url is provided, add it to product_images
        if (productData.image_url) {
            await supabaseAdmin
                .from('product_images')
                .insert({
                    product_id: product.id,
                    image_url: productData.image_url,
                    is_primary: true,
                    display_order: 1
                });
        }

        res.status(201).json({ product });
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to create product'
        });
    }
});

// Update product (Admin)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const productData = req.body;

        // Remove image_url from product data if present
        const { image_url, ...updateData } = productData;

        const { data: product, error } = await supabaseAdmin
            .from('products')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return res.status(400).json({
                error: 'Update Failed',
                message: error.message
            });
        }

        // Update image if provided
        if (image_url) {
            // Check if image exists
            const { data: existingImage } = await supabaseAdmin
                .from('product_images')
                .select('id')
                .eq('product_id', id)
                .eq('is_primary', true)
                .single();

            if (existingImage) {
                await supabaseAdmin
                    .from('product_images')
                    .update({ image_url })
                    .eq('id', existingImage.id);
            } else {
                await supabaseAdmin
                    .from('product_images')
                    .insert({
                        product_id: id,
                        image_url,
                        is_primary: true,
                        display_order: 1
                    });
            }
        }

        res.json({ product });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to update product'
        });
    }
});

// Delete product (Admin)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Soft delete by setting is_active to false
        const { data, error } = await supabaseAdmin
            .from('products')
            .update({ is_active: false })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return res.status(400).json({
                error: 'Delete Failed',
                message: error.message
            });
        }

        res.json({ message: 'Product deleted successfully', product: data });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to delete product'
        });
    }
});

// Get related products
router.get('/:id/related', async (req, res) => {
    try {
        const { id } = req.params;

        // Get the product's category
        const { data: product } = await supabaseAdmin
            .from('products')
            .select('category_id')
            .eq('id', id)
            .single();

        if (!product) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Product not found'
            });
        }

        // Get related products from same category
        const { data, error } = await supabaseAdmin
            .from('products')
            .select(`
                id,
                name,
                slug,
                price,
                original_price,
                product_images!inner(image_url)
            `)
            .eq('category_id', product.category_id)
            .eq('is_active', true)
            .neq('id', id)
            .eq('product_images.is_primary', true)
            .limit(4);

        if (error) {
            return res.status(400).json({
                error: 'Query Failed',
                message: error.message
            });
        }

        res.json({ products: data });
    } catch (error) {
        console.error('Get related products error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch related products'
        });
    }
});

module.exports = router;
