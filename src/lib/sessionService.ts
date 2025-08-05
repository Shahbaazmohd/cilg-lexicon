// Session management for admin authentication
export interface AdminSession {
  id: string;
  email: string;
  name: string;
  role: string;
  token: string;
  expiresAt: number;
}

class SessionService {
  private readonly SESSION_KEY = 'adminSession';
  private readonly TOKEN_KEY = 'adminToken';
  private readonly EXPIRY_KEY = 'adminExpiry';

  // Create a new admin session
  createSession(sessionData: Omit<AdminSession, 'expiresAt'>): void {
    const expiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days from now
    const session: AdminSession = {
      ...sessionData,
      expiresAt
    };

    // Store in sessionStorage for current session
    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    
    // Store token and expiry in localStorage for persistence
    localStorage.setItem(this.TOKEN_KEY, sessionData.token);
    localStorage.setItem(this.EXPIRY_KEY, expiresAt.toString());
  }

  // Get current session
  getSession(): AdminSession | null {
    try {
      // First check sessionStorage
      const sessionData = sessionStorage.getItem(this.SESSION_KEY);
      if (sessionData) {
        const session: AdminSession = JSON.parse(sessionData);
        if (this.isSessionValid(session)) {
          return session;
        }
      }

      // If no sessionStorage, check localStorage for token
      const token = localStorage.getItem(this.TOKEN_KEY);
      const expiry = localStorage.getItem(this.EXPIRY_KEY);
      
      if (token && expiry) {
        const expiryTime = parseInt(expiry);
        if (Date.now() < expiryTime) {
          // Token is valid, create session from stored data
          const session: AdminSession = {
            id: 'admin',
            email: 'admin@cilg.com',
            name: 'Administrator',
            role: 'admin',
            token: token,
            expiresAt: expiryTime
          };
          
          // Restore session in sessionStorage
          sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
          return session;
        }
      }

      return null;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  // Check if session is valid
  isSessionValid(session: AdminSession): boolean {
    return Date.now() < session.expiresAt;
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    const session = this.getSession();
    return session !== null && this.isSessionValid(session);
  }

  // Get current user info
  getCurrentUser(): { id: string; email: string; name: string; role: string } | null {
    const session = this.getSession();
    if (session && this.isSessionValid(session)) {
      return {
        id: session.id,
        email: session.email,
        name: session.name,
        role: session.role
      };
    }
    return null;
  }

  // Clear session (logout)
  clearSession(): void {
    sessionStorage.removeItem(this.SESSION_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.EXPIRY_KEY);
  }

  // Refresh session (extend expiry)
  refreshSession(): void {
    const session = this.getSession();
    if (session) {
      const expiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days
      session.expiresAt = expiresAt;
      
      sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
      localStorage.setItem(this.EXPIRY_KEY, expiresAt.toString());
    }
  }

  // Auto-refresh session on activity
  setupAutoRefresh(): void {
    // Refresh session every hour if user is active
    setInterval(() => {
      if (this.isLoggedIn()) {
        this.refreshSession();
      }
    }, 60 * 60 * 1000); // 1 hour

    // Refresh session on user activity
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    const refreshOnActivity = () => {
      if (this.isLoggedIn()) {
        this.refreshSession();
      }
    };

    activityEvents.forEach(event => {
      document.addEventListener(event, refreshOnActivity, { passive: true });
    });
  }
}

// Create singleton instance
export const sessionService = new SessionService();

// Initialize auto-refresh
if (typeof window !== 'undefined') {
  sessionService.setupAutoRefresh();
} 