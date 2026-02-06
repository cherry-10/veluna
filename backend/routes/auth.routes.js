const express = require('express');
const router = express.Router();
const { supabase, supabaseAdmin } = require('../config/supabase');
const { body } = require('express-validator');
const { validate } = require('../middleware/validation.middleware');

// Register
router.post('/register', [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('full_name').trim().notEmpty().withMessage('Full name is required'),
    validate
], async (req, res) => {
    try {
        const { email, password, full_name, phone } = req.body;

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name,
                    phone
                }
            }
        });

        if (authError) {
            return res.status(400).json({
                error: 'Registration Failed',
                message: authError.message
            });
        }

        if (authData.user) {
            await supabaseAdmin
                .from('users')
                .insert({
                    id: authData.user.id,
                    email,
                    full_name,
                    phone
                });
        }

        res.status(201).json({
            message: 'Registration successful',
            user: authData.user,
            session: authData.session
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Registration failed'
        });
    }
});

// Login
router.post('/login', [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
], async (req, res) => {
    try {
        const { email, password } = req.body;

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            return res.status(401).json({
                error: 'Login Failed',
                message: error.message
            });
        }

        res.json({
            message: 'Login successful',
            user: data.user,
            session: data.session
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Login failed'
        });
    }
});

// Logout
router.post('/logout', async (req, res) => {
    try {
        const { error } = await supabase.auth.signOut();

        if (error) {
            return res.status(400).json({
                error: 'Logout Failed',
                message: error.message
            });
        }

        res.json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Logout failed'
        });
    }
});

// Get current user
router.get('/me', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'No token provided'
            });
        }

        const token = authHeader.substring(7);
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Invalid token'
            });
        }

        const { data: userData } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

        res.json({
            user: userData || user
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to get user'
        });
    }
});

// Password reset request
router.post('/forgot-password', [
    body('email').isEmail().withMessage('Valid email is required'),
    validate
], async (req, res) => {
    try {
        const { email } = req.body;

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.FRONTEND_URL}/reset-password`
        });

        if (error) {
            return res.status(400).json({
                error: 'Request Failed',
                message: error.message
            });
        }

        res.json({
            message: 'Password reset email sent'
        });
    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to send reset email'
        });
    }
});

// Update password
router.post('/update-password', [
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    validate
], async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'No token provided'
            });
        }

        const { password } = req.body;

        const { error } = await supabase.auth.updateUser({
            password
        });

        if (error) {
            return res.status(400).json({
                error: 'Update Failed',
                message: error.message
            });
        }

        res.json({
            message: 'Password updated successfully'
        });
    } catch (error) {
        console.error('Update password error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to update password'
        });
    }
});

module.exports = router;
