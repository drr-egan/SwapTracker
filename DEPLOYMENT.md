# Deployment Guide

Complete guide to deploying your Office Swap Tracker to production.

## Option 1: Firebase Hosting (Recommended)

Firebase Hosting is free and integrates perfectly with your Firebase backend.

### Steps:

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

When prompted:
- Use an existing project? **Yes**
- Select your Firebase project
- Public directory? **dist**
- Configure as single-page app? **Yes**
- Set up automatic builds with GitHub? **No** (or Yes if you want CI/CD)
- Overwrite index.html? **No**

4. **Build your app**
```bash
npm run build
```

5. **Deploy**
```bash
firebase deploy --only hosting
```

Your app will be live at: `https://your-project-id.web.app`

### Custom Domain (Optional)

1. Go to Firebase Console > Hosting
2. Click "Add custom domain"
3. Follow the instructions to verify and connect your domain

## Option 2: Vercel

Vercel offers great performance and free hosting for personal projects.

### Steps:

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
vercel
```

Follow the prompts:
- Link to existing project? **No**
- Project name? **office-swap-tracker**
- Directory? **./office-swap-tracker**
- Override settings? **No**

3. **Set Environment Variables**

In Vercel Dashboard:
- Go to Project Settings > Environment Variables
- Add all your `VITE_FIREBASE_*` variables
- Redeploy to apply changes

## Option 3: Netlify

Netlify is another excellent free hosting option.

### Steps:

1. **Build your app locally**
```bash
npm run build
```

2. **Deploy via Netlify CLI**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

Or use the Netlify web interface:
- Drag and drop your `dist` folder
- Configure environment variables in Site Settings

## Environment Variables in Production

Make sure to set these environment variables in your hosting platform:

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

## GitHub Setup

1. **Create a new repository on GitHub**
   - Go to github.com/new
   - Name: `office-swap-tracker`
   - Make it Private (recommended for company projects)

2. **Push your code**
```bash
cd office-swap-tracker
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/office-swap-tracker.git
git push -u origin main
```

## Continuous Deployment (Optional)

### With GitHub Actions + Firebase

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches: [ main ]

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
          VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}
          VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
          VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}
      
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: your-project-id
```

Add secrets in GitHub repository settings.

## Post-Deployment Checklist

- [ ] Test user authentication
- [ ] Verify all CRUD operations work
- [ ] Check responsive design on mobile
- [ ] Test all navigation links
- [ ] Verify Firebase rules are deployed
- [ ] Create admin user in production
- [ ] Set up error monitoring (optional: Sentry)
- [ ] Configure backup strategy for Firestore
- [ ] Document the production URL for team

## Updating the App

### Firebase Hosting
```bash
npm run build
firebase deploy --only hosting
```

### Vercel
```bash
git push origin main
# Auto-deploys on push
```

### Netlify
```bash
npm run build
netlify deploy --prod
```

## Rollback

### Firebase Hosting
```bash
firebase hosting:rollback
```

Select the previous version to rollback to.

## Monitoring

Consider setting up:
- **Firebase Analytics** - User behavior tracking
- **Firebase Performance** - App performance monitoring
- **Sentry** - Error tracking and reporting
- **Google Analytics** - Advanced analytics

## Security Notes

- Never commit `.env` file
- Keep Firebase API keys in environment variables
- Regularly review Firestore security rules
- Monitor Firebase usage to avoid unexpected costs
- Set up billing alerts in Firebase Console

## Support

If you encounter issues:
1. Check Firebase Console for errors
2. Review browser console for client-side errors
3. Verify environment variables are set correctly
4. Check the hosting platform's logs
