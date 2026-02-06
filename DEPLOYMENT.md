# VELUNA by SKF - Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (for frontend)
- Render account (for backend)
- Supabase project setup completed
- Stripe account (for payments)
- Email service configured

## Database Deployment (Supabase)

### 1. Setup Supabase Project
Already completed with your credentials:
- **URL**: https://xsayrhaibqytafphwpqa.supabase.co
- **Anon Key**: (provided)
- **Service Role Key**: (provided)

### 2. Run Database Migrations
1. Go to Supabase Dashboard → SQL Editor
2. Run `database/schema.sql` (creates all tables, policies, functions)
3. Run `database/sample-data.sql` (loads sample products)
4. Run `database/storage-policies.sql` (after creating storage buckets)

### 3. Create Storage Buckets
In Supabase Dashboard → Storage:
- `product-images` (Public, 5MB limit)
- `category-images` (Public, 3MB limit)
- `occasion-images` (Public, 3MB limit)
- `custom-candle-references` (Public, 5MB limit)

## Backend Deployment (Render)

### 1. Push Code to GitHub
```bash
cd backend
git init
git add .
git commit -m "Initial backend commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Create Render Web Service
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: veluna-skf-api
   - **Region**: Singapore (or closest to your users)
   - **Branch**: main
   - **Root Directory**: backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or upgrade as needed)

### 3. Add Environment Variables
In Render Dashboard → Environment:
```
NODE_ENV=production
PORT=5000
SUPABASE_URL=https://xsayrhaibqytafphwpqa.supabase.co
SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
STRIPE_SECRET_KEY=<your-stripe-secret-key>
STRIPE_PUBLISHABLE_KEY=<your-stripe-publishable-key>
STRIPE_WEBHOOK_SECRET=<your-stripe-webhook-secret>
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=<your-email@gmail.com>
EMAIL_PASSWORD=<your-app-password>
EMAIL_FROM=VELUNA by SKF <noreply@velunaskf.com>
JWT_SECRET=<generate-random-secret>
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
FRONTEND_URL=<your-vercel-url>
```

### 4. Deploy
- Click "Create Web Service"
- Wait for deployment (5-10 minutes)
- Note your backend URL: `https://veluna-skf-api.onrender.com`

### 5. Test Backend
```bash
curl https://veluna-skf-api.onrender.com/api/health
```

## Frontend Deployment (Vercel)

### 1. Push Code to GitHub
```bash
cd frontend
git init
git add .
git commit -m "Initial frontend commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Import Project to Vercel
1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: frontend
   - **Build Command**: `npm run build`
   - **Output Directory**: dist

### 3. Add Environment Variables
In Vercel Dashboard → Settings → Environment Variables:
```
VITE_SUPABASE_URL=https://xsayrhaibqytafphwpqa.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
VITE_API_URL=https://veluna-skf-api.onrender.com/api
VITE_STRIPE_PUBLISHABLE_KEY=<your-stripe-publishable-key>
```

### 4. Deploy
- Click "Deploy"
- Wait for deployment (2-3 minutes)
- Your site will be live at: `https://veluna-skf.vercel.app`

### 5. Configure Custom Domain (Optional)
1. In Vercel Dashboard → Settings → Domains
2. Add your custom domain (e.g., velunaskf.com)
3. Update DNS records as instructed

## Post-Deployment Configuration

### 1. Update Backend CORS
Update `FRONTEND_URL` in Render environment variables to your Vercel URL

### 2. Configure Stripe Webhooks
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://veluna-skf-api.onrender.com/api/payment/webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy webhook secret to Render environment variables

### 3. Update Supabase Auth Redirect URLs
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add Site URL: `https://veluna-skf.vercel.app`
3. Add Redirect URLs:
   - `https://veluna-skf.vercel.app/auth/callback`
   - `https://veluna-skf.vercel.app/reset-password`

### 4. Test Complete Flow
1. Visit your Vercel URL
2. Register a new account
3. Browse products
4. Add to cart
5. Complete checkout
6. Verify order confirmation email

## Monitoring & Maintenance

### Backend (Render)
- View logs: Render Dashboard → Logs
- Monitor health: `https://veluna-skf-api.onrender.com/api/health`
- Auto-deploys on git push

### Frontend (Vercel)
- View deployments: Vercel Dashboard → Deployments
- Analytics: Vercel Dashboard → Analytics
- Auto-deploys on git push

### Database (Supabase)
- Monitor usage: Supabase Dashboard → Database
- View logs: Supabase Dashboard → Logs
- Backups: Automatic daily backups

## Troubleshooting

### Backend Issues
**Problem**: 503 Service Unavailable
**Solution**: Check Render logs, verify environment variables

**Problem**: CORS errors
**Solution**: Update FRONTEND_URL in Render environment

**Problem**: Database connection failed
**Solution**: Verify Supabase credentials

### Frontend Issues
**Problem**: API calls failing
**Solution**: Check VITE_API_URL points to correct backend

**Problem**: Authentication not working
**Solution**: Verify Supabase URL and anon key

**Problem**: Build fails
**Solution**: Check package.json dependencies, run `npm install` locally

### Database Issues
**Problem**: RLS blocking queries
**Solution**: Check policies in Supabase Dashboard

**Problem**: Storage upload fails
**Solution**: Verify bucket policies and file size limits

## Performance Optimization

### Backend
- Enable caching for product queries
- Use connection pooling for database
- Implement Redis for session storage (optional)

### Frontend
- Enable Vercel Edge Network
- Configure image optimization
- Implement lazy loading for images
- Use React.lazy for code splitting

### Database
- Add indexes for frequently queried columns
- Optimize slow queries using EXPLAIN ANALYZE
- Enable query caching

## Security Checklist

- [ ] Environment variables secured
- [ ] HTTPS enabled (automatic on Vercel/Render)
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Input validation on all forms
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection (Content Security Policy)
- [ ] Supabase RLS policies active
- [ ] Stripe webhook signature verification
- [ ] Email credentials secured

## Scaling Considerations

### When to Upgrade
- **Free Tier Limits**:
  - Render: 750 hours/month, sleeps after inactivity
  - Vercel: 100GB bandwidth/month
  - Supabase: 500MB database, 1GB file storage

### Upgrade Path
1. **Render**: Starter ($7/month) - No sleep, more resources
2. **Vercel**: Pro ($20/month) - More bandwidth, analytics
3. **Supabase**: Pro ($25/month) - More storage, backups

## Backup Strategy

### Database
- Supabase automatic daily backups (7 days retention)
- Manual backups: `pg_dump` command
- Export critical data weekly

### Code
- GitHub repository (version control)
- Tag releases for rollback capability

### Environment Variables
- Document all variables in `.env.example`
- Store securely in password manager

## Support & Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Stripe Docs**: https://stripe.com/docs

---

## Quick Deploy Commands

### Backend
```bash
cd backend
git add .
git commit -m "Update backend"
git push origin main
# Render auto-deploys
```

### Frontend
```bash
cd frontend
git add .
git commit -m "Update frontend"
git push origin main
# Vercel auto-deploys
```

### Database Migration
```bash
# Run in Supabase SQL Editor
-- Add your migration SQL here
```

---

**Deployment Complete! 🎉**

Your VELUNA by SKF e-commerce platform is now live and ready to accept orders!
