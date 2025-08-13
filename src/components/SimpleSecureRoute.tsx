import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { simpleAuthService, type SimpleAuthState } from '@/lib/simpleAuthService';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Lock, UserCheck } from 'lucide-react';

interface SimpleSecureRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  fallback?: React.ReactNode;
}

const SimpleSecureRoute: React.FC<SimpleSecureRouteProps> = ({ 
  children, 
  requireAdmin = false,
  fallback 
}) => {
  const [authState, setAuthState] = useState<SimpleAuthState>({
    isAuthenticated: false,
    isAdmin: false,
    user: null
  });
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      try {
        const isAuthenticated = simpleAuthService.isAuthenticated();
        const isAdmin = simpleAuthService.isAdmin();
        const user = simpleAuthService.getAuthState().user;

        const newAuthState: SimpleAuthState = {
          isAuthenticated,
          isAdmin,
          user
        };

        setAuthState(newAuthState);

        // Check authorization
        if (!isAuthenticated) {
          setLoading(false);
          navigate('/admin/login');
          return;
        }

        if (requireAdmin && !isAdmin) {
          setLoading(false);
          navigate('/admin/login');
          return;
        }

        setIsAuthorized(true);
        setLoading(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        setLoading(false);
        navigate('/admin/login');
      }
    };

    // Initial check
    checkAuth();

    // Set up interval to check auth status (every 30 seconds)
    const authCheckInterval = setInterval(checkAuth, 30000);

    return () => {
      clearInterval(authCheckInterval);
    };
  }, [navigate, requireAdmin]);

  // Loading state
  if (loading) {
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
                  : 'Authentication is required to access this page.'
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

export default SimpleSecureRoute;
