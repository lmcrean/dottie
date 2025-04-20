import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/src/components/ui/!to-migrate/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/src/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/src/components/ui/form";
import { useToast } from "@/src/components/ui/use-toast";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { useAuth } from "@/src/context/AuthContext";
import { PasswordInput } from "@/src/components/ui/PasswordInput";
import { useNavigate } from "react-router-dom";

const passwordUpdateSchema = z
  .object({
    currentPassword: z.string().min(8, {
      message: "Current password must be at least 8 characters.",
    }),
    newPassword: z.string().min(8, {
      message: "New password must be at least 8 characters.",
    }),
    confirmNewPassword: z.string().min(8, {
      message: "Confirmation password must be at least 8 characters.",
    }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords don't match",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

type PasswordUpdateFormValues = z.infer<typeof passwordUpdateSchema>;

interface PasswordFormProps {
  userId: string;
}

export function PasswordForm({ userId }: PasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const { updatePassword, logout } = useAuth();
  const navigate = useNavigate();

  const [passwordVisibility, setPasswordVisibility] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const form = useForm<PasswordUpdateFormValues>({
    resolver: zodResolver(passwordUpdateSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const togglePasswordVisibility = (field: keyof typeof passwordVisibility) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  async function onSubmit(data: PasswordUpdateFormValues) {
    setIsLoading(true);
    setIsSuccess(false);

    try {
      await updatePassword(data.currentPassword, data.newPassword);

      setIsSuccess(true);
      form.reset();

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });

      await logout(); // Logout after password update
      toast({
        title: "Logged out",
        description:
          "You have been logged out due to a password change. Please log in again.",
      });
      navigate("/auth/sign-in"); // Redirect to sign-in page
      
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description:
          "Failed to update password. Please check your current password and try again.",
        variant: "destructive",
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
          Change your account password. After saving, you'll need to use the new
          password to log in.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSuccess && (
          <Alert className="mb-4">
            <AlertDescription>
              Your password has been updated successfully.
            </AlertDescription>
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
                      toggleVisibility={() =>
                        togglePasswordVisibility("current")
                      }
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
                      toggleVisibility={() => togglePasswordVisibility("new")}
                    />
                  </FormControl>
                  <FormDescription>
                    Password must be at least 8 characters.
                  </FormDescription>
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
                      toggleVisibility={() =>
                        togglePasswordVisibility("confirm")
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
