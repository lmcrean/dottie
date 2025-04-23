import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/src/context/AuthContext';

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
  };

  return (
    <div className="flex justify-center items-center h-screen">
      {showModal && (
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full text-center border dark:bg-gray-900 dark:border-slate-800">
          <h2 className="text-xl font-semibold mb-4">Are you sure you want to sign out?</h2>
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
