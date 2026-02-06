# VELUNA by SKF - Backend API

## Overview
RESTful API for VELUNA by SKF e-commerce platform built with Node.js, Express, and Supabase.

## Tech Stack
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payment**: Stripe
- **Email**: Nodemailer
- **Security**: Helmet, CORS, Rate Limiting

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your credentials:
```bash
cp .env.example .env
```

Required variables:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (keep secret!)
- `STRIPE_SECRET_KEY` - Stripe secret key
- `EMAIL_USER` - Your email for sending notifications
- `EMAIL_PASSWORD` - Email app password

### 3. Run Development Server
```bash
npm run dev
```

Server will start on `http://localhost:5000`

### 4. Run Production Server
```bash
npm start
```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `POST /logout` - Logout user
- `GET /me` - Get current user
- `POST /forgot-password` - Request password reset
- `POST /update-password` - Update password

### Products (`/api/products`)
- `GET /` - Get all products (with filters)
- `GET /:slug` - Get single product
- `GET /featured/list` - Get featured products
- `GET /bestsellers/list` - Get bestseller products
- `GET /:id/related` - Get related products

### Categories (`/api/categories`)
- `GET /` - Get all categories
- `GET /:slug` - Get category with products
- `GET /:categoryId/subcategories` - Get subcategories

### Occasions (`/api/occasions`)
- `GET /` - Get all occasions
- `GET /:slug` - Get occasion with products

### Cart (`/api/cart`)
- `GET /` - Get cart items
- `POST /` - Add to cart
- `PUT /:id` - Update cart item
- `DELETE /:id` - Remove from cart
- `DELETE /` - Clear cart

### Orders (`/api/orders`)
- `POST /` - Create order
- `GET /` - Get user orders (auth required)
- `GET /:orderNumber` - Get single order
- `PATCH /:id/status` - Update order status (admin)

### Custom Candles (`/api/custom-candles`)
- `POST /` - Submit custom candle request
- `GET /` - Get user's requests (auth required)
- `GET /:requestNumber` - Get single request
- `PATCH /:id/status` - Update request status (admin)

### Reviews (`/api/reviews`)
- `GET /product/:productId` - Get product reviews
- `POST /` - Create review (auth required)
- `POST /:id/helpful` - Mark review as helpful

### Contact (`/api/contact`)
- `POST /` - Submit contact form
- `GET /` - Get all messages (admin)
- `PATCH /:id/status` - Update message status (admin)

### Wishlist (`/api/wishlist`)
- `GET /` - Get wishlist (auth required)
- `POST /` - Add to wishlist (auth required)
- `DELETE /:id` - Remove from wishlist (auth required)
- `DELETE /product/:productId` - Remove by product ID (auth required)

### Discounts (`/api/discounts`)
- `POST /validate` - Validate discount code
- `GET /active` - Get active discounts

### Newsletter (`/api/newsletter`)
- `POST /subscribe` - Subscribe to newsletter
- `POST /unsubscribe` - Unsubscribe from newsletter

### Payment (`/api/payment`)
- `POST /create-intent` - Create Stripe payment intent
- `POST /confirm` - Confirm payment
- `POST /webhook` - Stripe webhook handler

## Query Parameters

### Products Filtering
```
GET /api/products?category=uuid&min_price=500&max_price=2000&sort=price&order=asc&search=candle&featured=true&limit=20&offset=0
```

### Pagination
Most list endpoints support:
- `limit` - Number of items (default: 50)
- `offset` - Skip items (default: 0)

## Authentication

Include JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## Error Responses

All errors follow this format:
```json
{
  "error": "Error Type",
  "message": "Detailed error message"
}
```

Status codes:
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: 100 requests per 15 minutes
- **Input Validation**: Express-validator
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Input sanitization

## Deployment

### Deploy to Render

1. Create new Web Service on Render
2. Connect GitHub repository
3. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
4. Add environment variables
5. Deploy

### Health Check
```
GET /api/health
```

Response:
```json
{
  "status": "OK",
  "message": "VELUNA by SKF API is running",
  "timestamp": "2026-02-06T10:00:00.000Z",
  "environment": "production"
}
```

## Development

### File Structure
```
backend/
├── config/
│   └── supabase.js          # Supabase client configuration
├── middleware/
│   ├── auth.middleware.js   # Authentication middleware
│   └── validation.middleware.js  # Input validation
├── routes/
│   ├── auth.routes.js       # Authentication routes
│   ├── product.routes.js    # Product routes
│   ├── cart.routes.js       # Cart routes
│   ├── order.routes.js      # Order routes
│   └── ...                  # Other route files
├── utils/
│   └── email.js             # Email utilities
├── .env                     # Environment variables
├── .gitignore              # Git ignore file
├── package.json            # Dependencies
├── server.js               # Main server file
└── README.md               # This file
```

### Adding New Routes

1. Create route file in `routes/` directory
2. Define routes using Express Router
3. Add validation middleware
4. Import and use in `server.js`

Example:
```javascript
const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');

router.get('/', async (req, res) => {
    // Route logic
});

module.exports = router;
```

## Testing

Run tests:
```bash
npm test
```

## Support

For issues or questions:
- Email: dev@velunaskf.com
- Documentation: See `/database/README.md` for database schema

---

**Built with ❤️ for VELUNA by SKF**
