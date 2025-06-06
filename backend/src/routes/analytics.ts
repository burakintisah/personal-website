import express from "express";
import * as admin from "firebase-admin";
import { FieldValue, Query, DocumentData } from "firebase-admin/firestore";
import rateLimit from "express-rate-limit";
import { 
  VisitorData, 
  AnalyticsStats, 
  TrackAnalyticsRequest,
  ApiResponse,
  PaginatedResponse 
} from "../../../shared/types";
import { 
  COLLECTIONS, 
  RATE_LIMITS, 
  HTTP_STATUS, 
  ERROR_CODES, 
  VALIDATION 
} from "../../../shared/constants";
import {
  isValidDeviceType,
  isValidSessionId,
  isValidPage,
  sanitizeString,
  truncate,
  countBy,
  sortByCount,
  getDaysAgo
} from "../../../shared/utils";

const router = express.Router();
const db = admin.firestore();

// Rate limiting for analytics endpoints
const analyticsLimiter = rateLimit({
  windowMs: RATE_LIMITS.ANALYTICS.WINDOW_MS,
  max: RATE_LIMITS.ANALYTICS.MAX_REQUESTS,
  message: {
    success: false,
    error: "Too many analytics requests from this IP, please try again later.",
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

// Apply rate limiting to all analytics routes
router.use(analyticsLimiter);

/**
 * POST /analytics/track
 * Track a new analytics event (page view)
 */
router.post("/track", async (req, res): Promise<void> => {
  try {
    const requestData: TrackAnalyticsRequest = req.body;
    
    // Validate required fields
    if (!requestData.page || !requestData.sessionId || !requestData.deviceType || !requestData.browser) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: "Missing required fields: page, sessionId, deviceType, browser",
        code: ERROR_CODES.VALIDATION_ERROR,
      });
      return;
    }

    // Validate field formats and lengths
    if (!isValidPage(requestData.page)) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: `Page must be between 1 and ${VALIDATION.ANALYTICS.PAGE_MAX_LENGTH} characters`,
        code: ERROR_CODES.VALIDATION_ERROR,
      });
      return;
    }

    if (!isValidSessionId(requestData.sessionId)) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: `Session ID must be between 1 and ${VALIDATION.ANALYTICS.SESSION_ID_MAX_LENGTH} characters`,
        code: ERROR_CODES.VALIDATION_ERROR,
      });
      return;
    }

    if (!isValidDeviceType(requestData.deviceType)) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: `Invalid deviceType. Must be one of: ${VALIDATION.ANALYTICS.DEVICE_TYPES.join(', ')}`,
        code: ERROR_CODES.VALIDATION_ERROR,
      });
      return;
    }

    // Sanitize and truncate input data
    const visitorData: Omit<VisitorData, 'id'> = {
      timestamp: FieldValue.serverTimestamp(),
      page: sanitizeString(requestData.page),
      userAgent: truncate(sanitizeString(requestData.userAgent || ''), VALIDATION.ANALYTICS.USER_AGENT_MAX_LENGTH),
      referrer: truncate(sanitizeString(requestData.referrer || ''), VALIDATION.ANALYTICS.REFERRER_MAX_LENGTH),
      language: truncate(sanitizeString(requestData.language || ''), VALIDATION.ANALYTICS.LANGUAGE_MAX_LENGTH),
      screenResolution: truncate(sanitizeString(requestData.screenResolution || ''), VALIDATION.ANALYTICS.SCREEN_RESOLUTION_MAX_LENGTH),
      timezone: truncate(sanitizeString(requestData.timezone || ''), VALIDATION.ANALYTICS.TIMEZONE_MAX_LENGTH),
      sessionId: sanitizeString(requestData.sessionId),
      isNewSession: Boolean(requestData.isNewSession),
      deviceType: requestData.deviceType,
      browser: truncate(sanitizeString(requestData.browser), VALIDATION.ANALYTICS.BROWSER_MAX_LENGTH),
      os: truncate(sanitizeString(requestData.os || ''), VALIDATION.ANALYTICS.OS_MAX_LENGTH),
      ...(requestData.country && { country: truncate(sanitizeString(requestData.country), VALIDATION.ANALYTICS.COUNTRY_MAX_LENGTH) }),
      ...(requestData.city && { city: truncate(sanitizeString(requestData.city), VALIDATION.ANALYTICS.CITY_MAX_LENGTH) }),
      ...(requestData.ip && { ip: sanitizeString(requestData.ip) }),
    };

    // Add to Firestore
    const docRef = await db.collection(COLLECTIONS.ANALYTICS).add(visitorData);
    
    const response: ApiResponse<VisitorData> = {
      success: true,
      message: "Analytics event tracked successfully",
      data: {
        id: docRef.id,
        ...visitorData,
        timestamp: new Date().toISOString(),
      } as VisitorData,
    };

    res.status(HTTP_STATUS.CREATED).json(response);
  } catch (error) {
    console.error("Error tracking analytics:", error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: "Failed to track analytics event",
      code: ERROR_CODES.INTERNAL_ERROR,
    });
  }
});

