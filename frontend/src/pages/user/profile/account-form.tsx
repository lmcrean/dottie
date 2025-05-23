// import { User } from '@/src/api/auth/types';
import React from 'react';
import { useAuth } from '@/src/pages/auth/context/useAuthContext';
import { useAccountForm } from './hooks/useAccountForm';
import { useAccountDeletion } from './hooks/useAccountDeletion';
import { AccountUpdateForm } from './components/AccountUpdateForm';
import { AccountDeletionSection } from './components/AccountDeletionSection';
import { AccountFormData } from './types';

export default function AccountForm() {
  const { user } = useAuth();

  const initialFormData: AccountFormData = {
    name: user?.name || '',
    email: user?.email || ''
  };

  const accountForm = useAccountForm(initialFormData);
  const accountDeletion = useAccountDeletion();

  return (
    <div className="space-y-8">
      <AccountUpdateForm
        _user={user}
        formData={accountForm.formData}
        isLoading={accountForm.isLoading}
        onChange={accountForm.handleChange}
        onSubmit={accountForm.handleSubmit}
      />

      <AccountDeletionSection
        _user={user}
        onDelete={accountDeletion.handleDeleteAccount}
        isLoading={accountDeletion.isLoading}
      />
    </div>
  );
}
