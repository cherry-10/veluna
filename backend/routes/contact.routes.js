const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const { contactValidation } = require('../middleware/validation.middleware');
const { sendContactFormNotification } = require('../utils/email');

// Submit contact form
router.post('/', contactValidation, async (req, res) => {
    try {
        const { name, email, phone, subject, message, attachment_url } = req.body;

        const { data, error } = await supabaseAdmin
            .from('contact_messages')
            .insert({
                name,
                email,
                phone: phone || null,
                subject,
                message,
                attachment_url: attachment_url || null,
                status: 'new'
            })
            .select()
            .single();

        if (error) {
            return res.status(400).json({
                error: 'Submission Failed',
                message: error.message
            });
        }

        // Send notification to admin
        await sendContactFormNotification(data);

        res.status(201).json({
            message: 'Your message has been sent successfully. We will get back to you soon!',
            contact_message: data
        });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to submit contact form'
        });
    }
});

// Get all contact messages (admin only)
router.get('/', async (req, res) => {
    try {
        const { status, limit = 50, offset = 0 } = req.query;

        let query = supabaseAdmin
            .from('contact_messages')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

        if (status) {
            query = query.eq('status', status);
        }

        const { data, error, count } = await query;

        if (error) {
            return res.status(400).json({
                error: 'Query Failed',
                message: error.message
            });
        }

        res.json({
            messages: data,
            total: count
        });
    } catch (error) {
        console.error('Get contact messages error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch contact messages'
        });
    }
});

// Update contact message status (admin only)
router.patch('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, admin_notes } = req.body;

        const updateData = { status };
        if (admin_notes) updateData.admin_notes = admin_notes;

        const { data, error } = await supabaseAdmin
            .from('contact_messages')
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
            message: 'Contact message updated',
            contact_message: data
        });
    } catch (error) {
        console.error('Update contact message error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to update contact message'
        });
    }
});

module.exports = router;
