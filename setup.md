# Election Cart Admin Panel - Setup Guide

## Quick Setup

### 1. Prerequisites
- Node.js 16 or higher
- npm or yarn
- Git

### 2. Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd election-cart-admin

# Install dependencies
npm install
```

### 3. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Update `.env` with your values:

```env
# Backend API URL (local development)
VITE_API_BASE_URL=http://localhost:8000

# Firebase Configuration (get from Firebase Console)
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### 4. Firebase Setup

1. Go to https://console.firebase.google.com
2. Create a new project or select existing
3. Go to Project Settings → General
4. Scroll to "Your apps" → Web app
5. Copy the configuration values to your `.env` file
6. Go to Authentication → Sign-in method
7. Enable "Phone" authentication

### 5. Backend Setup

This admin panel requires the backend API to be running.

**Backend Repository:** [Link to your backend repo]

Make sure the backend is running on `http://localhost:8000` or update the `VITE_API_BASE_URL` accordingly.

### 6. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:5174](http://localhost:5174)

## Production Deployment

### Environment Variables

For production, set these in your hosting platform (Vercel, Netlify, etc.):

```env
VITE_API_BASE_URL=https://your-backend-api.com
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

### Deploy to Netlify

1. Push code to GitHub
2. Import project in Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variables
6. Deploy

## Troubleshooting

### Port Already in Use

If port 5174 is busy:

```bash
npm run dev -- --port 5175
```

### API Connection Issues

- Verify backend is running
- Check `VITE_API_BASE_URL` in `.env`
- Check CORS settings in backend
- Check browser console for errors

### Firebase Authentication Issues

- Verify Firebase configuration in `.env`
- Check Firebase Console for enabled auth methods
- Verify domain is authorized in Firebase Console
- Check browser console for Firebase errors

### Build Errors

```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

## Additional Resources

- [README.md](./README.md) - Project overview
- [QUICKSTART.md](./QUICKSTART.md) - Quick start guide
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Deployment guide
