import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

export default function PasswordForm() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: typeof formData) => ({ ...prev, [name]: value }));

    // Clear errors when typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev: typeof errors) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const newErrors: {
      currentPassword?: string;
      newPassword?: string;
      confirmPassword?: string;
    } = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);

    try {
      await axios.post('/api/user/pw/update', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      toast.success('Password updated successfully');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error updating password:', error.response);

        if (error.response?.status === 401) {
          setErrors({ currentPassword: 'Current password is incorrect' });
          toast.error('Current password is incorrect');
        } else {
          toast.error('Failed to update password');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="currentPassword" className="block text-sm font-medium">
          Current Password
        </label>
        <input
          type="password"
          id="currentPassword"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleChange}
          className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring ${
            errors.currentPassword ? 'border-destructive' : ''
          }`}
        />
        {errors.currentPassword && (
          <p className="text-sm text-destructive">{errors.currentPassword}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="newPassword" className="block text-sm font-medium">
          New Password
        </label>
        <input
          type="password"
          id="newPassword"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring ${
            errors.newPassword ? 'border-destructive' : ''
          }`}
        />
        {errors.newPassword && <p className="text-sm text-destructive">{errors.newPassword}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="block text-sm font-medium">
          Confirm New Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring ${
            errors.confirmPassword ? 'border-destructive' : ''
          }`}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">{errors.confirmPassword}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-md px-4 py-2 font-medium text-white focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50"
      >
        {isLoading ? 'Updating...' : 'Change Password'}
      </button>
    </form>
  );
}
