import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { userApi } from '@/src/pages/user/api';
import { useAuth } from '@/src/pages/auth/context/useAuthContext';

export const useAccountDeletion = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleDeleteAccount = async () => {
    if (isLoading) return;

    const confirmDelete = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );

    if (!confirmDelete) return;

    setIsLoading(true);

    try {
      if (user) {
        await userApi.delete(user.id);
        toast.success('Account deleted successfully');
      }
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleDeleteAccount
  };
};
