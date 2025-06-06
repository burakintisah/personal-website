import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { analyticsService } from '../services/analyticsService';
import { apiClient } from '../services/api/client';
import { AnalyticsStats, VisitorData } from '../../../shared/types';
import { AnalyticsFilters, BulkDeleteRequest } from '../services/api/analytics';

export const useAnalytics = () => {
  const location = useLocation();
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);

  useEffect(() => {
    // Check API health on mount
    const checkHealth = async () => {
      const healthy = await analyticsService.checkApiHealth();
      setIsHealthy(healthy);
    };
    
    checkHealth();
  }, []);

  useEffect(() => {
    // Only track page view for the home page to reduce API usage
    const trackPageView = async () => {
      // Only track the home page
      if (location.pathname === '/') {
        const page = location.pathname + location.search;
        await analyticsService.trackPageView(page);
      }
    };

    // Only track if API is healthy
    if (isHealthy) {
    trackPageView();
    }
  }, [location, isHealthy]);

  return {
    // Core analytics methods
    trackPageView: analyticsService.trackPageView.bind(analyticsService),
    getAnalyticsStats: analyticsService.getAnalyticsStats.bind(analyticsService),
    getVisitors: analyticsService.getVisitors.bind(analyticsService),
    
    // New filtering and deletion methods
    getFilteredData: analyticsService.getFilteredData.bind(analyticsService),
    deleteVisitor: analyticsService.deleteVisitor.bind(analyticsService),
    bulkDeleteVisitors: analyticsService.bulkDeleteVisitors.bind(analyticsService),
    clearAllData: analyticsService.clearAllData.bind(analyticsService),
    
    // Health and utility methods
    checkApiHealth: analyticsService.checkApiHealth.bind(analyticsService),
    getSessionId: analyticsService.getSessionId.bind(analyticsService),
    isNewSession: analyticsService.isNewSession.bind(analyticsService),
    resetSession: analyticsService.resetSession.bind(analyticsService),
    
    // Additional utility methods
    getDeviceInfo: analyticsService.getDeviceInfo.bind(analyticsService),
    getCachedLocation: analyticsService.getCachedLocation.bind(analyticsService),
    clearLocationCache: analyticsService.clearLocationCache.bind(analyticsService),
    
    // API client access
    apiClient,
    
    // Health status
    isApiHealthy: isHealthy,
  };
}; 