# Deployment Guide - Election Cart Admin Panel

## Deployment Options

The admin panel is a static React app that can be deployed to various platforms.

## Option 1: Vercel (Recommended)

### Prerequisites
- GitHub account
- Vercel account (free tier available)
- Code pushed to GitHub repository

### Steps

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to https://vercel.com
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite configuration

3. **Configure Build Settings**
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Add Environment Variables**
   
   Go to Project Settings → Environment Variables and add:
   
   ```
   VITE_API_BASE_URL=https://electioncart-backend.onrender.com
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your admin panel will be live!

6. **Update Firebase Authorized Domains**
   - Go to Firebase Console
   - Authentication → Settings → Authorized domains
   - Add your Vercel domain (e.g., `your-app.vercel.app`)

### Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Add custom domain to Firebase authorized domains

## Option 2: Netlify

### Steps

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Netlify**
   - Go to https://netlify.com
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select your repository

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 16 or higher

4. **Add Environment Variables**
   
   Go to Site settings → Environment variables and add:
   
   ```
   VITE_API_BASE_URL=https://electioncart-backend.onrender.com
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

5. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete

6. **Update Firebase Authorized Domains**
   - Add your Netlify domain to Firebase Console

## Option 3: Firebase Hosting

### Steps

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase Hosting**
   ```bash
   firebase init hosting
   ```
   
   - Select your Firebase project
   - Public directory: `dist`
   - Single-page app: Yes
   - GitHub integration: Optional

4. **Build the App**
   ```bash
   npm run build
   ```

5. **Deploy**
   ```bash
   firebase deploy --only hosting
   ```

6. **Access Your App**
   - Your app will be available at: `https://your-project.web.app`

## Option 4: AWS S3 + CloudFront

### Steps

1. **Build the App**
   ```bash
   npm run build
   ```

2. **Create S3 Bucket**
   - Go to AWS S3 Console
   - Create a new bucket
   - Enable static website hosting
   - Set bucket policy for public read access

3. **Upload Files**
   ```bash
   aws s3 sync dist/ s3://your-bucket-name
   ```

4. **Create CloudFront Distribution**
   - Point to your S3 bucket
   - Configure SSL certificate
   - Set default root object to `index.html`

5. **Update Firebase Authorized Domains**
   - Add your CloudFront domain

## Post-Deployment Checklist

### 1. Verify Environment Variables
- [ ] All environment variables are set correctly
- [ ] Backend API URL points to production backend
- [ ] Firebase configuration is correct

### 2. Test Authentication
- [ ] Login with phone number works
- [ ] Firebase authentication is functioning
- [ ] User roles are correctly assigned

### 3. Test API Connection
- [ ] Admin panel can connect to backend
- [ ] Orders are loading correctly
- [ ] Staff management works (admin only)

### 4. Update Backend CORS
- [ ] Add admin panel domain to backend CORS settings

```python
# In backend settings.py
CORS_ALLOWED_ORIGINS = [
    "https://your-admin-panel.vercel.app",
    "https://lapoelectioncart.com",
    # ... other origins
]
```

### 5. Firebase Configuration
- [ ] Admin panel domain added to Firebase authorized domains
- [ ] Phone authentication is enabled
- [ ] Test login from production URL

### 6. Security
- [ ] No sensitive data in code
- [ ] Environment variables properly configured
- [ ] HTTPS enabled
- [ ] Firebase security rules configured

## Continuous Deployment

### Vercel/Netlify Auto-Deploy

Both platforms support automatic deployment:

1. Push to GitHub main branch
2. Platform automatically builds and deploys
3. No manual intervention needed

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Admin Panel

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: your-project-id
```

## Troubleshooting

### Build Fails

- Check Node.js version (should be 16+)
- Verify all dependencies are installed
- Check for TypeScript errors: `npm run lint`

### Environment Variables Not Working

- Vite requires `VITE_` prefix for client-side variables
- Redeploy after adding/changing variables
- Check build logs for environment variable values

### Firebase Authentication Fails

- Verify domain is in Firebase authorized domains
- Check Firebase configuration in environment variables
- Verify phone authentication is enabled in Firebase Console

### API Connection Issues

- Verify backend URL in environment variables
- Check backend CORS settings include admin panel domain
- Check browser console for errors

## Monitoring

### Vercel Analytics

Enable in Project Settings → Analytics

### Sentry Error Tracking (Optional)

1. Create Sentry project
2. Add Sentry SDK to project
3. Configure DSN in environment variables

## Rollback

### Vercel/Netlify

1. Go to Deployments
2. Select previous working deployment
3. Click "Promote to Production"

### Firebase Hosting

```bash
firebase hosting:rollback
```

---

**Your admin panel is now deployed and ready to use!** 🚀
