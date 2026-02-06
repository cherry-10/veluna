const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');

// Get all categories
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('categories')
            .select(`
                *,
                subcategories(*)
            `)
            .eq('is_active', true)
            .order('display_order', { ascending: true });

        if (error) {
            return res.status(400).json({
                error: 'Query Failed',
                message: error.message
            });
        }

        res.json({ categories: data });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch categories'
        });
    }
});

// Get single category by slug
router.get('/:slug', async (req, res) => {
    try {
        const { slug } = req.params;

        const { data, error } = await supabaseAdmin
            .from('categories')
            .select(`
                *,
                subcategories(*),
                products(
                    id,
                    name,
                    slug,
                    price,
                    original_price,
                    short_description,
                    product_images!inner(image_url)
                )
            `)
            .eq('slug', slug)
            .eq('is_active', true)
            .eq('products.is_active', true)
            .eq('products.product_images.is_primary', true)
            .single();

        if (error || !data) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Category not found'
            });
        }

        res.json({ category: data });
    } catch (error) {
        console.error('Get category error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch category'
        });
    }
});

// Get subcategories by category
router.get('/:categoryId/subcategories', async (req, res) => {
    try {
        const { categoryId } = req.params;

        const { data, error } = await supabaseAdmin
            .from('subcategories')
            .select('*')
            .eq('category_id', categoryId)
            .eq('is_active', true)
            .order('display_order', { ascending: true });

        if (error) {
            return res.status(400).json({
                error: 'Query Failed',
                message: error.message
            });
        }

        res.json({ subcategories: data });
    } catch (error) {
        console.error('Get subcategories error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch subcategories'
        });
    }
});

module.exports = router;
