// Simple frontend-only authentication service
// This bypasses Supabase Auth issues and provides immediate admin access

export interface SimpleAuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: {
    email: string;
    role: string;
  } | null;
  expiresAt?: number; // Unix timestamp in milliseconds
  createdAt?: number; // Unix timestamp in milliseconds
}

class SimpleAuthService {
  private readonly ADMIN_EMAIL = 'usllscilg@gmail.com';
  private readonly ADMIN_PASSWORD = 'NewPassword123!';
  private readonly STORAGE_KEY = 'simple_admin_auth';
  // Session expires after 8 hours (configurable)
  private readonly SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours in milliseconds

  // Check if auth is expired
  isAuthExpired(): boolean {
    const authData = this.getStoredAuth();
    if (!authData || !authData.expiresAt) {
      return true; // No expiration time means expired/invalid
    }
    
    const now = Date.now();
    const isExpired = now >= authData.expiresAt;
    
    // Auto-clear expired sessions
    if (isExpired) {
      this.clearAuth();
    }
    
    return isExpired;
  }

  // Check if user is authenticated (also checks expiration)
  isAuthenticated(): boolean {
    if (this.isAuthExpired()) {
      return false;
    }
    const authData = this.getStoredAuth();
    return authData?.isAuthenticated || false;
  }

  // Check if user is admin (also checks expiration)
  isAdmin(): boolean {
    if (this.isAuthExpired()) {
      return false;
    }
    const authData = this.getStoredAuth();
    return authData?.isAdmin || false;
  }

  // Get current auth state (also checks expiration)
  getAuthState(): SimpleAuthState {
    if (this.isAuthExpired()) {
      return {
        isAuthenticated: false,
        isAdmin: false,
        user: null
      };
    }
    
    const authData = this.getStoredAuth();
    return {
      isAuthenticated: authData?.isAuthenticated || false,
      isAdmin: authData?.isAdmin || false,
      user: authData?.user || null,
      expiresAt: authData?.expiresAt,
      createdAt: authData?.createdAt
    };
  }

  // Get time remaining until session expires (in milliseconds)
  getTimeRemaining(): number {
    const authData = this.getStoredAuth();
    if (!authData || !authData.expiresAt) {
      return 0;
    }
    
    const now = Date.now();
    const remaining = authData.expiresAt - now;
    return Math.max(0, remaining);
  }

  // Get formatted time remaining (e.g., "2h 30m")
  getFormattedTimeRemaining(): string {
    const remaining = this.getTimeRemaining();
    if (remaining === 0) {
      return 'Expired';
    }
    
    const hours = Math.floor(remaining / (60 * 60 * 1000));
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  // Sign in with credentials
  async signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Simple credential check
      if (email === this.ADMIN_EMAIL && password === this.ADMIN_PASSWORD) {
        const now = Date.now();
        const expiresAt = now + this.SESSION_DURATION_MS;
        
        const authData: SimpleAuthState = {
          isAuthenticated: true,
          isAdmin: true,
          user: {
            email: email,
            role: 'admin'
          },
          createdAt: now,
          expiresAt: expiresAt
        };

        // Store in localStorage
        this.storeAuth(authData);

        return { success: true };
      } else {
        return { 
          success: false, 
          error: 'Invalid email or password' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Authentication failed' 
      };
    }
  }

  // Extend session expiration (refresh session)
  extendSession(): boolean {
    const authData = this.getStoredAuth();
    if (!authData || !authData.isAuthenticated || this.isAuthExpired()) {
      return false;
    }

    const now = Date.now();
    const expiresAt = now + this.SESSION_DURATION_MS;

    const updatedAuthData: SimpleAuthState = {
      ...authData,
      expiresAt: expiresAt
    };

    this.storeAuth(updatedAuthData);
    return true;
  }

  // Sign out
  signOut(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Get stored authentication data
  private getStoredAuth(): SimpleAuthState | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  // Store authentication data
  private storeAuth(authData: SimpleAuthState): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(authData));
    } catch (error) {
      console.error('Failed to store auth data:', error);
    }
  }

  // Clear stored authentication
  clearAuth(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

// Export singleton instance
export const simpleAuthService = new SimpleAuthService();
