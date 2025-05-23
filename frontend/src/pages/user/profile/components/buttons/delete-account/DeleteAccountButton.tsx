import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/src/pages/auth/context/useAuthContext';
import { deleteUserAccount } from './api';

interface DeleteAccountButtonProps {
  className?: string;
  variant?: 'danger' | 'outlined';
}

export const DeleteAccountButton: React.FC<DeleteAccountButtonProps> = ({
  className = '',
  variant = 'danger'
}) => {
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
        await deleteUserAccount();
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

  const baseClasses =
    'rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50';
  const variantClasses = {
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    outlined: 'border border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500'
  };

  return (
    <button
      type="button"
      onClick={handleDeleteAccount}
      disabled={isLoading}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {isLoading ? 'Deleting...' : 'Delete Account'}
    </button>
  );
};

export default DeleteAccountButton;
