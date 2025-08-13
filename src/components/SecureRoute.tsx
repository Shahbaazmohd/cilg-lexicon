import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, type AuthState } from '@/lib/authService';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Lock, UserCheck } from 'lucide-react';

interface SecureRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireModerator?: boolean;
  fallback?: React.ReactNode;
}

const SecureRoute: React.FC<SecureRouteProps> = ({ 
  children, 
  requireAdmin = false, 
  requireModerator = false,
  fallback 
}) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isAuthenticated: false,
    isAdmin: false,
    isLoading: true
  });
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state change listener
    const handleAuthStateChange = (state: AuthState) => {
      setAuthState(state);
      
      if (!state.isLoading) {
        checkAuthorization(state);
      }
    };

    authService.onAuthStateChange(handleAuthStateChange);

    // Initial check
    const checkAuth = async () => {
      try {
        const authenticated = authService.isAuthenticated();
        
        if (authenticated) {
          const adminStatus = await authService.isAdmin();
          const state = authService.getAuthState();
          state.isAdmin = adminStatus;
          setAuthState(state);
          checkAuthorization(state);
        } else {
          setLoading(false);
          navigate('/admin/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setLoading(false);
        navigate('/admin/login');
      }
    };

    checkAuth();

    return () => {
      authService.removeAuthStateChangeListener();
    };
  }, [navigate]);

  const checkAuthorization = async (state: AuthState) => {
    try {
      if (!state.isAuthenticated) {
        setLoading(false);
        navigate('/admin/login');
        return;
      }

      if (requireAdmin || requireModerator) {
        const adminStatus = await authService.isAdmin();
        
        if (!adminStatus) {
          setLoading(false);
          navigate('/admin/login');
          return;
        }

        if (requireAdmin) {
          const adminDetails = await authService.getAdminUserDetails();
          if (adminDetails?.role !== 'admin') {
            setLoading(false);
            navigate('/admin/login');
            return;
          }
        }
      }

      setIsAuthorized(true);
      setLoading(false);
    } catch (error) {
      console.error('Authorization check failed:', error);
      setLoading(false);
      navigate('/admin/login');
    }
  };

  // Loading state
  if (loading || authState.isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <CardTitle>Verifying Access</CardTitle>
            <CardDescription>
              Please wait while we verify your credentials...
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Unauthorized state
  if (!isAuthorized) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-destructive rounded-lg flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-destructive-foreground" />
            </div>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access this page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertDescription>
                {requireAdmin 
                  ? 'Administrator privileges are required to access this page.'
                  : 'Moderator or Administrator privileges are required to access this page.'
                }
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Authorized state - render children
  return (
    <div className="admin-protected-content">
      {children}
    </div>
  );
};

export default SecureRoute;
