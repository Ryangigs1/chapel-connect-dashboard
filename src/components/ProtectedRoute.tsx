
import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { decryptToken } from '@/utils/encryption';

interface ProtectedRouteProps {
  children: React.ReactNode;
  isAdmin?: boolean;
}

const ProtectedRoute = ({ children, isAdmin = false }: ProtectedRouteProps) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // If still loading, show a loading spinner with animation
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-muted-foreground animate-pulse">Loading...</p>
          <div className="fixed bottom-4 right-4 text-sm text-muted-foreground/60 font-medium">
            Faratech.inc
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to sign-in with the current location so we can redirect back
  if (!isAuthenticated) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  // For admin routes, check if user has admin role
  if (isAdmin && user?.role !== 'admin') {
    // User is authenticated but not an admin
    return <Navigate to="/" replace />;
  }

  // If authenticated and passes admin check (if applicable), render the children
  return <>{children}</>;
};

export default ProtectedRoute;
