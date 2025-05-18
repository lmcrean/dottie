import React from 'react';
import { PasswordForm } from './PasswordUpdateForm';
import AccountLayout from '../profile/account-layout';

export default function PasswordPage() {
  return (
    <AccountLayout
      title="Profile Settings"
      description="Manage your account details and preferences."
    >
      <div className="container mx-auto py-8">
        <div className="mx-auto max-w-md">
          <h1 className="mb-2 text-2xl font-bold">Change Password</h1>
          <p className="mb-6 text-gray-600">Update your password to keep your account secure.</p>
          <PasswordForm />
          <div className="mt-8 rounded-md border border-gray-200 bg-gray-50 p-4">
            <h3 className="text-sm font-medium text-gray-700">Password Tips</h3>
            <ul className="mt-2 space-y-1 text-xs text-gray-600">
              <li>• Use at least 8 characters</li>
              <li>• Include uppercase and lowercase letters</li>
              <li>• Include numbers and special characters</li>
              <li>• {"Don't reuse passwords from other sites"}</li>
            </ul>
          </div>
        </div>
      </div>
    </AccountLayout>
  );
}
