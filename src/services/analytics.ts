import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs, where, Timestamp, FieldValue } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface VisitorData {
  id?: string;
  timestamp: Timestamp | FieldValue;
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

class AnalyticsService {
  private sessionId: string;
  private isNewSession: boolean = true;

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
  }

  private getOrCreateSessionId(): string {
    const existingSessionId = sessionStorage.getItem('analytics_session_id');
    const sessionTimestamp = sessionStorage.getItem('analytics_session_timestamp');
    const now = Date.now();
    
    // Session expires after 30 minutes of inactivity
    if (existingSessionId && sessionTimestamp && (now - parseInt(sessionTimestamp)) < 30 * 60 * 1000) {
      this.isNewSession = false;
      sessionStorage.setItem('analytics_session_timestamp', now.toString());
      return existingSessionId;
    }
    
    const newSessionId = `session_${now}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', newSessionId);
    sessionStorage.setItem('analytics_session_timestamp', now.toString());
    this.isNewSession = true;
    return newSessionId;
  }

  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const userAgent = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      return 'tablet';
    }
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
      return 'mobile';
    }
    return 'desktop';
  }

  private getBrowser(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('Opera')) return 'Opera';
    return 'Other';
  }

  private getOS(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Other';
  }

  private async getLocationData(): Promise<{ country?: string; city?: string; ip?: string }> {
    try {
      // Using a free IP geolocation service
      const response = await fetch('https://ipapi.co/json/');
      if (response.ok) {
        const data = await response.json();
        return {
          country: data.country_name,
          city: data.city,
          ip: data.ip
        };
      }
    } catch (error) {
      console.warn('Failed to get location data:', error);
    }
    return {};
  }

  async trackPageView(page: string): Promise<void> {
    try {
      const locationData = await this.getLocationData();
      
      const visitorData: Omit<VisitorData, 'id'> = {
        timestamp: serverTimestamp(),
        page,
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        language: navigator.language,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        sessionId: this.sessionId,
        isNewSession: this.isNewSession,
        deviceType: this.getDeviceType(),
        browser: this.getBrowser(),
        os: this.getOS(),
        ...locationData
      };

      await addDoc(collection(db, 'analytics'), visitorData);
      
      // Reset new session flag after first page view
      this.isNewSession = false;
    } catch (error) {
      console.error('Failed to track page view:', error);
    }
  }

  async getAnalyticsStats(days: number = 30): Promise<AnalyticsStats> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const analyticsRef = collection(db, 'analytics');
      const q = query(
        analyticsRef,
        where('timestamp', '>=', startDate),
        orderBy('timestamp', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const visitors: VisitorData[] = [];
      
      querySnapshot.forEach((doc) => {
        visitors.push({ id: doc.id, ...doc.data() } as VisitorData);
      });

      // Calculate statistics
      const uniqueSessionIds = new Set(visitors.map(v => v.sessionId));
      const pageViews = visitors.length;
      const uniqueVisitors = uniqueSessionIds.size;

      // Top pages
      const pageCount = visitors.reduce((acc, visitor) => {
        acc[visitor.page] = (acc[visitor.page] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const topPages = Object.entries(pageCount)
        .map(([page, count]) => ({ page, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Top countries
      const countryCount = visitors.reduce((acc, visitor) => {
        if (visitor.country) {
          acc[visitor.country] = (acc[visitor.country] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);
      
      const topCountries = Object.entries(countryCount)
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Device types
      const deviceCount = visitors.reduce((acc, visitor) => {
        acc[visitor.deviceType] = (acc[visitor.deviceType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const deviceTypes = Object.entries(deviceCount)
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count);

      // Browsers
      const browserCount = visitors.reduce((acc, visitor) => {
        acc[visitor.browser] = (acc[visitor.browser] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const browsers = Object.entries(browserCount)
        .map(([browser, count]) => ({ browser, count }))
        .sort((a, b) => b.count - a.count);

      return {
        totalVisitors: pageViews,
        uniqueVisitors,
        pageViews,
        topPages,
        topCountries,
        deviceTypes,
        browsers,
        recentVisitors: visitors.slice(0, 50)
      };
    } catch (error) {
      console.error('Failed to get analytics stats:', error);
      return {
        totalVisitors: 0,
        uniqueVisitors: 0,
        pageViews: 0,
        topPages: [],
        topCountries: [],
        deviceTypes: [],
        browsers: [],
        recentVisitors: []
      };
    }
  }
}

export const analyticsService = new AnalyticsService(); 