// Device Detection Utilities
export interface DeviceInfo {
  deviceType: 'mobile' | 'tablet' | 'desktop';
  browser: string;
  os: string;
  screenResolution: string;
  userAgent: string;
  language: string;
  timezone: string;
}

export class DeviceDetector {
  static getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const userAgent = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      return 'tablet';
    }
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
      return 'mobile';
    }
    return 'desktop';
  }

  static getBrowser(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('Opera')) return 'Opera';
    return 'Other';
  }

  static getOS(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Other';
  }

  static getScreenResolution(): string {
    return `${screen.width}x${screen.height}`;
  }

  static getLanguage(): string {
    return navigator.language;
  }

  static getTimezone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  static getUserAgent(): string {
    return navigator.userAgent;
  }

  static getDeviceInfo(): DeviceInfo {
    return {
      deviceType: this.getDeviceType(),
      browser: this.getBrowser(),
      os: this.getOS(),
      screenResolution: this.getScreenResolution(),
      userAgent: this.getUserAgent(),
      language: this.getLanguage(),
      timezone: this.getTimezone(),
    };
  }
} 