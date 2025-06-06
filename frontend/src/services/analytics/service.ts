// Main Analytics Service
import { analyticsApi, AnalyticsFilters, BulkDeleteRequest } from '../api/analytics';
import { DeviceDetector } from './deviceDetection';
import { SessionManager } from './sessionManager';
import { LocationService } from './locationService';
import { AnalyticsStats, VisitorData, TrackAnalyticsRequest } from '../../../../shared/types';

export class AnalyticsService {
  private sessionManager: SessionManager;

  constructor() {
    this.sessionManager = new SessionManager();
  }

  // Public Methods
  async trackPageView(page: string): Promise<void> {
    try {
      const locationData = await LocationService.getLocationData();
      const deviceInfo = DeviceDetector.getDeviceInfo();
      const sessionInfo = this.sessionManager.getSessionInfo();
      
      const trackingData: TrackAnalyticsRequest = {
        page,
        sessionId: sessionInfo.sessionId,
        deviceType: deviceInfo.deviceType,
        browser: deviceInfo.browser,
        userAgent: deviceInfo.userAgent,
        referrer: document.referrer,
        language: deviceInfo.language,
        screenResolution: deviceInfo.screenResolution,
        timezone: deviceInfo.timezone,
        os: deviceInfo.os,
        isNewSession: sessionInfo.isNewSession,
        ...locationData
      };

      const response = await analyticsApi.track(trackingData);
      
      if (response.success) {
        // Mark session as used after first successful page view
        this.sessionManager.markSessionAsUsed();
      } else {
        console.error('Failed to track page view:', response.error);
      }
    } catch (error) {
      console.error('Failed to track page view:', error);
    }
  }

  async getAnalyticsStats(days: number = 30): Promise<AnalyticsStats> {
    try {
      const response = await analyticsApi.getStats(days);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to fetch analytics stats');
      }
    } catch (error) {
      console.error('Failed to get analytics stats:', error);
      throw error;
    }
  }

  async getVisitors(page: number = 1, limit: number = 20, days: number = 30): Promise<{
    visitors: VisitorData[];
    pagination: {
      page: number;
      limit: number;
      totalCount: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    try {
      const response = await analyticsApi.getVisitors(page, limit, days);
      
      if (response.success) {
        // Backend returns { success: true, data: [...], pagination: {...} }
        // Not wrapped in response.data.data format
        return {
          visitors: (response as any).data || [],
          pagination: (response as any).pagination || {
            page: 1,
            limit: 20,
            totalCount: 0,
            totalPages: 1,
            hasNext: false,
            hasPrev: false
          }
        };
      } else {
        throw new Error(response.error || 'Failed to fetch visitors');
      }
    } catch (error) {
      console.error('Failed to get visitors:', error);
      throw error;
    }
  }

  // New filtering and deletion methods
  async getFilteredData(
    filters: AnalyticsFilters,
    page: number = 1,
    limit: number = 20,
    days: number = 30
  ): Promise<{
    visitors: VisitorData[];
    pagination: {
      page: number;
      limit: number;
      totalCount: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    filters: AnalyticsFilters;
  }> {
    try {
      const response = await analyticsApi.getFilteredData(filters, page, limit, days);
      
      if (response.success) {
        // Backend returns { success: true, data: [...], pagination: {...} }
        return {
          visitors: (response as any).data || [],
          pagination: (response as any).pagination || {
            page: 1,
            limit: 20,
            totalCount: 0,
            totalPages: 1,
            hasNext: false,
            hasPrev: false
          },
          filters
        };
      } else {
        throw new Error(response.error || 'Failed to fetch filtered data');
      }
    } catch (error) {
      console.error('Failed to get filtered data:', error);
      throw error;
    }
  }

  async deleteVisitor(id: string): Promise<boolean> {
    try {
      const response = await analyticsApi.deleteVisitor(id);
      
      if (response.success) {
        return true;
      } else {
        console.error('Failed to delete visitor:', response.error);
        return false;
      }
    } catch (error) {
      console.error('Failed to delete visitor:', error);
      return false;
    }
  }

  async bulkDeleteVisitors(request: BulkDeleteRequest): Promise<number> {
    try {
      const response = await analyticsApi.bulkDelete(request);
      
      if (response.success && response.data) {
        return response.data.deletedCount;
      } else {
        throw new Error(response.error || 'Failed to bulk delete visitors');
      }
    } catch (error) {
      console.error('Failed to bulk delete visitors:', error);
      throw error;
    }
  }

  async clearAllData(days?: number): Promise<number> {
    try {
      const response = await analyticsApi.clearData(days);
      
      if (response.success && response.data) {
        return response.data.deletedCount;
      } else {
        throw new Error(response.error || 'Failed to clear analytics data');
      }
    } catch (error) {
      console.error('Failed to clear analytics data:', error);
      throw error;
    }
  }

  // Health check for API connectivity
  async checkApiHealth(): Promise<boolean> {
    return analyticsApi.checkHealth();
  }

  // Utility methods
  getSessionId(): string {
    return this.sessionManager.getSessionId();
  }

  isNewSession(): boolean {
    return this.sessionManager.isNewSessionFlag();
  }

  // Reset session (useful for testing)
  resetSession(): void {
    this.sessionManager.resetSession();
  }

  // Get current device info
  getDeviceInfo() {
    return DeviceDetector.getDeviceInfo();
  }

  // Get cached location data
  getCachedLocation() {
    return LocationService.getCachedLocation();
  }

  // Clear location cache
  clearLocationCache(): void {
    LocationService.clearCache();
  }
}

// Singleton instance
export const analyticsService = new AnalyticsService(); 