/**
 * GET /analytics/stats
 * Get analytics statistics
 * Query params: days (default: 30)
 */
router.get("/stats", async (req, res): Promise<void> => {
  try {
    const days = Math.min(
      Math.max(parseInt(req.query.days as string) || VALIDATION.PAGINATION.DEFAULT_DAYS, 1),
      VALIDATION.PAGINATION.MAX_DAYS
    );

    // Calculate start date
    const startDate = getDaysAgo(days);

    // Query analytics data
    const analyticsRef = db.collection(COLLECTIONS.ANALYTICS);
    const query = analyticsRef
      .where('timestamp', '>=', startDate)
      .orderBy('timestamp', 'desc');

    const snapshot = await query.get();
    
    if (snapshot.empty) {
      const emptyStats: AnalyticsStats = {
        totalVisitors: 0,
        uniqueVisitors: 0,
        pageViews: 0,
        topPages: [],
        topCountries: [],
        deviceTypes: [],
        browsers: [],
        recentVisitors: [],
      };

      res.json({
        success: true,
        data: emptyStats,
        meta: {
          days,
          startDate: startDate.toISOString(),
          endDate: new Date().toISOString(),
        },
      });
      return;
    }

    // Process the data
    const visitors: VisitorData[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      visitors.push({
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate() || new Date(),
      } as VisitorData);
    });

    // Calculate statistics using shared utilities
    const uniqueSessionIds = new Set(visitors.map(v => v.sessionId));
    const pageViews = visitors.length;
    const uniqueVisitors = uniqueSessionIds.size;

    // Top pages
    const pageCounts = countBy(visitors, (v) => v.page);
    const topPages = sortByCount(pageCounts, 10).map(({ key, count }) => ({ page: key, count }));

    // Top countries
    const countryCounts = countBy(visitors.filter(v => v.country), (v) => v.country!);
    const topCountries = sortByCount(countryCounts, 10).map(({ key, count }) => ({ country: key, count }));

    // Device types
    const deviceCounts = countBy(visitors, (v) => v.deviceType);
    const deviceTypes = sortByCount(deviceCounts).map(({ key, count }) => ({ type: key, count }));

    // Browsers
    const browserCounts = countBy(visitors, (v) => v.browser);
    const browsers = sortByCount(browserCounts).map(({ key, count }) => ({ browser: key, count }));

    // Recent visitors (convert timestamps to ISO strings)
    const recentVisitors = visitors.slice(0, 50).map(visitor => ({
      ...visitor,
      timestamp: visitor.timestamp instanceof Date 
        ? visitor.timestamp.toISOString() 
        : visitor.timestamp,
    }));

    const stats: AnalyticsStats = {
      totalVisitors: pageViews,
      uniqueVisitors,
      pageViews,
      topPages,
      topCountries,
      deviceTypes,
      browsers,
      recentVisitors,
    };

    const response: ApiResponse<AnalyticsStats> = {
      success: true,
      data: stats,
    };

    res.json({
      ...response,
      meta: {
        days,
        startDate: startDate.toISOString(),
        endDate: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error getting analytics stats:", error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: "Failed to get analytics statistics",
      code: ERROR_CODES.INTERNAL_ERROR,
    });
  }
});

/**
 * GET /analytics/visitors
 * Get recent visitors with pagination
 * Query params: page (default: 1), limit (default: 20), days (default: 30)
 */
