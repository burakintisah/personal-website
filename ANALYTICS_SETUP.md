# Analytics Setup Guide

This guide will help you set up visitor analytics for your website using Firebase Firestore.

## 🚀 Quick Start

### 1. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Firestore Database:
   - Go to "Firestore Database" in the left sidebar
   - Click "Create database"
   - Choose "Start in test mode" (you can configure security rules later)
   - Select a location for your database

### 2. Get Firebase Configuration

1. In your Firebase project, go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" and select "Web" (</>) 
4. Register your app with a nickname
5. Copy the Firebase configuration object

### 3. Environment Variables

1. Create a `.env` file in your project root
2. Add your Firebase configuration (use the `env.example` file as a template):

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 4. Firestore Security Rules (Optional but Recommended)

In your Firebase Console, go to Firestore Database > Rules and update them:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to analytics collection
    match /analytics/{document} {
      allow read, write: if true; // For now, allow all access
      // In production, you might want to restrict write access:
      // allow read: if true;
      // allow write: if request.auth != null; // Only authenticated users can write
    }
  }
}
```

## 📊 Features

### Automatic Tracking
- **Page Views**: Automatically tracks every page visit
- **Session Management**: Tracks unique sessions with 30-minute timeout
- **Device Detection**: Identifies mobile, tablet, or desktop
- **Browser Detection**: Identifies Chrome, Firefox, Safari, etc.
- **Location Data**: Gets country and city information (using IP geolocation)
- **Screen Resolution**: Captures visitor's screen size
- **Referrer Information**: Tracks where visitors came from

### Analytics Dashboard
- **Real-time Statistics**: Total page views, unique visitors
- **Top Pages**: Most visited pages on your site
- **Geographic Data**: Visitor locations by country
- **Device Analytics**: Mobile vs desktop usage
- **Browser Statistics**: Which browsers your visitors use
- **Recent Visitors**: Live feed of recent site visits

## 🔐 Admin Access

The analytics dashboard is protected by a simple password authentication:

- **Default Password**: `admin123`
- **Change Password**: Edit `src/components/AdminAuth.tsx` and update the `ADMIN_PASSWORD` constant
- **Access URL**: `https://yoursite.com/analytics`

## 🛠️ Customization

### Changing the Admin Password

Edit `src/components/AdminAuth.tsx`:

```typescript
const ADMIN_PASSWORD = 'your_new_password_here';
```

### Adding Custom Tracking Events

You can track custom events by using the analytics service:

```typescript
import { analyticsService } from '../services/analytics';

// Track a custom event
await analyticsService.trackPageView('/custom-event');
```

### Modifying Tracked Data

Edit `src/services/analytics.ts` to add or remove tracked fields:

```typescript
const visitorData = {
  // Add your custom fields here
  customField: 'custom value',
  // ... existing fields
};
```

## 🔧 Troubleshooting

### Common Issues

1. **"Failed to load analytics data"**
   - Check your Firebase configuration in `.env`
   - Ensure Firestore is enabled in your Firebase project
   - Check browser console for detailed error messages

2. **No location data showing**
   - The IP geolocation service might be rate-limited
   - Location data is optional and won't prevent other tracking

3. **Analytics not tracking**
   - Check browser console for errors
   - Ensure Firebase configuration is correct
   - Verify Firestore security rules allow writes

### Development vs Production

- **Development**: Uses test mode Firestore rules
- **Production**: Consider implementing proper authentication and stricter security rules

## 📈 Data Structure

Analytics data is stored in Firestore with the following structure:

```typescript
{
  timestamp: Firestore Timestamp,
  page: string,           // e.g., "/about"
  userAgent: string,      // Full user agent string
  referrer: string,       // Previous page URL
  language: string,       // Browser language
  screenResolution: string, // e.g., "1920x1080"
  timezone: string,       // User's timezone
  country: string,        // e.g., "United States"
  city: string,          // e.g., "New York"
  ip: string,            // Visitor's IP address
  sessionId: string,     // Unique session identifier
  isNewSession: boolean, // First page of session
  deviceType: string,    // "mobile", "tablet", or "desktop"
  browser: string,       // e.g., "Chrome"
  os: string            // e.g., "Windows"
}
```

## 🚀 Deployment

When deploying to production:

1. Ensure your `.env` file is not committed to version control
2. Set environment variables in your hosting platform
3. Update Firestore security rules for production use
4. Consider implementing proper user authentication for admin access

## 📝 Privacy Considerations

- The system collects IP addresses and location data
- Consider adding a privacy notice to your website
- Implement data retention policies as needed
- Comply with GDPR, CCPA, and other privacy regulations as applicable

## 🔗 Useful Links

- [Firebase Console](https://console.firebase.google.com/)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started) 


