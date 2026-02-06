const { body, param, query, validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Validation Error',
            details: errors.array()
        });
    }
    next();
};

const productValidation = [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category_id').isUUID().withMessage('Valid category ID is required'),
    validate
];

const orderValidation = [
    body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
    body('shipping_address').isObject().withMessage('Shipping address is required'),
    body('shipping_address.full_name').trim().notEmpty().withMessage('Full name is required'),
    body('shipping_address.phone').trim().notEmpty().withMessage('Phone number is required'),
    body('shipping_address.address_line1').trim().notEmpty().withMessage('Address is required'),
    body('shipping_address.city').trim().notEmpty().withMessage('City is required'),
    body('shipping_address.state').trim().notEmpty().withMessage('State is required'),
    body('shipping_address.postal_code').trim().notEmpty().withMessage('Postal code is required'),
    validate
];

const customCandleValidation = [
    body('jar_size').trim().notEmpty().withMessage('Jar size is required'),
    body('jar_type').trim().notEmpty().withMessage('Jar type is required'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('guest_email').optional().isEmail().withMessage('Valid email is required'),
    validate
];

const reviewValidation = [
    body('product_id').isUUID().withMessage('Valid product ID is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional().trim().isLength({ max: 1000 }).withMessage('Comment too long'),
    validate
];

const contactValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
    validate
];

const newsletterValidation = [
    body('email').isEmail().withMessage('Valid email is required'),
    validate
];

module.exports = {
    validate,
    productValidation,
    orderValidation,
    customCandleValidation,
    reviewValidation,
    contactValidation,
    newsletterValidation
};
