import React, { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/src/pages/auth/context/useAuthContext';
import { updateUsername } from './api';

interface UpdateUsernameButtonProps {
  className?: string;
  variant?: 'primary' | 'outlined';
}

export const UpdateUsernameButton: React.FC<UpdateUsernameButtonProps> = ({
  className = '',
  variant = 'primary'
}) => {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter a valid name');
      return;
    }

    if (name === user?.name) {
      toast.info('No changes to save');
      return;
    }

    setIsLoading(true);

    try {
      await updateUsername(name.trim());
      await refreshUser(); // Refresh user data in auth context
      toast.success('Username updated successfully');
    } catch (error) {
      console.error('Error updating username:', error);
      toast.error('Failed to update username');
      // Reset to original value on error
      setName(user?.name || '');
    } finally {
      setIsLoading(false);
    }
  };

  const baseClasses =
    'rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50';
  const variantClasses = {
    primary: 'bg-pink-600 text-white hover:bg-pink-700 focus:ring-pink-500',
    outlined: 'border border-pink-600 text-pink-600 hover:bg-pink-50 focus:ring-pink-500'
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        id="username"
        name="username"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1 rounded-md border px-3 py-2 text-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:border-slate-600 dark:bg-gray-900 dark:text-slate-200"
        placeholder="Enter your full name"
      />
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isLoading || name === user?.name}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      >
        {isLoading ? 'Updating...' : 'Update Name'}
      </button>
    </div>
  );
};

export default UpdateUsernameButton;
