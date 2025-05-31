import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../../components/buttons/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '../../../components/ui/card';
import { Input } from '../../../components/user-inputs/input';
import { Label } from '../../../components/ui/label';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@/src/api';

// Define a schema directly here for simplicity
const PasswordResetCompletionSchema = z
  .object({
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmNewPassword: z.string().min(6, 'Confirm password must be at least 6 characters')
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'The passwords do not match',
    path: ['confirmNewPassword']
  });

// Get type from the schema
type PasswordResetCompletionFormInputs = z.infer<typeof PasswordResetCompletionSchema>;

interface PasswordResetCompletionFormProps {
  token: string;
}

export const PasswordResetCompletionForm: React.FC<PasswordResetCompletionFormProps> = ({
  token
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isResetComplete, setIsResetComplete] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<PasswordResetCompletionFormInputs>({
    resolver: zodResolver(PasswordResetCompletionSchema),
    defaultValues: {
      newPassword: '',
      confirmNewPassword: ''
    }
  });

  const onSubmit: SubmitHandler<PasswordResetCompletionFormInputs> = async (data) => {
    setIsLoading(true);
    try {
      // Combine form data with token
      const resetData = {
        ...data,
        token
      };
      await apiClient.post('/api/user/pw/reset', resetData);
      // Simulate API success
      setIsResetComplete(true);
      reset();

      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/auth/login');
      }, 3000);
    } catch (error) {
      console.error('Password reset error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isResetComplete) {
    return (
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle>Password Reset Complete</CardTitle>
          <CardDescription>Your password has been reset successfully.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            You will be redirected to the login page in a moment. Please log in with your new
            password.
          </p>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => navigate('/auth/login')}>
            Go to Login
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Create New Password</CardTitle>
        <CardDescription>Enter a new password for your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="••••••••"
              {...register('newPassword')}
            />
            {errors.newPassword && (
              <p className="text-sm text-red-500">{errors.newPassword.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
            <Input
              id="confirmNewPassword"
              type="password"
              placeholder="••••••••"
              {...register('confirmNewPassword')}
            />
            {errors.confirmNewPassword && (
              <p className="text-sm text-red-500">{errors.confirmNewPassword.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PasswordResetCompletionForm;
