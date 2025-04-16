import React from "react";
import { PasswordForm } from "./PasswordUpdateForm";
import AccountLayout from "./account-layout";

export default function PasswordPage() {
  // In production, this would come from auth context
  const userId = "test-user-123";
  return (
    <AccountLayout
      title="Profile Settings"
      description="Manage your account details and preferences."
    >
      <div className="container mx-auto py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-2">Change Password</h1>
          <p className="text-gray-600 mb-6">
            Update your password to keep your account secure.
          </p>
          <PasswordForm userId={userId} />
          <div className="mt-8 p-4 bg-gray-50 rounded-md border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700">Password Tips</h3>
            <ul className="mt-2 text-xs text-gray-600 space-y-1">
              <li>• Use at least 8 characters</li>
              <li>• Include uppercase and lowercase letters</li>
              <li>• Include numbers and special characters</li>
              <li>• Don't reuse passwords from other sites</li>
            </ul>
          </div>
        </div>
      </div>
    </AccountLayout>
  );
}
