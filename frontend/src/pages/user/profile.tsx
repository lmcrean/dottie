import AccountLayout from './account-layout';
import AccountForm from './account-form';
import { useAuth } from '@/src/context/useAuthContext';

export default function ProfilePage() {
  const { user, isLoading, error } = useAuth();

  if (isLoading) {
    return (
      <AccountLayout title="Account">
        <div className="flex h-40 items-center justify-center">
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </AccountLayout>
    );
  }

  if (error) {
    return (
      <AccountLayout title="Account">
        <div className="rounded-md border border-red-200 bg-red-50 p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout
      title="Profile Settings"
      description="Manage your account details and preferences."
    >
      {user && <AccountForm />}
    </AccountLayout>
  );
}
