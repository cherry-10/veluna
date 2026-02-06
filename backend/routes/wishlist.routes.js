const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const { authenticate } = require('../middleware/auth.middleware');

// Get user's wishlist
router.get('/', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;

        const { data, error } = await supabaseAdmin
            .from('wishlist')
            .select(`
                id,
                created_at,
                product:products(
                    id,
                    name,
                    slug,
                    price,
                    original_price,
                    stock_quantity,
                    is_active,
                    product_images!inner(image_url)
                )
            `)
            .eq('user_id', userId)
            .eq('product.is_active', true)
            .eq('product.product_images.is_primary', true)
            .order('created_at', { ascending: false });

        if (error) {
            return res.status(400).json({
                error: 'Query Failed',
                message: error.message
            });
        }

        res.json({ wishlist: data });
    } catch (error) {
        console.error('Get wishlist error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch wishlist'
        });
    }
});

// Add to wishlist
router.post('/', authenticate, async (req, res) => {
    try {
        const { product_id } = req.body;
        const userId = req.user.id;

        // Check if already in wishlist
        const { data: existing } = await supabaseAdmin
            .from('wishlist')
            .select('id')
            .eq('user_id', userId)
            .eq('product_id', product_id)
            .single();

        if (existing) {
            return res.status(400).json({
                error: 'Already in Wishlist',
                message: 'This product is already in your wishlist'
            });
        }

        const { data, error } = await supabaseAdmin
            .from('wishlist')
            .insert({
                user_id: userId,
                product_id
            })
            .select()
            .single();

        if (error) {
            return res.status(400).json({
                error: 'Add Failed',
                message: error.message
            });
        }

        res.status(201).json({
            message: 'Product added to wishlist',
            wishlist_item: data
        });
    } catch (error) {
        console.error('Add to wishlist error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to add to wishlist'
        });
    }
});

// Remove from wishlist
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const { error } = await supabaseAdmin
            .from('wishlist')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);

        if (error) {
            return res.status(400).json({
                error: 'Delete Failed',
                message: error.message
            });
        }

        res.json({ message: 'Product removed from wishlist' });
    } catch (error) {
        console.error('Remove from wishlist error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to remove from wishlist'
        });
    }
});

// Remove by product ID
router.delete('/product/:productId', authenticate, async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.id;

        const { error } = await supabaseAdmin
            .from('wishlist')
            .delete()
            .eq('product_id', productId)
            .eq('user_id', userId);

        if (error) {
            return res.status(400).json({
                error: 'Delete Failed',
                message: error.message
            });
        }

        res.json({ message: 'Product removed from wishlist' });
    } catch (error) {
        console.error('Remove from wishlist error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to remove from wishlist'
        });
    }
});

module.exports = router;
