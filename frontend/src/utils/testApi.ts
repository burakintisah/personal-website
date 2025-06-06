// Test utility for API connectivity
import { apiClient } from '../services/api/client';
import { analyticsService } from '../services/analyticsService';

export const testApiConnectivity = async () => {
  console.log('🔍 Testing API connectivity...');
  
  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await apiClient.healthCheck();
    console.log('✅ Health check:', healthResponse);
    
    // Test analytics service health
    console.log('2. Testing analytics service health...');
    const serviceHealth = await analyticsService.checkApiHealth();
    console.log('✅ Analytics service health:', serviceHealth);
    
    // Test getting analytics stats
    console.log('3. Testing analytics stats...');
    const stats = await analyticsService.getAnalyticsStats(7);
    console.log('✅ Analytics stats:', {
      totalVisitors: stats.totalVisitors,
      uniqueVisitors: stats.uniqueVisitors,
      topCountries: stats.topCountries.length,
      deviceTypes: stats.deviceTypes.length
    });
    
    // Test device detection
    console.log('4. Testing device detection...');
    const deviceInfo = analyticsService.getDeviceInfo();
    console.log('✅ Device info:', deviceInfo);
    
    // Test session management
    console.log('5. Testing session management...');
    const sessionId = analyticsService.getSessionId();
    const isNewSession = analyticsService.isNewSession();
    console.log('✅ Session info:', { sessionId, isNewSession });
    
    // Test location service
    console.log('6. Testing location service...');
    const cachedLocation = analyticsService.getCachedLocation();
    console.log('✅ Cached location:', cachedLocation);
    
    // Test tracking (optional - only if you want to create test data)
    console.log('7. Testing analytics tracking...');
    await analyticsService.trackPageView('/test-api-connectivity');
    console.log('✅ Analytics tracking completed');
    
    console.log('🎉 All API tests passed!');
    return true;
    
  } catch (error) {
    console.error('❌ API test failed:', error);
    return false;
  }
};

// Helper to test in browser console
(window as any).testApi = testApiConnectivity; 