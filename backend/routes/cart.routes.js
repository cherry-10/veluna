const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');

// Get cart
router.get('/', optionalAuth, async (req, res) => {
    try {
        const userId = req.user?.id;
        const sessionId = req.query.session_id;

        if (!userId && !sessionId) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'User ID or session ID required'
            });
        }

        let query = supabaseAdmin
            .from('cart')
            .select(`
                *,
                product:products(
                    id,
                    name,
                    slug,
                    price,
                    stock_quantity,
                    product_images!inner(image_url)
                )
            `);

        if (userId) {
            query = query.eq('user_id', userId);
        } else {
            query = query.eq('session_id', sessionId);
        }

        const { data, error } = await query;

        if (error) {
            return res.status(400).json({
                error: 'Query Failed',
                message: error.message
            });
        }

        // Calculate totals
        const subtotal = data.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        const itemCount = data.reduce((sum, item) => sum + item.quantity, 0);

        res.json({
            cart: data,
            subtotal,
            itemCount
        });
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch cart'
        });
    }
});

// Add to cart
router.post('/', optionalAuth, async (req, res) => {
    try {
        const { product_id, quantity = 1, variant_id, customization_details, session_id } = req.body;
        const userId = req.user?.id;

        if (!userId && !session_id) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'User ID or session ID required'
            });
        }

        // Get product price
        const { data: product, error: productError } = await supabaseAdmin
            .from('products')
            .select('price, stock_quantity')
            .eq('id', product_id)
            .single();

        if (productError || !product) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Product not found'
            });
        }

        if (product.stock_quantity < quantity) {
            return res.status(400).json({
                error: 'Insufficient Stock',
                message: 'Not enough stock available'
            });
        }

        // Check if item already in cart
        let existingQuery = supabaseAdmin
            .from('cart')
            .select('*')
            .eq('product_id', product_id);

        if (userId) {
            existingQuery = existingQuery.eq('user_id', userId);
        } else {
            existingQuery = existingQuery.eq('session_id', session_id);
        }

        const { data: existing } = await existingQuery.single();

        if (existing) {
            // Update quantity
            const { data, error } = await supabaseAdmin
                .from('cart')
                .update({
                    quantity: existing.quantity + quantity,
                    updated_at: new Date().toISOString()
                })
                .eq('id', existing.id)
                .select()
                .single();

            if (error) {
                return res.status(400).json({
                    error: 'Update Failed',
                    message: error.message
                });
            }

            return res.json({
                message: 'Cart updated',
                cart_item: data
            });
        }

        // Add new item
        const { data, error } = await supabaseAdmin
            .from('cart')
            .insert({
                user_id: userId || null,
                session_id: session_id || null,
                product_id,
                variant_id: variant_id || null,
                quantity,
                price: product.price,
                customization_details: customization_details || null
            })
            .select()
            .single();

        if (error) {
            return res.status(400).json({
                error: 'Insert Failed',
                message: error.message
            });
        }

        res.status(201).json({
            message: 'Item added to cart',
            cart_item: data
        });
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to add to cart'
        });
    }
});

// Update cart item
router.put('/:id', optionalAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        if (quantity < 1) {
            return res.status(400).json({
                error: 'Invalid Quantity',
                message: 'Quantity must be at least 1'
            });
        }

        const { data, error } = await supabaseAdmin
            .from('cart')
            .update({
                quantity,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return res.status(400).json({
                error: 'Update Failed',
                message: error.message
            });
        }

        res.json({
            message: 'Cart item updated',
            cart_item: data
        });
    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to update cart'
        });
    }
});

// Remove from cart
router.delete('/:id', optionalAuth, async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabaseAdmin
            .from('cart')
            .delete()
            .eq('id', id);

        if (error) {
            return res.status(400).json({
                error: 'Delete Failed',
                message: error.message
            });
        }

        res.json({ message: 'Item removed from cart' });
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to remove from cart'
        });
    }
});

// Clear cart
router.delete('/', optionalAuth, async (req, res) => {
    try {
        const userId = req.user?.id;
        const sessionId = req.query.session_id;

        if (!userId && !sessionId) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'User ID or session ID required'
            });
        }

        let query = supabaseAdmin.from('cart').delete();

        if (userId) {
            query = query.eq('user_id', userId);
        } else {
            query = query.eq('session_id', sessionId);
        }

        const { error } = await query;

        if (error) {
            return res.status(400).json({
                error: 'Delete Failed',
                message: error.message
            });
        }

        res.json({ message: 'Cart cleared' });
    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to clear cart'
        });
    }
});

module.exports = router;
