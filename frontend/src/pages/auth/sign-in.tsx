import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/src/context/AuthContext";
import { signInSchema, type SignInFormData } from "@/src/lib/validations/auth";
import { FormInput } from "@/src/components/ui/!to-migrate/form-input";
import { Button } from "@/src/components/ui/!to-migrate/button";
import { toast } from "sonner";
import AuthLayout from "@/src/components/AuthLayout";
import { useEffect, useState } from "react";
import { PasswordInput } from "@/src/components/ui/PasswordInput";

export default function SignInPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => setPasswordVisible((prev) => !prev);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  // Auto-fill login credentials from successful signup
  useEffect(() => {
    const email = localStorage.getItem("login_email");
    const password = localStorage.getItem("login_password");

    if (email) {
      // Set with a slight delay to ensure form is ready
      setTimeout(() => {
        setValue("email", email);
        localStorage.removeItem("login_email");
      }, 100);
    }

    if (password) {
      // Set with a slight delay to ensure form is ready
      setTimeout(() => {
        setValue("password", password);
        localStorage.removeItem("login_password");
      }, 100);
    }
  }, [setValue]);

  const onSubmit = async (data: SignInFormData) => {
    try {
      await login(data);
  
      toast('Successfully Signed In', {
        description: '',
        style: {
          backgroundColor: '#4CAF50', // red
          color: 'white',
        },
      })

      // Debug: Log authentication token and user data
      console.log('[Auth Debug] After login - localStorage items:', {
        authToken: localStorage.getItem('authToken'),
        refresh_token: localStorage.getItem('refresh_token'),
        user: localStorage.getItem('user'),
        auth_user: localStorage.getItem('auth_user')
      });

      // Log context values
      setTimeout(() => {
        // Log auth state after login
        console.log('[Auth Debug] Auth context after login:', {
          isAuthenticated,
          user
        });
      }, 100);

      navigate("/assessment/age-verification");
    } catch (error) {
      toast(error instanceof Error ? error.message : "Failed to sign in", {
        description: '',
        style: {
          backgroundColor: '#FF4C4C', // red
          color: 'white',
        },
      })
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-2xl font-bold text-center mb-6">Welcome Back</h1>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="rounded-md shadow-sm space-y-4">
          <FormInput
            id="email"
            type="email"
            label="Email address"
            placeholder="Enter your email"
            autoComplete="email"
            required
            {...register("email")}
            error={errors.email?.message}
          />
          {/* <FormInput
            id="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            {...register("password")}
            error={errors.password?.message}
          /> */}

          <PasswordInput
            id="password"
            label="Password"
            autoComplete="current-password"
            register={register}
            error={errors.password?.message}
            required
            placeholder="Enter your password"
            isVisible={passwordVisible}
            toggleVisibility={togglePasswordVisibility}
          />

        </div>

        <div className="flex items-center justify-end">
          <Link to="/auth/forgot-password" className="text-sm text-pink-500 hover:text-pink-600">
            Forgot your password?
          </Link>
        </div>

        <div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </div>
      </form>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/auth/sign-up" className="text-pink-500 hover:text-pink-600">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
