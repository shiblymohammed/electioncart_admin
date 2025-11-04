# Debug Steps for admin.lapoelectioncart.com

## Step 1: Check Browser Console NOW

1. Go to https://admin.lapoelectioncart.com
2. Press F12 (or right-click → Inspect)
3. Click "Console" tab
4. **COPY ALL RED ERRORS HERE:**

```
[Paste errors here]
```

## Step 2: Check Network Tab

1. Stay in DevTools (F12)
2. Click "Network" tab
3. Refresh the page (Ctrl+R)
4. Look for any RED/failed requests
5. **COPY FAILED REQUESTS HERE:**

```
[Paste failed requests here]
```

## Step 3: Check Health Page

Visit: https://admin.lapoelectioncart.com/health-check.html

**Does it load?**
- [ ] Yes - Shows health check page
- [ ] No - Also blank/404

## Step 4: Check Environment Variables

**Where is your site hosted?**
- [ ] Vercel
- [ ] Netlify  
- [ ] Render
- [ ] Other: __________

**Have you added these environment variables?**
- [ ] VITE_API_BASE_URL
- [ ] VITE_FIREBASE_API_KEY
- [ ] VITE_FIREBASE_AUTH_DOMAIN
- [ ] VITE_FIREBASE_PROJECT_ID
- [ ] VITE_FIREBASE_STORAGE_BUCKET
- [ ] VITE_FIREBASE_MESSAGING_SENDER_ID
- [ ] VITE_FIREBASE_APP_ID

**Did you redeploy AFTER adding variables?**
- [ ] Yes
- [ ] No

## Most Likely Issues:

### Issue 1: Environment Variables Not Set (90% chance)
**Symptoms:** Blank screen, no errors in console OR Firebase errors

**Fix:**
1. Go to your hosting dashboard
2. Add ALL environment variables (see above)
3. **MUST REDEPLOY** after adding them
4. Wait 2-3 minutes
5. Hard refresh browser (Ctrl+Shift+R)

### Issue 2: Wrong Base Path
**Symptoms:** 404 errors for assets in Network tab

**Fix:** Check if assets are loading from correct URL

### Issue 3: Firebase Domain Not Authorized
**Symptoms:** Firebase auth errors in console

**Fix:**
1. Go to https://console.firebase.google.com
2. Select project: election-32867
3. Authentication → Settings → Authorized domains
4. Add: admin.lapoelectioncart.com
5. Save

## Quick Test Commands

If you have access to the deployment, check:

```bash
# Check if environment variables are set
echo $VITE_API_BASE_URL

# Should output: https://electioncart-backend.onrender.com
# If empty, variables are NOT set!
```
