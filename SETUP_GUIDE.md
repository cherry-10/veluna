# VELUNA by SKF - Complete Setup Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### Step 2: Database Setup
1. Open Supabase Dashboard: https://supabase.com/dashboard
2. Go to SQL Editor
3. Copy and run `database/schema.sql`
4. Copy and run `database/sample-data.sql`
5. Create storage buckets (see `database/README.md`)
6. Run `database/storage-policies.sql`

### Step 3: Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs on: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on: http://localhost:3000

### Step 4: Test the Application
1. Visit http://localhost:3000
2. Browse products
3. Register an account
4. Add items to cart
5. Test checkout flow

## 📋 Detailed Setup

### Prerequisites
- Node.js 18+ and npm 9+
- Git
- Supabase account
- Stripe account (for payments)
- Gmail account (for emails)

### Environment Variables

**Backend `.env`** (already configured):
```env
SUPABASE_URL=https://xsayrhaibqytafphwpqa.supabase.co
SUPABASE_ANON_KEY=<provided>
SUPABASE_SERVICE_ROLE_KEY=<provided>
PORT=5000
FRONTEND_URL=http://localhost:3000
STRIPE_SECRET_KEY=<your-key>
EMAIL_USER=<your-email>
EMAIL_PASSWORD=<your-app-password>
```

**Frontend `.env`** (already configured):
```env
VITE_SUPABASE_URL=https://xsayrhaibqytafphwpqa.supabase.co
VITE_SUPABASE_ANON_KEY=<provided>
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=<your-key>
```

### Configure Stripe

1. Go to https://dashboard.stripe.com
2. Get your API keys from Developers → API keys
3. Add to `.env` files:
   - `STRIPE_SECRET_KEY` (backend)
   - `STRIPE_PUBLISHABLE_KEY` (both)
4. For testing, use test mode keys (start with `sk_test_` and `pk_test_`)

### Configure Email Service

**Using Gmail:**
1. Enable 2-Factor Authentication on your Google account
2. Generate App Password:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Copy the generated password
3. Add to backend `.env`:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=<app-password>
   ```

## 🗂️ Project Structure

```
Veluna-SKF/
├── database/           # Database schema and migrations
│   ├── schema.sql
│   ├── sample-data.sql
│   └── README.md
├── backend/           # Node.js + Express API
│   ├── config/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
├── frontend/          # React + Vite application
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── App.jsx
│   ├── public/
│   └── package.json
└── README.md
```

## 🎨 Features Overview

### Pages Implemented
✅ Splash Screen
✅ Home Page with hero, categories, bestsellers
✅ Shop with filters and sorting
✅ Product Detail with reviews
✅ Occasions browsing
✅ Custom Candle Builder (6-step process)
✅ About Us
✅ Contact Form
✅ Shopping Cart
✅ Checkout with address and payment
✅ Order Confirmation
✅ Login/Register
✅ User Profile with orders and custom requests
✅ Wishlist
✅ 404 Page

### Backend API Endpoints
- Authentication (register, login, logout)
- Products (CRUD, filtering, search)
- Categories and Occasions
- Cart management
- Order processing
- Custom candle requests
- Reviews and ratings
- Wishlist
- Discount codes
- Newsletter
- Contact form
- Payment processing (Stripe)

## 🧪 Testing

### Test User Accounts
Create test accounts through the registration page or use Supabase Dashboard.

### Test Products
Sample data includes:
- 8 candle products
- 3 bouquets
- 2 flower boxes
- 2 gift sets

### Test Payment (Stripe Test Mode)
Use test card numbers:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Any future expiry date and any 3-digit CVC

### Test Discount Codes
- `WELCOME10` - 10% off orders over ₹500
- `FESTIVE20` - 20% off orders over ₹1000
- `FLAT100` - ₹100 off orders over ₹1000

## 🐛 Common Issues

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
npx kill-port 5000

# Kill process on port 3000 (frontend)
npx kill-port 3000
```

### Database Connection Failed
- Verify Supabase URL and keys in `.env`
- Check if schema.sql has been run
- Ensure RLS policies are enabled

### CORS Errors
- Verify `FRONTEND_URL` in backend `.env`
- Check CORS configuration in `server.js`

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📱 Mobile Testing

Test responsive design on:
- Chrome DevTools (F12 → Toggle device toolbar)
- Real devices via network:
  1. Get your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
  2. Access: `http://YOUR_IP:3000`

## 🔒 Security Notes

- Never commit `.env` files to Git
- Use strong passwords for production
- Enable 2FA on all accounts
- Rotate API keys regularly
- Keep dependencies updated: `npm audit fix`

## 📚 Documentation

- **Database**: `database/README.md`
- **Backend API**: `backend/README.md`
- **Deployment**: `DEPLOYMENT.md`
- **Main README**: `README.md`

## 🆘 Getting Help

### Check Logs
**Backend:**
```bash
cd backend
npm run dev
# Watch console output
```

**Frontend:**
```bash
cd frontend
npm run dev
# Check browser console (F12)
```

**Database:**
- Supabase Dashboard → Logs

### Debug Mode
Add to `.env`:
```env
NODE_ENV=development
DEBUG=true
```

## ✅ Pre-Deployment Checklist

Before deploying to production:

- [ ] Database schema deployed
- [ ] Sample data loaded (optional)
- [ ] Storage buckets created
- [ ] Environment variables configured
- [ ] Stripe keys (production mode)
- [ ] Email service configured
- [ ] All pages tested
- [ ] Mobile responsive verified
- [ ] Payment flow tested
- [ ] Email notifications working
- [ ] Security headers enabled
- [ ] HTTPS configured
- [ ] Custom domain setup (optional)

## 🎯 Next Steps

1. **Customize Content**
   - Replace placeholder images
   - Update About page with your story
   - Add real product photos
   - Customize email templates

2. **Add Features**
   - Product search functionality
   - Advanced filters
   - Product recommendations
   - Customer reviews
   - Blog section
   - Multi-language support

3. **Optimize Performance**
   - Image optimization
   - Lazy loading
   - Caching strategy
   - CDN integration

4. **Marketing**
   - SEO optimization
   - Social media integration
   - Google Analytics
   - Email marketing
   - Promotional campaigns

---

**Ready to launch your handcrafted candles business! 🕯️✨**
