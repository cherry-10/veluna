const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const { supabaseAdmin } = require('../config/supabase');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create payment intent (Stripe)
router.post('/create-intent', async (req, res) => {
    try {
        const { amount, order_id, currency = 'inr' } = req.body;

        if (!amount || amount < 50) {
            return res.status(400).json({
                error: 'Invalid Amount',
                message: 'Amount must be at least ₹50'
            });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to paise
            currency,
            metadata: {
                order_id: order_id || ''
            }
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });
    } catch (error) {
        console.error('Create payment intent error:', error);
        res.status(500).json({
            error: 'Payment Intent Failed',
            message: error.message
        });
    }
});

// Confirm payment
router.post('/confirm', async (req, res) => {
    try {
        const { payment_intent_id, order_id } = req.body;

        // Verify payment with Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

        if (paymentIntent.status === 'succeeded') {
            // Update order payment status
            const { data, error } = await supabaseAdmin
                .from('orders')
                .update({
                    payment_status: 'paid',
                    payment_id: payment_intent_id,
                    status: 'confirmed'
                })
                .eq('id', order_id)
                .select()
                .single();

            if (error) {
                return res.status(400).json({
                    error: 'Order Update Failed',
                    message: error.message
                });
            }

            res.json({
                message: 'Payment confirmed successfully',
                order: data
            });
        } else {
            res.status(400).json({
                error: 'Payment Not Completed',
                message: 'Payment has not been completed',
                status: paymentIntent.status
            });
        }
    } catch (error) {
        console.error('Confirm payment error:', error);
        res.status(500).json({
            error: 'Payment Confirmation Failed',
            message: error.message
        });
    }
});

// Webhook handler for Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log('PaymentIntent succeeded:', paymentIntent.id);
            
            // Update order status
            if (paymentIntent.metadata.order_id) {
                await supabaseAdmin
                    .from('orders')
                    .update({
                        payment_status: 'paid',
                        payment_id: paymentIntent.id,
                        status: 'confirmed'
                    })
                    .eq('id', paymentIntent.metadata.order_id);
            }
            break;

        case 'payment_intent.payment_failed':
            const failedPayment = event.data.object;
            console.log('PaymentIntent failed:', failedPayment.id);
            
            if (failedPayment.metadata.order_id) {
                await supabaseAdmin
                    .from('orders')
                    .update({
                        payment_status: 'failed'
                    })
                    .eq('id', failedPayment.metadata.order_id);
            }
            break;

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
});

module.exports = router;
