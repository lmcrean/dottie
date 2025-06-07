import React from 'react';
import { forwardRef } from 'react';
import { cn } from '@/src/lib/utils';
import { Label } from '../ui/label';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  iconRight?: React.ReactNode;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, label, error, iconRight, ...props }, ref) => {
    return (
      <div className="relative space-y-2">
        <Label htmlFor={props.id}>{label}</Label>

        <input
          className={cn(
            'flex h-10 w-full rounded-md border bg-background px-3 py-2 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800',
            error && 'border-red-500 focus-visible:ring-red-500',
            className
          )}
          ref={ref}
          {...props}
        />
        {iconRight && (
          <div className="absolute right-3 top-12 -translate-y-1/2 transform cursor-pointer text-primary">
            {iconRight}
          </div>
        )}

        {error && (
          <p className="text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';
