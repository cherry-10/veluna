const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const { newsletterValidation } = require('../middleware/validation.middleware');

// Subscribe to newsletter
router.post('/subscribe', newsletterValidation, async (req, res) => {
    try {
        const { email, name } = req.body;

        // Check if already subscribed
        const { data: existing } = await supabaseAdmin
            .from('newsletter_subscribers')
            .select('id, is_subscribed')
            .eq('email', email)
            .single();

        if (existing) {
            if (existing.is_subscribed) {
                return res.status(400).json({
                    error: 'Already Subscribed',
                    message: 'This email is already subscribed to our newsletter'
                });
            } else {
                // Resubscribe
                const { data, error } = await supabaseAdmin
                    .from('newsletter_subscribers')
                    .update({
                        is_subscribed: true,
                        subscribed_at: new Date().toISOString(),
                        unsubscribed_at: null
                    })
                    .eq('id', existing.id)
                    .select()
                    .single();

                if (error) {
                    return res.status(400).json({
                        error: 'Subscription Failed',
                        message: error.message
                    });
                }

                return res.json({
                    message: 'Successfully resubscribed to newsletter',
                    subscriber: data
                });
            }
        }

        // New subscription
        const { data, error } = await supabaseAdmin
            .from('newsletter_subscribers')
            .insert({
                email,
                name: name || null,
                is_subscribed: true
            })
            .select()
            .single();

        if (error) {
            return res.status(400).json({
                error: 'Subscription Failed',
                message: error.message
            });
        }

        res.status(201).json({
            message: 'Successfully subscribed to newsletter',
            subscriber: data
        });
    } catch (error) {
        console.error('Newsletter subscribe error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to subscribe to newsletter'
        });
    }
});

// Unsubscribe from newsletter
router.post('/unsubscribe', newsletterValidation, async (req, res) => {
    try {
        const { email } = req.body;

        const { data, error } = await supabaseAdmin
            .from('newsletter_subscribers')
            .update({
                is_subscribed: false,
                unsubscribed_at: new Date().toISOString()
            })
            .eq('email', email)
            .select()
            .single();

        if (error) {
            return res.status(400).json({
                error: 'Unsubscribe Failed',
                message: error.message
            });
        }

        res.json({
            message: 'Successfully unsubscribed from newsletter',
            subscriber: data
        });
    } catch (error) {
        console.error('Newsletter unsubscribe error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to unsubscribe from newsletter'
        });
    }
});

module.exports = router;
