const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const { authenticate } = require('../middleware/auth.middleware');
const { reviewValidation } = require('../middleware/validation.middleware');

// Get reviews for a product
router.get('/product/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const { limit = 10, offset = 0 } = req.query;

        const { data, error, count } = await supabaseAdmin
            .from('reviews')
            .select('*', { count: 'exact' })
            .eq('product_id', productId)
            .eq('is_approved', true)
            .order('created_at', { ascending: false })
            .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

        if (error) {
            return res.status(400).json({
                error: 'Query Failed',
                message: error.message
            });
        }

        // Calculate average rating
        const avgRating = data.length > 0
            ? data.reduce((sum, review) => sum + review.rating, 0) / data.length
            : 0;

        res.json({
            reviews: data,
            total: count,
            avgRating: parseFloat(avgRating.toFixed(1))
        });
    } catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch reviews'
        });
    }
});

// Create review
router.post('/', authenticate, reviewValidation, async (req, res) => {
    try {
        const { product_id, rating, title, comment } = req.body;
        const userId = req.user.id;

        // Check if user has purchased this product
        const { data: orderItems } = await supabaseAdmin
            .from('order_items')
            .select('id, order:orders!inner(user_id, payment_status)')
            .eq('product_id', product_id)
            .eq('order.user_id', userId)
            .eq('order.payment_status', 'paid');

        const isVerifiedPurchase = orderItems && orderItems.length > 0;

        // Check if user already reviewed this product
        const { data: existingReview } = await supabaseAdmin
            .from('reviews')
            .select('id')
            .eq('product_id', product_id)
            .eq('user_id', userId)
            .single();

        if (existingReview) {
            return res.status(400).json({
                error: 'Already Reviewed',
                message: 'You have already reviewed this product'
            });
        }

        // Get user details
        const { data: user } = await supabaseAdmin
            .from('users')
            .select('full_name, email')
            .eq('id', userId)
            .single();

        const { data, error } = await supabaseAdmin
            .from('reviews')
            .insert({
                product_id,
                user_id: userId,
                rating,
                title: title || null,
                comment: comment || null,
                reviewer_name: user?.full_name || 'Anonymous',
                reviewer_email: user?.email,
                is_verified_purchase: isVerifiedPurchase,
                is_approved: false
            })
            .select()
            .single();

        if (error) {
            return res.status(400).json({
                error: 'Review Creation Failed',
                message: error.message
            });
        }

        res.status(201).json({
            message: 'Review submitted successfully. It will be visible after approval.',
            review: data
        });
    } catch (error) {
        console.error('Create review error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to create review'
        });
    }
});

// Update review helpful count
router.post('/:id/helpful', async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabaseAdmin
            .from('reviews')
            .update({
                helpful_count: supabaseAdmin.raw('helpful_count + 1')
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
            message: 'Thank you for your feedback',
            review: data
        });
    } catch (error) {
        console.error('Update helpful count error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to update helpful count'
        });
    }
});

module.exports = router;
