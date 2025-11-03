# How to Push Admin-Frontend to New Repository

## Step-by-Step Guide

### 1. Create New GitHub Repository

1. Go to https://github.com/new
2. Repository name: `election-cart-admin`
3. Description: "Admin dashboard for Election Cart - Order and staff management"
4. Choose: **Public** or **Private**
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

### 2. Prepare Local Folder

Open terminal/command prompt in the **admin-frontend** folder:

```bash
# Navigate to admin-frontend folder
cd admin-frontend

# Initialize git (if not already initialized)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Election Cart Admin Panel standalone repository"
```

### 3. Connect to GitHub

Replace `yourusername` with your actual GitHub username:

```bash
# Add remote origin
git remote add origin https://github.com/yourusername/election-cart-admin.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

### 4. Verify Upload

1. Go to your GitHub repository
2. Check that all files are uploaded
3. Verify README.md displays correctly

### 5. Update Repository Settings

On GitHub repository page:

1. **About section** (top right):
   - Description: "Admin dashboard for Election Cart - Order and staff management"
   - Website: (add after deployment)
   - Topics: `react`, `typescript`, `admin-panel`, `firebase`, `vite`, `tailwindcss`

2. **Settings > General**:
   - Enable Issues
   - Enable Discussions (optional)

### 6. Update Files with Actual URLs

After repository is created, update these files:

#### README.md
```markdown
# Update repository links
**Frontend Repository:** https://github.com/yourusername/election-cart-frontend
**Backend Repository:** https://github.com/yourusername/election-cart-backend
```

#### package.json
```json
// Add repository field
{
  "name": "election-cart-admin",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/election-cart-admin.git"
  }
}
```

#### SETUP.md
```bash
# Update clone URL
git clone https://github.com/yourusername/election-cart-admin.git
```

Then commit and push these updates:

```bash
git add README.md package.json SETUP.md
git commit -m "docs: update repository URLs"
git push
```

### 7. Deploy to Vercel

1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. Add Environment Variables:
   ```
   VITE_API_BASE_URL=https://electioncart-backend.onrender.com
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

6. Click "Deploy"

### 8. Update Backend CORS

After deployment, update backend CORS settings:

```python
# In backend settings.py
CORS_ALLOWED_ORIGINS = [
    "https://your-admin-panel.vercel.app",
    "https://lapoelectioncart.com",
    "http://localhost:5174",  # for local development
]
```

### 9. Update Firebase Authorized Domains

1. Go to Firebase Console
2. Authentication → Settings → Authorized domains
3. Add your Vercel domain

### 10. Final Verification

- [ ] Repository is public/private as intended
- [ ] README displays correctly
- [ ] All files are present
- [ ] .env is NOT in repository (should be in .gitignore)
- [ ] Deployment successful
- [ ] Admin panel can connect to backend
- [ ] Firebase authentication working
- [ ] All features working

## Troubleshooting

### "Repository already exists"
- Choose a different name or delete the existing repository

### "Permission denied"
- Check your GitHub authentication
- Use HTTPS URL or set up SSH keys

### "Large files warning"
- Check if node_modules is being committed (should be in .gitignore)
- Run: `git rm -r --cached node_modules`

### "Push rejected"
- Make sure you're pushing to the correct repository
- Check if branch protection rules are enabled

## Quick Commands Reference

```bash
# Check git status
git status

# View remote URL
git remote -v

# Change remote URL
git remote set-url origin https://github.com/yourusername/new-repo.git

# View commit history
git log --oneline

# Undo last commit (keep changes)
git reset --soft HEAD~1
```

## Need Help?

- See [SETUP.md](./SETUP.md) for setup instructions
- See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for deployment
- See [STANDALONE_REPO_SETUP.md](./STANDALONE_REPO_SETUP.md) for overview

---

**Ready to push! Follow the steps above.** 🚀
