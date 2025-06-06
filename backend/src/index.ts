import * as functions from "firebase-functions/v2/https";
import { defineString } from "firebase-functions/params";
import * as admin from "firebase-admin";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { RATE_LIMITS, HTTP_STATUS, ERROR_CODES, API_CONFIG } from "../../shared/constants";

// Initialize Firebase Admin
admin.initializeApp();

// Get Firebase Functions config
const apiKeyParam = defineString("API_KEY", {
  description: "API key for frontend authentication",
  default: "portfolio-api-gpl6qgmqft55gaaj2gcq7a"
});

// Create Express app
const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for API
}));

// CORS configuration
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:5173", // Vite dev server
    "https://burakintisah.github.io",
    "https://burakintisah.com",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// General rate limiting
const generalLimiter = rateLimit({
  windowMs: RATE_LIMITS.GENERAL.WINDOW_MS,
  max: RATE_LIMITS.GENERAL.MAX_REQUESTS,
  message: {
    success: false,
    error: "Too many requests from this IP, please try again later.",
    code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
  },
  skip: (req) => {
    return process.env.FUNCTIONS_EMULATOR === 'true' || !req.ip;
  },
  keyGenerator: (req) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress;
    return Array.isArray(ip) ? ip[0] : (ip as string) || 'unknown';
  },
});

app.use(generalLimiter);

// API Key authentication middleware
const apiKeyAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Skip auth for health endpoint
  if (req.path === '/health') {
    return next();
  }

  const apiKey = req.headers[API_CONFIG.API_KEY_HEADER.toLowerCase()] as string;
  const expectedApiKey = apiKeyParam.value();

  if (!apiKey) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      error: "API key is required",
      code: ERROR_CODES.UNAUTHORIZED,
    });
  }

  if (apiKey !== expectedApiKey) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      error: "Invalid API key",
      code: ERROR_CODES.UNAUTHORIZED,
    });
  }

  next();
};

// Apply API key authentication to all routes except health
app.use(apiKeyAuth);

// Health check endpoint (public, no auth required)
app.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "API is healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// API Routes
import analyticsRoutes from "./routes/analytics";
app.use("/analytics", analyticsRoutes);

// 404 handler
app.use("*", (_req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    error: "Endpoint not found",
    code: ERROR_CODES.NOT_FOUND,
  });
});

// Error handling middleware
app.use((error: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("API Error:", error);
  
  res.status(error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: error.message || "Internal server error",
    code: error.code || ERROR_CODES.INTERNAL_ERROR,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
});

// Export the Express app as a Firebase Function (2nd gen)
export const api = functions.onRequest({
  region: "us-central1",
  memory: "256MiB",
  timeoutSeconds: 60,
  maxInstances: 10,
  minInstances: 0,
  concurrency: 80,
}, app); 