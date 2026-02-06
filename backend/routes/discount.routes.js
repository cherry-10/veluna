const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');

// Validate discount code
router.post('/validate', async (req, res) => {
    try {
        const { code, order_amount } = req.body;

        if (!code) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Discount code is required'
            });
        }

        const { data: discount, error } = await supabaseAdmin
            .from('discounts')
            .select('*')
            .eq('code', code.toUpperCase())
            .eq('is_active', true)
            .single();

        if (error || !discount) {
            return res.status(404).json({
                error: 'Invalid Code',
                message: 'This discount code is not valid',
                valid: false
            });
        }

        // Check validity dates
        const now = new Date();
        if (discount.valid_from && new Date(discount.valid_from) > now) {
            return res.status(400).json({
                error: 'Not Yet Valid',
                message: 'This discount code is not yet active',
                valid: false
            });
        }

        if (discount.valid_until && new Date(discount.valid_until) < now) {
            return res.status(400).json({
                error: 'Expired',
                message: 'This discount code has expired',
                valid: false
            });
        }

        // Check usage limit
        if (discount.usage_limit && discount.usage_count >= discount.usage_limit) {
            return res.status(400).json({
                error: 'Usage Limit Reached',
                message: 'This discount code has reached its usage limit',
                valid: false
            });
        }

        // Check minimum order amount
        if (discount.min_order_amount && order_amount < discount.min_order_amount) {
            return res.status(400).json({
                error: 'Minimum Order Not Met',
                message: `Minimum order amount of ₹${discount.min_order_amount} required`,
                valid: false,
                min_order_amount: discount.min_order_amount
            });
        }

        // Calculate discount amount
        let discountAmount = 0;
        if (discount.discount_type === 'percentage') {
            discountAmount = (order_amount * discount.discount_value) / 100;
            if (discount.max_discount_amount) {
                discountAmount = Math.min(discountAmount, discount.max_discount_amount);
            }
        } else {
            discountAmount = discount.discount_value;
        }

        res.json({
            valid: true,
            message: 'Discount code applied successfully',
            discount: {
                code: discount.code,
                description: discount.description,
                discount_type: discount.discount_type,
                discount_value: discount.discount_value,
                discount_amount: discountAmount
            }
        });
    } catch (error) {
        console.error('Validate discount error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to validate discount code'
        });
    }
});

// Get active discounts (public)
router.get('/active', async (req, res) => {
    try {
        const now = new Date().toISOString();

        const { data, error } = await supabaseAdmin
            .from('discounts')
            .select('code, description, discount_type, discount_value, min_order_amount')
            .eq('is_active', true)
            .or(`valid_from.is.null,valid_from.lte.${now}`)
            .or(`valid_until.is.null,valid_until.gte.${now}`)
            .order('created_at', { ascending: false });

        if (error) {
            return res.status(400).json({
                error: 'Query Failed',
                message: error.message
            });
        }

        res.json({ discounts: data });
    } catch (error) {
        console.error('Get active discounts error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch active discounts'
        });
    }
});

module.exports = router;
