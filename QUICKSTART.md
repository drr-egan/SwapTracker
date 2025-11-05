# Quick Start Guide

Get your Office Swap Tracker app running in 10 minutes.

## Prerequisites

- Node.js 18+ installed
- A Google/Gmail account
- Git installed

## Step 1: Set Up Firebase (5 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: `office-swap-tracker`
4. Click through the setup wizard
5. Once created, click on "Web" (</> icon) to add a web app
6. Register the app with nickname: "Office Swap Tracker"
7. Copy the Firebase configuration

## Step 2: Enable Firebase Services (3 minutes)

### Enable Authentication
1. In Firebase Console, go to "Authentication"
2. Click "Get Started"
3. Click "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

### Enable Firestore
1. Go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in production mode"
4. Select a location close to your users
5. Click "Enable"

## Step 3: Clone and Configure Project (2 minutes)

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/office-swap-tracker.git
cd office-swap-tracker

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit `.env` and paste your Firebase config:
```env
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_actual_auth_domain
VITE_FIREBASE_PROJECT_ID=your_actual_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_actual_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_actual_sender_id
VITE_FIREBASE_APP_ID=your_actual_app_id
```

## Step 4: Run the App

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Step 5: Create Your First Admin User

1. Sign up with your email and password
2. Go to Firebase Console > Authentication
3. Copy your user UID
4. Go to Firestore Database
5. Click "Start collection"
6. Collection ID: `admins`
7. Document ID: (paste your UID)
8. Add field:
   - Field: `email` | Type: string | Value: your_email@example.com
   - Field: `role` | Type: string | Value: `admin`
   - Field: `createdAt` | Type: timestamp | Value: (current timestamp)
9. Click "Save"

## Step 6: Deploy Firestore Rules

```bash
npm install -g firebase-tools
firebase login
firebase init firestore
firebase deploy --only firestore:rules
```

## Next Steps

- Import your existing data from Excel
- Invite team members
- Customize the app for your needs

## Troubleshooting

**Can't sign in?**
- Check that Email/Password auth is enabled in Firebase Console
- Verify your .env file has correct Firebase config

**Data not saving?**
- Check Firestore rules are deployed
- Look for errors in browser console (F12)

**App won't start?**
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then run `npm install`
- Check Node.js version: `node --version` (should be 18+)

## Support

For issues, check the main README.md or contact your development team.
