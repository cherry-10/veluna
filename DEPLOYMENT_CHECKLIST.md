# 🚀 VELUNA Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Supabase Setup
- [ ] Create Supabase project at https://supabase.com
- [ ] Run `database/schema.sql` in SQL Editor
- [ ] Run `database/storage-policies.sql` for storage setup
- [ ] Run `database/sample-data.sql` for initial data (optional)
- [ ] Enable Email Auth in Authentication settings
- [ ] Copy Project URL and Anon Key

### 2. Environment Variables

#### Frontend (.env)
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=your_backend_url_from_render
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

#### Backend (.env)
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
STRIPE_SECRET_KEY=your_stripe_secret_key
PORT=5000
NODE_ENV=production
```

---

## 🎨 Frontend Deployment (Vercel)

### Step 1: Push to GitHub
```bash
# Already done! ✅
git push -u origin main
```

### Step 2: Deploy to Vercel

1. **Go to Vercel**: https://vercel.com
2. **Import Project**:
   - Click "Add New" → "Project"
   - Import from GitHub: `cherry-10/veluna`
   
3. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Add Environment Variables**:
   ```
   VITE_SUPABASE_URL = your_supabase_url
   VITE_SUPABASE_ANON_KEY = your_anon_key
   VITE_API_URL = https://your-backend.onrender.com
   VITE_STRIPE_PUBLIC_KEY = your_stripe_public_key
   ```

5. **Deploy**: Click "Deploy"

6. **Custom Domain** (Optional):
   - Go to Project Settings → Domains
   - Add your custom domain

---

## ⚙️ Backend Deployment (Render)

### Step 1: Create Render Account
Go to https://render.com and sign up

### Step 2: Create Web Service

1. **New Web Service**:
   - Click "New +" → "Web Service"
   - Connect GitHub repository: `cherry-10/veluna`

2. **Configure Service**:
   - **Name**: `veluna-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Free (or paid for production)

3. **Add Environment Variables**:
   ```
   SUPABASE_URL = your_supabase_url
   SUPABASE_SERVICE_KEY = your_service_role_key
   STRIPE_SECRET_KEY = your_stripe_secret_key
   PORT = 5000
   NODE_ENV = production
   ```

4. **Deploy**: Click "Create Web Service"

5. **Copy Backend URL**:
   - Will be like: `https://veluna-backend.onrender.com`
   - Add this to Vercel frontend env as `VITE_API_URL`

---

## 🔑 Get Your Keys

### Supabase Keys
1. Go to your Supabase project
2. Settings → API
3. Copy:
   - Project URL
   - `anon` `public` key (for frontend)
   - `service_role` `secret` key (for backend)

### Stripe Keys
1. Go to https://stripe.com/dashboard
2. Developers → API Keys
3. Copy:
   - Publishable key (for frontend)
   - Secret key (for backend)

---

## 🧪 Testing Deployment

### 1. Test Frontend
- Visit your Vercel URL
- Check if images load
- Test navigation
- Try user registration/login

### 2. Test Backend
- Visit `https://your-backend.onrender.com/health`
- Should return: `{"status":"ok"}`

### 3. Test Full Flow
- [ ] Register new user
- [ ] Browse products
- [ ] Add to cart
- [ ] Checkout (test mode)
- [ ] View orders in profile
- [ ] Admin panel at `/admin`

---

## 🐛 Troubleshooting

### Frontend Issues
**Images not loading?**
- Check browser console for errors
- Verify Unsplash URLs are accessible
- Check CORS settings

**API calls failing?**
- Verify `VITE_API_URL` is correct
- Check backend is running
- Look at Network tab in DevTools

### Backend Issues
**500 errors?**
- Check Render logs
- Verify environment variables
- Check Supabase connection

**Database errors?**
- Verify schema is created
- Check RLS policies
- Verify service key is correct

---

## 📊 Post-Deployment

### 1. Update Frontend with Backend URL
After backend is deployed:
1. Copy Render backend URL
2. Go to Vercel project settings
3. Update `VITE_API_URL` environment variable
4. Redeploy frontend

### 2. Add Products
1. Go to `/admin` on your live site
2. Add products with images
3. Or use Supabase dashboard

### 3. Monitor
- **Vercel**: Check Analytics
- **Render**: Check Logs and Metrics
- **Supabase**: Check Database usage

---

## 🎉 Your Live URLs

After deployment, you'll have:

- **Frontend**: `https://veluna.vercel.app` (or custom domain)
- **Backend**: `https://veluna-backend.onrender.com`
- **Admin**: `https://veluna.vercel.app/admin`

---

## 📝 Notes

- **Free Tier Limits**:
  - Render: Spins down after 15 min inactivity
  - Vercel: 100GB bandwidth/month
  - Supabase: 500MB database, 1GB storage

- **For Production**:
  - Upgrade to paid plans
  - Add custom domain
  - Enable SSL (automatic on Vercel/Render)
  - Set up monitoring
  - Configure backups

---

**Need help?** Check:
- `DEPLOYMENT.md` - Detailed deployment guide
- `SETUP_GUIDE.md` - Local development setup
- `HOW_TO_ADD_PRODUCTS.md` - Product management guide
