import React from 'react';
import { UserProfile } from '@/src/api/user/types';

interface AccountUpdateFormProps {
  _user: UserProfile | null;
  formData: { name: string; email: string };
  isLoading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const AccountUpdateForm: React.FC<AccountUpdateFormProps> = ({
  _user,
  formData,
  isLoading,
  onChange,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-md block font-medium dark:text-slate-200">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={onChange}
          className="w-full rounded-md border px-3 py-2 text-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:border-slate-600 dark:bg-gray-900 dark:text-slate-200 md:w-3/4 lg:w-1/2"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-md block font-medium dark:text-slate-200">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          className="w-full rounded-md border px-3 py-2 text-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:border-slate-600 dark:bg-gray-900 dark:text-slate-200 md:w-3/4 lg:w-1/2"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-pink-600 px-4 py-2 text-white hover:bg-pink-700 disabled:opacity-50 md:w-1/2 lg:w-auto"
      >
        {isLoading ? 'Updating...' : 'Update Account'}
      </button>
    </form>
  );
};
