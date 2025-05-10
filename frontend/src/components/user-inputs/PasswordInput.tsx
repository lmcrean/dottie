import { EyeClosed, EyeIcon } from 'lucide-react';
import { FieldValues, Path, UseFormRegister } from 'react-hook-form';
import { FormInput } from './form-input';

interface PasswordInputProps<T extends FieldValues> {
  id: Path<T>;
  label?: string;
  autoComplete?: string;
  register: UseFormRegister<T>;
  error?: string;
  required?: boolean;
  placeholder?: string;
  isVisible: boolean;
  toggleVisibility: () => void;
}

export const PasswordInput = <T extends FieldValues>({
  id,
  label = 'Password',
  autoComplete = 'current-password',
  register,
  error,
  required = false,
  placeholder,
  isVisible,
  toggleVisibility
}: PasswordInputProps<T>) => {
  const icon = isVisible ? <EyeIcon size={18} /> : <EyeClosed size={18} />;

  return (
    <FormInput
      id={id}
      type={isVisible ? 'text' : 'password'}
      label={label}
      autoComplete={autoComplete}
      required={required}
      placeholder={placeholder}
      {...register(id)}
      error={error}
      className="border pr-10 dark:border-slate-800"
      iconRight={
        <button type="button" onClick={toggleVisibility}>
          {icon}
        </button>
      }
    />
  );
};
