import { supabase } from '@/integrations/supabase/client';
import { adminSupabase } from '@/integrations/supabase/adminClient';
import type { User, Session } from '@supabase/supabase-js';

export interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
}

export interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  role: 'admin' | 'moderator';
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_sign_in: string | null;
}

class AuthService {
  private currentUser: User | null = null;
  private currentSession: Session | null = null;
  private authStateChangeListener: ((state: AuthState) => void) | null = null;
  private isInitialized = false;

  constructor() {
    this.initializeAuth();
  }

  // Initialize authentication and set up listeners
  private async initializeAuth() {
    if (this.isInitialized) return;
    
    try {
      // Get initial session from Supabase
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (session) {
        this.currentSession = session;
        this.currentUser = session.user;
        this.notifyAuthStateChange();
      }

      // Listen for auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          this.currentSession = session;
          this.currentUser = session?.user || null;
          this.notifyAuthStateChange();

          if (event === 'SIGNED_IN' && session) {
            // Verify admin role when user signs in
            await this.verifyAdminRole(session.user);
          }
        }
      );

      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing auth:', error);
    }
  }

  // Set up auth state change listener
  onAuthStateChange(callback: (state: AuthState) => void) {
    this.authStateChangeListener = callback;
    // Immediately call with current state
    if (this.isInitialized) {
      callback(this.getAuthState());
    }
  }

  // Remove auth state change listener
  removeAuthStateChangeListener() {
    this.authStateChangeListener = null;
  }

  // Notify listeners of auth state change
  private notifyAuthStateChange() {
    if (this.authStateChangeListener) {
      this.authStateChangeListener(this.getAuthState());
    }
  }

  // Get current auth state
  getAuthState(): AuthState {
    return {
      user: this.currentUser,
      session: this.currentSession,
      isAuthenticated: !!this.currentUser,
      isAdmin: false, // Will be updated after role verification
      isLoading: !this.isInitialized
    };
  }

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user && data.session) {
        // Set the current user and session first
        this.currentUser = data.user;
        this.currentSession = data.session;
        
        // Notify auth state change
        this.notifyAuthStateChange();
        
        // Now verify admin role (user is authenticated)
        const isAdmin = await this.verifyAdminRole(data.user);
        if (!isAdmin) {
          // Sign out non-admin users
          await this.signOut();
          return { 
            success: false, 
            error: 'Access denied. Admin privileges required. Please contact an administrator.' 
          };
        }
        
        return { success: true };
      }

      return { success: false, error: 'Authentication failed' };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'An unexpected error occurred during sign in' };
    }
  }

  // Sign out user
  async signOut(): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return { success: false, error: error.message };
      }

      this.currentUser = null;
      this.currentSession = null;
      this.notifyAuthStateChange();
      
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }

  // Verify admin role by checking admin_users table
  private async verifyAdminRole(user: User): Promise<boolean> {
    try {
      console.log('Verifying admin role for user:', user.email);
      
      // First, try to get the admin user record
      const { data, error } = await supabase
        .from('admin_users')
        .select('role, is_active')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.log('Admin verification error:', error.message);
        
        // If it's a policy violation or permission issue, try alternative approach
        if (error.message.includes('policy') || 
            error.message.includes('permission') || 
            error.message.includes('RLS') ||
            error.message.includes('row-level security')) {
          
          console.log('RLS policy issue detected, trying alternative verification...');
          
          // Try using maybeSingle() instead of single() for more lenient querying
          const { data: adminData, error: adminError } = await supabase
            .from('admin_users')
            .select('role, is_active')
            .eq('user_id', user.id)
            .maybeSingle();
          
          if (adminError) {
            console.log('Alternative verification also failed:', adminError.message);
            return false;
          }
          
          if (adminData) {
            const isAdmin = adminData.is_active && (adminData.role === 'admin' || adminData.role === 'moderator');
            console.log('Admin verification successful via alternative method:', isAdmin);
            if (isAdmin) {
              this.notifyAuthStateChange();
            }
            return isAdmin;
          }
        }
        
        return false;
      }

      if (!data) {
        console.log('No admin record found for user:', user.id);
        return false;
      }

      const isAdmin = data.is_active && (data.role === 'admin' || data.role === 'moderator');
      console.log('Admin verification successful:', isAdmin, 'Role:', data.role, 'Active:', data.is_active);
      
      // Update auth state with admin status
      if (isAdmin) {
        this.notifyAuthStateChange();
      }
      
      return isAdmin;
    } catch (error) {
      console.error('Error verifying admin role:', error);
      return false;
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.currentUser && !!this.currentSession;
  }

  // Check if user is admin
  async isAdmin(): Promise<boolean> {
    if (!this.currentUser) return false;
    return await this.verifyAdminRole(this.currentUser);
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Get current session
  getCurrentSession(): Session | null {
    return this.currentSession;
  }

  // Get admin user details
  async getAdminUserDetails(): Promise<AdminUser | null> {
    if (!this.currentUser) return null;
    
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', this.currentUser.id)
        .single();

      if (error || !data) {
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error getting admin user details:', error);
      return null;
    }
  }

  // Update admin user last sign in
  async updateLastSignIn(): Promise<void> {
    if (!this.currentUser) return;
    
    try {
      await supabase
        .from('admin_users')
        .update({ last_sign_in: new Date().toISOString() })
        .eq('user_id', this.currentUser.id);
    } catch (error) {
      console.error('Error updating last sign in:', error);
    }
  }

  // Refresh session
  async refreshSession(): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        return { success: false, error: error.message };
      }

      if (data.session) {
        this.currentSession = data.session;
        this.currentUser = data.session.user;
        this.notifyAuthStateChange();
        return { success: true };
      }

      return { success: false, error: 'No session to refresh' };
    } catch (error) {
      console.error('Session refresh error:', error);
      return { success: false, error: 'Failed to refresh session' };
    }
  }

  // Reset password
  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, error: 'Failed to send password reset email' };
    }
  }

  // Update password
  async updatePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Password update error:', error);
      return { success: false, error: 'Failed to update password' };
    }
  }
}

// Create singleton instance
export const authService = new AuthService();

// Export types for use in other components
export type { AuthState, AdminUser };
