import { type FormFieldContextValue } from '@/src/components/ui/form';
import React from 'react';

export const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);
