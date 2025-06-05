// Analytics Types
export interface AnalyticsEvent {
  id?: string;
  type: 'page_view' | 'contact_form' | 'project_view';
  timestamp: Date;
  userAgent?: string;
  ip?: string;
  referrer?: string;
  page?: string;
  projectId?: string;
}

export interface VisitorData {
  id?: string;
  timestamp: Date | any; // Can be Firestore timestamp or Date
  page: string;
  userAgent: string;
  referrer: string;
  language: string;
  screenResolution: string;
  timezone: string;
  country?: string;
  city?: string;
  ip?: string;
  sessionId: string;
  isNewSession: boolean;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  browser: string;
  os: string;
}

export interface AnalyticsStats {
  totalVisitors: number;
  uniqueVisitors: number;
  pageViews: number;
  topPages: { page: string; count: number }[];
  topCountries: { country: string; count: number }[];
  deviceTypes: { type: string; count: number }[];
  browsers: { browser: string; count: number }[];
  recentVisitors: VisitorData[];
}

// Analytics Request Types
export interface TrackAnalyticsRequest {
  page: string;
  sessionId: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  browser: string;
  userAgent?: string;
  referrer?: string;
  language?: string;
  screenResolution?: string;
  timezone?: string;
  country?: string;
  city?: string;
  ip?: string;
  os?: string;
  isNewSession?: boolean;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination Types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  meta?: {
    days: number;
    startDate: string;
    endDate: string;
  };
}

// Error Types
export interface ApiError {
  code: string;
  message: string;
  details?: any;
} 