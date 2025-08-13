// Simple frontend-only authentication service
// This bypasses Supabase Auth issues and provides immediate admin access

export interface SimpleAuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: {
    email: string;
    role: string;
  } | null;
}

class SimpleAuthService {
  private readonly ADMIN_EMAIL = 'usllscilg@gmail.com';
  private readonly ADMIN_PASSWORD = 'NewPassword123!';
  private readonly STORAGE_KEY = 'simple_admin_auth';

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const authData = this.getStoredAuth();
    return authData?.isAuthenticated || false;
  }

  // Check if user is admin
  isAdmin(): boolean {
    const authData = this.getStoredAuth();
    return authData?.isAdmin || false;
  }

  // Get current auth state
  getAuthState(): SimpleAuthState {
    const authData = this.getStoredAuth();
    return {
      isAuthenticated: authData?.isAuthenticated || false,
      isAdmin: authData?.isAdmin || false,
      user: authData?.user || null
    };
  }

  // Sign in with credentials
  async signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Simple credential check
      if (email === this.ADMIN_EMAIL && password === this.ADMIN_PASSWORD) {
        const authData: SimpleAuthState = {
          isAuthenticated: true,
          isAdmin: true,
          user: {
            email: email,
            role: 'admin'
          }
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

  // Check if auth is expired (optional - you can set expiration time)
  isAuthExpired(): boolean {
    // For now, auth doesn't expire
    // You can add expiration logic here if needed
    return false;
  }
}

// Export singleton instance
export const simpleAuthService = new SimpleAuthService();
