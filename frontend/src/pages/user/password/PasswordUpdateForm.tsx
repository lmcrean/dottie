import { Button } from '@/src/components/buttons/button';
import { Alert, AlertDescription } from '@/src/components/alerts/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/src/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage
} from '@/src/components/ui/form';
import { PasswordInput } from '@/src/components/user-inputs/PasswordInput';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as z from 'zod';
import { useAuth } from '@/src/pages/auth/context/useAuthContext';

const passwordUpdateSchema = z
  .object({
    currentPassword: z.string().min(8, {
      message: 'Current password must be at least 8 characters.'
    }),
    newPassword: z.string().min(8, {
      message: 'New password must be at least 8 characters.'
    }),
    confirmNewPassword: z.string().min(8, {
      message: 'Confirmation password must be at least 8 characters.'
    })
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords don't match",
    path: ['confirmNewPassword']
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword']
  });

type PasswordUpdateFormValues = z.infer<typeof passwordUpdateSchema>;

export function PasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { updatePassword, logout } = useAuth();
  const navigate = useNavigate();

  const [passwordVisibility, setPasswordVisibility] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const form = useForm<PasswordUpdateFormValues>({
    resolver: zodResolver(passwordUpdateSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    }
  });

  const togglePasswordVisibility = (field: keyof typeof passwordVisibility) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  async function onSubmit(data: PasswordUpdateFormValues) {
    setIsLoading(true);
    setIsSuccess(false);

    try {
      await updatePassword(data.currentPassword, data.newPassword);

      setIsSuccess(true);
      form.reset();

      toast.success('Password updated', {
        description: 'Your password has been updated successfully.'
      });

      // Wait 2 secs before logging out to allow toast to notify
      setTimeout(async () => {
        await logout(); // Logout after password update
        toast.message('Logged out', {
          description: 'You have been logged out due to a password change. Please log in again.'
        });
        navigate('/auth/sign-in'); // Redirect to sign-in page
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error('Error', {
        description: 'Failed to update password. Please check your current password and try again.'
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Password</CardTitle>
        <CardDescription>
          {`Change your account password. After saving, 
          you'll need to use the new password to log in.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSuccess && (
          <Alert className="mb-4">
            <AlertDescription>Your password has been updated successfully.</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <PasswordInput
                      id="currentPassword"
                      label="Current Password"
                      register={form.register}
                      isVisible={passwordVisibility.current}
                      toggleVisibility={() => togglePasswordVisibility('current')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <PasswordInput
                      id="newPassword"
                      label="New Password"
                      register={form.register}
                      isVisible={passwordVisibility.new}
                      toggleVisibility={() => togglePasswordVisibility('new')}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Password must be at least 8 characters.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmNewPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <PasswordInput
                      id="confirmNewPassword"
                      label="Confirm New Password"
                      register={form.register}
                      isVisible={passwordVisibility.confirm}
                      toggleVisibility={() => togglePasswordVisibility('confirm')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
