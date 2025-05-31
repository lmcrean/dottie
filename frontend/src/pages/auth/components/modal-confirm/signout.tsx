import { useAuth } from '@/src/pages/auth/context/useAuthContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function SignOut() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showModal, setShowModal] = useState(true); // show the modal initially

  const handleConfirm = async () => {
    try {
      await logout();
      toast.success('You have been signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('There was a problem signing you out');
    } finally {
      navigate('/auth/sign-in', { replace: true });
    }
  };

  const handleCancel = () => {
    // Optional: navigate back to home or dashboard
    navigate(-1); // go back to the previous page
    setShowModal(false);
  };

  return (
    <div className="flex h-screen items-center justify-center">
      {showModal && (
        <div className="w-full max-w-md rounded-lg border bg-white p-6 text-center shadow-lg dark:border-slate-800 dark:bg-gray-900">
          <h2 className="mb-4 text-xl font-semibold">Are you sure you want to sign out?</h2>
          <div className="mt-6 flex justify-center gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
