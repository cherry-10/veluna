const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');

// Get all occasions
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('occasions')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true });

        if (error) {
            return res.status(400).json({
                error: 'Query Failed',
                message: error.message
            });
        }

        res.json({ occasions: data });
    } catch (error) {
        console.error('Get occasions error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch occasions'
        });
    }
});

// Get single occasion by slug with products
router.get('/:slug', async (req, res) => {
    try {
        const { slug } = req.params;

        const { data: occasion, error: occasionError } = await supabaseAdmin
            .from('occasions')
            .select('*')
            .eq('slug', slug)
            .eq('is_active', true)
            .single();

        if (occasionError || !occasion) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Occasion not found'
            });
        }

        // Get products for this occasion
        const { data: products, error: productsError } = await supabaseAdmin
            .from('product_occasions')
            .select(`
                product:products(
                    id,
                    name,
                    slug,
                    price,
                    original_price,
                    short_description,
                    product_images!inner(image_url)
                )
            `)
            .eq('occasion_id', occasion.id)
            .eq('product.is_active', true)
            .eq('product.product_images.is_primary', true);

        if (productsError) {
            return res.status(400).json({
                error: 'Query Failed',
                message: productsError.message
            });
        }

        occasion.products = products.map(p => p.product);

        res.json({ occasion });
    } catch (error) {
        console.error('Get occasion error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch occasion'
        });
    }
});

module.exports = router;
