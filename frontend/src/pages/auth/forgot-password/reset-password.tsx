import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthLayout from '../AuthLayout';
import PasswordResetCompletionForm from '../../user/password/PasswordResetCompletionForm';

export default function ResetPasswordPage() {
  const location = useLocation();
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Parse token from URL query parameters
    const params = new URLSearchParams(location.search);
    const tokenParam = params.get('token');

    if (!tokenParam) {
      setError('Missing reset token. Please use the link from your email.');
      return;
    }

    setToken(tokenParam);
  }, [location]);

  if (error) {
    return (
      <AuthLayout>
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-red-500">Reset Link Invalid</h1>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/auth/forgot-password"
            className="text-sm text-accent-foreground hover:text-accent-foreground/80"
          >
            Request a new password reset link
          </Link>
        </div>
      </AuthLayout>
    );
  }

  if (!token) {
    return (
      <AuthLayout>
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Loading...</h1>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Reset Your Password</h1>
        <p className="text-sm text-muted-foreground">
          Create a new secure password for your account
        </p>
      </div>

      <div className="mt-8">
        <PasswordResetCompletionForm token={token} />
      </div>
    </AuthLayout>
  );
}
