# Office Swap Tracker

A web application for tracking office phone and device swaps across multiple carriers (AT&T, Verizon, T-Mobile).

## Features

- 📱 Track device swaps and assignments
- 👥 User management
- 📊 Real-time statistics and analytics
- 🔄 Swap status tracking
- 📈 Survey and preference tracking
- 🔐 Secure authentication
- 📤 Export capabilities

## Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Firebase (Firestore, Authentication, Hosting)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router

## Prerequisites

- Node.js 18+ and npm
- Firebase account
- Git

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/office-swap-tracker.git
cd office-swap-tracker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable the following services:
   - **Authentication** (Email/Password provider)
   - **Firestore Database** (Start in production mode)
   - **Hosting** (optional, for deployment)

4. Get your Firebase config:
   - Go to Project Settings > General
   - Scroll to "Your apps" > Web app
   - Copy the configuration

5. Create `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Firestore Security Rules

In Firebase Console > Firestore Database > Rules, use:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users must be authenticated
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173`

### 6. Build for Production

```bash
npm run build
```

### 7. Deploy to Firebase Hosting (Optional)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## Project Structure

```
office-swap-tracker/
├── public/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx
│   │   ├── SwapManagement.jsx
│   │   ├── UserManagement.jsx
│   │   ├── Statistics.jsx
│   │   └── DeviceList.jsx
│   ├── firebase/
│   │   ├── config.js
│   │   └── services.js
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── App.jsx
│   └── main.jsx
├── .env
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

## Database Structure

### Collections

#### `users`
```javascript
{
  email: "user@example.com",
  firstName: "John",
  lastName: "Doe",
  phoneNumber: "6125551234",
  currentCarrier: "Verizon",
  currentDevice: "iPhone 14",
  createdAt: timestamp
}
```

#### `swaps`
```javascript
{
  userId: "user_id",
  email: "user@example.com",
  firstName: "John",
  lastName: "Doe",
  phoneNumber: "6125551234",
  currentCarrier: "Verizon",
  currentDevice: "Galaxy S21",
  tempNumber: "7634851482",
  contractEndDate: timestamp,
  phoneChoice: "T-Mobile Google Pixel 9",
  assignedTo: "Luke",
  swapDate: timestamp,
  status: "completed", // pending, in-progress, completed
  newDeviceReceived: false,
  oldDeviceReturned: false,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### `devices`
```javascript
{
  deviceName: "John's iPhone 14",
  userName: "John Doe",
  email: "user@example.com",
  lastSync: timestamp,
  status: "Approved",
  model: "iPhone14,5",
  serialNumber: "ABC123",
  os: "iOS 18.1",
  type: "iOS"
}
```

#### `carriers`
```javascript
{
  name: "AT&T",
  accountNumber: "287246340735",
  pin: "4131",
  transferPin: "230885",
  contactName: "Chad Harmon",
  contactEmail: "chad.harmon@att.com",
  contactPhone: "9528186628"
}
```

## Initial Setup - Creating Admin User

After first deployment, create an admin user:

1. Sign up through the app
2. In Firebase Console > Authentication, note the user's UID
3. In Firestore, create a collection `admins` with document ID = user's UID:
   ```javascript
   {
     email: "admin@example.com",
     role: "admin",
     createdAt: timestamp
   }
   ```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Private - Internal Use Only

## Support

For issues or questions, contact the development team.