router.get("/visitors", async (req, res): Promise<void> => {
  try {
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit as string) || VALIDATION.PAGINATION.DEFAULT_LIMIT, 1),
      VALIDATION.PAGINATION.MAX_LIMIT
    );
    const days = Math.min(
      Math.max(parseInt(req.query.days as string) || VALIDATION.PAGINATION.DEFAULT_DAYS, 1),
      VALIDATION.PAGINATION.MAX_DAYS
    );

    // Calculate start date
    const startDate = getDaysAgo(days);

    // Query analytics data with pagination
    const analyticsRef = db.collection(COLLECTIONS.ANALYTICS);
    const query = analyticsRef
      .where('timestamp', '>=', startDate)
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .offset((page - 1) * limit);

    const snapshot = await query.get();
    
    // Get total count for pagination
    const countQuery = analyticsRef.where('timestamp', '>=', startDate);
    const countSnapshot = await countQuery.get();
    const totalCount = countSnapshot.size;

    const visitors: VisitorData[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      visitors.push({
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate()?.toISOString() || new Date().toISOString(),
      } as VisitorData);
    });

    const totalPages = Math.ceil(totalCount / limit);

    const response: PaginatedResponse<VisitorData> = {
      data: visitors,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };

    res.json({
      success: true,
      ...response,
      meta: {
        days,
        startDate: startDate.toISOString(),
        endDate: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error getting visitors:", error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: "Failed to get visitors data",
      code: ERROR_CODES.INTERNAL_ERROR,
    });
  }
});

/**
 * GET /analytics/filter
 * Get filtered analytics data
 * Query params: 
 * - page, limit, days (pagination)
 * - country, city, deviceType, browser, os (filters)
 * - startDate, endDate (date range)
 */
router.get("/filter", async (req, res): Promise<void> => {
  try {
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit as string) || VALIDATION.PAGINATION.DEFAULT_LIMIT, 1),
      VALIDATION.PAGINATION.MAX_LIMIT
    );

    // Date filtering
    let startDate: Date;
    let endDate: Date = new Date();

    if (req.query.startDate && req.query.endDate) {
      startDate = new Date(req.query.startDate as string);
      endDate = new Date(req.query.endDate as string);
    } else {
      const days = Math.min(
        Math.max(parseInt(req.query.days as string) || VALIDATION.PAGINATION.DEFAULT_DAYS, 1),
        VALIDATION.PAGINATION.MAX_DAYS
      );
      startDate = getDaysAgo(days);
    }

    // Build query with filters
    const analyticsRef = db.collection(COLLECTIONS.ANALYTICS);
    let query: Query<DocumentData> = analyticsRef
      .where('timestamp', '>=', startDate);

    // Apply additional filters
    const filters: { [key: string]: string } = {};
    if (req.query.country) filters.country = req.query.country as string;
    if (req.query.city) filters.city = req.query.city as string;
    if (req.query.deviceType) filters.deviceType = req.query.deviceType as string;
    if (req.query.browser) filters.browser = req.query.browser as string;
    if (req.query.os) filters.os = req.query.os as string;
    if (req.query.pagePath) filters.page = req.query.pagePath as string;

    // Apply filters to query (Firestore allows up to 10 equality filters)
    Object.entries(filters).forEach(([field, value]) => {
      query = query.where(field, '==', value);
    });

    // Execute query with pagination
    const paginatedQuery = query
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .offset((page - 1) * limit);

    const snapshot = await paginatedQuery.get();
    
    // Filter results in memory for endDate (since we can't use <= in query)
    const visitors: VisitorData[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      const docTimestamp = data.timestamp?.toDate();
      
      // Apply endDate filter in memory
      if (!docTimestamp || docTimestamp <= endDate) {
        visitors.push({
          id: doc.id,
          ...data,
          timestamp: docTimestamp?.toISOString() || new Date().toISOString(),
        } as VisitorData);
      }
    });

    // Get total count for pagination (also filter by endDate in memory)
    const countSnapshot = await query.get();
    let totalCount = 0;
    countSnapshot.forEach((doc) => {
      const data = doc.data();
      const docTimestamp = data.timestamp?.toDate();
      if (!docTimestamp || docTimestamp <= endDate) {
        totalCount++;
      }
    });

    const totalPages = Math.ceil(totalCount / limit);

    const response: PaginatedResponse<VisitorData> = {
      data: visitors,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };

    res.json({
      success: true,
      ...response,
      meta: {
        filters,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error filtering analytics data:", error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: "Failed to filter analytics data",
      code: ERROR_CODES.INTERNAL_ERROR,
    });
  }
});

