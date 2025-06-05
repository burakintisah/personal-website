# Burak's Portfolio - Full Stack Application

A modern, full-stack portfolio website built with React, TypeScript, Firebase Functions, and Firestore.

## 🏗️ Project Structure

```
your-website/
├── frontend/          # React application (Vite + TypeScript)
├── backend/           # Firebase Functions (Node.js + TypeScript)
├── shared/            # Shared types, utilities, constants
├── firebase.json      # Firebase configuration
├── .firebaserc       # Firebase project settings
└── package.json      # Root package.json for scripts
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- Firebase CLI (`npm install -g firebase-tools`)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/burakintisah/burakintisah.github.io.git
   cd burakintisah.github.io
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up Firebase project**
   ```bash
   # Login to Firebase
   firebase login
   
   # Initialize Firebase (if not already done)
   firebase init
   
   # Update .firebaserc with your project ID
   ```

4. **Set up environment variables**
   ```bash
   # Copy environment template
   cp env.example frontend/.env.local
   
   # Update with your Firebase config
   ```

## 🛠️ Development

### Start Development Servers

```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:frontend  # React app on http://localhost:5173
npm run dev:backend   # Firebase emulators on http://localhost:5001
```

### Available Scripts

#### Root Level
- `npm run dev` - Start both frontend and backend
- `npm run build` - Build both applications
- `npm run deploy` - Deploy both to production
- `npm run install:all` - Install all dependencies
- `npm run clean` - Clean all node_modules and build files
- `npm run lint` - Lint both applications
- `npm run test` - Run all tests

#### Frontend
- `npm run dev:frontend` - Start React development server
- `npm run build:frontend` - Build React application
- `npm run deploy:frontend` - Deploy to GitHub Pages

#### Backend
- `npm run dev:backend` - Start Firebase emulators
- `npm run build:backend` - Build Firebase Functions
- `npm run deploy:backend` - Deploy Functions to Firebase

## 🔧 Configuration

### Firebase Setup

1. **Create a Firebase project** at [Firebase Console](https://console.firebase.google.com)

2. **Update `.firebaserc`** with your project ID:
   ```json
   {
     "projects": {
       "default": "your-project-id"
     }
   }
   ```

3. **Configure Firestore** (if not already done):
   ```bash
   firebase firestore:rules
   firebase firestore:indexes
   ```

### Environment Variables

Create `frontend/.env.local`:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your_app_id
```

## 📁 Folder Structure

### Frontend (`/frontend`)
- **`src/components/`** - Reusable React components
- **`src/pages/`** - Page components
- **`src/hooks/`** - Custom React hooks
- **`src/services/`** - API services and utilities
- **`src/types/`** - TypeScript type definitions
- **`public/`** - Static assets

### Backend (`/backend`)
- **`src/routes/`** - API route handlers
- **`src/services/`** - Business logic services
- **`src/middleware/`** - Express middleware
- **`src/utils/`** - Utility functions

### Shared (`/shared`)
- **`types/`** - Shared TypeScript interfaces
- **`utils/`** - Shared utility functions
- **`constants/`** - Shared constants

## 🚀 Deployment

### Frontend (GitHub Pages)
```bash
npm run deploy:frontend
```

### Backend (Firebase Functions)
```bash
npm run deploy:backend
```

### Full Deployment
```bash
npm run deploy
```

## 🔒 Security

- Firestore security rules are configured for public reads with validated writes
- Rate limiting is implemented on all API endpoints
- Input validation using Joi schemas
- CORS properly configured for production domains

## 📊 Analytics

The application includes built-in analytics tracking:
- Page views
- Contact form submissions
- Project interactions

Analytics data is stored in Firestore and can be viewed in the admin dashboard.

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run frontend tests
npm run test:frontend

