// import { User } from '@/src/api/auth/types';
import React from 'react';
import { useAuth } from '@/src/pages/auth/context/useAuthContext';
import { UpdateUsernameButton } from './components/buttons/update-username';
import { UpdateEmailButton } from './components/buttons/update-email';
import { DeleteAccountSection } from './delete-account/DeleteAccountSection';

export default function AccountForm() {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div>
          <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-slate-200">
            Profile Information
          </h3>
          <div className="space-y-4">
            <UpdateUsernameButton />
            <UpdateEmailButton />
          </div>
        </div>
      </div>

      <DeleteAccountSection />
    </div>
  );
}
