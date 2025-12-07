# 🚨 Quick Fix Guide - 404 Error on Google OAuth

## What's Wrong?

Your app is showing:
```
GET https://eloquent-parfait-8fa33b.netlify.app/api/auth/google/url 404 (Not Found)
```

**Why?** Netlify only hosts static files (HTML, CSS, JS). Your backend API server is not running!

---

## ⚡ Quick Fix (5 Minutes)

### Option A: Deploy Backend to Fly.io (RECOMMENDED)

1. **Install Fly.io CLI:**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Run the deployment script:**
   ```bash
   cd emingo-ai-dashboard
   ./deploy-backend.sh
   ```

3. **Get your backend URL:**
   ```bash
   flyctl status
   ```
   You'll see something like: `https://emingo-ai-dashboard.fly.dev`

4. **Update `netlify.toml`:**
   - Open `netlify.toml`
   - Replace `YOUR_BACKEND_URL` with your Fly.io URL
   - Example: `https://emingo-ai-dashboard.fly.dev`

5. **Redeploy to Netlify:**
   ```bash
   # If using Netlify CLI
   netlify deploy --prod
   
   # Or push to GitHub
   git add .
   git commit -m "Fix: Add backend URL"
   git push
   ```

6. **Done!** Test your app at: `https://eloquent-parfait-8fa33b.netlify.app`

---

### Option B: Use Netlify Functions (Serverless)

1. **Update `netlify.toml`:**
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"

   [functions]
     directory = "netlify/functions"
     node_bundler = "esbuild"

   [[redirects]]
     from = "/api/*"
     to = "/.netlify/functions/api"
     status = 200

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. **Install dependencies:**
   ```bash
   npm install serverless-http
   ```

3. **Set environment variables in Netlify:**
   - Go to: Netlify Dashboard → Site settings → Environment variables
   - Add:
     - `DATABASE_URL`
     - `GOOGLE_CLIENT_ID`
     - `GOOGLE_CLIENT_SECRET`
     - `JWT_SECRET`
     - `GOOGLE_REDIRECT_URI=https://eloquent-parfait-8fa33b.netlify.app/auth/callback`

4. **Redeploy:**
   ```bash
   netlify deploy --prod
   ```

---

## 🔍 Verify It's Working

1. Open: `https://eloquent-parfait-8fa33b.netlify.app`
2. Click "Sign in with Google"
3. Should redirect to Google OAuth (no 404 error)

---

## 📝 Environment Variables Checklist

### For Backend (Fly.io):
- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `GOOGLE_CLIENT_ID` - From Google Cloud Console
- [ ] `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
- [ ] `JWT_SECRET` - Random string for token signing
- [ ] `GOOGLE_REDIRECT_URI` - Your Netlify URL + `/auth/callback`

### For Frontend (Netlify):
- [ ] `VITE_API_URL` - Your backend URL (e.g., `https://your-app.fly.dev/api`)

---

## 🆘 Still Not Working?

### Check Backend Logs:
```bash
flyctl logs
```

### Check if Backend is Running:
```bash
curl https://your-app.fly.dev/api/health
```

Should return: `{"status":"ok"}`

### Check Netlify Redirects:
- Open: `https://eloquent-parfait-8fa33b.netlify.app/api/health`
- Should proxy to your backend

---

## 📚 Full Documentation

For detailed explanation and alternative options, see:
- `NETLIFY_DEPLOYMENT_FIX.md` - Complete deployment guide
- `.env.example` - Environment variables template

---

## 🎯 Summary

**Problem:** Backend API not running on Netlify  
**Solution:** Deploy backend separately (Fly.io) or use Netlify Functions  
**Time:** 5-10 minutes  

**Choose:**
- ✅ **Fly.io** - Better performance, no limits (recommended)
- ⚠️ **Netlify Functions** - Easier but has 10s timeout limit

---

**Need help?** Check the error logs and verify all environment variables are set correctly.
