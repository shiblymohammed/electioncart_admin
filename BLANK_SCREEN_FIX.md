# 🚨 BLANK SCREEN FIX - Quick Guide

## The Problem
Your app works on localhost but shows a blank white screen when deployed.

## The Solution (90% of cases)

### ⚡ Quick Fix - Environment Variables

**The most common cause is missing environment variables.**

#### Step 1: Go to your hosting platform

**Vercel:**
- Dashboard → Your Project → Settings → Environment Variables

**Netlify:**
- Site dashboard → Site settings → Environment variables

**Render:**
- Dashboard → Your Static Site → Environment

#### Step 2: Add ALL these variables

Copy and paste each one:

```
VITE_API_BASE_URL=https://electioncart-backend.onrender.com
```

```
VITE_FIREBASE_API_KEY=AIzaSyApmd23dZVv1VCmzda2bE2oB2UH6vsZ8aY
```

```
VITE_FIREBASE_AUTH_DOMAIN=election-32867.firebaseapp.com
```

```
VITE_FIREBASE_PROJECT_ID=election-32867
```

```
VITE_FIREBASE_STORAGE_BUCKET=election-32867.firebasestorage.app
```

```
VITE_FIREBASE_MESSAGING_SENDER_ID=1048261401017
```

```
VITE_FIREBASE_APP_ID=1:1048261401017:web:a8928f701df287c31c3e68
```

#### Step 3: Redeploy

**CRITICAL:** Adding environment variables does NOT automatically redeploy!

**Vercel:**
1. Go to Deployments
2. Click "..." on latest deployment
3. Click "Redeploy"
4. **Uncheck** "Use existing Build Cache"
5. Click "Redeploy"

**Netlify:**
1. Go to Deploys
2. Click "Trigger deploy"
3. Select "Clear cache and deploy site"

**Render:**
1. Click "Manual Deploy"
2. Select "Clear build cache & deploy"

#### Step 4: Wait and Test

- Wait 2-3 minutes for deployment to complete
- Visit your site
- You should see the login page!

---

## Still Blank? Try This

### Check Browser Console

1. Press `F12` (Windows) or `Cmd+Option+I` (Mac)
2. Click "Console" tab
3. Look for red errors

**If you see errors, take a screenshot and check the troubleshooting guide below.**

### Test Health Check

Visit: `https://your-domain.com/health-check.html`

This page will show you:
- ✅ If files are deployed
- ✅ If API is reachable
- ❌ What's broken

---

## Common Errors & Fixes

### Error: "Failed to fetch dynamically imported module"

**Fix:**
1. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Clear browser cache
3. Try incognito/private window

### Error: "Firebase: Error (auth/unauthorized-domain)"

**Fix:**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: `election-32867`
3. Authentication → Settings → Authorized domains
4. Click "Add domain"
5. Add your deployment URL (e.g., `your-app.vercel.app`)
6. Save

### Error: "CORS policy: No 'Access-Control-Allow-Origin'"

**Fix:**
1. Go to your backend (Render dashboard)
2. Environment → Add variable:
   - Key: `CORS_ALLOWED_ORIGINS`
   - Value: `https://your-admin-domain.vercel.app,https://admin.lapoelectioncart.com`
3. Manual Deploy → Deploy latest commit

### Error: "Cannot read properties of undefined"

**Fix:** Missing environment variables (go back to Step 1)

---

## Verification Checklist

After deploying, verify these:

- [ ] Can see login page (not blank)
- [ ] Console shows: "🚀 Election Cart Admin Starting..."
- [ ] Console shows: "✅ App mounted successfully"
- [ ] No red errors in console
- [ ] Can click "Login with Phone"
- [ ] Firebase auth popup appears

---

## Platform-Specific Notes

### Vercel
- ✅ Automatically detects Vite
- ✅ `vercel.json` already configured
- ⚠️ Must manually redeploy after adding env vars

### Netlify
- ✅ `_redirects` file already in place
- ⚠️ Set Node version to 18.x in Build settings
- ⚠️ Must trigger new deploy after adding env vars

### Render (Static Site)
- ⚠️ Must manually deploy after changes
- ⚠️ Clear build cache if issues persist

---

## Need More Help?

### Full Troubleshooting Guide
See: `DEPLOYMENT_TROUBLESHOOTING.md`

### Debug Steps
1. Check `/health-check.html` on your deployed site
2. Open browser console (F12)
3. Check Network tab for failed requests
4. Verify all environment variables are set
5. Confirm Firebase domain is authorized
6. Test in incognito window

### Last Resort
1. Delete the deployment
2. Create a new deployment from scratch
3. Add environment variables BEFORE first deploy
4. Deploy

---

## Success! 🎉

You'll know it's working when you see:

1. **Login page** with Election Cart branding
2. **Phone number input** field
3. **No errors** in console
4. **Can login** and see dashboard

---

**Quick Reference:**

| Issue | Solution |
|-------|----------|
| Blank screen | Add environment variables + redeploy |
| Firebase error | Add domain to Firebase Console |
| CORS error | Update backend CORS settings |
| Module error | Clear cache + hard refresh |
| Build fails | Check build logs for errors |

---

**Need immediate help?**
1. Screenshot browser console errors
2. Check build logs
3. Verify environment variables are set
4. Try health check page

**Most issues are solved by:**
1. Adding environment variables
2. Redeploying with cache cleared
3. Adding domain to Firebase

Good luck! 🚀
