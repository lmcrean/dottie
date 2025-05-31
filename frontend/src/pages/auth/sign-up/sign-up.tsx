import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { signUpSchema, type SignUpFormData } from '@/src/lib/validations/auth';
import { FormInput } from '@/src/components/user-inputs/form-input';
import { Button } from '@/src/components/buttons/button';
import { toast } from 'sonner';
import AuthLayout from '@/src/pages/auth/AuthLayout';
import { useState } from 'react';
import { PasswordInput } from '@/src/components/user-inputs/PasswordInput';
import AnimatedLogo from '@/src/pages/landing-page/AnimatedLogo';
import { useAuth } from '@/src/pages/auth/context/useAuthContext';

export default function SignUpPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [cnfrmPasswordVisible, setCnfrmPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => setPasswordVisible((prev: boolean) => !prev);
  const toggleCnfrmPasswordVisibility = () => setCnfrmPasswordVisible((prev: boolean) => !prev);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema)
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      await signup(data);

      // Store signup credentials for autofill in the login form
      localStorage.setItem('login_email', data.email);
      localStorage.setItem('login_password', data.password);

      toast.success('Account created successfully!');
      navigate('/auth/sign-in');
    } catch (error: any) {
      // Handle structured error responses from the backend
      if (error?.response?.data) {
        const errorData = error.response.data;
        const errorType = errorData.errorType;
        const userMessage = errorData.message;
        
        // Use specific error messages based on error type
        switch (errorType) {
          case 'EMAIL_CONFLICT':
            toast.error(userMessage || 'An account with this email already exists. Please use a different email or try signing in.');
            break;
          case 'USERNAME_CONFLICT':
            toast.error(userMessage || 'This username is already taken. Please choose a different username.');
            break;
          case 'VALIDATION_ERROR':
            toast.error(userMessage || 'Please check your information and try again.');
            break;
          case 'SERVER_ERROR':
            toast.error(userMessage || 'An unexpected error occurred. Please try again later.');
            break;
          default:
            // Fallback to the error message if no specific type
            toast.error(errorData.error || userMessage || 'Failed to create account');
        }
      } else if (error instanceof Error) {
        // Handle cases where error doesn't have the structured response
        toast.error(error.message || 'Failed to create account');
      } else {
        toast.error('Failed to create account. Please try again.');
      }
    }
  };

  return (
    <AuthLayout>
      <h1 className="mb-6 text-center text-2xl font-bold">Create Account</h1>
      <AnimatedLogo
        borderColor="border-pink-600"
        size={80}
        logoSize={48}
        logoSrc="/logo/logo-mascot.svg"
      />
      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4 rounded-md shadow-sm">
          <FormInput
            id="name"
            type="text"
            label="Full name"
            autoComplete="name"
            required
            {...register('name')}
            error={errors.name?.message}
          />
          <FormInput
            id="username"
            type="text"
            label="Username"
            autoComplete="username"
            required
            {...register('username')}
            error={errors.username?.message}
          />
          <FormInput
            id="email"
            type="email"
            label="Email address"
            autoComplete="email"
            required
            {...register('email')}
            error={errors.email?.message}
          />
          {/* <FormInput
              id="password"
              type={passwordVisible ? "text" : "password"}
              label="Password"
              autoComplete="new-password"
              required
              {...register("password")}
              error={errors.password?.message}
              
            /> */}
          {/* <FormInput
              id="confirmPassword"
              type={passwordVisible ? "text" : "password"}
              label="Confirm password"
              autoComplete="new-password"
              required
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
            /> */}
          <PasswordInput
            id="password"
            label="Password"
            autoComplete="new-password"
            register={register}
            error={errors.password?.message}
            required
            isVisible={passwordVisible}
            toggleVisibility={togglePasswordVisibility}
          />
          <PasswordInput
            id="confirmPassword"
            label="Confirm password"
            autoComplete="new-password"
            register={register}
            error={errors.confirmPassword?.message}
            required
            isVisible={cnfrmPasswordVisible}
            toggleVisibility={toggleCnfrmPasswordVisibility}
          />
        </div>
        <div>
          <Button
            type="submit"
            className="btn-primary w-full hover:bg-pink-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </Button>
        </div>
      </form>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/auth/sign-in" className="text-pink-600 hover:text-pink-700">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
