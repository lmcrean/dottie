import * as z from 'zod';

export const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

const passwordValidation = z.string();

export const signUpSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    username: z.string().min(2, 'Username must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: passwordValidation.superRefine((password, ctx) => {
      const containsUppercase = /[A-Z]/.test(password);
      const containsLowercase = /[a-z]/.test(password);
      const containsNumber = /[0-9]/.test(password);
      const containsSpecialChar = /[@$!%*?&_#]/.test(password);
      const hasMinLength = password.length >= 8;

      if (
        !hasMinLength ||
        !containsUppercase ||
        !containsLowercase ||
        !containsNumber ||
        !containsSpecialChar
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&_#).'
          // Optional: Include individual flags if needed elsewhere
          // params: {
          //   hasMinLength,
          //   containsUppercase,
          //   containsLowercase,
          //   containsNumber,
          //   containsSpecialChar
          // }
        });
      }
    }),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  });

export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