# Run backend tests
npm run test:backend
```

## 📝 API Documentation

### Endpoints

- **GET** `/api/health` - Health check
- **POST** `/api/contact` - Submit contact form
- **POST** `/api/analytics` - Track analytics event
- **GET** `/api/posts` - Get blog posts
- **GET** `/api/projects` - Get projects

### Rate Limits

- General API: 100 requests per 15 minutes
- Contact form: 5 submissions per hour
- Analytics: 10 events per minute

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Burak Intisah**
- Website: [burakintisah.com](https://burakintisah.com)
- GitHub: [@burakintisah](https://github.com/burakintisah)
- LinkedIn: [burakintisah](https://linkedin.com/in/burakintisah)

---

Built with ❤️ using React, TypeScript, and Firebase 

# Burak's Portfolio - Backend API

A Firebase Functions-based backend API for Burak's portfolio website, currently focused on analytics tracking with plans for future expansion.

## Current Features

### ✅ Analytics API
- **Track page views** with detailed visitor information
- **Get analytics statistics** with aggregated data
- **Paginated visitor data** with filtering options
- **Input validation** and sanitization
- **Rate limiting** for API protection

## API Endpoints

### Health Check
```bash
GET /health
```

### Analytics

#### Track Analytics Event
```bash
POST /analytics/track
Content-Type: application/json

{
  "page": "/home",
  "sessionId": "session_123",
  "deviceType": "desktop", // mobile | tablet | desktop
  "browser": "Chrome",
  "userAgent": "Mozilla/5.0...",
  "referrer": "https://google.com",
  "language": "en-US",
  "screenResolution": "1920x1080",
  "timezone": "America/New_York",
  "country": "United States",
  "city": "New York",
  "os": "macOS",
  "isNewSession": true
}
```

#### Get Analytics Statistics
```bash
GET /analytics/stats?days=30
```

#### Get Visitors (Paginated)
```bash
GET /analytics/visitors?page=1&limit=20&days=30
```

## Development

### Prerequisites
- Node.js 18+
- Firebase CLI
- Firebase project setup

### Setup
```bash
# Install dependencies
npm install

# Build the project
npm run build

# Start development server
npm run dev

# Deploy to Firebase
npm run deploy
```

### Testing
```bash
# Start emulator
npm run dev

# Test health endpoint
curl http://127.0.0.1:5001/personal-website-d0d32/us-central1/api/health

# Test analytics tracking
curl -X POST http://127.0.0.1:5001/personal-website-d0d32/us-central1/api/analytics/track \
  -H "Content-Type: application/json" \
  -d '{"page":"/test","sessionId":"test-123","deviceType":"desktop","browser":"Chrome"}'
```

## Project Structure

```
├── backend/                 # Firebase Functions
│   ├── src/
│   │   ├── index.ts        # Main API entry point
│   │   └── routes/
│   │       └── analytics.ts # Analytics endpoints
│   └── package.json
├── shared/                  # Shared types and utilities
│   ├── types/              # TypeScript interfaces
│   ├── constants/          # API constants and validation rules
│   └── utils/              # Utility functions
├── frontend/               # React frontend (separate)
└── firebase.json           # Firebase configuration
```

## Future Expansion Plans

### 🚧 Planned Features
- **Contact Form API** - Handle contact form submissions
- **Blog Posts API** - CRUD operations for blog content
- **Projects API** - Manage portfolio projects
- **Authentication** - User management and protected routes
- **File Upload** - Image and document handling
- **Email Service** - Automated email notifications

### 🔄 Future Endpoints
```bash
# Contact
POST /contact
GET /contact (admin)

# Blog Posts
GET /posts
GET /posts/:id
POST /posts (admin)
PUT /posts/:id (admin)
DELETE /posts/:id (admin)

# Projects
GET /projects
GET /projects/:id
POST /projects (admin)
PUT /projects/:id (admin)
DELETE /projects/:id (admin)
```

## Configuration

### Environment Variables
- `NODE_ENV` - Environment (development/production)
- `FUNCTIONS_EMULATOR` - Firebase emulator flag

### Firebase Collections
- `analytics` - Visitor tracking data

### Rate Limits
- General API: 100 requests per 15 minutes
- Analytics: 50 requests per 15 minutes

## Security Features
- **CORS** protection with allowed origins
- **Helmet** security headers
- **Rate limiting** per IP address
- **Input validation** and sanitization
- **Error handling** with proper status codes

## Deployment

The API is deployed as Firebase Functions:
- **Production**: `https://us-central1-personal-website-d0d32.cloudfunctions.net/api`
- **Development**: `http://127.0.0.1:5001/personal-website-d0d32/us-central1/api`

## License

Private project for Burak's portfolio website. 