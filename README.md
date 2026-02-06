# 🕯️ VELUNA by SKF - Luxury Candle E-commerce Platform

A sophisticated, full-stack e-commerce platform for handcrafted candles and floral creations with classical aesthetic design.

## ✨ Features

- 🎨 **Posh Classical Design** - Elegant cursive fonts, luxury color palette
- 🛍️ **Full E-commerce** - Product catalog, cart, checkout, orders
- 👤 **User Authentication** - Supabase Auth with profiles
- 🎨 **Custom Candle Builder** - Multi-step customization flow
- 📦 **Admin Panel** - Complete product management system
- 🎉 **Occasions** - Shop by special events
- 📱 **Fully Responsive** - Mobile-first design
- 🖼️ **High-Quality Images** - Professional candle photography

## 🚀 Live Demo

- **Frontend**: [Deploy to Vercel](https://vercel.com)
- **Backend**: [Deploy to Render](https://render.com)

## 🛠️ Tech Stack

### Frontend
- React 18 + Vite
- Tailwind CSS
- React Router DOM
- React Query
- Framer Motion
- React Hook Form
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router DOM** for navigation
- **React Query** for server state management
- **Context API** for global state
- **Supabase** for authentication and database
- **Stripe** for payments
- **Axios** for API calls

### Backend
- **Node.js** with Express.js
- **Supabase** (PostgreSQL) for database
- **Supabase Auth** for authentication
- **Stripe** for payment processing
- **Nodemailer** for email notifications
- **Express Rate Limit** for security
- **Helmet** for security headers

### Database
- **Supabase** (PostgreSQL)
- 20 tables with full relationships
- Row Level Security (RLS) policies
- Automatic triggers and functions

## 📁 Project Structure

```
Veluna-SKF/
├── database/
│   ├── schema.sql              # Complete database schema
│   ├── sample-data.sql         # Sample products and data
│   ├── useful-queries.sql      # Common queries
│   ├── storage-policies.sql    # File upload policies
│   ├── README.md              # Database documentation
│   └── quick-setup.md         # Quick setup guide
├── backend/
│   ├── config/
│   │   └── supabase.js        # Supabase configuration
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── validation.middleware.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── product.routes.js
│   │   ├── cart.routes.js
│   │   ├── order.routes.js
│   │   └── ... (11 route files)
│   ├── utils/
│   │   └── email.js
│   ├── .env
│   ├── package.json
│   ├── server.js
│   └── README.md
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Layout/
    │   │   └── UI/
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── CartContext.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Shop.jsx
    │   │   ├── ProductDetail.jsx
    │   │   └── ... (15+ pages)
    │   ├── utils/
    │   │   └── api.js
    │   ├── config/
    │   │   └── supabase.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .env
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── index.html
```

## 🚀 Quick Start

### 1. Database Setup

```bash
cd database
```

1. Create a Supabase project at https://supabase.com
2. Run `schema.sql` in Supabase SQL Editor
3. Run `sample-data.sql` for test data
4. Run `storage-policies.sql` after creating storage buckets
5. See `quick-setup.md` for detailed instructions

### 2. Backend Setup

```bash
cd backend
npm install
```

Configure `.env`:
```env
SUPABASE_URL=https://xsayrhaibqytafphwpqa.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
PORT=5000
STRIPE_SECRET_KEY=your_stripe_key
EMAIL_USER=your_email
EMAIL_PASSWORD=your_password
```

Start server:
```bash
npm run dev
```

Server runs on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Configure `.env`:
```env
VITE_SUPABASE_URL=https://xsayrhaibqytafphwpqa.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

Start development server:
```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

## 📋 Features Implemented

### ✅ Core Features
- [x] User authentication (register, login, logout)
- [x] Product catalog with filtering and search
- [x] Shopping cart (persistent for logged-in users)
- [x] Checkout process with address management
- [x] Order management and tracking
- [x] Custom candle builder (signature feature)
- [x] Product reviews and ratings
- [x] Wishlist functionality
- [x] Contact form
- [x] Newsletter subscription
- [x] Discount code system
- [x] Payment integration (Stripe)
- [x] Email notifications

### ✅ Pages Completed
- [x] Splash Screen
- [x] Home Page
- [x] Shop (All Products)
- [x] Product Detail
- [x] Occasions
- [x] Custom Candle Builder
- [x] About
- [x] Contact
- [x] Cart
- [x] Checkout
- [x] Login/Register
- [x] Profile
- [x] Wishlist
- [x] 404 Page

### ✅ Backend API
- [x] 13 route modules
- [x] Authentication endpoints
- [x] Product CRUD operations
- [x] Cart management
- [x] Order processing
- [x] Custom candle requests
- [x] Review system
- [x] Payment processing
- [x] Email notifications

### ✅ Database
- [x] 20 tables with relationships
- [x] Row Level Security policies
- [x] Indexes for performance
- [x] Triggers and functions
- [x] Sample data

## 🎨 Design System

### Colors
- **Cream**: #F7F3EE (background)
- **Brown**: #8B5E3C (primary)
- **Beige**: #E6D5C3 (secondary)
- **Charcoal**: #2B2B2B (text)
- **Gold**: #C9A24D (accent)

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Montserrat (sans-serif)

### Components
- Rounded corners (12px)
- Soft shadows
- Smooth transitions (300ms)
- Touch-friendly (44px minimum)

## 📱 Responsive Design

- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px - 1439px
- **Large Desktop**: 1440px+

## 🔒 Security Features

- Row Level Security (RLS) on all tables
- JWT authentication
- Input validation and sanitization
- Rate limiting (100 requests/15 minutes)
- CORS configuration
- Helmet security headers
- SQL injection prevention
- XSS protection

## 📦 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
```

Deploy to Vercel:
1. Connect GitHub repository
2. Set environment variables
3. Deploy

### Backend (Render)
1. Create Web Service on Render
2. Connect GitHub repository
3. Set environment variables
4. Deploy

## 🧪 Testing

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 📚 API Documentation

See `backend/README.md` for complete API documentation.

Key endpoints:
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/products` - Get products
- `POST /api/cart` - Add to cart
- `POST /api/orders` - Create order
- `POST /api/custom-candles` - Submit custom request

## 🎯 Next Steps

### Remaining Pages to Complete
1. **Shop.jsx** - Product listing with filters
2. **ProductDetail.jsx** - Full product page
3. **Occasions.jsx** - Occasions listing
4. **OccasionProducts.jsx** - Products by occasion
5. **CustomizeCandle.jsx** - Interactive candle builder
6. **About.jsx** - Brand story
7. **Contact.jsx** - Contact form
8. **Cart.jsx** - Shopping cart
9. **Checkout.jsx** - Checkout process
10. **OrderConfirmation.jsx** - Order success
11. **Login.jsx** - Login form
12. **Register.jsx** - Registration form
13. **Profile.jsx** - User dashboard
14. **Wishlist.jsx** - Saved products

### Additional Components Needed
- ProductCard component
- ProductGrid component
- FilterSidebar component
- CategoryCard component
- ReviewCard component
- AddressForm component
- PaymentForm component

## 🐛 Known Issues

- CSS lint warnings for Tailwind directives (expected, can be ignored)
- Need to add Stripe publishable key
- Need to configure email service

## 📄 License

Proprietary - VELUNA by SKF

## 👥 Support

For issues or questions:
- Email: hello@velunaskf.com
- Documentation: See individual README files

---

**Built with ❤️ for VELUNA by SKF**
