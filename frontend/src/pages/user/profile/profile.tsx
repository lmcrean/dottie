import AccountLayout from './account-layout';
import AccountForm from './account-form';
import { LoadingState, ErrorState } from '@/src/components/ui';
import { useAuth } from '@/src/pages/auth/context/useAuthContext';

export default function ProfilePage() {
  const { user, isLoading, error } = useAuth();

  if (isLoading) {
    return (
      <AccountLayout title="Account">
        <LoadingState message="Loading profile..." />
      </AccountLayout>
    );
  }

  if (error) {
    return (
      <AccountLayout title="Account">
        <ErrorState error={error} />
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
