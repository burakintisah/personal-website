# Analytics Migration: Frontend to Backend API

## Overview

The analytics system has been migrated from direct Firestore access to a backend API architecture for better security, performance, and maintainability.

## Architecture Changes

### Before (Direct Firestore)
```
Frontend → Firestore Database
```

### After (Backend API)
```
Frontend → Backend API → Firestore Database
```

## New File Structure

### Frontend (`frontend/src/`)
```
services/
├── api.ts                 # API client for backend communication
├── analyticsService.ts    # Analytics service using backend API
└── (removed) analytics.ts # Old direct Firestore service

hooks/
└── useAnalytics.ts       # Updated to use new analytics service

pages/
└── Analytics.tsx         # Updated to use backend API

utils/
└── testApi.ts           # API connectivity testing utility

components/
└── (removed) DataManagement.tsx # Data management moved to backend
```

### Backend (`backend/src/`)
```
routes/
└── analytics.ts          # Analytics API endpoints

index.ts                  # Main API server with analytics routes
```

### Shared (`shared/`)
```
types/index.ts           # Shared TypeScript interfaces
constants/index.ts       # Shared constants and validation rules
utils/index.ts          # Shared utility functions
```

## API Endpoints

### Health Check
- **GET** `/health` - API health status

### Analytics
- **POST** `/analytics/track` - Track page views and user data
- **GET** `/analytics/stats?days=30` - Get analytics statistics
- **GET** `/analytics/visitors?page=1&limit=20&days=30` - Get paginated visitor data

## Environment Variables

### Frontend (`.env.local`)
```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:5001/personal-website-d0d32/us-central1/api
VITE_API_KEY=portfolio-api-gpl6qgmqft55gaaj2gcq7a

# Firebase (for admin auth only)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
# ... other Firebase config
```

### Backend (`.env`)
```bash
FIREBASE_PROJECT_ID=personal-website-d0d32
API_KEY=portfolio-api-gpl6qgmqft55gaaj2gcq7a
```

## Key Features

### 1. API Client (`api.ts`)
- Centralized HTTP client with error handling
- Automatic environment-based URL switching
- API key authentication
- TypeScript support with shared types

### 2. Analytics Service (`analyticsService.ts`)
- Session management (30-minute expiry)
- Device detection (mobile/tablet/desktop)
- Browser and OS detection
- Location detection via IP geolocation
- Health checking for API connectivity

### 3. Enhanced Analytics Dashboard
- Real-time API health status indicator
- Error handling with retry mechanisms
- Improved UI with connection status
- Removed direct data management (moved to backend)

## Testing

### Browser Console Testing
In development mode, you can test API connectivity:
```javascript
// Available in browser console
testApi()
```

### Manual Testing
1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Visit analytics page: `http://localhost:5173/analytics`
4. Check browser console for API calls

## Migration Benefits

1. **Security**: No direct database access from frontend
2. **Performance**: Optimized queries and caching on backend
3. **Scalability**: Rate limiting and request validation
4. **Maintainability**: Centralized business logic
5. **Monitoring**: Better error tracking and logging
6. **Flexibility**: Easy to add new features and endpoints

## Deployment

### Development
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend  
cd frontend && npm run dev
```

### Production
```bash
# Build and deploy backend
cd backend && npm run build && firebase deploy --only functions

# Build and deploy frontend
cd frontend && npm run build && npm run deploy
```

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Check if backend is running
   - Verify environment variables
   - Check network connectivity

2. **CORS Errors**
   - Backend includes CORS middleware
   - Check API_BASE_URL in frontend

3. **Authentication Errors**
   - Verify API_KEY matches between frontend and backend
   - Check X-API-Key header in requests

4. **Build Errors**
   - Ensure shared types are properly imported
   - Check TypeScript path mappings
   - Verify all dependencies are installed

### Debug Commands
```bash
# Test backend health
curl http://localhost:5001/personal-website-d0d32/us-central1/api/health

# Test analytics stats
curl -H "X-API-Key: portfolio-api-gpl6qgmqft55gaaj2gcq7a" \
  http://localhost:5001/personal-website-d0d32/us-central1/api/analytics/stats

# Check frontend build
cd frontend && npm run build
``` 