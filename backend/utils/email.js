const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to,
            subject,
            html
        });
        console.log('Email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Email error:', error);
        return { success: false, error: error.message };
    }
};

const sendOrderConfirmation = async (order, customerEmail) => {
    const subject = `Order Confirmation - ${order.order_number}`;
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: 'Montserrat', Arial, sans-serif; line-height: 1.6; color: #2B2B2B; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #8B5E3C; color: white; padding: 30px; text-align: center; }
                .content { background: #F7F3EE; padding: 30px; }
                .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
                .item { padding: 10px 0; border-bottom: 1px solid #E6D5C3; }
                .total { font-size: 1.2em; font-weight: bold; color: #8B5E3C; margin-top: 20px; }
                .footer { text-align: center; padding: 20px; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>VELUNA by SKF</h1>
                    <p>Thank you for your order!</p>
                </div>
                <div class="content">
                    <h2>Order Confirmation</h2>
                    <p>Hi ${order.shipping_address.full_name},</p>
                    <p>Your order has been received and is being processed with love and care.</p>
                    
                    <div class="order-details">
                        <h3>Order #${order.order_number}</h3>
                        <p><strong>Order Date:</strong> ${new Date(order.created_at).toLocaleDateString()}</p>
                        <p><strong>Total Amount:</strong> ₹${order.total_amount}</p>
                        
                        <h4>Shipping Address:</h4>
                        <p>
                            ${order.shipping_address.full_name}<br>
                            ${order.shipping_address.address_line1}<br>
                            ${order.shipping_address.city}, ${order.shipping_address.state} ${order.shipping_address.postal_code}
                        </p>
                    </div>
                    
                    <p>We'll send you another email when your order ships.</p>
                    <p>Made with love, warmth, and soul ❤️</p>
                </div>
                <div class="footer">
                    <p>VELUNA by SKF - Handcrafted Candles & Floral Creations</p>
                    <p>Questions? Contact us at hello@velunaskf.com</p>
                </div>
            </div>
        </body>
        </html>
    `;
    
    return await sendEmail(customerEmail, subject, html);
};

const sendCustomCandleRequest = async (customCandle, customerEmail) => {
    const subject = `Custom Candle Request Received - ${customCandle.request_number}`;
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: 'Montserrat', Arial, sans-serif; line-height: 1.6; color: #2B2B2B; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #8B5E3C; color: white; padding: 30px; text-align: center; }
                .content { background: #F7F3EE; padding: 30px; }
                .details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
                .footer { text-align: center; padding: 20px; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>VELUNA by SKF</h1>
                    <p>Custom Candle Request Received</p>
                </div>
                <div class="content">
                    <h2>Thank You!</h2>
                    <p>Hi ${customCandle.guest_name || 'there'},</p>
                    <p>We've received your custom candle request and are excited to create something special for you!</p>
                    
                    <div class="details">
                        <h3>Request #${customCandle.request_number}</h3>
                        <p><strong>Jar Size:</strong> ${customCandle.jar_size}</p>
                        <p><strong>Jar Type:</strong> ${customCandle.jar_type}</p>
                        <p><strong>Mold Type:</strong> ${customCandle.mold_type || 'None'}</p>
                        <p><strong>Color:</strong> ${customCandle.candle_color || 'Natural'}</p>
                        <p><strong>Fragrance:</strong> ${customCandle.fragrance || 'Unscented'}</p>
                        <p><strong>Quantity:</strong> ${customCandle.quantity}</p>
                        ${customCandle.special_instructions ? `<p><strong>Special Instructions:</strong> ${customCandle.special_instructions}</p>` : ''}
                    </div>
                    
                    <p>We'll review your request and get back to you within 24-48 hours with pricing and timeline.</p>
                    <p>Crafted with love ❤️</p>
                </div>
                <div class="footer">
                    <p>VELUNA by SKF - Handcrafted Candles & Floral Creations</p>
                </div>
            </div>
        </body>
        </html>
    `;
    
    return await sendEmail(customerEmail, subject, html);
};

const sendContactFormNotification = async (contactMessage) => {
    const subject = `New Contact Form Submission - ${contactMessage.subject}`;
    const html = `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${contactMessage.name}</p>
        <p><strong>Email:</strong> ${contactMessage.email}</p>
        <p><strong>Phone:</strong> ${contactMessage.phone || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${contactMessage.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${contactMessage.message}</p>
        <p><strong>Submitted:</strong> ${new Date(contactMessage.created_at).toLocaleString()}</p>
    `;
    
    return await sendEmail(process.env.EMAIL_USER, subject, html);
};

module.exports = {
    sendEmail,
    sendOrderConfirmation,
    sendCustomCandleRequest,
    sendContactFormNotification
};
