import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analyticsService } from '../services/analytics';

export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view when location changes, but exclude analytics page
    const trackPageView = async () => {
      const page = location.pathname + location.search;
      
      // Don't track the analytics page itself
      if (location.pathname === '/analytics') {
        return;
      }
      
      await analyticsService.trackPageView(page);
    };

    trackPageView();
  }, [location]);

  return {
    trackPageView: analyticsService.trackPageView.bind(analyticsService),
    getAnalyticsStats: analyticsService.getAnalyticsStats.bind(analyticsService)
  };
}; 