import { useAuth } from '@/src/pages/auth/context/useAuthContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/src/components/ui/dialog';
import { useTheme } from '@/src/context/theme/useTheme';
import { X } from 'lucide-react';

export default function SignOut() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showModal, setShowModal] = useState(true); // show the modal initially
  const [isLoading, setIsLoading] = useState(false);

  const { isDarkMode } = useTheme();
  const bgColor = isDarkMode ? 'bg-black-100 text-white' : 'bg-white text-black';
  const handleConfirm = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      await logout();
      toast.success('You have been signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('There was a problem signing you out');
    } finally {
      navigate('/auth/sign-in', { replace: true });
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Optional: navigate back to home or dashboard
    navigate(-1); // go back to the previous page
    setShowModal(false);
  };

  return (
    <Dialog open={showModal} onOpenChange={handleCancel}>
      <DialogContent className={`${bgColor} max-w-md rounded-xl p-6 shadow-lg backdrop-blur-lg`}>
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Confirm Sign Out
              </h3>
              <button
                type="button"
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </DialogTitle>
        </DialogHeader>
        <p className="text-gray-600 dark:text-gray-300">Are you sure you want to sign out?</p>
        <div className="mt-4 flex justify-end gap-4">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            {isLoading ? 'Sign Out...' : 'Confirm'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
