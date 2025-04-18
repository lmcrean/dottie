import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/src/context/AuthContext';

export default function SignOut() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const hasRun = useRef(false);

  useEffect(() => {
    const performSignOut = async () => {
      if (hasRun.current) return;
      hasRun.current = true;
      try {
        // Call the sign-out endpoint
        await logout();
        toast.success('You have been signed out successfully');
      } catch (error) {
        console.error('Error signing out:', error);
        toast.error('There was a problem signing you out');
      } finally {
        // Redirect to the sign-in page regardless of outcome
        navigate('/auth/sign-in', { replace: true });
      }
    };

    performSignOut();
  }, [navigate, logout]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Signing out...</h1>
        <p className="text-gray-600">Please wait while we sign you out.</p>
      </div>
    </div>
  );
} 