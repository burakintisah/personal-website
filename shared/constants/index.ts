// Firebase Collections
export const COLLECTIONS = {
  ANALYTICS: 'analytics',
  // Future collections will be added here:
  // CONTACTS: 'contacts',
  // POSTS: 'posts',
  // PROJECTS: 'projects',
} as const;

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://us-central1-personal-website-d0d32.cloudfunctions.net/api'
    : 'http://localhost:5001/personal-website-d0d32/us-central1/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  // API Key for frontend authentication
  API_KEY_HEADER: 'X-API-Key',
  API_KEY: process.env.API_KEY || 'your-api-key-here', // Will be set in Firebase Functions config
} as const;

// Rate Limiting
export const RATE_LIMITS = {
  GENERAL: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100, // 100 requests per 15 minutes per IP
  },
  ANALYTICS: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 50, // 50 requests per 15 minutes per IP
  },
  // Future rate limits will be added here:
  // CONTACT_FORM: {
  //   WINDOW_MS: 60 * 60 * 1000, // 1 hour
  //   MAX_REQUESTS: 5,
  // },
} as const;

// Validation Rules
export const VALIDATION = {
  ANALYTICS: {
    PAGE_MAX_LENGTH: 500,
    SESSION_ID_MAX_LENGTH: 100,
    USER_AGENT_MAX_LENGTH: 1000,
    REFERRER_MAX_LENGTH: 500,
    LANGUAGE_MAX_LENGTH: 10,
    SCREEN_RESOLUTION_MAX_LENGTH: 20,
    TIMEZONE_MAX_LENGTH: 50,
    COUNTRY_MAX_LENGTH: 100,
    CITY_MAX_LENGTH: 100,
    BROWSER_MAX_LENGTH: 50,
    OS_MAX_LENGTH: 50,
    DEVICE_TYPES: ['mobile', 'tablet', 'desktop'] as const,
  },
  PAGINATION: {
    MAX_LIMIT: 100,
    DEFAULT_LIMIT: 20,
    MAX_DAYS: 365,
    DEFAULT_DAYS: 30,
  },
  // Future validation rules will be added here:
  // CONTACT: {
  //   NAME_MIN_LENGTH: 2,
  //   NAME_MAX_LENGTH: 100,
  //   MESSAGE_MIN_LENGTH: 10,
  //   MESSAGE_MAX_LENGTH: 2000,
  // },
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Error Codes
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  NOT_FOUND: 'NOT_FOUND',
} as const; 