/**
 * DELETE /analytics/visitor/:id
 * Delete a specific visitor record
 */
router.delete("/visitor/:id", async (req, res): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: "Visitor ID is required",
        code: ERROR_CODES.VALIDATION_ERROR,
      });
      return;
    }

    // Check if document exists
    const docRef = db.collection(COLLECTIONS.ANALYTICS).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: "Visitor record not found",
        code: ERROR_CODES.NOT_FOUND,
      });
      return;
    }

    // Delete the document
    await docRef.delete();

    res.json({
      success: true,
      message: "Visitor record deleted successfully",
      data: { id },
    });
  } catch (error) {
    console.error("Error deleting visitor record:", error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: "Failed to delete visitor record",
      code: ERROR_CODES.INTERNAL_ERROR,
    });
  }
});

/**
 * DELETE /analytics/bulk
 * Bulk delete analytics records
 * Body: { ids: string[] } or { filters: object, days?: number }
 */
router.delete("/bulk", async (req, res): Promise<void> => {
  try {
    const { ids, filters, days } = req.body;

    if (!ids && !filters) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: "Either 'ids' array or 'filters' object is required",
        code: ERROR_CODES.VALIDATION_ERROR,
      });
      return;
    }

    let deletedCount = 0;

    if (ids && Array.isArray(ids)) {
      // Delete by specific IDs
      const batch = db.batch();
      
      for (const id of ids) {
        const docRef = db.collection(COLLECTIONS.ANALYTICS).doc(id);
        batch.delete(docRef);
      }

      await batch.commit();
      deletedCount = ids.length;
    } else if (filters) {
      // Delete by filters
      const analyticsRef = db.collection(COLLECTIONS.ANALYTICS);
      let query: Query<DocumentData> = analyticsRef;

      // Apply date filter
      if (days) {
        const startDate = getDaysAgo(Math.min(days, VALIDATION.PAGINATION.MAX_DAYS));
        query = query.where('timestamp', '>=', startDate);
      }

      // Apply other filters
      Object.entries(filters).forEach(([field, value]) => {
        if (value) {
          query = query.where(field, '==', value);
        }
      });

      const snapshot = await query.get();
      
      if (!snapshot.empty) {
        const batch = db.batch();
        snapshot.forEach((doc) => {
          batch.delete(doc.ref);
        });
        
        await batch.commit();
        deletedCount = snapshot.size;
      }
    }

    res.json({
      success: true,
      message: `Successfully deleted ${deletedCount} analytics records`,
      data: { deletedCount },
    });
  } catch (error) {
    console.error("Error bulk deleting analytics records:", error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: "Failed to bulk delete analytics records",
      code: ERROR_CODES.INTERNAL_ERROR,
    });
  }
});

/**
 * DELETE /analytics/clear
 * Clear all analytics data (with optional date range)
 * Query params: days (optional) - only delete data older than X days
 */
router.delete("/clear", async (req, res): Promise<void> => {
  try {
    const days = req.query.days ? parseInt(req.query.days as string) : null;
    
    const analyticsRef = db.collection(COLLECTIONS.ANALYTICS);
    let query: Query<DocumentData> = analyticsRef;
    
    if (days) {
      // Only delete data older than specified days
      const cutoffDate = getDaysAgo(Math.min(days, VALIDATION.PAGINATION.MAX_DAYS));
      query = query.where('timestamp', '<', cutoffDate);
    }

    // Get all documents to delete
    const snapshot = await query.get();
    
    if (snapshot.empty) {
      res.json({
        success: true,
        message: "No analytics data to clear",
        data: { deletedCount: 0 },
      });
      return;
    }

    // Delete in batches (Firestore batch limit is 500)
    const batchSize = 500;
    let deletedCount = 0;
    
    for (let i = 0; i < snapshot.docs.length; i += batchSize) {
      const batch = db.batch();
      const batchDocs = snapshot.docs.slice(i, i + batchSize);
      
      batchDocs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      deletedCount += batchDocs.length;
    }

    res.json({
      success: true,
      message: `Successfully cleared ${deletedCount} analytics records`,
      data: { deletedCount },
    });
  } catch (error) {
    console.error("Error clearing analytics data:", error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: "Failed to clear analytics data",
      code: ERROR_CODES.INTERNAL_ERROR,
    });
  }
});

export default router; 