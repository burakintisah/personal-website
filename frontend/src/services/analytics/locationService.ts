// Location Detection Service
export interface LocationData {
  country?: string;
  city?: string;
  ip?: string;
  region?: string;
  timezone?: string;
}

export class LocationService {
  private static cache: LocationData | null = null;
  private static cacheTimestamp: number = 0;
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static async getLocationData(): Promise<LocationData> {
    // Return cached data if still valid
    if (this.cache && (Date.now() - this.cacheTimestamp) < this.CACHE_DURATION) {
      return this.cache;
    }

    try {
      // Using a free IP geolocation service
      const response = await fetch('https://ipapi.co/json/', {
        timeout: 5000, // 5 second timeout
      } as RequestInit);
      
      if (response.ok) {
        const data = await response.json();
        
        const locationData: LocationData = {
          country: data.country_name,
          city: data.city,
          ip: data.ip,
          region: data.region,
          timezone: data.timezone,
        };

        // Cache the result
        this.cache = locationData;
        this.cacheTimestamp = Date.now();
        
        return locationData;
      }
    } catch (error) {
      console.warn('Failed to get location data:', error);
    }

    // Return cached data if available, even if expired
    if (this.cache) {
      return this.cache;
    }

    // Return empty object if no data available
    return {};
  }

  static clearCache(): void {
    this.cache = null;
    this.cacheTimestamp = 0;
  }

  static getCachedLocation(): LocationData | null {
    return this.cache;
  }

  static isCacheValid(): boolean {
    return this.cache !== null && (Date.now() - this.cacheTimestamp) < this.CACHE_DURATION;
  }
} 