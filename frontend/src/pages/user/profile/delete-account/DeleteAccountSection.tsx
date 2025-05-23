import React from 'react';
import { DeleteAccountButton } from './DeleteAccountButton';

interface DeleteAccountSectionProps {
  className?: string;
}

export const DeleteAccountSection: React.FC<DeleteAccountSectionProps> = ({ className = '' }) => {
  return (
    <div className={`border-t border-slate-200 pt-6 dark:border-slate-600 ${className}`}>
      <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-slate-200">Danger Zone</h2>
      <div className="rounded-md border border-red-200 bg-red-50 p-4">
        <h3 className="text-sm font-medium text-red-800">Delete Account</h3>
        <p className="mt-1 text-sm text-red-700">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <div className="mt-4">
          <DeleteAccountButton />
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountSection;
