# Vercel Deployment Fix - Complete Guide

## ⚠️ CRITICAL: Your Vercel project needs the correct Root Directory setting

---

## 🎯 **The Problem:**

Your project has this structure:
```
Veluna-SKF/
├── frontend/          ← React app is HERE
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   └── public/
└── backend/           ← Node.js API
```

**Vercel is trying to build from the root (`Veluna-SKF/`) but your React app is in the `frontend/` folder!**

---

## ✅ **Fix Vercel Configuration:**

### **Step 1: Go to Vercel Dashboard**
1. Visit: https://vercel.com/dashboard
2. Click on your **veluna-skf** project

### **Step 2: Update Project Settings**
1. Click **Settings** tab (top menu)
2. Scroll down to **Build & Development Settings**
3. Find **Root Directory** setting
4. Click **Edit** button
5. Enter: `frontend`
6. Click **Save**

### **Step 3: Configure Build Settings**

Make sure these are set:

**Framework Preset:** `Vite`

**Build Command:** `npm run build` (or leave as default)

**Output Directory:** `dist` (or leave as default)

**Install Command:** `npm install` (or leave as default)

**Root Directory:** `frontend` ← **MOST IMPORTANT**

---

## 🔧 **Environment Variables (You Already Added These):**

Make sure these are set in **Settings → Environment Variables**:

| Variable Name | Value |
|---------------|-------|
| `VITE_SUPABASE_URL` | `https://xsayrhaibqytafphwpqa.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzYXlyaGFpYnF5dGFmcGh3cHFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzNjM3NjYsImV4cCI6MjA4NTkzOTc2Nn0.O12aZSraf35rcLsetxVeox58WlICQV06l7KgaYjyBnc` |
| `VITE_API_URL` | `https://veluna.onrender.com/api` |

**Important:** Select **Production**, **Preview**, and **Development** for each variable.

---

## 🚀 **Step 4: Redeploy**

After changing the Root Directory:

1. Go to **Deployments** tab
2. Click **...** (three dots) on the latest deployment
3. Click **Redeploy**
4. Wait 1-2 minutes for build to complete

---

## ✅ **Verify Deployment:**

Once deployed, visit:
```
https://veluna-skf.vercel.app
```

You should see:
- ✅ Homepage loads correctly
- ✅ Navigation works
- ✅ No 404 errors
- ✅ Categories load in Shop page
- ✅ Products display correctly

---

## 🔍 **If Still Not Working:**

### **Check Build Logs:**
1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **Building** or **View Function Logs**
4. Look for errors in the build output

### **Common Issues:**

**Error: "No package.json found"**
- Solution: Root Directory is not set to `frontend`

**Error: "Build failed"**
- Solution: Check build logs for specific error
- Verify all dependencies are in `frontend/package.json`

**Error: "404 on all pages"**
- Solution: Verify `frontend/vercel.json` has rewrites configuration
- Check that `dist` folder is being created during build

---

## 📝 **Quick Checklist:**

- [ ] Root Directory set to `frontend`
- [ ] Framework Preset set to `Vite`
- [ ] 3 environment variables added (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_API_URL)
- [ ] All env vars set for Production, Preview, Development
- [ ] Redeployed after making changes
- [ ] Build succeeded (green checkmark)
- [ ] Website loads at https://veluna-skf.vercel.app

---

## 🎯 **Expected Result:**

After following these steps:
- ✅ Build completes successfully
- ✅ Homepage loads
- ✅ All routes work (no 404)
- ✅ Admin panel accessible
- ✅ Shop page shows products
- ✅ Categories dropdown works

---

## 📞 **Still Having Issues?**

Share the following:
1. Screenshot of Build & Development Settings (showing Root Directory)
2. Build logs from latest deployment
3. Error message you're seeing in browser
