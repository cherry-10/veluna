const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');
const { orderValidation } = require('../middleware/validation.middleware');
const { sendOrderConfirmation } = require('../utils/email');

// Generate order number
const generateOrderNumber = () => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return `VLN${dateStr}${random}`;
};

// Create order
router.post('/', optionalAuth, orderValidation, async (req, res) => {
    try {
        const {
            items,
            shipping_address,
            billing_address,
            shipping_method,
            payment_method,
            discount_code,
            guest_email,
            guest_name,
            guest_phone
        } = req.body;

        const userId = req.user?.id;

        // Calculate totals
        let subtotal = 0;
        const orderItems = [];

        for (const item of items) {
            const { data: product } = await supabaseAdmin
                .from('products')
                .select('id, name, sku, price, stock_quantity')
                .eq('id', item.product_id)
                .single();

            if (!product) {
                return res.status(404).json({
                    error: 'Product Not Found',
                    message: `Product ${item.product_id} not found`
                });
            }

            if (product.stock_quantity < item.quantity) {
                return res.status(400).json({
                    error: 'Insufficient Stock',
                    message: `Not enough stock for ${product.name}`
                });
            }

            const itemTotal = product.price * item.quantity;
            subtotal += itemTotal;

            orderItems.push({
                product_id: product.id,
                product_name: product.name,
                product_sku: product.sku,
                quantity: item.quantity,
                unit_price: product.price,
                total_price: itemTotal,
                customization_details: item.customization_details || null
            });
        }

        // Apply discount if provided
        let discountAmount = 0;
        if (discount_code) {
            const { data: discount } = await supabaseAdmin
                .from('discounts')
                .select('*')
                .eq('code', discount_code)
                .eq('is_active', true)
                .single();

            if (discount) {
                const now = new Date();
                const validFrom = discount.valid_from ? new Date(discount.valid_from) : null;
                const validUntil = discount.valid_until ? new Date(discount.valid_until) : null;

                if ((!validFrom || now >= validFrom) && (!validUntil || now <= validUntil)) {
                    if (!discount.min_order_amount || subtotal >= discount.min_order_amount) {
                        if (discount.discount_type === 'percentage') {
                            discountAmount = (subtotal * discount.discount_value) / 100;
                            if (discount.max_discount_amount) {
                                discountAmount = Math.min(discountAmount, discount.max_discount_amount);
                            }
                        } else {
                            discountAmount = discount.discount_value;
                        }

                        // Update usage count
                        await supabaseAdmin
                            .from('discounts')
                            .update({ usage_count: discount.usage_count + 1 })
                            .eq('id', discount.id);
                    }
                }
            }
        }

        // Calculate shipping
        const shippingCost = shipping_method === 'express' ? 150 : 50;

        // Calculate tax (18% GST)
        const taxAmount = ((subtotal - discountAmount + shippingCost) * 0.18);

        const totalAmount = subtotal - discountAmount + shippingCost + taxAmount;

        // Create order
        const orderNumber = generateOrderNumber();

        const { data: order, error: orderError } = await supabaseAdmin
            .from('orders')
            .insert({
                order_number: orderNumber,
                user_id: userId || null,
                guest_email: guest_email || null,
                guest_name: guest_name || null,
                guest_phone: guest_phone || null,
                status: 'pending',
                payment_status: 'pending',
                payment_method,
                subtotal,
                discount_amount: discountAmount,
                shipping_cost: shippingCost,
                tax_amount: taxAmount,
                total_amount: totalAmount,
                shipping_address,
                billing_address: billing_address || shipping_address,
                shipping_method
            })
            .select()
            .single();

        if (orderError) {
            return res.status(400).json({
                error: 'Order Creation Failed',
                message: orderError.message
            });
        }

        // Create order items
        const itemsWithOrderId = orderItems.map(item => ({
            ...item,
            order_id: order.id
        }));

        const { error: itemsError } = await supabaseAdmin
            .from('order_items')
            .insert(itemsWithOrderId);

        if (itemsError) {
            // Rollback order
            await supabaseAdmin.from('orders').delete().eq('id', order.id);
            return res.status(400).json({
                error: 'Order Items Creation Failed',
                message: itemsError.message
            });
        }

        // Clear cart if user is logged in
        if (userId) {
            await supabaseAdmin.from('cart').delete().eq('user_id', userId);
        }

        // Send confirmation email
        const customerEmail = userId ? req.user.email : guest_email;
        if (customerEmail) {
            await sendOrderConfirmation(order, customerEmail);
        }

        res.status(201).json({
            message: 'Order created successfully',
            order: {
                ...order,
                items: orderItems
            }
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to create order'
        });
    }
});

// Get user orders
router.get('/', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;

        const { data, error } = await supabaseAdmin
            .from('orders')
            .select(`
                *,
                items:order_items(*)
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            return res.status(400).json({
                error: 'Query Failed',
                message: error.message
            });
        }

        res.json({ orders: data });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch orders'
        });
    }
});

// Get single order
router.get('/:orderNumber', optionalAuth, async (req, res) => {
    try {
        const { orderNumber } = req.params;

        const { data, error } = await supabaseAdmin
            .from('orders')
            .select(`
                *,
                items:order_items(*)
            `)
            .eq('order_number', orderNumber)
            .single();

        if (error || !data) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Order not found'
            });
        }

        // Check authorization
        if (req.user && data.user_id !== req.user.id) {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'Access denied'
            });
        }

        res.json({ order: data });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch order'
        });
    }
});

// Update order status (admin only - would need admin middleware)
router.patch('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, tracking_number } = req.body;

        const updateData = { status };
        if (tracking_number) {
            updateData.tracking_number = tracking_number;
        }
        if (status === 'delivered') {
            updateData.delivered_at = new Date().toISOString();
        }

        const { data, error } = await supabaseAdmin
            .from('orders')
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
            message: 'Order status updated',
            order: data
        });
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to update order status'
        });
    }
});

module.exports = router;
