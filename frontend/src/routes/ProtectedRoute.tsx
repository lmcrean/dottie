import { useAuth } from '@/src/context/auth/useAuthContext';
import { Navigate, Outlet } from 'react-router-dom';

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  return <Outlet />;
}
