# Render Environment Variables Setup

## ⚠️ CRITICAL: Add These Environment Variables to Render

Your Render deployment is failing because environment variables are missing.

### Go to Render Dashboard:
1. Visit: https://dashboard.render.com
2. Select your **veluna-backend** service
3. Click **Environment** tab (left sidebar)
4. Add each variable below

---

## Required Environment Variables:

### 1. Supabase Configuration
```
SUPABASE_URL
https://xsayrhaibqytafphwpqa.supabase.co
```

```
SUPABASE_ANON_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzYXlyaGFpYnF5dGFmcGh3cHFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzNjM3NjYsImV4cCI6MjA4NTkzOTc2Nn0.O12aZSraf35rcLsetxVeox58WlICQV06l7KgaYjyBnc
```

```
SUPABASE_SERVICE_ROLE_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzYXlyaGFpYnF5dGFmcGh3cHFhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDM2Mzc2NiwiZXhwIjoyMDg1OTM5NzY2fQ.BEqYb0wyhSF6-s-GT1hrg6sGEUTcLDs4mete6vHcph8
```

### 2. Server Configuration
```
NODE_ENV
production
```

```
PORT
5000
```

```
FRONTEND_URL
https://your-vercel-url.vercel.app
```

### 3. JWT Secret
```
JWT_SECRET
veluna-skf-secret-key-2026-change-in-production
```

### 4. Rate Limiting (Optional)
```
RATE_LIMIT_WINDOW_MS
900000
```

```
RATE_LIMIT_MAX_REQUESTS
100
```

---

## ✅ After Adding Variables:

1. Click **Save Changes**
2. Render will automatically redeploy
3. Wait 2-3 minutes for deployment to complete
4. Check logs to verify successful deployment

---

## 🔍 Verify Deployment:

Once deployed, test your backend:
```
https://your-render-url.onrender.com/api/health
```

Should return:
```json
{
  "status": "OK",
  "message": "VELUNA by SKF API is running"
}
```

---

## ⚠️ IMPORTANT NOTES:

- **DO NOT** add quotes around the values in Render
- **COPY** the entire JWT tokens (they are very long)
- **WAIT** for auto-redeploy after saving (takes ~2 minutes)
- **UPDATE** `FRONTEND_URL` with your actual Vercel URL after frontend deployment

---

## Common Errors:

### Error: "Missing Supabase environment variables"
- **Solution**: Make sure all 3 Supabase variables are added (URL, ANON_KEY, SERVICE_ROLE_KEY)

### Error: "Port already in use"
- **Solution**: This shouldn't happen on Render, but make sure PORT=5000 is set

### Error: "CORS error"
- **Solution**: Update FRONTEND_URL to match your Vercel deployment URL
