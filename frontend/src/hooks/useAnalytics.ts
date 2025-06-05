import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analyticsService } from '../services/analytics';

export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Only track page view for the home page to reduce Firestore usage
    const trackPageView = async () => {
      // Only track the home page
      if (location.pathname === '/') {
        const page = location.pathname + location.search;
        await analyticsService.trackPageView(page);
      }
    };

    trackPageView();
  }, [location]);

  return {
    trackPageView: analyticsService.trackPageView.bind(analyticsService),
    getAnalyticsStats: analyticsService.getAnalyticsStats.bind(analyticsService)
  };
}; 