const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const { optionalAuth } = require('../middleware/auth.middleware');
const { customCandleValidation } = require('../middleware/validation.middleware');
const { sendCustomCandleRequest } = require('../utils/email');

// Generate custom request number
const generateRequestNumber = () => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return `CUS${dateStr}${random}`;
};

// Create custom candle request
router.post('/', optionalAuth, customCandleValidation, async (req, res) => {
    try {
        const {
            jar_size,
            jar_type,
            mold_type,
            candle_color,
            color_hex,
            fragrance,
            fragrance_intensity,
            quantity,
            special_instructions,
            reference_image_url,
            guest_email,
            guest_name,
            guest_phone
        } = req.body;

        const userId = req.user?.id;

        // Calculate estimated price (base pricing logic)
        let estimatedPrice = 0;
        const sizeMultiplier = {
            '30ml': 1,
            '50ml': 1.5,
            '100ml': 2,
            '150ml': 2.5,
            '200ml': 3
        };
        const basePrice = 400;
        estimatedPrice = basePrice * (sizeMultiplier[jar_size] || 2) * quantity;

        const requestNumber = generateRequestNumber();

        const { data, error } = await supabaseAdmin
            .from('custom_candles')
            .insert({
                request_number: requestNumber,
                user_id: userId || null,
                guest_email: guest_email || null,
                guest_name: guest_name || null,
                guest_phone: guest_phone || null,
                jar_size,
                jar_type,
                mold_type: mold_type || null,
                candle_color: candle_color || null,
                color_hex: color_hex || null,
                fragrance: fragrance || null,
                fragrance_intensity: fragrance_intensity || null,
                quantity,
                special_instructions: special_instructions || null,
                reference_image_url: reference_image_url || null,
                estimated_price: estimatedPrice,
                status: 'received'
            })
            .select()
            .single();

        if (error) {
            return res.status(400).json({
                error: 'Request Creation Failed',
                message: error.message
            });
        }

        // Send confirmation email
        const customerEmail = userId ? req.user.email : guest_email;
        if (customerEmail) {
            await sendCustomCandleRequest(data, customerEmail);
        }

        res.status(201).json({
            message: 'Custom candle request submitted successfully',
            request: data
        });
    } catch (error) {
        console.error('Create custom candle error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to create custom candle request'
        });
    }
});

// Get user's custom candle requests
router.get('/', optionalAuth, async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Authentication required'
            });
        }

        const { data, error } = await supabaseAdmin
            .from('custom_candles')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            return res.status(400).json({
                error: 'Query Failed',
                message: error.message
            });
        }

        res.json({ requests: data });
    } catch (error) {
        console.error('Get custom candles error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch custom candle requests'
        });
    }
});

// Get single custom candle request
router.get('/:requestNumber', optionalAuth, async (req, res) => {
    try {
        const { requestNumber } = req.params;

        const { data, error } = await supabaseAdmin
            .from('custom_candles')
            .select('*')
            .eq('request_number', requestNumber)
            .single();

        if (error || !data) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Custom candle request not found'
            });
        }

        // Check authorization
        if (req.user && data.user_id !== req.user.id) {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'Access denied'
            });
        }

        res.json({ request: data });
    } catch (error) {
        console.error('Get custom candle error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch custom candle request'
        });
    }
});

// Update custom candle status (admin only)
router.patch('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, final_price, admin_notes } = req.body;

        const updateData = { status };
        if (final_price) updateData.final_price = final_price;
        if (admin_notes) updateData.admin_notes = admin_notes;

        const { data, error } = await supabaseAdmin
            .from('custom_candles')
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

        res.json({
            message: 'Custom candle request updated',
            request: data
        });
    } catch (error) {
        console.error('Update custom candle error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to update custom candle request'
        });
    }
});

module.exports = router;
