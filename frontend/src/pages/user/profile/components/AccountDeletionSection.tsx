import React from 'react';
import { AccountDeletionProps } from '../types';

export const AccountDeletionSection: React.FC<AccountDeletionProps> = ({
  _user,
  onDelete,
  isLoading
}) => {
  return (
    <div className="border-t border-slate-200 pt-6 dark:border-slate-600">
      <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-slate-200">Danger Zone</h2>
      <div className="rounded-md border border-red-200 bg-red-50 p-4">
        <h3 className="text-sm font-medium text-red-800">Delete Account</h3>
        <p className="mt-1 text-sm text-red-700">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button
          type="button"
          onClick={onDelete}
          disabled={isLoading}
          className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? 'Deleting...' : 'Delete Account'}
        </button>
      </div>
    </div>
  );
};
