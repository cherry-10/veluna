# Vercel Environment Variables Setup

## ⚠️ CRITICAL: Configure Vercel Environment Variables

Your Vercel deployment needs environment variables to connect to backend and Supabase.

### Go to Vercel Dashboard:
1. Visit: https://vercel.com/dashboard
2. Select your **veluna-skf** project
3. Click **Settings** tab
4. Click **Environment Variables** (left sidebar)
5. Add each variable below

---

## Required Environment Variables:

### 1. Supabase Configuration
```
VITE_SUPABASE_URL
https://xsayrhaibqytafphwpqa.supabase.co
```

```
VITE_SUPABASE_ANON_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzYXlyaGFpYnF5dGFmcGh3cHFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzNjM3NjYsImV4cCI6MjA4NTkzOTc2Nn0.O12aZSraf35rcLsetxVeox58WlICQV06l7KgaYjyBnc
```

### 2. Backend API URL
```
VITE_API_URL
https://veluna.onrender.com/api
```

### 3. Stripe (Optional - for payments)
```
VITE_STRIPE_PUBLISHABLE_KEY
pk_test_xxxxxxxxxxxxx
```

---

## ✅ After Adding Variables:

1. Click **Save** for each variable
2. Select **Production**, **Preview**, and **Development** for each
3. Go to **Deployments** tab
4. Click **...** menu on latest deployment
5. Click **Redeploy**
6. Wait 1-2 minutes for redeployment

---

## 🔍 Verify Deployment:

Once deployed, visit:
```
https://veluna-skf.vercel.app
```

Should show your homepage, not 404 error.

---

## ⚠️ IMPORTANT NOTES:

- **DO NOT** add quotes around the values
- **COPY** the entire JWT tokens (they are very long)
- **SELECT** all three environments (Production, Preview, Development)
- **REDEPLOY** after adding variables

---

## Common Errors:

### Error: "404 Not Found"
- **Solution**: Environment variables missing or incorrect. Add all 3 required variables above.

### Error: "Network Error" in console
- **Solution**: VITE_API_URL is wrong. Should be `https://veluna.onrender.com/api` (no trailing slash)

### Error: Categories not showing
- **Solution**: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing or incorrect
