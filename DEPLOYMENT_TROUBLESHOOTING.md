# Deployment Troubleshooting - Blank White Screen Fix

## 🔍 Diagnosing the Issue

If you see a blank white screen in production but localhost works fine, follow these steps:

### Step 1: Check Health Check Page

Visit: `https://your-domain.com/health-check.html`

This will tell you:
- ✅ If static files are being served
- ✅ If the API is reachable
- ✅ Browser information
- ❌ Any console errors

### Step 2: Open Browser Console

1. Press `F12` to open Developer Tools
2. Go to the **Console** tab
3. Look for errors (red text)

Common errors and solutions:

#### Error: "Failed to fetch dynamically imported module"
**Solution:** Clear cache and hard reload (`Ctrl+Shift+R` or `Cmd+Shift+R`)

#### Error: "VITE_API_BASE_URL is not defined"
**Solution:** Environment variables not set (see Step 3)

#### Error: "Firebase: Error (auth/...)"
**Solution:** Firebase configuration issue (see Step 4)

#### Error: "CORS policy"
**Solution:** Backend CORS not configured (see Step 5)

### Step 3: Verify Environment Variables

Your hosting platform MUST have these environment variables set:

#### For Vercel:
1. Go to Project Settings → Environment Variables
2. Add these variables:

```
VITE_API_BASE_URL=https://electioncart-backend.onrender.com
VITE_FIREBASE_API_KEY=AIzaSyApmd23dZVv1VCmzda2bE2oB2UH6vsZ8aY
VITE_FIREBASE_AUTH_DOMAIN=election-32867.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=election-32867
VITE_FIREBASE_STORAGE_BUCKET=election-32867.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1048261401017
VITE_FIREBASE_APP_ID=1:1048261401017:web:a8928f701df287c31c3e68
```

3. **IMPORTANT:** After adding variables, you MUST redeploy!
4. Go to Deployments → Click "..." → Redeploy

#### For Netlify:
1. Go to Site settings → Environment variables
2. Add the same variables as above
3. Go to Deploys → Trigger deploy → Deploy site

#### For Render (Static Site):
1. Go to Environment → Environment Variables
2. Add the same variables
3. Manual Deploy → Deploy latest commit

### Step 4: Verify Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `election-32867`
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Add your deployment domain:
   - `your-app.vercel.app`
   - `your-app.netlify.app`
   - `your-custom-domain.com`

### Step 5: Update Backend CORS

The backend must allow requests from your admin panel domain.

1. Go to your backend deployment (Render)
2. Add environment variable:

```
CORS_ALLOWED_ORIGINS=https://your-admin-domain.vercel.app,https://admin.lapoelectioncart.com,https://lapoelectioncart.com
```

3. Redeploy backend

Or update `settings.py` directly:

```python
CORS_ALLOWED_ORIGINS = [
    "https://your-admin-domain.vercel.app",
    "https://admin.lapoelectioncart.com",
    "https://lapoelectioncart.com",
    "http://localhost:5174",
]
```

### Step 6: Check Build Logs

#### Vercel:
1. Go to Deployments
2. Click on the latest deployment
3. Check the build logs for errors

#### Netlify:
1. Go to Deploys
2. Click on the latest deploy
3. Check deploy log for errors

Common build errors:
- TypeScript errors → Fix in code and push
- Missing dependencies → Check package.json
- Out of memory → Increase Node memory or optimize build

## 🛠️ Quick Fixes

### Fix 1: Force Rebuild with Cache Clear

#### Vercel:
```bash
# In your local terminal
git commit --allow-empty -m "Force rebuild"
git push
```

Then in Vercel dashboard:
- Deployments → Latest → "..." → Redeploy → **Uncheck "Use existing Build Cache"**

#### Netlify:
- Deploys → Trigger deploy → **Clear cache and deploy site**

### Fix 2: Check Build Output

Ensure `dist` folder is being generated:

```bash
# Run locally
npm run build

# Check if dist folder exists
ls dist/

# Should see:
# - index.html
# - assets/
# - manifest.webmanifest
# - sw.js
```

### Fix 3: Verify Routing Configuration

#### Vercel:
File: `vercel.json` should exist with:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

#### Netlify:
File: `_redirects` should exist in `public/` folder with:
```
/*    /index.html   200
```

Or `netlify.toml`:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Fix 4: Test Production Build Locally

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Open http://localhost:4173
```

If it works locally but not in production, it's likely an environment variable issue.

## 🔧 Platform-Specific Issues

### Vercel Issues

**Issue:** Build succeeds but blank screen
**Solution:**
1. Check Functions tab for errors
2. Verify Node.js version (should be 18.x or 20.x)
3. Check if using correct framework preset (Vite)

**Issue:** "Module not found" errors
**Solution:**
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install`
3. Commit and push

### Netlify Issues

**Issue:** 404 on refresh
**Solution:** Add `_redirects` file (see Fix 3)

**Issue:** Build fails with "Command failed"
**Solution:**
1. Check Node.js version in build settings
2. Set to Node 18.x or higher
3. Redeploy

### Render Issues

**Issue:** Static site not updating
**Solution:**
1. Manual Deploy → Clear build cache
2. Deploy latest commit

## 📋 Complete Deployment Checklist

- [ ] Environment variables set in hosting platform
- [ ] All variables start with `VITE_` prefix
- [ ] Firebase authorized domains updated
- [ ] Backend CORS includes admin domain
- [ ] Build completes without errors
- [ ] `dist` folder generated correctly
- [ ] Routing configuration in place (`vercel.json` or `_redirects`)
- [ ] Health check page accessible
- [ ] Browser console shows no errors
- [ ] Can login with test account
- [ ] API calls working

## 🆘 Still Not Working?

### Debug Mode

Add this to your environment variables temporarily:

```
VITE_DEBUG=true
```

This will enable additional console logging.

### Contact Information

If you've tried everything above and still see a blank screen:

1. **Check browser console** - Take a screenshot of any errors
2. **Check build logs** - Copy the full build log
3. **Check network tab** - See if any requests are failing
4. **Try different browser** - Rule out browser-specific issues

### Common Root Causes

1. **Missing environment variables** (90% of cases)
   - Solution: Add all VITE_* variables and redeploy

2. **Firebase domain not authorized** (5% of cases)
   - Solution: Add domain to Firebase Console

3. **Backend CORS not configured** (3% of cases)
   - Solution: Update CORS_ALLOWED_ORIGINS

4. **Build cache issue** (2% of cases)
   - Solution: Clear cache and rebuild

## ✅ Success Indicators

You'll know it's working when:
- ✅ You see the login page (not blank screen)
- ✅ Console shows: "🚀 Election Cart Admin Starting..."
- ✅ Console shows: "✅ App mounted successfully"
- ✅ No red errors in console
- ✅ Can login with phone number
- ✅ Dashboard loads after login

---

**Last Updated:** 2024
**Version:** 1.0.0
