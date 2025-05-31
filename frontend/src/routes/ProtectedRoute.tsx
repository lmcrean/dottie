import { useAuth } from '@/src/pages/auth/context/useAuthContext';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save the intended destination for redirect after login
    const redirectTo = location.pathname + location.search;
    return <Navigate to="/auth/sign-in" state={{ from: redirectTo }} replace />;
  }

  return <Outlet />;
}
