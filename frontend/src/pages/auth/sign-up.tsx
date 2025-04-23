import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/src/context/AuthContext";
import { signUpSchema, type SignUpFormData } from "@/src/lib/validations/auth";
import { FormInput } from "@/src/components/ui/!to-migrate/form-input";
import { Button } from "@/src/components/ui/!to-migrate/button";
import { toast } from "sonner";
import AuthLayout from "@/src/components/AuthLayout";
import { useState } from "react";
import { PasswordInput } from "@/src/components/ui/PasswordInput";
import AnimatedLogo from "@/src/components/AnimatedLogo";

export default function SignUpPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [cnfrmPasswordVisible, setCnfrmPasswordVisible] = useState(false);

  const togglePasswordVisibility = () =>
    setPasswordVisible((prev: boolean) => !prev);
  const toggleCnfrmPasswordVisibility = () =>
    setCnfrmPasswordVisible((prev: boolean) => !prev);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      await signup(data);

      // Store signup credentials for autofill in the login form
      localStorage.setItem("login_email", data.email);
      localStorage.setItem("login_password", data.password);

      toast.success("Account created successfully!");
      navigate("/auth/sign-in");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(
          error.message === "Failed to create user"
            ? "Username Already Taken"
            : error.message
        );
      }
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>
      <AnimatedLogo
        borderColor="border-pink-600"
        size={80}
        logoSize={48}
        logoSrc="/logo/logo-mascot.svg"
      />
      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="rounded-md shadow-sm space-y-4">
          <FormInput
            id="name"
            type="text"
            label="Full name"
            autoComplete="name"
            required
            {...register("name")}
            error={errors.name?.message}
          />
          <FormInput
            id="username"
            type="text"
            label="Username"
            autoComplete="username"
            required
            {...register("username")}
            error={errors.username?.message}
          />
          <FormInput
            id="email"
            type="email"
            label="Email address"
            autoComplete="email"
            required
            {...register("email")}
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
            className="btn-primary hover:bg-pink-700 w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>
        </div>
      </form>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/auth/sign-in"
            className="text-pink-600 hover:text-pink-700"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
