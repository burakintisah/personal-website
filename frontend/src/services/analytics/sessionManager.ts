// Session Management Utilities
export interface SessionInfo {
  sessionId: string;
  isNewSession: boolean;
  sessionStartTime: number;
  lastActivity: number;
}

export class SessionManager {
  private static readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  private static readonly SESSION_ID_KEY = 'analytics_session_id';
  private static readonly SESSION_TIMESTAMP_KEY = 'analytics_session_timestamp';

  private sessionId: string;
  private isNewSession: boolean = true;

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
  }

  private getOrCreateSessionId(): string {
    const existingSessionId = sessionStorage.getItem(SessionManager.SESSION_ID_KEY);
    const sessionTimestamp = sessionStorage.getItem(SessionManager.SESSION_TIMESTAMP_KEY);
    const now = Date.now();
    
    // Session expires after 30 minutes of inactivity
    if (existingSessionId && sessionTimestamp && (now - parseInt(sessionTimestamp)) < SessionManager.SESSION_TIMEOUT) {
      this.isNewSession = false;
      this.updateSessionTimestamp();
      return existingSessionId;
    }
    
    const newSessionId = `session_${now}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem(SessionManager.SESSION_ID_KEY, newSessionId);
    sessionStorage.setItem(SessionManager.SESSION_TIMESTAMP_KEY, now.toString());
    this.isNewSession = true;
    return newSessionId;
  }

  private updateSessionTimestamp(): void {
    sessionStorage.setItem(SessionManager.SESSION_TIMESTAMP_KEY, Date.now().toString());
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public isNewSessionFlag(): boolean {
    return this.isNewSession;
  }

  public markSessionAsUsed(): void {
    this.isNewSession = false;
    this.updateSessionTimestamp();
  }

  public getSessionInfo(): SessionInfo {
    const sessionTimestamp = sessionStorage.getItem(SessionManager.SESSION_TIMESTAMP_KEY);
    const startTime = parseInt(sessionTimestamp || '0');
    
    return {
      sessionId: this.sessionId,
      isNewSession: this.isNewSession,
      sessionStartTime: startTime,
      lastActivity: Date.now(),
    };
  }

  public resetSession(): void {
    sessionStorage.removeItem(SessionManager.SESSION_ID_KEY);
    sessionStorage.removeItem(SessionManager.SESSION_TIMESTAMP_KEY);
    this.sessionId = this.getOrCreateSessionId();
  }

  public static clearAllSessions(): void {
    sessionStorage.removeItem(SessionManager.SESSION_ID_KEY);
    sessionStorage.removeItem(SessionManager.SESSION_TIMESTAMP_KEY);
  }
} 