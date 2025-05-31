import React, { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/src/pages/auth/context/useAuthContext';
import { updateEmail } from './api';

interface UpdateEmailButtonProps {
  className?: string;
  variant?: 'primary' | 'outlined';
}

export const UpdateEmailButton: React.FC<UpdateEmailButtonProps> = ({
  className = '',
  variant = 'primary'
}) => {
  const { user, refreshUser } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [isLoading, setIsLoading] = useState(false);

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email format');
      return;
    }

    if (email === user?.email) {
      toast.info('No changes to save');
      return;
    }

    setIsLoading(true);

    try {
      await updateEmail(email.trim());
      await refreshUser(); // Refresh user data in auth context
      toast.success('Email updated successfully');
    } catch (error) {
      console.error('Error updating email:', error);
      toast.error('Failed to update email');
      // Reset to original value on error
      setEmail(user?.email || '');
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

  const isEmailValid = isValidEmail(email);
  const hasChanges = email !== user?.email;
  const canUpdate = isEmailValid && hasChanges && !isLoading;

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`flex-1 rounded-md border px-3 py-2 text-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:border-slate-600 dark:bg-gray-900 dark:text-slate-200 ${
            email && !isEmailValid ? 'border-red-500 focus:ring-red-500' : ''
          }`}
          placeholder="Enter your email address"
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canUpdate}
          className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        >
          {isLoading ? 'Updating...' : 'Update Email'}
        </button>
      </div>
      {email && !isEmailValid && (
        <p className="mt-1 text-sm text-red-500">Please enter a valid email address</p>
      )}
    </div>
  );
};

export default UpdateEmailButton;
