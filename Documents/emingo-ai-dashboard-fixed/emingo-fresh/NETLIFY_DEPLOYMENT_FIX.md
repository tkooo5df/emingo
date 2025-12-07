# Netlify Deployment Fix - 404 Error on Google OAuth

## Problem

Your application is getting a **404 error** on `/api/auth/google/url` because:

1. **Netlify only hosts static files** (HTML, CSS, JS)
2. Your backend API server (`server/api.js`) is **not running** on Netlify
3. The frontend is trying to call API endpoints that don't exist

## Solution Options

You have **3 options** to fix this:

---

## Option 1: Deploy Backend Separately (RECOMMENDED)

This is the **best approach** for your full-stack application.

### Step 1: Deploy Backend to Fly.io (or Render/Railway)

#### Using Fly.io:

```bash
# Install flyctl if not already installed
curl -L https://fly.io/install.sh | sh

# Login to Fly.io
flyctl auth login

# Navigate to your project
cd emingo-ai-dashboard

# Launch the app (follow prompts)
flyctl launch

# Set environment variables
flyctl secrets set DATABASE_URL="your-database-url"
flyctl secrets set GOOGLE_CLIENT_ID="your-google-client-id"
flyctl secrets set GOOGLE_CLIENT_SECRET="your-google-client-secret"
flyctl secrets set JWT_SECRET="your-jwt-secret"
flyctl secrets set GOOGLE_REDIRECT_URI="https://eloquent-parfait-8fa33b.netlify.app/auth/callback"

# Deploy
flyctl deploy
```

After deployment, you'll get a URL like: `https://your-app.fly.dev`

### Step 2: Update Netlify Configuration

1. Update `netlify.toml` (already created for you):

```toml
[build]
  command = "npm run build"
  publish = "dist"

# Redirect API calls to your backend
[[redirects]]
  from = "/api/*"
  to = "https://your-app.fly.dev/api/:splat"
  status = 200
  force = true

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. **Replace** `https://your-app.fly.dev` with your actual Fly.io URL

3. **Redeploy to Netlify**:

```bash
# If using Netlify CLI
netlify deploy --prod

# Or push to GitHub (if connected to Netlify)
git add .
git commit -m "Fix: Add backend proxy configuration"
git push
```

---

## Option 2: Use Netlify Functions (Serverless)

This option runs your backend as **serverless functions** on Netlify.

### Pros:
- Everything on one platform
- No separate backend deployment

### Cons:
- **10-second timeout limit** per function
- **Cold starts** (slower first request)
- More expensive for high traffic
- Limited for long-running operations

### Steps:

1. I've already created `netlify/functions/api.js` for you

2. Update `netlify.toml`:

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

3. Install serverless-http:

```bash
npm install serverless-http
```

4. Set environment variables in Netlify Dashboard:
   - Go to: Site settings → Environment variables
   - Add:
     - `DATABASE_URL`
     - `GOOGLE_CLIENT_ID`
     - `GOOGLE_CLIENT_SECRET`
     - `JWT_SECRET`
     - `GOOGLE_REDIRECT_URI`

5. Redeploy to Netlify

---

## Option 3: Move Everything to Vercel

Vercel has better support for full-stack apps with API routes.

### Steps:

1. Create `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api" }
  ]
}
```

2. Move `server/api.js` to `api/index.js`

3. Deploy to Vercel:

```bash
npm install -g vercel
vercel
```

---

## Recommended Approach

**Use Option 1** (Backend on Fly.io + Frontend on Netlify) because:

✅ Better performance (no cold starts)  
✅ No timeout limits  
✅ Better for database connections  
✅ More scalable  
✅ Cheaper for your use case  

---

## Quick Fix Checklist

- [ ] Choose deployment option
- [ ] Deploy backend (if using Option 1)
- [ ] Update `netlify.toml` with correct backend URL
- [ ] Set environment variables
- [ ] Update `GOOGLE_REDIRECT_URI` to match your Netlify URL
- [ ] Redeploy frontend to Netlify
- [ ] Test Google OAuth login

---

## Testing After Deployment

1. Open your Netlify site: `https://eloquent-parfait-8fa33b.netlify.app`
2. Click "Sign in with Google"
3. Check browser console for errors
4. Verify the API call goes to the correct backend URL

---

## Environment Variables Needed

### Backend (Fly.io/Render/Railway):
```
DATABASE_URL=postgres://user:password@host:5432/database
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
JWT_SECRET=your-secret-key
GOOGLE_REDIRECT_URI=https://eloquent-parfait-8fa33b.netlify.app/auth/callback
PORT=3001
```

### Frontend (Netlify):
```
VITE_API_URL=https://your-backend-url.fly.dev/api
```

---

## Need Help?

If you encounter issues:

1. Check backend logs: `flyctl logs` (for Fly.io)
2. Check Netlify function logs (if using Option 2)
3. Verify environment variables are set correctly
4. Ensure Google OAuth redirect URI matches your Netlify URL

---

## Files Created/Modified

- ✅ `netlify.toml` - Netlify configuration with redirects
- ✅ `netlify/functions/api.js` - Serverless function (for Option 2)
- ✅ `NETLIFY_DEPLOYMENT_FIX.md` - This guide

---

**Next Steps:** Choose your deployment option and follow the steps above!
