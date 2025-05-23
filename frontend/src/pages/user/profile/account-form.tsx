// import { User } from '@/src/api/auth/types';
import React from 'react';
import { useAuth } from '@/src/pages/auth/context/useAuthContext';
import { useAccountForm } from './hooks/useAccountForm';
import { AccountUpdateForm } from './components/AccountUpdateForm';
import { DeleteAccountSection } from './components/buttons/delete-account';
import { AccountFormData } from './types';

export default function AccountForm() {
  const { user } = useAuth();

  const initialFormData: AccountFormData = {
    name: user?.name || '',
    email: user?.email || ''
  };

  const accountForm = useAccountForm(initialFormData);

  return (
    <div className="space-y-8">
      <AccountUpdateForm
        _user={user}
        formData={accountForm.formData}
        isLoading={accountForm.isLoading}
        onChange={accountForm.handleChange}
        onSubmit={accountForm.handleSubmit}
      />

      <DeleteAccountSection />
    </div>
  );
}
